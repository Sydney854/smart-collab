-- Registre des applications (EF-APP-01 à 06, 16_CONTRAT_APPLICATION.md § 9)
begin;
\ir fixtures.sql
update public.tenants set plan_id = 'business' where id = 'aaaaaaaa-0000-0000-0000-000000000001';
update public.tenants set plan_id = 'starter' where id = 'bbbbbbbb-0000-0000-0000-000000000002';
insert into public.role_permissions (tenant_id, role_id, permission)
  select tenant_id, id, p from public.roles, unnest(array['core.apps.view', 'core.apps.manage']) p where code = 'admin' on conflict do nothing;
-- Données d'inventaire fictives (la table propre de l'application n'existe qu'au lot 2 : on vérifie l'installation)
select set_config('request.jwt.claims', '{"sub":"a1000000-0000-0000-0000-000000000001","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}', true);
set local role authenticated;
do $$
declare added text[];
begin
  -- Aperçu : Point de vente ajoute Tiers, Produits & Inventaire et Finance (EF-APP-02)
  assert (select array_agg(app_id order by app_id) from public.preview_install('pos') where not installed)
         = array['finance','inventory','partners','pos'], 'Aperçu des dépendances incorrect';
  added := public.install_app('pos');
  assert added @> array['inventory','finance','partners','pos'], 'Dépendances non installées';
  assert (select count(*) from public.app_installations where status = 'installed') = 5, 'Nombre d''applications installées';
  -- Réinstaller ne fait rien de plus
  assert public.install_app('pos') = '{}', 'Réinstallation en double';
  -- Désinstaller une dépendance : refusé (EF-APP-03)
  begin perform public.uninstall_app('inventory', 'essai'); assert false, 'Dépendance désinstallée alors que pos en dépend';
  exception when dependent_objects_still_exist then null; end;
  begin perform public.uninstall_app('core', 'essai'); assert false, 'Socle désinstallé';
  exception when check_violation then null; end;
  begin perform public.uninstall_app('pos', ''); assert false, 'Désinstallation sans motif';
  exception when check_violation then null; end;
  -- Désinstaller pos : archivé, données gardées, puis inventory devient désinstallable
  perform public.uninstall_app('pos', 'fin de l''essai');
  assert (select status from public.app_installations where app_id = 'pos') = 'archived', 'pos non archivé';
  perform public.uninstall_app('inventory', 'fin de l''essai');
  -- Réinstaller : la même ligne revient (données archivées réapparaissent)
  perform public.install_app('pos');
  assert (select status from public.app_installations where app_id = 'pos') = 'installed', 'Réinstallation';
end $$;
reset role;
do $$ begin
  assert (select count(*) from public.audit_log where entity = 'app' and action = 'install') >= 4, 'Installations non tracées';
  assert (select count(*) from public.audit_log where entity = 'app' and action = 'uninstall') = 2, 'Désinstallations non tracées';
  assert exists (select 1 from public.event_outbox where type = 'core.app.installed' and payload ->> 'app_id' = 'pos'), 'Événement d''installation non publié';
  assert exists (select 1 from public.event_outbox where type = 'core.app.uninstalled' and payload ->> 'app_id' = 'pos'), 'Événement de désinstallation non publié';
end $$;

-- Formule « Essentiel » : Ventes non incluse (EF-APP-06) ; un caissier n'installe rien ; B ne voit pas les applications de A
select set_config('request.jwt.claims', '{"sub":"b2000000-0000-0000-0000-000000000002","tenant_id":"bbbbbbbb-0000-0000-0000-000000000002","role":"authenticated"}', true);
set local role authenticated;
do $$ begin
  begin perform public.install_app('sales'); assert false, 'Application hors formule installée';
  exception when check_violation then null; end;
  assert (select count(*) from public.app_installations where tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 0, 'B voit les installations de A';
  assert exists (select 1 from public.preview_install('sales') where not in_plan), 'Aperçu : hors formule non signalé';
end $$;
reset role;
update public.memberships set is_active = true where user_id = 'd4000000-0000-0000-0000-000000000004';
select set_config('request.jwt.claims', '{"sub":"d4000000-0000-0000-0000-000000000004","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}', true);
set local role authenticated;
do $$ begin
  begin perform public.install_app('crm'); assert false, 'Installation sans droit';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
