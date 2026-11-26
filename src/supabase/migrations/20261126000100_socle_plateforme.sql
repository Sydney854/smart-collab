-- Smart Collab — Socle plateforme (lot 1, étape 1)
-- Adapté de 02_SPECIFICATIONS/sql/001_socle_plateforme.sql pour Supabase :
--   * entreprise courante lue dans le jeton de connexion (auth.jwt() ->> 'tenant_id'), jamais choisie par l'écran (SEC-MO-03) ;
--   * une personne = un compte de connexion (auth.users), reliée à une ou plusieurs entreprises par `memberships`
--     (décision L1 du 26/11/2026) ; l'entreprise du jeton n'est retenue que si la personne en est membre active ;
--   * sécurité au niveau des lignes activée ET forcée sur toutes les tables, aucune table sans règle (SEC-MO-01) ;
--   * liens entre tables d'une même entreprise par clés composées (tenant_id, id) : impossible de relier deux entreprises ;
--   * montants en numeric ; journal d'audit en ajout seul (SEC-MO-10).
-- Droits d'écriture : aucun pour les écrans à cette étape. Les écritures passeront par des fonctions serveur
-- vérifiées (étapes 2 à 4). Les rôles `anon` et `authenticated` n'ont que la lecture prévue ci-dessous.

-- gen_random_uuid() est intégré à PostgreSQL (13 et plus) : aucune extension nécessaire.

create schema if not exists app;
comment on schema app is 'Fonctions internes de Smart Collab (non exposées par l''API)';

-- ─────────────────────────────────────────────
-- Plateforme (console éditeur)
-- ─────────────────────────────────────────────

create table public.plans (
  id              text primary key,                 -- starter | business | enterprise
  name            jsonb not null,                   -- {"fr": "...", "en": "..."}
  billing_period  text not null default 'year' check (billing_period in ('year', 'multi_year')),
  max_users       int check (max_users > 0),
  max_sites       int check (max_sites > 0)
);

create table public.tenants (
  id              uuid primary key default gen_random_uuid(),
  legal_name      text not null check (length(trim(legal_name)) > 0),
  country         char(2) not null default 'CI',    -- code ISO ; UEMOA au lancement
  currency        char(3) not null default 'XOF',
  timezone        text not null default 'Africa/Abidjan',
  default_locale  text not null default 'fr' check (default_locale in ('fr', 'en')),
  business_domain text not null check (business_domain in ('retail', 'multisite', 'consulting', 'electrical', 'mixed')),
  deployment      text not null default 'cloud' check (deployment in ('cloud', 'on_premise')),
  plan_id         text references public.plans(id),
  status          text not null default 'trial' check (status in ('trial', 'active', 'suspended', 'closed')),
  trial_ends_at   timestamptz,
  created_at      timestamptz not null default now()
);

create table public.subscriptions (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants(id),
  plan_id         text not null references public.plans(id),
  starts_on       date not null,
  ends_on         date not null check (ends_on > starts_on),
  amount          numeric(14,2) not null check (amount >= 0),
  currency        char(3) not null default 'XOF',
  status          text not null default 'pending' check (status in ('pending', 'paid', 'overdue', 'cancelled')),
  license_key     text unique,                       -- installations chez le client
  created_at      timestamptz not null default now()
);
create index subscriptions_tenant_idx on public.subscriptions (tenant_id);

-- ─────────────────────────────────────────────
-- Registre des applications (modèle Odoo)
-- ─────────────────────────────────────────────

create table public.apps (
  id              text primary key,                 -- pos, inventory, accounting...
  version         text not null,
  category        text not null,
  name            jsonb not null,
  is_core         boolean not null default false,
  is_bridge       boolean not null default false,
  offline_capable boolean not null default false,
  manifest        jsonb not null                     -- manifeste complet (16_CONTRAT_APPLICATION.md)
);

create table public.app_dependencies (
  app_id          text not null references public.apps(id),
  depends_on      text not null references public.apps(id),
  primary key (app_id, depends_on),
  check (app_id <> depends_on)
);

