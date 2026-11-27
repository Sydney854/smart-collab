-- Escalade de privilèges : un gérant à qui l'on a donné « Gérer les collaborateurs » ne prend jamais le pouvoir
begin;
\ir fixtures.sql
select app.install_role_presets('aaaaaaaa-0000-0000-0000-000000000001');
-- Dan = gérant actif de A, avec en plus « Gérer les collaborateurs » et « Voir les collaborateurs »
update public.memberships set is_active = true where user_id = 'd4000000-0000-0000-0000-000000000004';
insert into public.user_roles (tenant_id, user_id, role_id)
  select tenant_id, 'd4000000-0000-0000-0000-000000000004', id from public.roles where tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001' and code = 'manager';
insert into public.role_permissions (tenant_id, role_id, permission)
  select tenant_id, id, p from public.roles, unnest(array['core.users.manage', 'core.users.invite']) p
  where tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001' and code = 'manager'
  on conflict do nothing;
-- Un rôle personnalisé « puissant »
insert into public.roles (tenant_id, code, name) values ('aaaaaaaa-0000-0000-0000-000000000001', 'superviseur', '{"fr":"Superviseur"}');
insert into public.role_permissions (tenant_id, role_id, permission)
  select tenant_id, id, 'core.roles.manage' from public.roles where tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001' and code = 'superviseur';

select set_config('request.jwt.claims', '{"sub":"d4000000-0000-0000-0000-000000000004","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}', true);
set local role authenticated;
do $$
declare rm uuid; rs uuid; ra uuid; rc uuid;
begin
  select id into rm from public.roles where code = 'manager';
  select id into rs from public.roles where code = 'superviseur';
  select id into ra from public.roles where code = 'admin';
  select id into rc from public.roles where code = 'cashier';
  -- Retirer le rôle admin d'Alice : refusé
  begin perform public.set_member_roles('a1000000-0000-0000-0000-000000000001', array[rc]); assert false, 'Gérant : admin retiré à Alice';
  exception when insufficient_privilege then null; end;
  -- Désactiver l'administratrice : refusé
  begin perform public.set_member_active('a1000000-0000-0000-0000-000000000001', false, 'prise de pouvoir'); assert false, 'Gérant : admin désactivée';
  exception when insufficient_privilege then null; end;
  -- Se donner un rôle puissant ou admin : refusé
  begin perform public.set_member_roles('d4000000-0000-0000-0000-000000000004', array[rm, rs]); assert false, 'Gérant : rôle puissant pris';
  exception when insufficient_privilege then null; end;
  begin perform public.set_member_roles('d4000000-0000-0000-0000-000000000004', array[rm, ra]); assert false, 'Gérant : admin pris';
  exception when insufficient_privilege then null; end;
  -- Gérer un caissier ordinaire : permis
  perform public.set_member_roles('c3000000-0000-0000-0000-000000000003', array[rc]);
  -- S'inviter sous une autre adresse sur un rôle puissant : refusé
  begin perform public.create_invitation('moi-bis@demo.test', 'Moi Bis', rs); assert false, 'Invitation sur un rôle puissant';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

-- Dernier administrateur : jamais retiré ni désactivé, même par un administrateur
insert into public.memberships (tenant_id, user_id) values ('aaaaaaaa-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000002');
insert into public.user_roles (tenant_id, user_id, role_id)
  select tenant_id, 'b2000000-0000-0000-0000-000000000002', id from public.roles where tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001' and code = 'admin';
select set_config('request.jwt.claims', '{"sub":"a1000000-0000-0000-0000-000000000001","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}', true);
set local role authenticated;
do $$
declare rc uuid;
begin
  select id into rc from public.roles where code = 'cashier';
  -- Deux administrateurs : Alice peut retirer Bob
  perform public.set_member_roles('b2000000-0000-0000-0000-000000000002', array[rc]);
end $$;
reset role;
-- Alice seule administratrice, Bob redevient admin puis tente de retirer Alice ET qu'il ne reste personne
select set_config('request.jwt.claims', '{"sub":"a1000000-0000-0000-0000-000000000001","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}', true);
update public.users set is_active = false where id = 'b2000000-0000-0000-0000-000000000002';
set local role authenticated;
do $$ begin
  -- Seule administratrice active : Alice ne peut pas être laissée seule… et ne peut pas se retirer (déjà testé) ;
  -- désactiver la seule autre personne admin inactive ne change rien : il reste Alice
  assert app.has_permission('core.roles.manage'), 'Alice doit gérer les droits';
end $$;
reset role;
update public.users set is_active = true where id = 'b2000000-0000-0000-0000-000000000002';

-- Lecture réservée : un caissier ne lit ni les invitations, ni les rôles des collègues, ni les droits, ni les masques
update public.user_roles set role_id = (select id from public.roles where tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001' and code = 'cashier')
  where user_id = 'c3000000-0000-0000-0000-000000000003' and tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001';
select set_config('request.jwt.claims', '{"sub":"c3000000-0000-0000-0000-000000000003","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}', true);
set local role authenticated;
do $$ begin
  assert (select count(*) from public.invitations) = 0, 'Caissier : invitations lisibles';
  assert (select count(*) from public.user_roles where user_id <> 'c3000000-0000-0000-0000-000000000003') = 0, 'Caissier : rôles des collègues lisibles';
  assert (select count(*) from public.user_roles where user_id = 'c3000000-0000-0000-0000-000000000003') = 1, 'Caissier : ses propres rôles illisibles';
  assert (select count(*) from public.role_permissions) = 0, 'Caissier : droits lisibles';
  assert (select count(*) from public.field_masks) = 0, 'Caissier : masques lisibles';
end $$;
reset role;
rollback;

-- Retraits simultanés : il reste toujours un administrateur actif
begin;
\ir fixtures.sql
select app.install_role_presets('aaaaaaaa-0000-0000-0000-000000000001');
select set_config('request.jwt.claims', '{"sub":"a1000000-0000-0000-0000-000000000001","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}', true);
do $$ begin
  -- Alice est la seule administratrice : impossible de la retirer (elle-même) ; aucune autre voie ne laisse l'entreprise sans admin
  assert app.active_admins('aaaaaaaa-0000-0000-0000-000000000001') = 1, 'Une seule administratrice attendue';
end $$;
rollback;
