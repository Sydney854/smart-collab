-- Entreprise ajoutée au jeton par la base (SEC-MO-03) et choix de l'entreprise à la connexion (décision L1).
begin;
\ir fixtures.sql
set local role supabase_auth_admin;
do $$
declare ev jsonb := '{"claims":{"role":"authenticated","tenant_id":"forgé"}}';
begin
  -- Une seule entreprise : retenue d'office
  assert public.custom_access_token_hook(ev || '{"user_id":"a1000000-0000-0000-0000-000000000001"}') -> 'claims' ->> 'tenant_id'
         = 'aaaaaaaa-0000-0000-0000-000000000001', 'Alice doit recevoir A';
  -- Plusieurs entreprises : celle choisie à la connexion
  assert public.custom_access_token_hook(ev || '{"user_id":"c3000000-0000-0000-0000-000000000003"}') -> 'claims' ->> 'tenant_id'
         = 'bbbbbbbb-0000-0000-0000-000000000002', 'Carla doit recevoir B (son choix)';
  -- Appartenance désactivée : aucune entreprise, et la valeur forgée est retirée
  assert (public.custom_access_token_hook(ev || '{"user_id":"d4000000-0000-0000-0000-000000000004"}') -> 'claims') ? 'tenant_id' = false,
         'Dan ne doit recevoir aucune entreprise';
end $$;
reset role;

-- Plusieurs entreprises sans choix enregistré : aucune entreprise (l'écran demandera de choisir)
update public.users set current_tenant_id = null where id = 'c3000000-0000-0000-0000-000000000003';
set local role supabase_auth_admin;
do $$ begin
  assert (public.custom_access_token_hook('{"user_id":"c3000000-0000-0000-0000-000000000003","claims":{}}') -> 'claims') ? 'tenant_id' = false,
         'Sans choix, aucune entreprise ne doit être imposée';
end $$;
reset role;
-- Entreprise suspendue : plus d'entreprise dans le jeton, et on ne peut plus la choisir
update public.tenants set status = 'suspended' where id = 'aaaaaaaa-0000-0000-0000-000000000001';
set local role supabase_auth_admin;
do $$ begin
  assert (public.custom_access_token_hook('{"user_id":"a1000000-0000-0000-0000-000000000001","claims":{}}') -> 'claims') ? 'tenant_id' = false,
         'Entreprise suspendue encore donnée dans le jeton';
end $$;
reset role;
select set_config('request.jwt.claims', '{"sub":"c3000000-0000-0000-0000-000000000003","role":"authenticated"}', true);
set local role authenticated;
do $$ begin
  begin
    perform public.select_tenant('aaaaaaaa-0000-0000-0000-000000000001');
    assert false, 'Entreprise suspendue choisie';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
update public.tenants set status = 'trial' where id = 'aaaaaaaa-0000-0000-0000-000000000001';
update public.users set current_tenant_id = 'bbbbbbbb-0000-0000-0000-000000000002' where id = 'c3000000-0000-0000-0000-000000000003';

-- Choisir une entreprise dont on est membre : accepté ; une autre : refusé
select set_config('request.jwt.claims', '{"sub":"c3000000-0000-0000-0000-000000000003","role":"authenticated"}', true);
set local role authenticated;
select public.select_tenant('aaaaaaaa-0000-0000-0000-000000000001');
reset role;
do $$ begin
  assert (select current_tenant_id from public.users where id = 'c3000000-0000-0000-0000-000000000003') = 'aaaaaaaa-0000-0000-0000-000000000001',
         'Le choix de Carla n''est pas enregistré';
end $$;
select set_config('request.jwt.claims', '{"sub":"a1000000-0000-0000-0000-000000000001","role":"authenticated"}', true);
set local role authenticated;
do $$ begin
  begin
    perform public.select_tenant('bbbbbbbb-0000-0000-0000-000000000002');
    assert false, 'Alice a pu choisir une entreprise dont elle n''est pas membre';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
