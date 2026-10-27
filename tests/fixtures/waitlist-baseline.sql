create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
grant usage on schema public to anon, authenticated, service_role;
create table public.extension_waitlist(email text primary key, created_at timestamptz not null default now());
alter table public.extension_waitlist enable row level security;
revoke all on public.extension_waitlist from public, anon, authenticated;
grant select, insert on public.extension_waitlist to service_role;
create table public.extension_waitlist_rate(rate_key text,day date,attempts integer,primary key(rate_key,day));
alter table public.extension_waitlist_rate enable row level security;
revoke all on public.extension_waitlist_rate from public, anon, authenticated;
grant select,insert,update,delete on public.extension_waitlist_rate to service_role;
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

  insert into public.extension_waitlist(email) values (v_email)
  on conflict (email) do nothing;
  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then return 'already_joined'; end if;
  return 'joined';
end;
$function$
;
revoke all on function public.join_extension_waitlist(text,text) from public,anon,authenticated;
grant execute on function public.join_extension_waitlist(text,text) to service_role;
