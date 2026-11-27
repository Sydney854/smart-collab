-- Smart Collab — Rôles et droits (lot 1, étape 3 ; 02_SPECIFICATIONS/04_ROLES_DROITS.md ; fiches core.roles, core.users, core.field-masks)
-- Un droit = rôle × permission (application · action) × périmètre. Toujours vérifié par la base (SEC-MO-03).
-- Les écrans ne font que masquer ce qui n'est pas permis ; les écritures passent par des fonctions qui revérifient.

-- ─────────────────────────────────────────────
-- Catalogue des permissions et des champs sensibles (déclarés par les applications ; ici : le socle)
-- ─────────────────────────────────────────────
create table public.permissions (
  code      text primary key check (code ~ '^[a-z0-9_]+(\.[a-z0-9_]+)+$'),   -- 'core.users.invite'
  app_id    text not null references public.apps(id),
  action    text not null check (action in ('view', 'create', 'update', 'validate', 'cancel', 'export', 'print', 'manage', 'invite')),
  label     jsonb not null
);
create table public.sensitive_fields (
  app_id    text not null references public.apps(id),
  entity    text not null,
  field     text not null,
  label     jsonb not null,
  primary key (entity, field)
);

insert into public.apps (id, version, category, name, is_core, manifest)
values ('core', '1.0.0', 'core', '{"fr":"Socle","en":"Core"}', true, '{}') on conflict (id) do nothing;

insert into public.permissions (code, app_id, action, label) values
  ('core.settings.view',  'core', 'view',   '{"fr":"Voir les paramètres","en":"View settings"}'),
  ('core.settings.manage','core', 'manage', '{"fr":"Modifier les paramètres","en":"Change settings"}'),
  ('core.users.view',     'core', 'view',   '{"fr":"Voir les collaborateurs","en":"View people"}'),
  ('core.users.invite',   'core', 'invite', '{"fr":"Inviter des collaborateurs","en":"Invite people"}'),
  ('core.users.manage',   'core', 'manage', '{"fr":"Gérer les collaborateurs (rôles, activation)","en":"Manage people (roles, activation)"}'),
  ('core.roles.view',     'core', 'view',   '{"fr":"Voir les profils et droits","en":"View roles and permissions"}'),
  ('core.roles.manage',   'core', 'manage', '{"fr":"Modifier les profils et droits","en":"Change roles and permissions"}'),
  ('core.apps.view',      'core', 'view',   '{"fr":"Voir les applications","en":"View apps"}'),
  ('core.apps.manage',    'core', 'manage', '{"fr":"Installer ou retirer des applications","en":"Install or remove apps"}'),
  ('core.audit.view',     'core', 'view',   '{"fr":"Consulter les journaux (actions, connexions)","en":"View logs (actions, sign-ins)"}')
on conflict (code) do nothing;

-- Droits existants (données de démonstration créées avant ce catalogue) : rattachés au catalogue
delete from public.role_permissions rp where not exists (select 1 from public.permissions p where p.code = rp.permission);
alter table public.role_permissions add constraint role_permissions_permission_fk foreign key (permission) references public.permissions(code);

alter table public.permissions enable row level security;
alter table public.permissions force row level security;
alter table public.sensitive_fields enable row level security;
alter table public.sensitive_fields force row level security;
create policy catalog_read on public.permissions for select to authenticated using (true);
create policy catalog_read on public.sensitive_fields for select to authenticated using (true);
grant select on public.permissions, public.sensitive_fields to authenticated;

