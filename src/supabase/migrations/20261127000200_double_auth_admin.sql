-- Smart Collab — Double authentification obligatoire pour les administrateurs (décision L5 du 26/11/2026, SEC-MO-04)
-- Imposée par la base (pas seulement par l'enchaînement des écrans) : quand le réglage de la plateforme
-- `require_admin_mfa` est vrai (production), un administrateur sans second facteur validé dans la session ne voit rien.
-- En démonstration (réglage absent ou faux), elle reste facultative.
-- Le même tableau de réglages porte `allow_demo_data`, sans lequel le script des comptes de démonstration refuse de s'exécuter.

create table if not exists app.settings (
  key   text primary key,
  value jsonb not null
);
alter table app.settings enable row level security;
alter table app.settings force row level security;
revoke all on app.settings from public, anon, authenticated;
comment on table app.settings is 'Réglages de la plateforme (par base) : require_admin_mfa, allow_demo_data. Modifiés par migration ou par l''éditeur, jamais par l''application.';

create or replace function app.setting_true(p_key text) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select s.value = 'true'::jsonb from app.settings s where s.key = p_key), false)
$$;

-- La personne connectée doit-elle activer / valider son second facteur avant d'accéder à l'entreprise du jeton ?
create or replace function app.admin_mfa_missing(p_tenant uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select app.setting_true('require_admin_mfa')
     and coalesce(auth.jwt() ->> 'aal', 'aal1') <> 'aal2'
     and exists (select 1 from public.user_roles ur
                 join public.roles r on r.tenant_id = ur.tenant_id and r.id = ur.role_id and r.is_active
                 where ur.user_id = auth.uid() and ur.tenant_id = p_tenant and r.code = 'admin')
$$;

create or replace function app.current_tenant() returns uuid
language sql stable security definer set search_path = '' as $$
  select m.tenant_id
  from public.memberships m
  join public.users u on u.id = m.user_id and u.is_active
  join public.tenants t on t.id = m.tenant_id and t.status in ('trial', 'active')
  where m.user_id = auth.uid()
    and m.is_active
    and m.tenant_id::text = (auth.jwt() ->> 'tenant_id')
    and (coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
         or not exists (select 1 from auth.mfa_factors f where f.user_id = auth.uid() and f.status = 'verified'))
    and not app.admin_mfa_missing(m.tenant_id)
$$;

-- Pour la garde des pages : faut-il envoyer la personne vers l'activation du second facteur ?
create or replace function public.must_enroll_mfa() returns boolean
language sql stable security definer set search_path = '' as $$
  select app.admin_mfa_missing(nullif(auth.jwt() ->> 'tenant_id', '')::uuid)
$$;

-- Invitation : un jeton sans e-mail ne peut jamais correspondre
create or replace function public.accept_invitation(p_token text, p_full_name text default null)
returns uuid language plpgsql volatile security definer set search_path = '' as $$
declare
  inv public.invitations;
  me uuid := auth.uid();
  my_email text := lower(auth.jwt() ->> 'email');
begin
  if me is null then
    raise exception 'Connexion requise' using errcode = 'insufficient_privilege';
  end if;
  select i.* into inv from public.invitations i
  join public.tenants t on t.id = i.tenant_id and t.status in ('trial', 'active')
  where i.token_hash = app.token_hash(p_token) and i.status = 'pending' and i.expires_at > now()
  for update of i;
  if inv.id is null then
    raise exception 'Invitation non valable' using errcode = 'no_data_found';
  end if;
  if my_email is null or inv.email is distinct from my_email then
    raise exception 'Invitation destinée à une autre adresse' using errcode = 'insufficient_privilege';
  end if;
  insert into public.users (id, email, full_name, locale)
  values (me, inv.email, coalesce(nullif(trim(p_full_name), ''), inv.full_name), inv.locale)
  on conflict (id) do nothing;
  insert into public.memberships (tenant_id, user_id, is_active) values (inv.tenant_id, me, true)
  on conflict (tenant_id, user_id) do update set is_active = true;
  insert into public.user_roles (tenant_id, user_id, role_id) values (inv.tenant_id, me, inv.role_id)
  on conflict do nothing;
  update public.invitations set status = 'accepted', accepted_by = me where id = inv.id;
  update public.users set current_tenant_id = inv.tenant_id where id = me and current_tenant_id is null;
  insert into public.audit_log (tenant_id, user_id, app_id, action, entity, entity_id, new_value)
  values (inv.tenant_id, me, 'core', 'accept', 'invitation', inv.id::text, jsonb_build_object('role_id', inv.role_id));
  return inv.tenant_id;
end $$;

revoke all on function app.setting_true(text) from public, anon, authenticated;
revoke all on function app.admin_mfa_missing(uuid) from public, anon;
revoke all on function public.must_enroll_mfa() from public, anon;
grant execute on function app.admin_mfa_missing(uuid) to authenticated;
grant execute on function public.must_enroll_mfa() to authenticated;
