-- Smart Collab — Registre des applications (lot 1, étape 4 ; EF-APP-01 à 06 ; 16_CONTRAT_APPLICATION.md)
-- * catalogue des applications des lots 1 à 7 avec leurs dépendances, formules d'abonnement ;
-- * installer : ajoute les dépendances manquantes (listées avant confirmation), refuse hors formule (EF-APP-06) ;
-- * désinstaller : refusé si une application installée en dépend (EF-APP-03), ne supprime jamais de données (statut archived) ;
-- * réinstaller : les données archivées réapparaissent ;
-- * chaque action est tracée (audit_log) et publiée (event_outbox : core.app.installed / core.app.uninstalled, EF-APP-05).

-- ─────────────────────────────────────────────
-- Catalogue (manifestes simplifiés ; le manifeste complet vit dans src/apps/<id>/manifest.ts avec chaque lot)
-- ─────────────────────────────────────────────
insert into public.apps (id, version, category, name, is_core, offline_capable, manifest) values
  ('core',      '1.0.0', 'core',    '{"fr":"Socle","en":"Core"}', true, false, '{"lot":1}'),
  ('partners',  '0.1.0', 'core',    '{"fr":"Tiers","en":"Partners"}', false, false, '{"lot":2}'),
  ('inventory', '0.1.0', 'supply',  '{"fr":"Produits & Inventaire","en":"Products & Inventory"}', false, true, '{"lot":2}'),
  ('finance',   '0.1.0', 'finance', '{"fr":"Finance","en":"Finance"}', false, false, '{"lot":3}'),
  ('pos',       '0.1.0', 'sales',   '{"fr":"Point de vente","en":"Point of sale"}', false, true, '{"lot":3}'),
  ('sales',     '0.1.0', 'sales',   '{"fr":"Ventes","en":"Sales"}', false, false, '{"lot":5}'),
  ('crm',       '0.1.0', 'sales',   '{"fr":"CRM & Clients","en":"CRM & Customers"}', false, false, '{"lot":5}'),
  ('purchase',  '0.1.0', 'supply',  '{"fr":"Achats","en":"Purchasing"}', false, false, '{"lot":4}'),
  ('transfers', '0.1.0', 'supply',  '{"fr":"Transferts & Sites","en":"Transfers & Sites"}', false, false, '{"lot":4}'),
  ('studio',    '0.1.0', 'core',    '{"fr":"Studio (configuration, états, tableaux de bord)","en":"Studio (configuration, reports, dashboards)"}', false, false, '{"lot":6}'),
  ('control',   '0.1.0', 'core',    '{"fr":"Centre de contrôle","en":"Control centre"}', false, false, '{"lot":6}'),
  ('accounting','0.1.0', 'finance', '{"fr":"Comptabilité SYSCOHADA","en":"SYSCOHADA accounting"}', false, false, '{"lot":7}')
on conflict (id) do update set version = excluded.version, category = excluded.category, name = excluded.name,
  offline_capable = excluded.offline_capable, manifest = public.apps.manifest || excluded.manifest;

insert into public.app_dependencies (app_id, depends_on) values
  ('partners','core'), ('inventory','core'), ('inventory','partners'), ('finance','core'),
  ('pos','core'), ('pos','inventory'), ('pos','finance'),
  ('sales','core'), ('sales','partners'), ('sales','inventory'), ('sales','finance'),
  ('crm','core'), ('crm','partners'),
  ('purchase','core'), ('purchase','partners'), ('purchase','inventory'), ('purchase','finance'),
  ('transfers','core'), ('transfers','inventory'),
  ('studio','core'), ('control','core'), ('accounting','core'), ('accounting','finance')
on conflict do nothing;

insert into public.plans (id, name, max_users, max_sites) values
  ('starter',    '{"fr":"Essentiel","en":"Starter"}', 5, 1),
  ('business',   '{"fr":"Business","en":"Business"}', 25, 5),
  ('enterprise', '{"fr":"Entreprise","en":"Enterprise"}', null, null)
on conflict (id) do nothing;
insert into public.plan_apps (plan_id, app_id)
select 'starter', a from unnest(array['core','partners','inventory','finance','pos']) a
union all select 'business', id from public.apps
union all select 'enterprise', id from public.apps
on conflict do nothing;

