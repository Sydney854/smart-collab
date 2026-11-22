-- Smart Collab — Socle plateforme (lot 1)
-- Cible : PostgreSQL 16
-- Contenu : entreprises clientes, utilisateurs, rôles et droits, registre des applications,
--           configuration versionnée, numérotation, journal d'audit, événements (outbox), synchronisation hors ligne.
-- Règles : chaque table métier porte tenant_id ; isolation imposée par RLS (row level security) ;
--          montants en numeric ; aucune suppression physique de document validé.
-- L'application positionne l'entreprise courante à chaque requête :  SET app.tenant_id = '<uuid>';

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fonction utilitaire : entreprise courante (NULL si non positionnée → aucune ligne visible)
CREATE OR REPLACE FUNCTION app_current_tenant() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('app.tenant_id', true), '')::uuid
$$;

-- ─────────────────────────────────────────────
-- Plateforme (console éditeur)
-- ─────────────────────────────────────────────

CREATE TABLE plans (
  id              text PRIMARY KEY,                 -- starter | business | enterprise
  name            jsonb NOT NULL,                   -- {"fr": "...", "en": "..."}
  billing_period  text NOT NULL DEFAULT 'year' CHECK (billing_period IN ('year', 'multi_year')),
  max_users       int,
  max_sites       int
);

CREATE TABLE tenants (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name      text NOT NULL,
  country         char(2) NOT NULL DEFAULT 'CI',    -- code ISO ; UEMOA au lancement
  currency        char(3) NOT NULL DEFAULT 'XOF',
  timezone        text NOT NULL DEFAULT 'Africa/Abidjan',
  default_locale  text NOT NULL DEFAULT 'fr' CHECK (default_locale IN ('fr', 'en')),
  business_domain text NOT NULL CHECK (business_domain IN ('retail', 'multisite', 'consulting', 'electrical', 'mixed')),
  deployment      text NOT NULL DEFAULT 'cloud' CHECK (deployment IN ('cloud', 'on_premise')),
  plan_id         text REFERENCES plans(id),
  status          text NOT NULL DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'suspended', 'closed')),
  trial_ends_at   timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE subscriptions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  plan_id         text NOT NULL REFERENCES plans(id),
  starts_on       date NOT NULL,
  ends_on         date NOT NULL CHECK (ends_on > starts_on),
  amount          numeric(14,2) NOT NULL CHECK (amount >= 0),
  currency        char(3) NOT NULL DEFAULT 'XOF',
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  license_key     text UNIQUE,                       -- installations chez le client
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- Registre des applications (modèle Odoo)
-- ─────────────────────────────────────────────

CREATE TABLE apps (
  id              text PRIMARY KEY,                 -- pos, inventory, accounting...
  version         text NOT NULL,
  category        text NOT NULL,
  name            jsonb NOT NULL,
  is_core         boolean NOT NULL DEFAULT false,
  is_bridge       boolean NOT NULL DEFAULT false,
  offline_capable boolean NOT NULL DEFAULT false,
  manifest        jsonb NOT NULL                     -- manifeste complet (16_CONTRAT_APPLICATION.md)
);

CREATE TABLE app_dependencies (
  app_id          text NOT NULL REFERENCES apps(id),
  depends_on      text NOT NULL REFERENCES apps(id),
  PRIMARY KEY (app_id, depends_on),
  CHECK (app_id <> depends_on)
);

CREATE TABLE plan_apps (
  plan_id         text NOT NULL REFERENCES plans(id),
  app_id          text NOT NULL REFERENCES apps(id),
  PRIMARY KEY (plan_id, app_id)
);

CREATE TABLE app_installations (
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  app_id          text NOT NULL REFERENCES apps(id),
  status          text NOT NULL CHECK (status IN ('installed', 'archived')),
  installed_version text NOT NULL,
  installed_at    timestamptz NOT NULL DEFAULT now(),
  installed_by    uuid,
  archived_at     timestamptz,
  PRIMARY KEY (tenant_id, app_id)
);

-- ─────────────────────────────────────────────
-- Utilisateurs, rôles, droits
-- ─────────────────────────────────────────────

CREATE TABLE users (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  email           text NOT NULL,
  full_name       text NOT NULL,
  password_hash   text NOT NULL,
  locale          text NOT NULL DEFAULT 'fr' CHECK (locale IN ('fr', 'en')),
  mfa_enabled     boolean NOT NULL DEFAULT false,
  is_active       boolean NOT NULL DEFAULT true,
  last_login_at   timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, email)
);

CREATE TABLE roles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  code            text NOT NULL,                     -- admin, manager, cashier...
  name            jsonb NOT NULL,
  source_preset   text,                              -- métier d'origine du rôle préréglé
  is_active       boolean NOT NULL DEFAULT true,
  UNIQUE (tenant_id, code)
);

-- Un droit = rôle × permission (déclarée par une application) × périmètre
CREATE TABLE role_permissions (
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  role_id         uuid NOT NULL REFERENCES roles(id),
  permission      text NOT NULL,                     -- 'pos.sale.create'
  scope           text NOT NULL DEFAULT 'tenant' CHECK (scope IN ('tenant', 'sites', 'team', 'own')),
  limit_amount    numeric(14,2),                     -- seuil de validation éventuel
  PRIMARY KEY (role_id, permission)
);

