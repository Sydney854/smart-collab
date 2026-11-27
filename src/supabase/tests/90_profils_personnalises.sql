-- Profils personnalisés (étape 3 bis)
begin;
\ir fixtures.sql
insert into public.role_permissions (tenant_id, role_id, permission)
  select tenant_id, id, 'core.roles.manage' from public.roles where tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001' and code = 'admin';
select app.install_role_presets('aaaaaaaa-0000-0000-0000-000000000001');
create temporary table ids(k text, v uuid) on commit drop;
grant all on ids to authenticated;
select set_config('request.jwt.claims', '{"sub":"a1000000-0000-0000-0000-000000000001","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}', true);
set local role authenticated;
do $$
declare rid uuid; rm uuid;
begin
  assert exists (select 1 from public.roles where code = 'read_only'), 'Préréglage Lecture seule absent';
  select id into rm from public.roles where code = 'manager';
  rid := public.create_role('Chef de rayon', 'Department head', rm);
  insert into ids values ('custom', rid);
  assert (select count(*) from public.role_permissions where role_id = rid) = (select count(*) from public.role_permissions where role_id = rm),
         'Droits non copiés';
  assert (select code from public.roles where id = rid) like 'custom\_%', 'Code du profil personnalisé';
  perform public.rename_role(rid, 'Responsable de rayon', 'Department manager');
  assert (select name ->> 'fr' from public.roles where id = rid) = 'Responsable de rayon', 'Renommage';
  begin perform public.create_role('X', 'Y'); assert false, 'Nom trop court accepté';
  exception when check_violation then null; end;
  begin perform public.create_role('caissier', 'Other'); assert false, 'Nom en double accepté';
  exception when unique_violation then null; end;
  begin perform public.set_role_active((select id from public.roles where code = 'admin'), false, 'test'); assert false, 'Admin désactivé';
  exception when insufficient_privilege then null; end;
  begin perform public.set_role_active(rid, false, ''); assert false, 'Désactivation sans motif';
  exception when check_violation then null; end;
end $$;
reset role;
-- Une personne qui n'a que ce rôle bloque sa désactivation
update public.memberships set is_active = true where user_id = 'd4000000-0000-0000-0000-000000000004';
insert into public.user_roles (tenant_id, user_id, role_id) select 'aaaaaaaa-0000-0000-0000-000000000001', 'd4000000-0000-0000-0000-000000000004', v from ids where k = 'custom';
set local role authenticated;
do $$ begin
  begin perform public.set_role_active((select v from ids where k = 'custom'), false, 'réorganisation'); assert false, 'Personne laissée sans rôle';
  exception when check_violation then null; end;
end $$;
reset role;
-- Invitation en attente sur le profil : désactivation refusée
insert into public.invitations (tenant_id, email, full_name, role_id, token_hash, expires_at, invited_by)
  select 'aaaaaaaa-0000-0000-0000-000000000001', 'attente@demo.test', 'En Attente', v, md5('attente'), now() + interval '1 day', 'a1000000-0000-0000-0000-000000000001' from ids where k = 'custom';
delete from public.user_roles where user_id = 'd4000000-0000-0000-0000-000000000004';
set local role authenticated;
do $$ begin
  begin perform public.set_role_active((select v from ids where k = 'custom'), false, 'réorganisation'); assert false, 'Invitations en attente ignorées';
  exception when check_violation then null; end;
end $$;
reset role;

-- B ne copie pas un profil de A
insert into public.role_permissions (tenant_id, role_id, permission)
  select tenant_id, id, 'core.roles.manage' from public.roles where tenant_id = 'bbbbbbbb-0000-0000-0000-000000000002' and code = 'admin' on conflict do nothing;
select set_config('request.jwt.claims', '{"sub":"b2000000-0000-0000-0000-000000000002","tenant_id":"bbbbbbbb-0000-0000-0000-000000000002","role":"authenticated"}', true);
set local role authenticated;
do $$ begin
  begin perform public.create_role('Copie pirate', 'Pirate copy', (select v from ids where k = 'custom')); assert false, 'B copie un profil de A';
  exception when no_data_found then null; end;
end $$;
reset role;

-- Un caissier ne crée pas de profil ; B ne voit pas les profils de A
select set_config('request.jwt.claims', '{"sub":"b2000000-0000-0000-0000-000000000002","tenant_id":"bbbbbbbb-0000-0000-0000-000000000002","role":"authenticated"}', true);
set local role authenticated;
do $$ begin
  begin perform public.rename_role((select v from ids where k = 'custom'), 'Piraté', 'Hacked'); assert false, 'B renomme un profil de A';
  exception when insufficient_privilege or no_data_found then null; end;
end $$;
reset role;
do $$ begin
  assert exists (select 1 from public.audit_log where entity = 'role' and action = 'create'), 'Création non tracée';
end $$;
rollback;
