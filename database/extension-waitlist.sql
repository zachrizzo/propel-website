-- Private signup storage for the upcoming Propel Extension. Only the existing
-- Edge Function's service role can invoke the registration function or read rows.
create table if not exists public.extension_waitlist (
  email text primary key,
  created_at timestamptz not null default now(),
  constraint extension_waitlist_email_length check (length(email) between 3 and 254),
  constraint extension_waitlist_email_normalized check (email = lower(btrim(email)))
);
alter table public.extension_waitlist enable row level security;
revoke all on public.extension_waitlist from public, anon, authenticated;
grant select, insert on public.extension_waitlist to service_role;

-- A keyed digest of the gateway address, never the raw address, limits signups
-- to five attempts per UTC day. Counts are purged opportunistically after 8 days.
create table if not exists public.extension_waitlist_rate (
  rate_key text not null,
  day date not null,
  attempts integer not null default 0,
  primary key (rate_key, day),
  constraint extension_waitlist_rate_key_shape check (rate_key ~ '^[0-9a-f]{64}$'),
  constraint extension_waitlist_rate_attempts_check check (attempts >= 0)
);
create index if not exists extension_waitlist_rate_day_idx on public.extension_waitlist_rate(day);
alter table public.extension_waitlist_rate enable row level security;
revoke all on public.extension_waitlist_rate from public, anon, authenticated;
grant select, insert, update, delete on public.extension_waitlist_rate to service_role;

create or replace function public.join_extension_waitlist(p_email text, p_rate_key text)
returns text
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
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

  insert into public.extension_waitlist(email) values (v_email)
  on conflict (email) do nothing;
  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then return 'already_joined'; end if;
  return 'joined';
end;
$$;
revoke all on function public.join_extension_waitlist(text, text) from public, anon, authenticated;
grant execute on function public.join_extension_waitlist(text, text) to service_role;