-- ─────────────────────────────────────────────
-- Dépendances et formule
-- ─────────────────────────────────────────────
-- Toutes les applications nécessaires à p_app (elle comprise), dans l'ordre d'installation (dépendances d'abord)
create or replace function app.dependency_closure(p_app text)
returns table (app_id text, depth int) language sql stable security definer set search_path = '' as $$
  with recursive deps(app_id, depth) as (
    select p_app, 0
    union
    select d.depends_on, deps.depth + 1 from public.app_dependencies d join deps on d.app_id = deps.app_id
    where deps.depth < 20
  )
  select app_id, max(depth) from deps group by app_id order by max(depth) desc, app_id
$$;

create or replace function app.in_plan(p_tenant uuid, p_app text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.tenants t join public.plan_apps pa on pa.plan_id = t.plan_id
                 where t.id = p_tenant and pa.app_id = p_app)
$$;

-- Ce que l'installation ajoutera (EF-APP-02) : pour l'écran, avant confirmation
create or replace function public.preview_install(p_app text)
returns table (app_id text, name jsonb, installed boolean, in_plan boolean)
language sql stable security definer set search_path = '' as $$
  select c.app_id, a.name,
         exists (select 1 from public.app_installations i where i.tenant_id = app.current_tenant() and i.app_id = c.app_id and i.status = 'installed'),
         app.in_plan(app.current_tenant(), c.app_id)
  from app.dependency_closure(p_app) c join public.apps a on a.id = c.app_id
  where app.current_tenant() is not null and app.has_permission('core.apps.view')
$$;

-- ─────────────────────────────────────────────
-- Installer / désinstaller (tout ou rien, tracé, publié)
-- ─────────────────────────────────────────────
create or replace function public.install_app(p_app text) returns text[]
language plpgsql volatile security definer set search_path = '' as $$
declare t uuid := app.current_tenant(); r record; added text[] := '{}';
begin
  if t is null or not app.has_permission('core.apps.manage') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  if not exists (select 1 from public.apps where id = p_app) then
    raise exception 'Application inconnue' using errcode = 'no_data_found';
  end if;
  perform pg_advisory_xact_lock(hashtext('apps:' || t::text));
  -- Formule : toute la chaîne de dépendances doit être incluse (EF-APP-06)
  if exists (select 1 from app.dependency_closure(p_app) c where not app.in_plan(t, c.app_id)) then
    raise exception 'Application non incluse dans votre formule' using errcode = 'check_violation';
  end if;
  for r in select c.app_id from app.dependency_closure(p_app) c loop
    if not exists (select 1 from public.app_installations where tenant_id = t and app_id = r.app_id and status = 'installed') then
      insert into public.app_installations (tenant_id, app_id, status, installed_version, installed_by)
      select t, a.id, 'installed', a.version, auth.uid() from public.apps a where a.id = r.app_id
      on conflict (tenant_id, app_id) do update
        set status = 'installed', installed_version = excluded.installed_version, installed_at = now(),
            installed_by = excluded.installed_by, archived_at = null;
      added := added || r.app_id;
      insert into public.audit_log (tenant_id, user_id, app_id, action, entity, entity_id, new_value)
      values (t, auth.uid(), 'core', 'install', 'app', r.app_id, jsonb_build_object('requested', p_app));
      insert into public.event_outbox (tenant_id, type, actor_id, payload)
      values (t, 'core.app.installed', auth.uid(), jsonb_build_object('app_id', r.app_id, 'requested', p_app));
    end if;
  end loop;
  return added;
end $$;

create or replace function public.uninstall_app(p_app text, p_reason text) returns void
language plpgsql volatile security definer set search_path = '' as $$
declare t uuid := app.current_tenant(); blockers text;
begin
  if t is null or not app.has_permission('core.apps.manage') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  if exists (select 1 from public.apps where id = p_app and is_core) then
    raise exception 'Le socle ne se désinstalle pas' using errcode = 'check_violation';
  end if;
  if length(trim(coalesce(p_reason, ''))) not between 3 and 500 then
    raise exception 'Motif obligatoire' using errcode = 'check_violation';
  end if;
  perform pg_advisory_xact_lock(hashtext('apps:' || t::text));
  if not exists (select 1 from public.app_installations where tenant_id = t and app_id = p_app and status = 'installed') then
    raise exception 'Application non installée' using errcode = 'no_data_found';
  end if;
  -- Refus si une application installée en dépend (EF-APP-03) ; le message liste les applications concernées
  select string_agg(i.app_id, ', ' order by i.app_id) into blockers
  from public.app_installations i join public.app_dependencies d on d.app_id = i.app_id
  where i.tenant_id = t and i.status = 'installed' and d.depends_on = p_app;
  if blockers is not null then
    raise exception 'Applications dépendantes installées : %', blockers using errcode = 'dependent_objects_still_exist';
  end if;
  -- Les données sont conservées : seule l'installation passe en « archived »
  update public.app_installations set status = 'archived', archived_at = now() where tenant_id = t and app_id = p_app;
  insert into public.audit_log (tenant_id, user_id, app_id, action, entity, entity_id, reason)
  values (t, auth.uid(), 'core', 'uninstall', 'app', p_app, trim(p_reason));
  insert into public.event_outbox (tenant_id, type, actor_id, payload)
  values (t, 'core.app.uninstalled', auth.uid(), jsonb_build_object('app_id', p_app));
end $$;

-- Installation par défaut d'une nouvelle entreprise (assistant, démonstration) : le socle
create or replace function app.install_core(p_tenant uuid) returns void
language sql volatile security definer set search_path = '' as $$
  insert into public.app_installations (tenant_id, app_id, status, installed_version)
  select p_tenant, 'core', 'installed', version from public.apps where id = 'core'
  on conflict (tenant_id, app_id) do nothing
$$;

revoke all on function app.dependency_closure(text) from public, anon, authenticated;
revoke all on function app.in_plan(uuid, text) from public, anon, authenticated;
revoke all on function app.install_core(uuid) from public, anon, authenticated;
revoke all on function public.preview_install(text) from public, anon;
revoke all on function public.install_app(text) from public, anon;
revoke all on function public.uninstall_app(text, text) from public, anon;
grant execute on function public.preview_install(text) to authenticated;
grant execute on function public.install_app(text) to authenticated;
grant execute on function public.uninstall_app(text, text) to authenticated;