create table public.plan_apps (
  plan_id         text not null references public.plans(id),
  app_id          text not null references public.apps(id),
  primary key (plan_id, app_id)
);

create table public.app_installations (
  tenant_id       uuid not null references public.tenants(id),
  app_id          text not null references public.apps(id),
  status          text not null check (status in ('installed', 'archived')),
  installed_version text not null,
  installed_at    timestamptz not null default now(),
  installed_by    uuid,
  archived_at     timestamptz,
  primary key (tenant_id, app_id)
);

-- ─────────────────────────────────────────────
-- Personnes, appartenance aux entreprises, rôles, droits
-- ─────────────────────────────────────────────

-- Une personne = un compte de connexion Supabase (mot de passe et double authentification gérés par Supabase Auth)
create table public.users (
  id                uuid primary key references auth.users(id),
  email             text not null,
  full_name         text not null,
  locale            text not null default 'fr' check (locale in ('fr', 'en')),
  is_active         boolean not null default true,
  current_tenant_id uuid references public.tenants(id),   -- entreprise choisie à la connexion (si plusieurs)
  last_login_at     timestamptz,
  created_at        timestamptz not null default now()
);
create unique index users_email_idx on public.users (lower(email));

-- Appartenance d'une personne à une entreprise (une personne peut en avoir plusieurs : décision L1 du 26/11/2026)
create table public.memberships (
  tenant_id       uuid not null references public.tenants(id),
  user_id         uuid not null references public.users(id),
  is_active       boolean not null default true,
  joined_at       timestamptz not null default now(),
  primary key (tenant_id, user_id)
);
create index memberships_user_idx on public.memberships (user_id);

create table public.roles (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants(id),
  code            text not null,                     -- admin, manager, cashier...
  name            jsonb not null,
  source_preset   text,                              -- métier d'origine du rôle préréglé
  is_active       boolean not null default true,
  unique (tenant_id, code),
  unique (tenant_id, id)
);

-- Un droit = rôle × permission (déclarée par une application) × périmètre
create table public.role_permissions (
  tenant_id       uuid not null,
  role_id         uuid not null,
  permission      text not null,                     -- 'pos.sale.create'
  scope           text not null default 'tenant' check (scope in ('tenant', 'sites', 'team', 'own')),
  limit_amount    numeric(14,2) check (limit_amount >= 0),   -- seuil de validation éventuel
  primary key (role_id, permission),
  foreign key (tenant_id, role_id) references public.roles(tenant_id, id)
);

create table public.user_roles (
  tenant_id       uuid not null,
  user_id         uuid not null,
  role_id         uuid not null,
  primary key (tenant_id, user_id, role_id),
  foreign key (tenant_id, user_id) references public.memberships(tenant_id, user_id),
  foreign key (tenant_id, role_id) references public.roles(tenant_id, id)
);

create table public.field_masks (                    -- champs sensibles masqués par rôle
  tenant_id       uuid not null,
  role_id         uuid not null,
  entity          text not null,                     -- 'product'
  field           text not null,                     -- 'cost_price'
  primary key (role_id, entity, field),
  foreign key (tenant_id, role_id) references public.roles(tenant_id, id)
);

-- ─────────────────────────────────────────────
-- Configuration versionnée (moteur de configuration)
-- ─────────────────────────────────────────────

create table public.config_items (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants(id),
  app_id          text not null references public.apps(id),
  kind            text not null check (kind in ('rule', 'scale', 'kpi', 'dashboard', 'document_template',
                                                'report_template', 'approval_flow', 'threshold', 'numbering',
                                                'custom_field', 'menu', 'theme')),
  code            text not null,
  unique (tenant_id, app_id, kind, code),
  unique (tenant_id, id)
);

create table public.config_versions (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null,
  config_item_id  uuid not null,
  version         int not null check (version > 0),
  valid_from      date not null,                     -- un document garde la version en vigueur à sa date
  definition      jsonb not null,                    -- expression, barème, mise en page...
  created_by      uuid,
  created_at      timestamptz not null default now(),
  unique (config_item_id, version),
  foreign key (tenant_id, created_by) references public.memberships(tenant_id, user_id),
  foreign key (tenant_id, config_item_id) references public.config_items(tenant_id, id)
);