-- ─────────────────────────────────────────────
-- Rôles préréglés par métier (04_ROLES_DROITS.md) et droits du socle de chaque rôle
-- ─────────────────────────────────────────────
create or replace function app.role_presets(p_domain text)
returns table (code text, name jsonb, core_permissions text[])
language sql immutable set search_path = '' as $$
  with admin as (select array['core.settings.view','core.settings.manage','core.users.view','core.users.invite','core.users.manage',
                              'core.roles.view','core.roles.manage','core.apps.view','core.apps.manage','core.audit.view'] as p),
       lead as (select array['core.settings.view','core.users.view','core.roles.view','core.apps.view','core.audit.view'] as p),
       presets(domain, code, fr, en, kind) as (values
    ('*', 'admin', 'Administrateur', 'Administrator', 'admin'),
    ('retail', 'manager', 'Gérant', 'Manager', 'lead'),
    ('retail', 'cashier', 'Caissier', 'Cashier', 'none'),
    ('retail', 'storekeeper', 'Magasinier', 'Storekeeper', 'none'),
    ('multisite', 'network_director', 'Directeur réseau', 'Network director', 'lead'),
    ('multisite', 'central_buyer', 'Acheteur central', 'Central buyer', 'none'),
    ('multisite', 'logistics_manager', 'Responsable logistique', 'Logistics manager', 'none'),
    ('multisite', 'picker', 'Préparateur', 'Picker', 'none'),
    ('multisite', 'store_manager', 'Gérant de boutique', 'Store manager', 'lead'),
    ('multisite', 'cashier', 'Caissier', 'Cashier', 'none'),
    ('multisite', 'storekeeper', 'Magasinier', 'Storekeeper', 'none'),
    ('consulting', 'partner', 'Associé / Direction', 'Partner / Management', 'lead'),
    ('consulting', 'sales', 'Commercial', 'Sales', 'none'),
    ('consulting', 'engagement_manager', 'Chef de mission', 'Engagement manager', 'none'),
    ('consulting', 'consultant', 'Consultant', 'Consultant', 'none'),
    ('consulting', 'finance', 'Finance', 'Finance', 'none'),
    ('consulting', 'assistant', 'Assistant(e)', 'Assistant', 'none'),
    ('electrical', 'management', 'Direction', 'Management', 'lead'),
    ('electrical', 'sales', 'Commercial', 'Sales', 'none'),
    ('electrical', 'designer', 'Projeteur (bureau d''études)', 'Designer (engineering office)', 'none'),
    ('electrical', 'buyer', 'Acheteur', 'Buyer', 'none'),
    ('electrical', 'storekeeper', 'Magasinier', 'Storekeeper', 'none'),
    ('electrical', 'seller_cashier', 'Vendeur / caissier', 'Seller / cashier', 'none'),
    ('electrical', 'site_manager', 'Chef de chantier', 'Site manager', 'none'),
    ('electrical', 'technician', 'Technicien', 'Technician', 'none'),
    ('electrical', 'finance', 'Finance', 'Finance', 'none'))
  select pr.code, jsonb_build_object('fr', pr.fr, 'en', pr.en),
         case pr.kind when 'admin' then (select p from admin) when 'lead' then (select p from lead) else '{}'::text[] end
  from presets pr where pr.domain in ('*', p_domain)
$$;

-- Installe (ou complète) les rôles préréglés du métier de l'entreprise ; réexécutable, ne retire rien
create or replace function app.install_role_presets(p_tenant uuid) returns void
language plpgsql volatile security definer set search_path = '' as $$
declare d text; r record; rid uuid;
begin
  select business_domain into d from public.tenants where id = p_tenant;
  for r in select * from app.role_presets(d) loop
    insert into public.roles (tenant_id, code, name, source_preset) values (p_tenant, r.code, r.name, d)
    on conflict (tenant_id, code) do nothing;
    select id into rid from public.roles where tenant_id = p_tenant and code = r.code;
    insert into public.role_permissions (tenant_id, role_id, permission)
    select p_tenant, rid, p from unnest(r.core_permissions) p on conflict do nothing;
  end loop;
end $$;
revoke all on function app.role_presets(text) from public, anon, authenticated;
revoke all on function app.install_role_presets(uuid) from public, anon, authenticated;

-- ─────────────────────────────────────────────
-- Lecture des journaux : seulement avec la permission core.audit.view (décision E3)
-- ─────────────────────────────────────────────
drop policy tenant_isolation on public.audit_log;
create policy tenant_isolation on public.audit_log for all to authenticated
  using (tenant_id = (select app.current_tenant()) and (select app.has_permission('core.audit.view')))
  with check (tenant_id = (select app.current_tenant()));
drop policy tenant_isolation on public.access_log;
create policy tenant_isolation on public.access_log for all to authenticated
  using (tenant_id = (select app.current_tenant()) and (select app.has_permission('core.audit.view')))
  with check (tenant_id = (select app.current_tenant()));

