-- Profils : garde-fous complémentaires (contrôle de sécurité du 27/11/2026)
-- * deux profils d'une même entreprise ne portent pas le même nom (risque d'attribuer le mauvais) ;
-- * la désactivation prend le verrou des rôles de l'entreprise et refuse s'il reste des invitations en attente sur ce profil.

create or replace function app.role_name_taken(p_tenant uuid, p_fr text, p_en text, p_except uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.roles r
                 where r.tenant_id = p_tenant and r.id is distinct from p_except
                   and (lower(r.name ->> 'fr') = lower(trim(p_fr)) or lower(r.name ->> 'en') = lower(trim(p_en))))
$$;
revoke all on function app.role_name_taken(uuid, text, text, uuid) from public, anon, authenticated;

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
  perform pg_advisory_xact_lock(hashtext('roles:' || t::text));
  if app.role_name_taken(t, p_name_fr, p_name_en, null) then
    raise exception 'Ce nom de profil existe déjà' using errcode = 'unique_violation';
  end if;
  if p_copy_from is not null and not exists (select 1 from public.roles where id = p_copy_from and tenant_id = t) then
    raise exception 'Rôle inconnu' using errcode = 'no_data_found';
  end if;
  code := 'custom_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);
  insert into public.roles (tenant_id, code, name, source_preset)
  values (t, code, jsonb_build_object('fr', trim(p_name_fr), 'en', trim(p_name_en)), null)
  returning id into rid;
  if p_copy_from is not null then
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
  perform pg_advisory_xact_lock(hashtext('roles:' || t::text));
  select name into old from public.roles where id = p_role and tenant_id = t;
  if old is null then raise exception 'Rôle inconnu' using errcode = 'no_data_found'; end if;
  if app.role_name_taken(t, p_name_fr, p_name_en, p_role) then
    raise exception 'Ce nom de profil existe déjà' using errcode = 'unique_violation';
  end if;
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
  perform pg_advisory_xact_lock(hashtext('roles:' || t::text));
  select * into r from public.roles where id = p_role and tenant_id = t;
  if r.id is null then raise exception 'Rôle inconnu' using errcode = 'no_data_found'; end if;
  if r.code = 'admin' then
    raise exception 'Le rôle administrateur ne se désactive pas' using errcode = 'insufficient_privilege';
  end if;
  if not p_active and length(trim(coalesce(p_reason, ''))) not between 3 and 500 then
    raise exception 'Motif obligatoire' using errcode = 'check_violation';
  end if;
  if not p_active and exists (select 1 from public.invitations i where i.role_id = p_role and i.status = 'pending' and i.expires_at > now()) then
    raise exception 'Des invitations en attente utilisent ce profil : annulez-les d''abord' using errcode = 'check_violation';
  end if;
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
