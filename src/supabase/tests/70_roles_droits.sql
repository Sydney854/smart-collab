-- Lot 1, étape 3 : rôles préréglés, droits, masques, journaux réservés, rôles dans le jeton
begin;
\ir fixtures.sql
-- Entreprise A (Commerce de détail) : rôles préréglés du métier
select app.install_role_presets('aaaaaaaa-0000-0000-0000-000000000001');
select app.install_role_presets('aaaaaaaa-0000-0000-0000-000000000001');   -- réexécutable
do $$ begin
  assert (select count(*) from public.roles where tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001'
          and code in ('admin','manager','cashier','storekeeper')) = 4, 'Préréglages Commerce de détail incomplets';
  assert (select count(*) from public.role_permissions rp join public.roles r on r.id = rp.role_id
          where r.tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001' and r.code = 'cashier') = 0, 'Le caissier ne doit avoir aucun droit du socle';
  assert exists (select 1 from public.role_permissions rp join public.roles r on r.id = rp.role_id
          where r.tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001' and r.code = 'admin' and rp.permission = 'core.roles.manage'), 'Administrateur sans droits';
end $$;
-- Dan devient caissier actif de A
update public.memberships set is_active = true where user_id = 'd4000000-0000-0000-0000-000000000004';
insert into public.user_roles (tenant_id, user_id, role_id)
  select tenant_id, 'd4000000-0000-0000-0000-000000000004', id from public.roles where tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001' and code = 'cashier';
insert into public.sensitive_fields values ('core', 'product', 'cost_price', '{"fr":"Prix d''achat","en":"Cost price"}') on conflict do nothing;
insert into public.audit_log (tenant_id, action, entity, entity_id) values ('aaaaaaaa-0000-0000-0000-000000000001', 'test', 'x', '1');

-- Caissier : aucun droit du socle, ne lit pas les journaux, ne peut rien modifier
select set_config('request.jwt.claims', '{"sub":"d4000000-0000-0000-0000-000000000004","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}', true);
set local role authenticated;
do $$
declare rc uuid; rm uuid;
begin
  assert public.my_permissions() = '{}', 'Le caissier a des droits du socle';
  assert (select count(*) from public.audit_log) = 0, 'Le caissier lit le journal d''audit';
  assert (select count(*) from public.access_log) = 0, 'Le caissier lit le journal des accès';
  select id into rc from public.roles where code = 'cashier';
  select id into rm from public.roles where code = 'manager';
  begin perform public.set_role_permission(rc, 'core.settings.view', true); assert false, 'Caissier : droits modifiés';
  exception when insufficient_privilege then null; end;
  begin perform public.set_member_roles('d4000000-0000-0000-0000-000000000004', array[rm]); assert false, 'Caissier : rôles modifiés';
  exception when insufficient_privilege then null; end;
  begin perform public.create_invitation('x@demo.test', 'X Y', rc); assert false, 'Caissier : invitation';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

-- Administratrice (Alice, rôle admin de A complété par les préréglages)
select set_config('request.jwt.claims', '{"sub":"a1000000-0000-0000-0000-000000000001","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}', true);
set local role authenticated;
do $$
declare rc uuid; ra uuid; rm uuid;
begin
  assert 'core.audit.view' = any (public.my_permissions()), 'Administratrice sans accès aux journaux';
  assert (select count(*) from public.audit_log) > 0, 'Administratrice : journal illisible';
  select id into rc from public.roles where code = 'cashier';
  select id into ra from public.roles where code = 'admin';
  select id into rm from public.roles where code = 'manager';
  -- Droits du caissier modifiables, ceux de l'administrateur non
  perform public.set_role_permission(rc, 'core.apps.view', true);
  assert exists (select 1 from public.role_permissions where role_id = rc and permission = 'core.apps.view'), 'Droit non ajouté';
  begin perform public.set_role_permission(ra, 'core.audit.view', false); assert false, 'Droits de l''administrateur modifiés';
  exception when insufficient_privilege then null; end;
  begin perform public.set_role_permission(rc, 'inconnu.truc.faire', true); assert false, 'Permission hors catalogue acceptée';
  exception when foreign_key_violation then null; end;
  -- Masque du prix d'achat pour le caissier ; jamais pour l'administrateur
  perform public.set_field_mask(rc, 'product', 'cost_price', true);
  begin perform public.set_field_mask(ra, 'product', 'cost_price', true); assert false, 'Masque posé sur l''administrateur';
  exception when insufficient_privilege then null; end;
  assert app.field_visible('product', 'cost_price'), 'L''administratrice doit voir le prix d''achat';
  -- Ne peut pas se retirer son propre rôle administrateur ni se désactiver
  begin perform public.set_member_roles('a1000000-0000-0000-0000-000000000001', array[rm]); assert false, 'Rôle admin retiré à soi-même';
  exception when insufficient_privilege then null; end;
  begin perform public.set_member_active('a1000000-0000-0000-0000-000000000001', false, 'test'); assert false, 'Auto-désactivation';
  exception when insufficient_privilege then null; end;
  begin perform public.set_member_active('d4000000-0000-0000-0000-000000000004', false, ''); assert false, 'Désactivation sans motif';
  exception when check_violation then null; end;
  -- Un rôle d'une autre entreprise est refusé
  begin perform public.set_member_roles('d4000000-0000-0000-0000-000000000004',
          array[(select id from public.roles where tenant_id = 'bbbbbbbb-0000-0000-0000-000000000002' limit 1)]);
    assert false, 'Rôle d''une autre entreprise attribué';
  exception when no_data_found then null; end;
end $$;
reset role;
do $$ begin
  assert exists (select 1 from public.audit_log where entity = 'role_permission'), 'Changement de droit non tracé';
  assert exists (select 1 from public.audit_log where entity = 'field_mask'), 'Masque non tracé';
end $$;

-- Le caissier ne voit plus le prix d'achat ; gérant sans droit sur les rôles ne peut pas inviter un administrateur
select set_config('request.jwt.claims', '{"sub":"d4000000-0000-0000-0000-000000000004","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}', true);
set local role authenticated;
do $$ begin
  assert not app.field_visible('product', 'cost_price'), 'Prix d''achat visible pour le caissier';
end $$;
reset role;
insert into public.role_permissions (tenant_id, role_id, permission)
  select tenant_id, id, 'core.users.invite' from public.roles where tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001' and code = 'cashier';
set local role authenticated;
do $$ begin
  begin perform public.create_invitation('chef@demo.test', 'Chef Pirate', (select id from public.roles where code = 'admin'));
    assert false, 'Invitation d''un administrateur sans droit sur les rôles';
  exception when insufficient_privilege then null; end;
  assert length(public.create_invitation('vendeur@demo.test', 'Vendeur Démo', (select id from public.roles where code = 'cashier'))) = 64,
         'Invitation d''un caissier refusée';
end $$;
reset role;

-- Rôles dans le jeton
set local role supabase_auth_admin;
do $$ begin
  assert public.custom_access_token_hook('{"user_id":"d4000000-0000-0000-0000-000000000004","claims":{}}') -> 'claims' -> 'roles' = '["cashier"]'::jsonb,
         'Rôle du caissier absent du jeton';
end $$;
reset role;
rollback;