CREATE TABLE user_roles (
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  user_id         uuid NOT NULL REFERENCES users(id),
  role_id         uuid NOT NULL REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE field_masks (                           -- champs sensibles masqués par rôle
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  role_id         uuid NOT NULL REFERENCES roles(id),
  entity          text NOT NULL,                     -- 'product'
  field           text NOT NULL,                     -- 'cost_price'
  PRIMARY KEY (role_id, entity, field)
);

-- ─────────────────────────────────────────────
-- Configuration versionnée (moteur de configuration)
-- ─────────────────────────────────────────────

CREATE TABLE config_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  app_id          text NOT NULL REFERENCES apps(id),
  kind            text NOT NULL CHECK (kind IN ('rule', 'scale', 'kpi', 'dashboard', 'document_template',
                                                'report_template', 'approval_flow', 'threshold', 'numbering',
                                                'custom_field', 'menu', 'theme')),
  code            text NOT NULL,
  UNIQUE (tenant_id, app_id, kind, code)
);

CREATE TABLE config_versions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  config_item_id  uuid NOT NULL REFERENCES config_items(id),
  version         int NOT NULL,
  valid_from      date NOT NULL,                     -- un document garde la version en vigueur à sa date
  definition      jsonb NOT NULL,                    -- expression, barème, mise en page...
  created_by      uuid REFERENCES users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (config_item_id, version)
);

-- ─────────────────────────────────────────────
-- Numérotation des documents
-- ─────────────────────────────────────────────

CREATE TABLE number_sequences (
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  code            text NOT NULL,                     -- 'pos.ticket', 'purchase.receipt'
  scope_key       text NOT NULL DEFAULT '',          -- site, année...
  prefix          text NOT NULL,
  next_value      bigint NOT NULL DEFAULT 1,
  PRIMARY KEY (tenant_id, code, scope_key)
);

-- ─────────────────────────────────────────────
-- Traçabilité et événements
-- ─────────────────────────────────────────────

CREATE TABLE audit_log (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  occurred_at     timestamptz NOT NULL DEFAULT now(),
  user_id         uuid REFERENCES users(id),
  device_id       uuid,
  app_id          text,
  action          text NOT NULL,                     -- create | update | validate | cancel | install | ...
  entity          text NOT NULL,
  entity_id       text NOT NULL,
  old_value       jsonb,
  new_value       jsonb,
  reason          text,
  severity        text NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'watch', 'important', 'urgent'))
);
CREATE INDEX audit_log_entity_idx ON audit_log (tenant_id, entity, entity_id);

-- Le journal d'audit n'est jamais modifié ni supprimé
CREATE OR REPLACE FUNCTION forbid_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Table en ajout seul : % interdit sur %', TG_OP, TG_TABLE_NAME;
END $$;
CREATE TRIGGER audit_log_append_only BEFORE UPDATE OR DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION forbid_change();

CREATE TABLE access_log (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id       uuid REFERENCES tenants(id),
  occurred_at     timestamptz NOT NULL DEFAULT now(),
  email           text NOT NULL,
  event           text NOT NULL CHECK (event IN ('login', 'login_failed', 'logout', 'role_changed', 'locked')),
  ip              inet,
  user_agent      text
);

-- Outbox : événements publiés par les applications, consommés en tâche de fond
CREATE TABLE event_outbox (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  type            text NOT NULL,                     -- 'pos.sale.validated'
  version         int NOT NULL DEFAULT 1,
  actor_id        uuid REFERENCES users(id),
  site_id         uuid,
  payload         jsonb NOT NULL,
  occurred_at     timestamptz NOT NULL DEFAULT now(),
  processed_at    timestamptz,
  attempts        int NOT NULL DEFAULT 0
);
CREATE INDEX event_outbox_pending_idx ON event_outbox (occurred_at) WHERE processed_at IS NULL;

CREATE TABLE delete_requests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  entity          text NOT NULL,
  entity_id       text NOT NULL,
  reason          text NOT NULL,
  requested_by    uuid NOT NULL REFERENCES users(id),
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  decided_by      uuid REFERENCES users(id),
  decided_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- Synchronisation hors ligne
-- ─────────────────────────────────────────────

CREATE TABLE devices (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  label           text NOT NULL,
  site_id         uuid,
  number_prefix   text NOT NULL,                     -- numéros provisoires propres à l'appareil
  last_sync_at    timestamptz,
  is_active       boolean NOT NULL DEFAULT true
);

CREATE TABLE sync_operations (
  idempotency_key uuid PRIMARY KEY,                  -- généré par l'appareil : un envoi en double n'est enregistré qu'une fois
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  device_id       uuid NOT NULL REFERENCES devices(id),
  operation       text NOT NULL,                     -- 'pos.sale.create'
  payload         jsonb NOT NULL,
  performed_at    timestamptz NOT NULL,              -- heure réelle de l'opération sur l'appareil
  received_at     timestamptz NOT NULL DEFAULT now(),
  status          text NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'conflict', 'rejected')),
  result          jsonb
);

CREATE TABLE sync_conflicts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  idempotency_key uuid NOT NULL REFERENCES sync_operations(idempotency_key),
  kind            text NOT NULL,                     -- 'insufficient_stock', 'price_changed'...
  detail          jsonb NOT NULL,
  resolved_by     uuid REFERENCES users(id),
  resolved_at     timestamptz,
  resolution      text
);

-- ─────────────────────────────────────────────
-- Isolation par entreprise (RLS)
-- ─────────────────────────────────────────────

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['subscriptions','app_installations','users','roles','role_permissions','user_roles',
    'field_masks','config_items','config_versions','number_sequences','audit_log','event_outbox',
    'delete_requests','devices','sync_operations','sync_conflicts']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_current_tenant()) WITH CHECK (tenant_id = app_current_tenant())', t);
  END LOOP;
END $$;

COMMIT;