-- ─────────────────────────────────────────────
-- Numérotation des documents
-- ─────────────────────────────────────────────

create table public.number_sequences (
  tenant_id       uuid not null references public.tenants(id),
  code            text not null,                     -- 'pos.ticket', 'purchase.receipt'
  scope_key       text not null default '',          -- site, année...
  prefix          text not null,
  next_value      bigint not null default 1 check (next_value > 0),
  primary key (tenant_id, code, scope_key)
);

-- ─────────────────────────────────────────────
-- Traçabilité et événements
-- ─────────────────────────────────────────────

-- Appareils (caisses, tablettes) : déclarés avant le journal d'audit, qui les cite
create table public.devices (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants(id),
  label           text not null,
  site_id         uuid,
  number_prefix   text not null,                     -- numéros provisoires propres à l'appareil
  last_sync_at    timestamptz,
  is_active       boolean not null default true,
  unique (tenant_id, id)
);

create table public.audit_log (
  id              bigint generated always as identity primary key,
  tenant_id       uuid not null references public.tenants(id),
  occurred_at     timestamptz not null default now(),
  user_id         uuid,
  device_id       uuid,
  app_id          text,
  action          text not null,                     -- create | update | validate | cancel | install | ...
  entity          text not null,
  entity_id       text not null,
  old_value       jsonb,
  new_value       jsonb,
  reason          text,
  severity        text not null default 'info' check (severity in ('info', 'watch', 'important', 'urgent')),
  foreign key (tenant_id, user_id) references public.memberships(tenant_id, user_id),
  foreign key (tenant_id, device_id) references public.devices(tenant_id, id)
);
create index audit_log_entity_idx on public.audit_log (tenant_id, entity, entity_id);

-- Tables en ajout seul : aucune modification ni suppression par l'application ni par le propriétaire en usage normal (SEC-MO-10).
-- Limite connue : le propriétaire de la base pourrait retirer ces déclencheurs ; la structure ne change donc que par migration relue.
create or replace function app.forbid_change() returns trigger
language plpgsql set search_path = '' as $$
begin
  raise exception 'Table en ajout seul : % interdit sur %', tg_op, tg_table_name
    using errcode = 'insufficient_privilege';
end $$;
create trigger audit_log_append_only before update or delete on public.audit_log
  for each row execute function app.forbid_change();
create trigger audit_log_no_truncate before truncate on public.audit_log
  for each statement execute function app.forbid_change();

-- Journal des accès (connexions) ; l'entreprise peut être inconnue pour un échec de connexion
create table public.access_log (
  id              bigint generated always as identity primary key,
  tenant_id       uuid references public.tenants(id),
  occurred_at     timestamptz not null default now(),
  email           text not null,
  event           text not null check (event in ('login', 'login_failed', 'logout', 'role_changed', 'locked')),
  ip              inet,
  user_agent      text
);
create index access_log_tenant_idx on public.access_log (tenant_id, occurred_at);
create trigger access_log_append_only before update or delete on public.access_log
  for each row execute function app.forbid_change();
create trigger access_log_no_truncate before truncate on public.access_log
  for each statement execute function app.forbid_change();

-- Outbox : événements publiés par les applications, consommés en tâche de fond
create table public.event_outbox (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants(id),
  type            text not null,                     -- 'pos.sale.validated'
  version         int not null default 1,
  actor_id        uuid,
  site_id         uuid,
  payload         jsonb not null,
  occurred_at     timestamptz not null default now(),
  processed_at    timestamptz,
  attempts        int not null default 0,
  foreign key (tenant_id, actor_id) references public.memberships(tenant_id, user_id)
);
create index event_outbox_pending_idx on public.event_outbox (occurred_at) where processed_at is null;
create index event_outbox_tenant_idx on public.event_outbox (tenant_id);

