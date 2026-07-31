# Website product analytics

Propel stores marketing-site analytics in the same Supabase project used by the
desktop app: `propel job agent` (`jhezakjoyxzfcamwqmqz`). The implementation uses
the project's browser-safe publishable key and never uses a secret or
`service_role` credential.

## What is collected

- Page views for an allowlisted pathname (never a query string or fragment)
- Download CTA clicks, split into Mac, Windows, Chrome, and “jump to downloads”
- Scroll milestones at 25%, 50%, 75%, and 90%, once per tab session and page
- Explicitly named section views, once per tab session and page
- Random visitor and tab-session UUIDs

The event schema has no columns for IP address, user agent, referrer, account ID,
form values, or free-form metadata. The random visitor UUID lives in local
storage; the session UUID and retry queue live in session storage. Global Privacy
Control and Do Not Track disable collection.

The browser batches events through the same-origin `/api/analytics` route. That
route validates and reconstructs every event from allowlisted fields before
using the publishable key to insert it. Supabase grants `anon` column-level
`INSERT` only, and RLS restricts writes to the known marketing paths. Browser
roles cannot select, update, or delete analytics records.

## Aggregate queries

Run these from the Supabase SQL Editor or another trusted database connection.
The aggregate views live in the non-exposed `app_private` schema.

Daily page, visitor, CTA, and scroll counts:

```sql
select *
from app_private.website_analytics_daily
where event_date >= current_date - 30
order by event_date desc, page_path;
```

Daily section visibility:

```sql
select *
from app_private.website_analytics_sections_daily
where event_date >= current_date - 30
order by event_date desc, page_path, section_key;
```

Unique visitors and download clicks across an arbitrary reporting window:

```sql
select
  count(distinct visitor_id) filter (where event_name = 'page_view') as visitors,
  count(*) filter (where event_name = 'page_view') as page_views,
  count(*) filter (where event_name = 'download_click') as download_clicks
from public.website_analytics_events
where created_at >= timestamptz '2026-07-01 00:00:00+00'
  and created_at < timestamptz '2026-08-01 00:00:00+00';
```

## Configuration

The server route has the same project URL and publishable key defaults as the
desktop app so the deployed site works without privileged environment variables.
For key rotation, set `PROPEL_SUPABASE_URL` and
`PROPEL_SUPABASE_PUBLISHABLE_KEY` in the website deployment.
