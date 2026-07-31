-- Privacy-conscious, first-party marketing-site analytics.
-- Live migration history version: 20260730225235.
--
-- The identifiers below are random browser-generated pseudonyms. They are not
-- linked to auth.users or profiles, and the table intentionally has no fields
-- for IP addresses, user agents, referrers, URLs with query strings, or
-- free-form metadata.

create table public.website_analytics_events (
  id uuid primary key,
  visitor_id uuid not null,
  session_id uuid not null,
  event_name text not null
    check (event_name in ('page_view', 'download_click', 'scroll_depth', 'section_view')),
  page_path text not null
    check (
      length(page_path) between 1 and 256
      and left(page_path, 1) = '/'
      and position('?' in page_path) = 0
      and position('#' in page_path) = 0
      and page_path !~ '[[:cntrl:]]'
    ),
  section_key text
    check (
      section_key is null
      or (
        length(section_key) between 1 and 80
        and section_key ~ '^[a-z0-9][a-z0-9._-]*$'
      )
    ),
  download_target text
    check (
      download_target is null
      or download_target in ('mac', 'windows', 'chrome', 'download_section')
    ),
  scroll_depth smallint
    check (scroll_depth is null or scroll_depth in (25, 50, 75, 90)),
  created_at timestamptz not null default now(),
  constraint website_analytics_event_shape check (
    case event_name
      when 'page_view' then
        section_key is null and download_target is null and scroll_depth is null
      when 'download_click' then
        section_key is null and download_target is not null and scroll_depth is null
      when 'scroll_depth' then
        section_key is null and download_target is null and scroll_depth is not null
      when 'section_view' then
        section_key is not null and download_target is null and scroll_depth is null
      else false
    end
  )
);

comment on table public.website_analytics_events is
  'Append-only marketing-site events using pseudonymous random visitor and tab-session IDs; contains no raw PII.';
comment on column public.website_analytics_events.visitor_id is
  'Random browser-local UUID; never joined to an authenticated Propel account.';
comment on column public.website_analytics_events.session_id is
  'Random sessionStorage UUID scoped to one browser tab session.';
comment on column public.website_analytics_events.page_path is
  'Known pathname only. Query strings, fragments, and referrers are intentionally excluded.';

alter table public.website_analytics_events enable row level security;
alter table public.website_analytics_events force row level security;

-- Explicit grants are required for new Data API objects and make this endpoint
-- append-only. In particular, browser roles cannot read, update, or delete raw
-- analytics rows and cannot supply the server-owned created_at value.
revoke all on table public.website_analytics_events from public, anon, authenticated;
grant insert (
  id,
  visitor_id,
  session_id,
  event_name,
  page_path,
  section_key,
  download_target,
  scroll_depth
) on table public.website_analytics_events to anon;

create policy website_analytics_anon_insert
  on public.website_analytics_events
  for insert
  to anon
  with check (
    page_path in (
      '/',
      '/job-application-agent',
      '/how-to-auto-apply-to-jobs',
      '/privacy'
    )
  );

create index website_analytics_events_created_at_idx
  on public.website_analytics_events (created_at desc);
create index website_analytics_events_page_created_idx
  on public.website_analytics_events (page_path, created_at desc);
create index website_analytics_events_name_created_idx
  on public.website_analytics_events (event_name, created_at desc);
create index website_analytics_events_visitor_created_idx
  on public.website_analytics_events (visitor_id, created_at desc);

-- These views are intentionally kept in app_private, which the existing Propel
-- schema does not expose to anon/authenticated roles. They are for SQL Editor,
-- MCP, or another trusted database connection only.
create view app_private.website_analytics_daily
with (security_invoker = true)
as
select
  (created_at at time zone 'UTC')::date as event_date,
  page_path,
  count(*) filter (where event_name = 'page_view') as page_views,
  count(distinct visitor_id) filter (where event_name = 'page_view') as visitors,
  count(distinct session_id) filter (where event_name = 'page_view') as sessions,
  count(*) filter (where event_name = 'download_click') as download_clicks,
  count(*) filter (
    where event_name = 'download_click' and download_target = 'mac'
  ) as mac_download_clicks,
  count(*) filter (
    where event_name = 'download_click' and download_target = 'windows'
  ) as windows_download_clicks,
  count(*) filter (
    where event_name = 'download_click' and download_target = 'chrome'
  ) as chrome_download_clicks,
  count(*) filter (
    where event_name = 'download_click' and download_target = 'download_section'
  ) as download_section_clicks,
  count(distinct session_id) filter (
    where event_name = 'scroll_depth' and scroll_depth = 25
  ) as sessions_reaching_25_percent,
  count(distinct session_id) filter (
    where event_name = 'scroll_depth' and scroll_depth = 50
  ) as sessions_reaching_50_percent,
  count(distinct session_id) filter (
    where event_name = 'scroll_depth' and scroll_depth = 75
  ) as sessions_reaching_75_percent,
  count(distinct session_id) filter (
    where event_name = 'scroll_depth' and scroll_depth = 90
  ) as sessions_reaching_90_percent
from public.website_analytics_events
group by 1, 2;

create view app_private.website_analytics_sections_daily
with (security_invoker = true)
as
select
  (created_at at time zone 'UTC')::date as event_date,
  page_path,
  section_key,
  count(*) as section_views,
  count(distinct visitor_id) as visitors,
  count(distinct session_id) as sessions
from public.website_analytics_events
where event_name = 'section_view'
group by 1, 2, 3;

comment on view app_private.website_analytics_daily is
  'Daily page, visitor, download CTA, and scroll-milestone metrics in UTC.';
comment on view app_private.website_analytics_sections_daily is
  'Daily section visibility metrics in UTC, deduplicated by the client per tab session.';

revoke all on table app_private.website_analytics_daily from public, anon, authenticated;
revoke all on table app_private.website_analytics_sections_daily from public, anon, authenticated;

notify pgrst, 'reload schema';