-- ─────────────────────────────────────────────
-- Droits de la personne connectée (pour masquer les écrans) et champs sensibles visibles
-- ─────────────────────────────────────────────
create or replace function public.my_permissions() returns text[]
language sql stable security definer set search_path = '' as $$
  select coalesce(array_agg(distinct rp.permission order by rp.permission), '{}')
  from public.user_roles ur
  join public.roles r on r.tenant_id = ur.tenant_id and r.id = ur.role_id and r.is_active
  join public.role_permissions rp on rp.tenant_id = r.tenant_id and rp.role_id = r.id
  where ur.tenant_id = app.current_tenant() and ur.user_id = auth.uid()
$$;

-- Un champ est visible si au moins un rôle actif de la personne ne le masque pas (l'administrateur voit tout)
create or replace function app.field_visible(p_entity text, p_field text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.user_roles ur
    join public.roles r on r.tenant_id = ur.tenant_id and r.id = ur.role_id and r.is_active
    where ur.tenant_id = app.current_tenant() and ur.user_id = auth.uid()
      and (r.code = 'admin' or not exists (select 1 from public.field_masks fm
                                            where fm.role_id = r.id and fm.entity = p_entity and fm.field = p_field))
  )
$$;

-- ─────────────────────────────────────────────
-- Modifications (écrans Profils et droits, Collaborateurs) : revérifiées et tracées
-- ─────────────────────────────────────────────
create or replace function public.set_role_permission(p_role uuid, p_permission text, p_granted boolean) returns void
language plpgsql volatile security definer set search_path = '' as $$
declare t uuid := app.current_tenant(); r public.roles;
begin
  if t is null or not app.has_permission('core.roles.manage') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  select * into r from public.roles where id = p_role and tenant_id = t;
  if r.id is null then raise exception 'Rôle inconnu' using errcode = 'no_data_found'; end if;
  if r.code = 'admin' then
    raise exception 'Les droits de l''administrateur ne se modifient pas' using errcode = 'insufficient_privilege';
  end if;
  if p_granted then
    insert into public.role_permissions (tenant_id, role_id, permission) values (t, p_role, p_permission) on conflict do nothing;
  else
    delete from public.role_permissions where role_id = p_role and permission = p_permission;
  end if;
  insert into public.audit_log (tenant_id, user_id, app_id, action, entity, entity_id, new_value)
  values (t, auth.uid(), 'core', 'update', 'role_permission', p_role::text, jsonb_build_object('permission', p_permission, 'granted', p_granted));
end $$;

create or replace function public.set_field_mask(p_role uuid, p_entity text, p_field text, p_masked boolean) returns void
language plpgsql volatile security definer set search_path = '' as $$
declare t uuid := app.current_tenant(); r public.roles;
begin
  if t is null or not app.has_permission('core.roles.manage') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  select * into r from public.roles where id = p_role and tenant_id = t;
  if r.id is null then raise exception 'Rôle inconnu' using errcode = 'no_data_found'; end if;
  if r.code = 'admin' then
    raise exception 'L''administrateur voit toujours toutes les données' using errcode = 'insufficient_privilege';
  end if;
  if not exists (select 1 from public.sensitive_fields where entity = p_entity and field = p_field) then
    raise exception 'Champ inconnu' using errcode = 'no_data_found';
  end if;
  if p_masked then
    insert into public.field_masks (tenant_id, role_id, entity, field) values (t, p_role, p_entity, p_field) on conflict do nothing;
  else
    delete from public.field_masks where role_id = p_role and entity = p_entity and field = p_field;
  end if;
  insert into public.audit_log (tenant_id, user_id, app_id, action, entity, entity_id, new_value)
  values (t, auth.uid(), 'core', 'update', 'field_mask', p_role::text,
          jsonb_build_object('entity', p_entity, 'field', p_field, 'masked', p_masked));
end $$;

-- Rôles d'une personne : remplace la liste ; impossible de se retirer soi-même le rôle administrateur
create or replace function public.set_member_roles(p_user uuid, p_roles uuid[]) returns void
language plpgsql volatile security definer set search_path = '' as $$
declare t uuid := app.current_tenant(); before jsonb;
begin
  if t is null or not app.has_permission('core.users.manage') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  if not exists (select 1 from public.memberships where tenant_id = t and user_id = p_user) then
    raise exception 'Personne inconnue' using errcode = 'no_data_found';
  end if;
  if exists (select 1 from unnest(p_roles) x where not exists (select 1 from public.roles r where r.id = x and r.tenant_id = t and r.is_active)) then
    raise exception 'Rôle inconnu' using errcode = 'no_data_found';
  end if;
  -- Donner le rôle administrateur demande soi-même de pouvoir modifier les droits
  if exists (select 1 from public.roles r where r.id = any (p_roles) and r.code = 'admin')
     and not app.has_permission('core.roles.manage') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  if p_user = auth.uid() and not exists (select 1 from public.roles r where r.id = any (p_roles) and r.code = 'admin')
     and exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id
                 where ur.tenant_id = t and ur.user_id = p_user and r.code = 'admin') then
    raise exception 'Vous ne pouvez pas retirer votre propre rôle d''administrateur' using errcode = 'insufficient_privilege';
  end if;
  select coalesce(jsonb_agg(role_id), '[]') into before from public.user_roles where tenant_id = t and user_id = p_user;
  delete from public.user_roles where tenant_id = t and user_id = p_user and role_id <> all (p_roles);
  insert into public.user_roles (tenant_id, user_id, role_id) select t, p_user, x from unnest(p_roles) x on conflict do nothing;
  insert into public.audit_log (tenant_id, user_id, app_id, action, entity, entity_id, old_value, new_value)
  values (t, auth.uid(), 'core', 'update', 'member_roles', p_user::text, before, to_jsonb(p_roles));