create table public.delete_requests (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants(id),
  entity          text not null,
  entity_id       text not null,
  reason          text not null check (length(trim(reason)) >= 3),
  requested_by    uuid not null,
  status          text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  decided_by      uuid,
  decided_at      timestamptz,
  created_at      timestamptz not null default now(),
  foreign key (tenant_id, requested_by) references public.memberships(tenant_id, user_id),
  foreign key (tenant_id, decided_by) references public.memberships(tenant_id, user_id)
);
create index delete_requests_tenant_idx on public.delete_requests (tenant_id);

-- ─────────────────────────────────────────────
-- Synchronisation hors ligne
-- ─────────────────────────────────────────────


create table public.sync_operations (
  idempotency_key uuid not null,                     -- généré par l'appareil : un envoi en double n'est enregistré qu'une fois
  tenant_id       uuid not null,
  device_id       uuid not null,
  operation       text not null,                     -- 'pos.sale.create'
  payload         jsonb not null,
  performed_at    timestamptz not null,              -- heure réelle de l'opération sur l'appareil
  received_at     timestamptz not null default now(),
  status          text not null default 'applied' check (status in ('applied', 'conflict', 'rejected')),
  result          jsonb,
  primary key (tenant_id, idempotency_key),
  foreign key (tenant_id, device_id) references public.devices(tenant_id, id)
);

create table public.sync_conflicts (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null,
  idempotency_key uuid not null,
  kind            text not null,                     -- 'insufficient_stock', 'price_changed'...
  detail          jsonb not null,
  resolved_by     uuid,
  resolved_at     timestamptz,
  resolution      text,
  foreign key (tenant_id, resolved_by) references public.memberships(tenant_id, user_id),
  foreign key (tenant_id, idempotency_key) references public.sync_operations(tenant_id, idempotency_key)
);

