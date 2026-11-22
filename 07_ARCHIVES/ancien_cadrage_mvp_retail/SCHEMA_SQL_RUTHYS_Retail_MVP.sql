-- RUTHY'S Plus ERP — Schéma SQL MVP Retail
-- Cible : PostgreSQL 16
-- Devise : XOF (FCFA) · 1 site suffit au MVP, le modèle porte déjà site_id
-- Hors MVP : transferts, marketing, RH, compta légale, apps transversales

BEGIN;

-- ─────────────────────────────────────────────
-- Référentiels
-- ─────────────────────────────────────────────

CREATE TABLE sites (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text NOT NULL UNIQUE,
  name          text NOT NULL,
  kind          text NOT NULL DEFAULT 'boutique'
                  CHECK (kind IN ('boutique', 'entrepot')),
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE roles (
  id            text PRIMARY KEY,          -- admin | gerant | caissier | magasinier
  label         text NOT NULL
);

CREATE TABLE users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL UNIQUE,
  full_name     text NOT NULL,
  role_id       text NOT NULL REFERENCES roles(id),
  site_id       uuid REFERENCES sites(id),
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE company_settings (
  id            int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  legal_name    text NOT NULL,
  currency      text NOT NULL DEFAULT 'XOF',
  locale        text NOT NULL DEFAULT 'fr',
  timezone      text NOT NULL DEFAULT 'Africa/Abidjan',
  default_site_id uuid REFERENCES sites(id)
);

CREATE TABLE modules (
  id            text PRIMARY KEY,          -- pos, ventes, crm, inventaire, achats, finance, rapports
  label         text NOT NULL,
  category      text NOT NULL,
  is_core       boolean NOT NULL DEFAULT false
);

CREATE TABLE enabled_modules (
  module_id     text PRIMARY KEY REFERENCES modules(id),
  enabled_at    timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- Catalogue & stock
-- ─────────────────────────────────────────────

CREATE TABLE families (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL UNIQUE
);

CREATE TABLE suppliers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  phone         text,
  city          text,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text NOT NULL UNIQUE,
  name          text NOT NULL,
  family_id     uuid REFERENCES families(id),
  supplier_id   uuid REFERENCES suppliers(id),
  cost_price    numeric(14,2) NOT NULL DEFAULT 0 CHECK (cost_price >= 0),
  sale_price    numeric(14,2) NOT NULL CHECK (sale_price >= 0),
  min_stock     numeric(14,3) NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX products_name_idx ON products (lower(name));
CREATE INDEX products_family_idx ON products (family_id);

-- Stock théorique par site. Jamais saisi à la main hors inventaire :
-- mis à jour par les mouvements (vente, réception, ajustement).
CREATE TABLE stock_levels (
  product_id    uuid NOT NULL REFERENCES products(id),
  site_id       uuid NOT NULL REFERENCES sites(id),
  qty           numeric(14,3) NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, site_id)
);

CREATE TABLE stock_moves (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    uuid NOT NULL REFERENCES products(id),
  site_id       uuid NOT NULL REFERENCES sites(id),
  qty           numeric(14,3) NOT NULL,          -- + entrée, − sortie
  reason        text NOT NULL
                  CHECK (reason IN ('sale', 'purchase_receipt', 'adjustment', 'opening')),
  ref_type      text,                            -- ticket | purchase_receipt | inventory
  ref_id        uuid,
  created_by    uuid REFERENCES users(id),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX stock_moves_product_idx ON stock_moves (product_id, site_id, created_at);

-- ─────────────────────────────────────────────
-- Clients
-- ─────────────────────────────────────────────

CREATE TABLE customers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  phone         text,
  city          text,
  segment       text NOT NULL DEFAULT 'nouveau'
                  CHECK (segment IN ('nouveau', 'regulier', 'fidele', 'vip')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX customers_phone_idx ON customers (phone);
CREATE INDEX customers_name_idx ON customers (lower(name));

-- ─────────────────────────────────────────────
-- Caisse & ventes
-- ─────────────────────────────────────────────

CREATE TABLE cash_sessions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id       uuid NOT NULL REFERENCES sites(id),
  opened_by     uuid NOT NULL REFERENCES users(id),
  opened_at     timestamptz NOT NULL DEFAULT now(),
  closed_at     timestamptz,
  opening_float numeric(14,2) NOT NULL DEFAULT 0,
  closing_cash  numeric(14,2),
  status        text NOT NULL DEFAULT 'open'
                  CHECK (status IN ('open', 'closed'))
);

-- Une seule session ouverte par site
CREATE UNIQUE INDEX cash_sessions_one_open
  ON cash_sessions (site_id) WHERE status = 'open';

CREATE TABLE tickets (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number        text NOT NULL UNIQUE,            -- V-0001
  site_id       uuid NOT NULL REFERENCES sites(id),
  session_id    uuid NOT NULL REFERENCES cash_sessions(id),
  customer_id   uuid REFERENCES customers(id),
  cashier_id    uuid NOT NULL REFERENCES users(id),
  payment_method text NOT NULL
                  CHECK (payment_method IN ('especes', 'mobile_money', 'carte', 'autre')),
  total         numeric(14,2) NOT NULL CHECK (total >= 0),
  cost_total    numeric(14,2) NOT NULL DEFAULT 0,
  status        text NOT NULL DEFAULT 'paid'
                  CHECK (status IN ('paid', 'void')),
  sold_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX tickets_sold_at_idx ON tickets (sold_at);
CREATE INDEX tickets_site_idx ON tickets (site_id, sold_at);

CREATE TABLE ticket_lines (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id     uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  product_id    uuid NOT NULL REFERENCES products(id),
  qty           numeric(14,3) NOT NULL CHECK (qty > 0),
  unit_price    numeric(14,2) NOT NULL,
  unit_cost     numeric(14,2) NOT NULL DEFAULT 0,
  line_total    numeric(14,2) NOT NULL
);

CREATE INDEX ticket_lines_ticket_idx ON ticket_lines (ticket_id);
CREATE INDEX ticket_lines_product_idx ON ticket_lines (product_id);

-- ─────────────────────────────────────────────
-- Achats
-- ─────────────────────────────────────────────

CREATE TABLE purchase_orders (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number        text NOT NULL UNIQUE,            -- BC-0001
  supplier_id   uuid NOT NULL REFERENCES suppliers(id),
  site_id       uuid NOT NULL REFERENCES sites(id),
  status        text NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'confirmed', 'partial', 'received', 'cancelled')),
  ordered_at    date NOT NULL DEFAULT CURRENT_DATE,
  created_by    uuid REFERENCES users(id),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE purchase_order_lines (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id    uuid NOT NULL REFERENCES products(id),
  qty_ordered   numeric(14,3) NOT NULL CHECK (qty_ordered > 0),
  qty_received  numeric(14,3) NOT NULL DEFAULT 0 CHECK (qty_received >= 0),
  unit_cost     numeric(14,2) NOT NULL CHECK (unit_cost >= 0)
);

CREATE TABLE purchase_receipts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number        text NOT NULL UNIQUE,            -- BL-0001
  order_id      uuid REFERENCES purchase_orders(id),
  site_id       uuid NOT NULL REFERENCES sites(id),
  received_at   timestamptz NOT NULL DEFAULT now(),
  received_by   uuid REFERENCES users(id)
);

CREATE TABLE purchase_receipt_lines (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id    uuid NOT NULL REFERENCES purchase_receipts(id) ON DELETE CASCADE,
  product_id    uuid NOT NULL REFERENCES products(id),
  qty_expected  numeric(14,3) NOT NULL DEFAULT 0,
  qty_received  numeric(14,3) NOT NULL CHECK (qty_received >= 0),
  unit_cost     numeric(14,2) NOT NULL DEFAULT 0
);

-- ─────────────────────────────────────────────
-- Finance légère
-- ─────────────────────────────────────────────

CREATE TABLE cash_accounts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  kind          text NOT NULL
                  CHECK (kind IN ('caisse', 'banque', 'mobile_money')),
  site_id       uuid REFERENCES sites(id)
);