end $$;

create or replace function public.set_member_active(p_user uuid, p_active boolean, p_reason text) returns void
language plpgsql volatile security definer set search_path = '' as $$
declare t uuid := app.current_tenant();
begin
  if t is null or not app.has_permission('core.users.manage') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  if p_user = auth.uid() then
    raise exception 'Vous ne pouvez pas vous désactiver vous-même' using errcode = 'insufficient_privilege';
  end if;
  if not p_active and length(trim(coalesce(p_reason, ''))) < 3 then
    raise exception 'Motif obligatoire' using errcode = 'check_violation';
  end if;
  update public.memberships set is_active = p_active where tenant_id = t and user_id = p_user;
  if not found then raise exception 'Personne inconnue' using errcode = 'no_data_found'; end if;
  insert into public.audit_log (tenant_id, user_id, app_id, action, entity, entity_id, new_value, reason)
  values (t, auth.uid(), 'core', case when p_active then 'update' else 'cancel' end, 'membership', p_user::text,
          jsonb_build_object('is_active', p_active), nullif(trim(p_reason), ''));
end $$;

-- Invitation : seul quelqu'un qui peut modifier les droits peut inviter un administrateur (point de sécurité de l'étape 2)
create or replace function app.check_invitable_role(p_role uuid) returns void
language plpgsql stable security definer set search_path = '' as $$
begin
  if exists (select 1 from public.roles r where r.id = p_role and r.code = 'admin') and not app.has_permission('core.roles.manage') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  if not exists (select 1 from public.roles r where r.id = p_role and r.tenant_id = app.current_tenant() and r.is_active) then
    raise exception 'Rôle inconnu' using errcode = 'no_data_found';
  end if;
end $$;

create or replace function public.create_invitation(p_email text, p_full_name text, p_role uuid, p_locale text default 'fr')
returns text language plpgsql volatile security definer set search_path = '' as $$
declare
  t uuid := app.current_tenant();
  token text := replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
  e text := lower(trim(p_email));
  inv uuid;
