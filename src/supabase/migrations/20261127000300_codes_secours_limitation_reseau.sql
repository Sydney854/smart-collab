-- Smart Collab — Codes de secours de la double authentification et limitation par adresse réseau
-- (décisions F1 et F4 du 27/11/2026 ; fiches core.two-factor et core.login ; SEC-MO-04, SEC-MO-07)

-- ─────────────────────────────────────────────
-- Codes de secours : 8 codes à usage unique, seul leur condensé est gardé
-- ─────────────────────────────────────────────
create table public.mfa_recovery_codes (
  user_id     uuid not null references public.users(id),
  code_hash   text not null,
  created_at  timestamptz not null default now(),
  used_at     timestamptz,
  primary key (user_id, code_hash)
);
alter table public.mfa_recovery_codes enable row level security;
alter table public.mfa_recovery_codes force row level security;
-- La personne voit combien de codes il lui reste (jamais les condensés)
create policy own_codes on public.mfa_recovery_codes for select to authenticated using (user_id = (select auth.uid()));
grant select (user_id, created_at, used_at) on public.mfa_recovery_codes to authenticated;

create or replace function app.recovery_hash(p_code text) returns text
language sql immutable set search_path = '' as $$
  select app.token_hash('recovery:' || upper(regexp_replace(coalesce(p_code, ''), '[^0-9A-Za-z]', '', 'g')))
$$;

-- Créer (ou recréer) les 8 codes : seulement juste après avoir validé un second facteur (session au niveau aal2).
-- Renvoie les codes en clair UNE seule fois ; les anciens codes non utilisés sont supprimés.
create or replace function public.generate_recovery_codes() returns text[]
language plpgsql volatile security definer set search_path = '' as $$
declare
  me uuid := auth.uid();
  codes text[] := '{}';
  c text;
  i int;
begin
  if me is null or coalesce(auth.jwt() ->> 'aal', 'aal1') <> 'aal2' then
    raise exception 'Second facteur requis' using errcode = 'insufficient_privilege';
  end if;
  delete from public.mfa_recovery_codes where user_id = me;
  for i in 1..8 loop
    c := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
    c := substr(c, 1, 5) || '-' || substr(c, 6, 5);
    codes := codes || c;
    insert into public.mfa_recovery_codes (user_id, code_hash) values (me, app.recovery_hash(c));
  end loop;
  return codes;
end $$;

-- Utiliser un code (serveur seulement) : vrai si le code était valable ; il est alors marqué utilisé
create or replace function public.consume_recovery_code(p_user uuid, p_code text) returns boolean
language plpgsql volatile security definer set search_path = '' as $$
begin
  update public.mfa_recovery_codes set used_at = now()
  where user_id = p_user and code_hash = app.recovery_hash(p_code) and used_at is null;
  return found;
end $$;

-- ─────────────────────────────────────────────
-- Limitation par adresse réseau (serveur seulement) : trop d'échecs depuis une même adresse, quel que soit le compte
-- ─────────────────────────────────────────────
create index access_log_ip_idx on public.access_log (ip, occurred_at) where event = 'login_failed';

create or replace function public.ip_blocked(p_ip inet, p_max_failures int default 20, p_minutes int default 15)
returns boolean language sql stable security definer set search_path = '' as $$
  select p_ip is not null and count(*) >= p_max_failures
  from public.access_log a
  where a.ip = p_ip and a.event = 'login_failed' and a.occurred_at > now() - make_interval(mins => p_minutes)
$$;

revoke all on function app.recovery_hash(text) from public, anon, authenticated;
revoke all on function public.generate_recovery_codes() from public, anon;
revoke all on function public.consume_recovery_code(uuid, text) from public, anon, authenticated;
revoke all on function public.ip_blocked(inet, int, int) from public, anon, authenticated;
grant execute on function public.generate_recovery_codes() to authenticated;
grant execute on function public.consume_recovery_code(uuid, text) to service_role;
grant execute on function public.ip_blocked(inet, int, int) to service_role;
