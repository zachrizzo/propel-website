-- First successful signup attribution on the existing private waitlist.
-- No grants, RLS policies, API hooks, entitlements or existing rows are changed.
begin;
set local lock_timeout = '3s';
alter table public.extension_waitlist add column if not exists signup_source text;
do $$ begin
  if not exists (select 1 from pg_constraint where conrelid = 'public.extension_waitlist'::regclass
    and conname = 'extension_waitlist_signup_source_check') then
    alter table public.extension_waitlist add constraint extension_waitlist_signup_source_check
      check (signup_source is null or signup_source = 'tiktok');
  end if;
end $$;
comment on column public.extension_waitlist.signup_source is
  'Source label on the first successful signup; not verified social-platform origin. Existing rows remain unattributed.';

-- Same RPC signature and ACL; only the existing service-role caller can invoke it.
-- The Edge Function allowlists the fixed campaign header.
CREATE OR REPLACE FUNCTION public.join_extension_waitlist(p_email text, p_rate_key text)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO 'pg_catalog', 'public'
AS $function$
declare
  v_email text := lower(btrim(p_email));
  v_day date := (now() at time zone 'UTC')::date;
  v_attempts integer;
  v_inserted integer;
begin
  if p_email is null or p_rate_key is null or length(v_email) not between 3 and 254 or
     v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$' or
     p_rate_key !~ '^[0-9a-f]{64}$' then
    return 'invalid_request';
  end if;

  delete from public.extension_waitlist_rate where day < v_day - 8;
  insert into public.extension_waitlist_rate(rate_key, day, attempts)
  values (p_rate_key, v_day, 1)
  on conflict (rate_key, day) do update
    set attempts = public.extension_waitlist_rate.attempts + 1
  returning attempts into v_attempts;
  if v_attempts > 5 then return 'rate_limited'; end if;

  insert into public.extension_waitlist(email, signup_source) values (v_email,
    case when (coalesce(nullif(current_setting('request.headers', true), ''), '{}')::jsonb
      ->> 'x-propel-signup-source') = 'tiktok' then 'tiktok' else null end)
  on conflict (email) do nothing;
  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then return 'already_joined'; end if;
  return 'joined';
end;
$function$
;
notify pgrst, 'reload schema';
commit;
