-- ENF-SEC-01 / SEC-MO-01 : une personne de l'entreprise A ne voit et ne modifie jamais rien de l'entreprise B.
begin;
\ir fixtures.sql

create temporary table tenant_tables(name text) on commit drop;
insert into tenant_tables values ('subscriptions'),('app_installations'),('memberships'),('roles'),('role_permissions'),
  ('user_roles'),('field_masks'),('config_items'),('config_versions'),('number_sequences'),('audit_log'),('access_log'),
  ('event_outbox'),('delete_requests'),('devices'),('sync_operations'),('sync_conflicts');
grant select on tenant_tables to authenticated;

-- 1. Alice (A) : voit les lignes de A dans chaque table, aucune de B
select set_config('request.jwt.claims', '{"sub":"a1000000-0000-0000-0000-000000000001","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}', true);
set local role authenticated;
do $$
declare t text; n_a int; n_b int;
begin
  for t in select name from tenant_tables loop
    execute format('select count(*) filter (where tenant_id = %L), count(*) filter (where tenant_id <> %L) from public.%I',
                   'aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', t) into n_a, n_b;
    assert n_a > 0, format('Alice ne voit pas ses propres lignes dans %s', t);
    assert n_b = 0, format('Alice voit %s ligne(s) d''une autre entreprise dans %s', n_b, t);
  end loop;
  assert (select count(*) from public.tenants) = 1, 'Alice voit une autre entreprise';
  assert not exists (select 1 from public.users where email like '%demo-b.test'), 'Alice voit une personne de B';
  assert (select count(*) from public.apps) = 2, 'Le catalogue des applications doit rester lisible';
end $$;

-- 2. Écritures directes refusées (même dans sa propre entreprise : elles passeront par des fonctions serveur)
do $$ begin
  begin
    insert into public.roles (tenant_id, code, name) values ('bbbbbbbb-0000-0000-0000-000000000002', 'pirate', '{}');
    assert false, 'Alice a pu créer un rôle dans B';
  exception when insufficient_privilege then null; end;
  begin
    update public.tenants set legal_name = 'Piratée';
    assert false, 'Alice a pu modifier une entreprise';
  exception when insufficient_privilege then null; end;
  begin
    delete from public.audit_log;
    assert false, 'Alice a pu supprimer le journal';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

-- 3. Jeton qui annonce une entreprise dont la personne n'est pas membre : rien n'est visible
select set_config('request.jwt.claims', '{"sub":"a1000000-0000-0000-0000-000000000001","tenant_id":"bbbbbbbb-0000-0000-0000-000000000002","role":"authenticated"}', true);
set local role authenticated;
do $$
declare t text; n int;
begin
  assert app.current_tenant() is null, 'Entreprise non vérifiée acceptée';
  for t in select name from tenant_tables where name <> 'memberships' loop
    execute format('select count(*) from public.%I', t) into n;
    assert n = 0, format('Jeton falsifié : %s ligne(s) visibles dans %s', n, t);
  end loop;
end $$;
reset role;

-- 4. Appartenance désactivée : plus rien n'est visible
select set_config('request.jwt.claims', '{"sub":"d4000000-0000-0000-0000-000000000004","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}', true);
set local role authenticated;
do $$ begin
  assert app.current_tenant() is null, 'Appartenance désactivée acceptée';
  assert (select count(*) from public.roles) = 0, 'Ancien membre voit les rôles';
  assert (select count(*) from public.tenants) = 0, 'Ancien membre voit l''entreprise';
end $$;
reset role;

-- 5. Carla (comptable, A et B) : voit A avec un jeton A, B avec un jeton B, jamais les deux à la fois
select set_config('request.jwt.claims', '{"sub":"c3000000-0000-0000-0000-000000000003","tenant_id":"bbbbbbbb-0000-0000-0000-000000000002","role":"authenticated"}', true);
set local role authenticated;
do $$ begin
  assert (select count(*) from public.roles where tenant_id = 'bbbbbbbb-0000-0000-0000-000000000002') = 1, 'Carla ne voit pas B';
  assert (select count(*) from public.roles where tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 0, 'Carla voit A avec un jeton B';
  -- Pour choisir à la connexion : elle voit ses deux entreprises et ses deux appartenances, pas celles des autres
  assert (select count(*) from public.tenants) = 2, 'Carla doit voir le nom de ses 2 entreprises';
  assert (select count(*) from public.memberships where user_id = 'c3000000-0000-0000-0000-000000000003') = 2, 'Carla doit voir ses appartenances';
  assert (select count(*) from public.memberships where user_id <> 'c3000000-0000-0000-0000-000000000003'
          and tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 0, 'Carla voit les membres de A avec un jeton B';
end $$;
reset role;

-- 6. Visiteur non connecté : aucun accès
set local role anon;
do $$ begin
  begin
    perform 1 from public.tenants;
    assert false, 'Un visiteur lit les entreprises';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

-- 7. Impossible de relier deux entreprises (rôle de B donné à une personne de A), même pour le propriétaire de la base
do $$
declare rb uuid;
begin
  select id into rb from public.roles where tenant_id = 'bbbbbbbb-0000-0000-0000-000000000002' limit 1;
  begin
    insert into public.user_roles (tenant_id, user_id, role_id)
      values ('aaaaaaaa-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', rb);
    assert false, 'Rôle de B attribué dans A';
  exception when foreign_key_violation then null; end;
end $$;
rollback;
