-- Smart Collab — Rôles et droits : protections contre l'escalade (contrôle de sécurité du 27/11/2026)
-- 1. Tout ce qui touche au rôle administrateur (le donner, le retirer, désactiver un administrateur) ou qui donne un rôle
--    portant « Modifier les profils et droits » / « Gérer les collaborateurs » exige core.roles.manage.
-- 2. Une entreprise garde toujours au moins un administrateur actif (verrou par entreprise contre les retraits simultanés).
-- 3. La lecture de l'administration est réservée : invitations et rôles des personnes → core.users.view ;
--    droits des rôles et masques → core.roles.view (chacun voit toujours ses propres rôles).

create or replace function app.is_admin_role(p_role uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.roles where id = p_role and code = 'admin')
$$;

create or replace function app.role_is_powerful(p_role uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select app.is_admin_role(p_role)
      or exists (select 1 from public.role_permissions
                 where role_id = p_role and permission in ('core.roles.manage', 'core.users.manage'))
$$;

create or replace function app.active_admins(p_tenant uuid) returns int
language sql stable security definer set search_path = '' as $$
  select count(distinct ur.user_id)::int
  from public.user_roles ur
  join public.roles r on r.id = ur.role_id and r.code = 'admin' and r.is_active
  join public.memberships m on m.tenant_id = ur.tenant_id and m.user_id = ur.user_id and m.is_active
  join public.users u on u.id = ur.user_id and u.is_active
  where ur.tenant_id = p_tenant
$$;

create or replace function public.set_member_roles(p_user uuid, p_roles uuid[]) returns void
language plpgsql volatile security definer set search_path = '' as $$
declare t uuid := app.current_tenant(); before jsonb; touches_power boolean;
begin
  if t is null or not app.has_permission('core.users.manage') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  if coalesce(array_length(p_roles, 1), 0) > 20 then
    raise exception 'Trop de rôles' using errcode = 'check_violation';
  end if;
  perform pg_advisory_xact_lock(hashtext('roles:' || t::text));
  if not exists (select 1 from public.memberships where tenant_id = t and user_id = p_user) then
    raise exception 'Personne inconnue' using errcode = 'no_data_found';
  end if;
  if exists (select 1 from unnest(p_roles) x where not exists (select 1 from public.roles r where r.id = x and r.tenant_id = t and r.is_active)) then
    raise exception 'Rôle inconnu' using errcode = 'no_data_found';
  end if;
  -- Rôles « puissants » donnés ou retirés : réservé à qui peut modifier les droits
  select exists (select 1 from unnest(p_roles) x where app.role_is_powerful(x))
      or exists (select 1 from public.user_roles ur where ur.tenant_id = t and ur.user_id = p_user
                 and ur.role_id <> all (p_roles) and app.role_is_powerful(ur.role_id))
    into touches_power;
  if touches_power and not app.has_permission('core.roles.manage') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  if p_user = auth.uid() and not exists (select 1 from unnest(p_roles) x where app.is_admin_role(x))
     and exists (select 1 from public.user_roles ur where ur.tenant_id = t and ur.user_id = p_user and app.is_admin_role(ur.role_id)) then
    raise exception 'Vous ne pouvez pas retirer votre propre rôle d''administrateur' using errcode = 'insufficient_privilege';
  end if;
  select coalesce(jsonb_agg(role_id), '[]') into before from public.user_roles where tenant_id = t and user_id = p_user;
  delete from public.user_roles where tenant_id = t and user_id = p_user and role_id <> all (p_roles);
  insert into public.user_roles (tenant_id, user_id, role_id) select t, p_user, x from unnest(p_roles) x on conflict do nothing;
  if app.active_admins(t) < 1 then
    raise exception 'L''entreprise doit garder au moins un administrateur actif' using errcode = 'check_violation';
  end if;
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
  if not p_active and length(trim(coalesce(p_reason, ''))) not between 3 and 500 then
    raise exception 'Motif obligatoire' using errcode = 'check_violation';
  end if;
  perform pg_advisory_xact_lock(hashtext('roles:' || t::text));
  -- Désactiver ou réactiver une personne au rôle puissant : réservé à qui peut modifier les droits
  if exists (select 1 from public.user_roles ur where ur.tenant_id = t and ur.user_id = p_user and app.role_is_powerful(ur.role_id))
     and not app.has_permission('core.roles.manage') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  update public.memberships set is_active = p_active where tenant_id = t and user_id = p_user;
  if not found then raise exception 'Personne inconnue' using errcode = 'no_data_found'; end if;
  if app.active_admins(t) < 1 then
    raise exception 'L''entreprise doit garder au moins un administrateur actif' using errcode = 'check_violation';
  end if;
  insert into public.audit_log (tenant_id, user_id, app_id, action, entity, entity_id, new_value, reason)
  values (t, auth.uid(), 'core', case when p_active then 'update' else 'cancel' end, 'membership', p_user::text,
          jsonb_build_object('is_active', p_active), nullif(trim(p_reason), ''));
end $$;

-- Lecture de l'administration réservée
drop policy tenant_isolation on public.invitations;
create policy tenant_isolation on public.invitations for all to authenticated
  using (tenant_id = (select app.current_tenant()) and (select app.has_permission('core.users.view')))
  with check (tenant_id = (select app.current_tenant()));
drop policy tenant_isolation on public.user_roles;
create policy tenant_isolation on public.user_roles for all to authenticated
  using (tenant_id = (select app.current_tenant())
         and (user_id = (select auth.uid()) or (select app.has_permission('core.users.view'))))
  with check (tenant_id = (select app.current_tenant()));
drop policy tenant_isolation on public.role_permissions;
create policy tenant_isolation on public.role_permissions for all to authenticated
  using (tenant_id = (select app.current_tenant()) and (select app.has_permission('core.roles.view')))
  with check (tenant_id = (select app.current_tenant()));
drop policy tenant_isolation on public.field_masks;
create policy tenant_isolation on public.field_masks for all to authenticated
  using (tenant_id = (select app.current_tenant()) and (select app.has_permission('core.roles.view')))
  with check (tenant_id = (select app.current_tenant()));

revoke all on function app.is_admin_role(uuid) from public, anon, authenticated;
revoke all on function app.role_is_powerful(uuid) from public, anon, authenticated;
revoke all on function app.active_admins(uuid) from public, anon, authenticated;
