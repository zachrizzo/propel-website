-- Run privately in this project's Supabase SQL Editor. No emails or visitor IDs are returned.
-- Match this window to the Vercel /tiktok report before comparing metrics.
with classified as (
  select (created_at at time zone 'UTC')::date as signup_day, signup_source,
    split_part(email, '@', 2) ~* '(^|[.])(invalid|test|localhost|example)$|^example[.](com|net|org)$' as is_qa
  from public.extension_waitlist
  where created_at >= now() - interval '30 days'
)
select case when grouping(signup_day) = 1 then 'TOTAL' else signup_day::text end as utc_day,
  count(*) filter (where signup_source = 'tiktok' and not is_qa) as tiktok_signups_excluding_tests,
  count(*) filter (where signup_source = 'tiktok' and is_qa) as tiktok_test_signups,
  count(*) filter (where signup_source is null and not is_qa) as unattributed_signups_excluding_tests
from classified
group by rollup(signup_day)
order by grouping(signup_day) desc, signup_day desc;
