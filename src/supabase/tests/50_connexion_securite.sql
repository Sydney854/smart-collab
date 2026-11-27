-- Lot 1, étape 2 : double authentification exigée par la base, journal des accès, verrouillage, invitations.
begin;
\ir fixtures.sql

-- 1. Second facteur activé : rien n'est visible tant que la session n'est pas au niveau aal2
insert into auth.mfa_factors (user_id, status) values ('a1000000-0000-0000-0000-000000000001', 'verified');
select set_config('request.jwt.claims', '{"sub":"a1000000-0000-0000-0000-000000000001","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated","aal":"aal1"}', true);
set local role authenticated;
do $$ begin
  assert app.current_tenant() is null, 'Second facteur non vérifié : l''entreprise ne doit pas être accessible';
  assert (select count(*) from public.roles) = 0, 'Second facteur non vérifié : rôles visibles';
end $$;
reset role;
select set_config('request.jwt.claims', '{"sub":"a1000000-0000-0000-0000-000000000001","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated","aal":"aal2"}', true);
set local role authenticated;
do $$ begin
  assert app.current_tenant() = 'aaaaaaaa-0000-0000-0000-000000000001', 'Second facteur vérifié : l''entreprise doit être accessible';
end $$;
reset role;
delete from auth.mfa_factors;

-- 2. Journal des accès et verrouillage : réservés au serveur
set local role authenticated;
do $$ begin
  begin
    perform public.record_access('x@demo.test', 'login');
    assert false, 'Le navigateur peut écrire au journal des accès';
  exception when insufficient_privilege then null; end;
  begin
    perform public.login_locked('x@demo.test');
    assert false, 'Le navigateur peut interroger le verrouillage';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role service_role;
do $$
declare i int;
begin
  for i in 1..4 loop perform public.record_access('Eve@Demo.test ', 'login_failed'); end loop;
  assert not public.login_locked('eve@demo.test'), '4 échecs : pas encore verrouillé';
  perform public.record_access('eve@demo.test', 'login_failed');
  assert public.login_locked('eve@demo.test'), '5 échecs : doit être verrouillé';
  assert not public.login_locked('autre@demo.test'), 'Le verrouillage ne touche que ce compte';
  perform public.record_access('alice@demo-a.test', 'login', 'aaaaaaaa-0000-0000-0000-000000000001');
  assert (select last_login_at from public.users where id = 'a1000000-0000-0000-0000-000000000001') is not null, 'Dernière connexion non enregistrée';
end $$;
reset role;

-- 3. Invitations : seul un membre ayant la permission invite ; le lien n'est gardé qu'en condensé
select set_config('request.jwt.claims', '{"sub":"a1000000-0000-0000-0000-000000000001","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}', true);
set local role authenticated;
do $$
declare r uuid; tok text;
begin
  select id into r from public.roles where code = 'admin';
  -- Alice a le rôle admin, qui porte 'core.settings.manage' mais pas encore 'core.users.invite'
  begin
    perform public.create_invitation('new@demo-a.test', 'Nouvelle Personne', r);
    assert false, 'Invitation sans la permission core.users.invite';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
insert into public.role_permissions (tenant_id, role_id, permission)
  select tenant_id, id, 'core.users.invite' from public.roles where tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001' and code = 'admin';
create temporary table tok(v text) on commit drop;
grant all on tok to authenticated, service_role;
set local role authenticated;
do $$
declare r uuid; t text;
begin
  select id into r from public.roles where code = 'admin';
  t := public.create_invitation(' New@Demo-A.test ', 'Nouvelle Personne', r);
  assert length(t) = 64, 'Lien d''invitation trop court';
  insert into tok values (t);
  assert (select count(*) from public.invitations where email = 'new@demo-a.test' and status = 'pending') = 1, 'Invitation non créée';
  begin
    perform token_hash from public.invitations;
    assert false, 'Le condensé du lien est lisible';
  exception when insufficient_privilege then null; end;
  -- Déjà membre : refus
  begin
    perform public.create_invitation('carla@cabinet.test', 'Carla', r);
    assert false, 'Invitation d''une personne déjà membre';
  exception when unique_violation then null; end;
end $$;
reset role;
do $$ begin
  assert (select token_hash from public.invitations where email = 'new@demo-a.test') = app.token_hash((select v from tok)), 'Condensé incorrect';
  assert not exists (select 1 from public.invitations where token_hash = (select v from tok)), 'Lien gardé en clair';
  assert exists (select 1 from public.audit_log where entity = 'invitation' and action = 'create'), 'Invitation non tracée';
end $$;

-- B ne voit pas les invitations de A
select set_config('request.jwt.claims', '{"sub":"b2000000-0000-0000-0000-000000000002","tenant_id":"bbbbbbbb-0000-0000-0000-000000000002","role":"authenticated"}', true);
set local role authenticated;
do $$ begin
  assert (select count(*) from public.invitations where tenant_id <> 'bbbbbbbb-0000-0000-0000-000000000002') = 0, 'B voit les invitations de A';
end $$;
reset role;

-- Aperçu (serveur) puis acceptation par la bonne personne ; mauvaise adresse refusée ; lien à usage unique
set local role service_role;
do $$ begin
  assert (select company from public.invitation_preview((select v from tok))) = 'Boutique Démo A', 'Aperçu incorrect';
  assert (select count(*) from public.invitation_preview('faux-lien')) = 0, 'Faux lien accepté';
end $$;
reset role;
insert into auth.users (id, email) values ('e5000000-0000-0000-0000-000000000005', 'new@demo-a.test');
select set_config('request.jwt.claims', '{"sub":"b2000000-0000-0000-0000-000000000002","email":"bob@demo-b.test","role":"authenticated"}', true);
set local role authenticated;
do $$ begin
  begin
    perform public.accept_invitation((select v from tok));
    assert false, 'Invitation acceptée par une autre adresse';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
select set_config('request.jwt.claims', '{"sub":"e5000000-0000-0000-0000-000000000005","email":"new@demo-a.test","role":"authenticated"}', true);
set local role authenticated;
do $$ begin
  assert public.accept_invitation((select v from tok), 'Nouvelle Personne') = 'aaaaaaaa-0000-0000-0000-000000000001', 'Acceptation refusée';
  begin
    perform public.accept_invitation((select v from tok));
    assert false, 'Lien réutilisable';
  exception when no_data_found then null; end;
end $$;
reset role;
do $$ begin
  assert exists (select 1 from public.memberships where user_id = 'e5000000-0000-0000-0000-000000000005' and tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001' and is_active), 'Appartenance non créée';
  assert exists (select 1 from public.user_roles where user_id = 'e5000000-0000-0000-0000-000000000005'), 'Rôle non attribué';
  assert (select current_tenant_id from public.users where id = 'e5000000-0000-0000-0000-000000000005') = 'aaaaaaaa-0000-0000-0000-000000000001', 'Entreprise non choisie';
  assert exists (select 1 from public.audit_log where entity = 'invitation' and action = 'accept'), 'Acceptation non tracée';
end $$;
rollback;
