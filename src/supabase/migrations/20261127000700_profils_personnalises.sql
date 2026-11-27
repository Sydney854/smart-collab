-- Smart Collab — Profils personnalisés (lot 1, étape 3 bis ; décisions G1 et G2 du 27/11/2026 ; 04_ROLES_DROITS.md :
-- « l'administrateur peut créer, renommer, fusionner ou désactiver des rôles »)
-- * création d'un profil, vide ou copié d'un profil existant (droits et masques) ;
-- * renommage ; désactivation avec motif (jamais l'administrateur ; refusée si des personnes n'ont plus que ce rôle) ;
-- * préréglage « Lecture seule » pour tous les métiers (remplace la case « consultation seule » du prototype).

create or replace function public.create_role(p_name_fr text, p_name_en text, p_copy_from uuid default null)
returns uuid language plpgsql volatile security definer set search_path = '' as $$
declare t uuid := app.current_tenant(); rid uuid; code text;
begin
  if t is null or not app.has_permission('core.roles.manage') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  if length(trim(coalesce(p_name_fr, ''))) not between 2 and 60 or length(trim(coalesce(p_name_en, ''))) not between 2 and 60 then
    raise exception 'Nom obligatoire (2 à 60 caractères)' using errcode = 'check_violation';
  end if;
  if p_copy_from is not null and not exists (select 1 from public.roles where id = p_copy_from and tenant_id = t) then
    raise exception 'Rôle inconnu' using errcode = 'no_data_found';
  end if;
  code := 'custom_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);
  insert into public.roles (tenant_id, code, name, source_preset)
  values (t, code, jsonb_build_object('fr', trim(p_name_fr), 'en', trim(p_name_en)), null)
  returning id into rid;
  if p_copy_from is not null then
    -- Copier depuis l'administrateur donne les droits de l'administrateur moins le statut d'administrateur
    insert into public.role_permissions (tenant_id, role_id, permission, scope, limit_amount)
    select t, rid, rp.permission, rp.scope, rp.limit_amount from public.role_permissions rp where rp.role_id = p_copy_from;
    insert into public.field_masks (tenant_id, role_id, entity, field)
    select t, rid, fm.entity, fm.field from public.field_masks fm where fm.role_id = p_copy_from;
  end if;
  insert into public.audit_log (tenant_id, user_id, app_id, action, entity, entity_id, new_value)
  values (t, auth.uid(), 'core', 'create', 'role', rid::text,
          jsonb_build_object('name', jsonb_build_object('fr', trim(p_name_fr), 'en', trim(p_name_en)), 'copied_from', p_copy_from));
  return rid;
end $$;

create or replace function public.rename_role(p_role uuid, p_name_fr text, p_name_en text) returns void
language plpgsql volatile security definer set search_path = '' as $$
declare t uuid := app.current_tenant(); old jsonb;
begin
  if t is null or not app.has_permission('core.roles.manage') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  if length(trim(coalesce(p_name_fr, ''))) not between 2 and 60 or length(trim(coalesce(p_name_en, ''))) not between 2 and 60 then
    raise exception 'Nom obligatoire (2 à 60 caractères)' using errcode = 'check_violation';
  end if;
  select name into old from public.roles where id = p_role and tenant_id = t;
  if old is null then raise exception 'Rôle inconnu' using errcode = 'no_data_found'; end if;
  update public.roles set name = jsonb_build_object('fr', trim(p_name_fr), 'en', trim(p_name_en)) where id = p_role;
  insert into public.audit_log (tenant_id, user_id, app_id, action, entity, entity_id, old_value, new_value)
  values (t, auth.uid(), 'core', 'update', 'role', p_role::text, old, jsonb_build_object('fr', trim(p_name_fr), 'en', trim(p_name_en)));
end $$;

create or replace function public.set_role_active(p_role uuid, p_active boolean, p_reason text) returns void
language plpgsql volatile security definer set search_path = '' as $$
declare t uuid := app.current_tenant(); r public.roles;
begin
  if t is null or not app.has_permission('core.roles.manage') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  select * into r from public.roles where id = p_role and tenant_id = t;
  if r.id is null then raise exception 'Rôle inconnu' using errcode = 'no_data_found'; end if;
  if r.code = 'admin' then
    raise exception 'Le rôle administrateur ne se désactive pas' using errcode = 'insufficient_privilege';
  end if;
  if not p_active and length(trim(coalesce(p_reason, ''))) not between 3 and 500 then
    raise exception 'Motif obligatoire' using errcode = 'check_violation';
  end if;
  -- Personne ne doit se retrouver sans aucun rôle actif
  if not p_active and exists (
    select 1 from public.user_roles ur join public.memberships m on m.tenant_id = ur.tenant_id and m.user_id = ur.user_id and m.is_active
    where ur.role_id = p_role
      and not exists (select 1 from public.user_roles o join public.roles orl on orl.id = o.role_id and orl.is_active
                      where o.tenant_id = t and o.user_id = ur.user_id and o.role_id <> p_role)) then
    raise exception 'Des personnes n''ont que ce rôle : donnez-leur d''abord un autre rôle' using errcode = 'check_violation';
  end if;
  update public.roles set is_active = p_active where id = p_role;
  insert into public.audit_log (tenant_id, user_id, app_id, action, entity, entity_id, new_value, reason)
  values (t, auth.uid(), 'core', case when p_active then 'update' else 'cancel' end, 'role', p_role::text,
          jsonb_build_object('is_active', p_active), nullif(trim(p_reason), ''));
end $$;

-- Préréglage « Lecture seule » pour tous les métiers (aucun droit du socle ; les applications y ajouteront « voir »)
create or replace function app.role_presets(p_domain text)
returns table (code text, name jsonb, core_permissions text[])
language sql immutable set search_path = '' as $$
  with admin as (select array['core.settings.view','core.settings.manage','core.users.view','core.users.invite','core.users.manage',
                              'core.roles.view','core.roles.manage','core.apps.view','core.apps.manage','core.audit.view'] as p),
       lead as (select array['core.settings.view','core.users.view','core.roles.view','core.apps.view','core.audit.view'] as p),
       presets(domain, code, fr, en, kind) as (values
    ('*', 'admin', 'Administrateur', 'Administrator', 'admin'),
    ('*', 'read_only', 'Lecture seule', 'Read only', 'none'),
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
revoke all on function app.role_presets(text) from public, anon, authenticated;

revoke all on function public.create_role(text, text, uuid) from public, anon;
revoke all on function public.rename_role(uuid, text, text) from public, anon;
revoke all on function public.set_role_active(uuid, boolean, text) from public, anon;
grant execute on function public.create_role(text, text, uuid) to authenticated;
grant execute on function public.rename_role(uuid, text, text) to authenticated;
grant execute on function public.set_role_active(uuid, boolean, text) to authenticated;
