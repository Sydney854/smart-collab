-- Imitation minimale de Supabase pour les tests locaux et l'intégration continue (PostgreSQL seul, sans Docker).
-- Reproduit ce dont dépend la migration : rôles de l'API, schéma auth, auth.uid() et auth.jwt() lus dans
-- le réglage request.jwt.claims (comme PostgREST), rôle `postgres` non superutilisateur qui contourne la RLS.
-- NE PAS appliquer sur un vrai projet Supabase.
do $$ begin
  if not exists (select from pg_roles where rolname = 'anon') then create role anon nologin noinherit; end if;
  if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated nologin noinherit; end if;
  if not exists (select from pg_roles where rolname = 'service_role') then create role service_role nologin noinherit bypassrls; end if;
  if not exists (select from pg_roles where rolname = 'supabase_auth_admin') then create role supabase_auth_admin nologin noinherit; end if;
  if not exists (select from pg_roles where rolname = 'postgres') then create role postgres login createrole bypassrls; end if;
end $$;
grant anon, authenticated, service_role, supabase_auth_admin to postgres;
grant all on schema public to postgres;
grant create on database postgres to postgres;
create schema if not exists extensions authorization postgres;
create schema if not exists auth;
create table if not exists auth.users (id uuid primary key, email text);
-- Seconds facteurs (double authentification) : seuls les champs lus par Smart Collab
create table if not exists auth.mfa_factors (id uuid primary key default gen_random_uuid(), user_id uuid not null, status text not null);
grant select on auth.mfa_factors to postgres;
grant usage on schema auth to postgres, anon, authenticated, service_role, supabase_auth_admin;
grant select, references on auth.users to postgres;
create or replace function auth.jwt() returns jsonb language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
$$;
create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(auth.jwt() ->> 'sub', '')::uuid
$$;
grant execute on function auth.jwt(), auth.uid() to public;
-- Droits par défaut comme sur Supabase (tout est ouvert, la migration doit tout refermer)
alter default privileges for role postgres in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant all on functions to anon, authenticated, service_role;
grant usage on schema public to anon, authenticated, service_role;