begin
  if t is null or not app.has_permission('core.users.invite') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  perform app.check_invitable_role(p_role);
  if exists (select 1 from public.memberships m join public.users u on u.id = m.user_id
             where m.tenant_id = t and lower(u.email) = e and m.is_active) then
    raise exception 'Cette personne est déjà membre' using errcode = 'unique_violation';
  end if;
  update public.invitations set status = 'cancelled' where tenant_id = t and email = e and status = 'pending';
  insert into public.invitations (tenant_id, email, full_name, role_id, locale, token_hash, expires_at, invited_by)
  values (t, e, trim(p_full_name), p_role, p_locale, app.token_hash(token), now() + interval '7 days', auth.uid())
  returning id into inv;
  insert into public.audit_log (tenant_id, user_id, app_id, action, entity, entity_id, new_value)
  values (t, auth.uid(), 'core', 'create', 'invitation', inv::text,
          jsonb_build_object('email', e, 'role_id', p_role, 'expires_in_days', 7));
  return token;
end $$;

-- ─────────────────────────────────────────────
-- Rôles dans le jeton (SEC-MO-03) : indication pour l'écran ; la base revérifie toujours dans ses tables
-- ─────────────────────────────────────────────
create or replace function public.custom_access_token_hook(event jsonb) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  uid uuid := (event ->> 'user_id')::uuid;
  chosen uuid;
  claims jsonb := coalesce(event -> 'claims', '{}'::jsonb);
begin
  select m.tenant_id into chosen
  from public.memberships m
  join public.users u on u.id = m.user_id and u.is_active
  join public.tenants t on t.id = m.tenant_id and t.status in ('trial', 'active')
  where m.user_id = uid and m.is_active
    and (m.tenant_id = u.current_tenant_id
         or (select count(*) from public.memberships x join public.tenants y on y.id = x.tenant_id
             where x.user_id = uid and x.is_active and y.status in ('trial', 'active')) = 1)
  limit 1;

  if chosen is null then
    claims := claims - 'tenant_id' - 'roles';
  else
    claims := jsonb_set(claims, '{tenant_id}', to_jsonb(chosen::text));
    claims := jsonb_set(claims, '{roles}', coalesce((
      select jsonb_agg(r.code order by r.code) from public.user_roles ur
      join public.roles r on r.tenant_id = ur.tenant_id and r.id = ur.role_id and r.is_active
      where ur.tenant_id = chosen and ur.user_id = uid), '[]'::jsonb));
  end if;
  return jsonb_set(event, '{claims}', claims);
end $$;

revoke all on function public.my_permissions() from public, anon;
revoke all on function app.field_visible(text, text) from public, anon;
revoke all on function public.set_role_permission(uuid, text, boolean) from public, anon;
revoke all on function public.set_field_mask(uuid, text, text, boolean) from public, anon;
revoke all on function public.set_member_roles(uuid, uuid[]) from public, anon;
revoke all on function public.set_member_active(uuid, boolean, text) from public, anon;
revoke all on function app.check_invitable_role(uuid) from public, anon, authenticated;
revoke all on function public.custom_access_token_hook(jsonb) from public, anon, authenticated;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
grant execute on function public.my_permissions() to authenticated;
grant execute on function app.field_visible(text, text) to authenticated;
grant execute on function public.set_role_permission(uuid, text, boolean) to authenticated;
grant execute on function public.set_field_mask(uuid, text, text, boolean) to authenticated;
grant execute on function public.set_member_roles(uuid, uuid[]) to authenticated;
grant execute on function public.set_member_active(uuid, boolean, text) to authenticated;

-- ─────────────────────────────────────────────
-- Codes de secours : condensé propre à chaque personne (contrôle de sécurité du 27/11)
-- ─────────────────────────────────────────────
create or replace function app.recovery_hash(p_user uuid, p_code text) returns text
language sql immutable set search_path = '' as $$
  select app.token_hash('recovery:' || p_user::text || ':' || upper(regexp_replace(coalesce(p_code, ''), '[^0-9A-Za-z]', '', 'g')))
$$;
revoke all on function app.recovery_hash(uuid, text) from public, anon, authenticated;
drop function if exists app.recovery_hash(text);

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
    insert into public.mfa_recovery_codes (user_id, code_hash) values (me, app.recovery_hash(me, c));
  end loop;
  return codes;
end $$;

create or replace function public.consume_recovery_code(p_user uuid, p_code text) returns boolean
language plpgsql volatile security definer set search_path = '' as $$
begin
  update public.mfa_recovery_codes set used_at = now()
  where user_id = p_user and code_hash = app.recovery_hash(p_user, p_code) and used_at is null;
  return found;
end $$;