-- ─────────────────────────────────────────────
-- Entreprise courante (lue dans le jeton, vérifiée par l'appartenance)
-- ─────────────────────────────────────────────

-- Renvoie l'entreprise du jeton seulement si la personne connectée en est membre active ; sinon NULL → aucune ligne visible.
create or replace function app.current_tenant() returns uuid
language sql stable security definer set search_path = '' as $$
  select m.tenant_id
  from public.memberships m
  join public.users u on u.id = m.user_id and u.is_active
  join public.tenants t on t.id = m.tenant_id and t.status in ('trial', 'active')
  where m.user_id = auth.uid()
    and m.is_active
    and m.tenant_id::text = (auth.jwt() ->> 'tenant_id')
$$;

-- Ajoute l'entreprise au jeton à chaque connexion ou rafraîchissement (Supabase « custom access token hook »).
-- Une seule entreprise active : elle est retenue. Plusieurs : celle choisie à la connexion (users.current_tenant_id).
create or replace function public.custom_access_token_hook(event jsonb) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  uid uuid := (event ->> 'user_id')::uuid;
  chosen uuid;
  claims jsonb := coalesce(event -> 'claims', '{}'::jsonb);
begin
  select m.tenant_id into chosen
  from public.memberships m
  join public.users u on u.id = m.user_id and u.is_active
  join public.tenants t on t.id = m.tenant_id and t.status in ('trial', 'active')
  where m.user_id = uid and m.is_active
    and (m.tenant_id = u.current_tenant_id
         or (select count(*) from public.memberships x join public.tenants y on y.id = x.tenant_id
             where x.user_id = uid and x.is_active and y.status in ('trial', 'active')) = 1)
  limit 1;

  if chosen is null then
    claims := claims - 'tenant_id';
  else
    claims := jsonb_set(claims, '{tenant_id}', to_jsonb(chosen::text));
  end if;
  return jsonb_set(event, '{claims}', claims);
end $$;

-- Choix de l'entreprise à la connexion (personne membre de plusieurs entreprises) ; refusé si la personne n'en est pas membre.
-- L'écran rafraîchit ensuite la session pour obtenir un jeton portant la nouvelle entreprise.
create or replace function public.select_tenant(target uuid) returns void
language plpgsql volatile security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'Connexion requise' using errcode = 'insufficient_privilege';
  end if;
  if not exists (
    select 1 from public.memberships m join public.users u on u.id = m.user_id and u.is_active
    join public.tenants t on t.id = m.tenant_id and t.status in ('trial', 'active')
    where m.user_id = auth.uid() and m.tenant_id = target and m.is_active
  ) then
    raise exception 'Entreprise non autorisée' using errcode = 'insufficient_privilege';
  end if;
  update public.users set current_tenant_id = target where id = auth.uid();
end $$;

-- ─────────────────────────────────────────────
-- Droits d'accès des rôles de l'API (anon = visiteur, authenticated = personne connectée)
-- ─────────────────────────────────────────────

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;
revoke all on all functions in schema app from public, anon, authenticated;
revoke all on schema app from public;

grant usage on schema app to authenticated;
grant execute on function app.current_tenant() to authenticated;
grant execute on function public.select_tenant(uuid) to authenticated;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
grant usage on schema public to supabase_auth_admin;

-- Lecture seule pour les personnes connectées ; les écritures passeront par des fonctions serveur (étapes suivantes)
grant select on all tables in schema public to authenticated;
-- Fiche d'une personne : les collègues ne lisent que l'identité ; l'entreprise choisie et la dernière connexion
-- restent privées (elles révéleraient les autres entreprises de la personne)
revoke select on public.users from authenticated;
grant select (id, email, full_name, locale, is_active, created_at) on public.users to authenticated;

-- ─────────────────────────────────────────────
-- Sécurité au niveau des lignes (RLS) : activée et forcée partout, aucune table sans règle (SEC-MO-01)
-- ─────────────────────────────────────────────

do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
  end loop;

  -- Tables d'une entreprise : visibles seulement dans l'entreprise courante
  foreach t in array array['subscriptions','app_installations','memberships','roles','role_permissions','user_roles',
    'field_masks','config_items','config_versions','number_sequences','audit_log','access_log','event_outbox',
    'delete_requests','devices','sync_operations','sync_conflicts']
  loop
    execute format(
      'create policy tenant_isolation on public.%I as permissive for all to authenticated '
      'using (tenant_id = (select app.current_tenant())) with check (tenant_id = (select app.current_tenant()))', t);
  end loop;

  -- Catalogue commun (offres, applications) : lisible par toute personne connectée, modifiable par l'éditeur seulement
  foreach t in array array['plans','apps','app_dependencies','plan_apps'] loop
    execute format('create policy catalog_read on public.%I for select to authenticated using (true)', t);
  end loop;
end $$;

-- Entreprise : seulement l'entreprise courante
create policy tenant_self on public.tenants for select to authenticated
  using (id = (select app.current_tenant()));

-- Personne connectée active ? (fonction propriétaire : évite que les règles de users et memberships s'appellent en boucle)
create or replace function app.is_active_user() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select u.is_active from public.users u where u.id = auth.uid()), false)
$$;
revoke all on function app.is_active_user() from public, anon;
grant execute on function app.is_active_user() to authenticated;

-- Choix à la connexion : une personne voit ses propres appartenances et le nom de ses entreprises
create policy memberships_own on public.memberships for select to authenticated
  using (user_id = (select auth.uid()) and (select app.is_active_user()));
create policy tenants_member on public.tenants for select to authenticated
  using ((select app.is_active_user())
         and exists (select 1 from public.memberships m
                     where m.tenant_id = tenants.id and m.user_id = (select auth.uid()) and m.is_active));

-- Personnes : soi-même, et les membres de l'entreprise courante
create policy users_visible on public.users for select to authenticated
  using (
    id = (select auth.uid())
    or exists (select 1 from public.memberships m
               where m.user_id = users.id and m.tenant_id = (select app.current_tenant()))
  );

-- Le crochet de connexion s'exécute avec les droits du propriétaire (security definer) :
-- le compte de connexion Supabase n'a besoin d'aucun droit de lecture sur les tables.

-- Tables créées plus tard : pas de droits par défaut pour l'API (chaque migration les accorde explicitement)
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on functions from public, anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