CREATE TABLE cash_movements (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id    uuid NOT NULL REFERENCES cash_accounts(id),
  direction     text NOT NULL CHECK (direction IN ('in', 'out')),
  amount        numeric(14,2) NOT NULL CHECK (amount > 0),
  label         text NOT NULL,
  category      text NOT NULL
                  CHECK (category IN ('encaissement_vente', 'reglement_fournisseur',
                                      'loyer', 'transport', 'salaire', 'divers')),
  ref_type      text,
  ref_id        uuid,
  occurred_on   date NOT NULL DEFAULT CURRENT_DATE,
  created_by    uuid REFERENCES users(id),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- Vues de pilotage (pas de table KPI figée)
-- ─────────────────────────────────────────────

CREATE VIEW v_sales_day AS
SELECT
  t.site_id,
  (t.sold_at AT TIME ZONE 'Africa/Abidjan')::date AS day,
  count(*) FILTER (WHERE t.status = 'paid') AS tickets,
  coalesce(sum(t.total) FILTER (WHERE t.status = 'paid'), 0) AS revenue,
  coalesce(sum(t.total - t.cost_total) FILTER (WHERE t.status = 'paid'), 0) AS margin
FROM tickets t
GROUP BY 1, 2;

CREATE VIEW v_stock_alerts AS
SELECT
  p.id AS product_id,
  p.code,
  p.name,
  s.id AS site_id,
  s.name AS site_name,
  coalesce(sl.qty, 0) AS qty,
  p.min_stock
FROM products p
CROSS JOIN sites s
LEFT JOIN stock_levels sl ON sl.product_id = p.id AND sl.site_id = s.id
WHERE p.is_active AND s.is_active
  AND coalesce(sl.qty, 0) < p.min_stock;

COMMIT;

-- Règle stock (application, dans une transaction unique) :
--   vente     → ticket + lines + stock_moves(qty négatif) + stock_levels.qty -=
--   réception → receipt + lines + stock_moves(qty positif) + stock_levels.qty +=
--   écart BL  → qty_received peut différer de qty_expected ; seul qty_received entre en stock
-- Refus si stock résultant < 0, sauf rôle admin (journalisé hors MVP).
