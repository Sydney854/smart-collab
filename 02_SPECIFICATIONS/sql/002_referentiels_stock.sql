-- Smart Collab — Référentiels et stock (lot 2)
-- Applications : partners (tiers), inventory (produits, sites, stock)
-- Règle : le stock n'est jamais saisi ; il est la somme des mouvements (stock_moves).
--         stock_levels est un cache recalculable, mis à jour dans la même transaction que le mouvement.

BEGIN;

-- ─────────────────────────────────────────────
-- Tiers (application partners)
-- ─────────────────────────────────────────────

CREATE TABLE partners (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  kind            text NOT NULL CHECK (kind IN ('company', 'person')),
  is_customer     boolean NOT NULL DEFAULT false,
  is_supplier     boolean NOT NULL DEFAULT false,
  is_consignor    boolean NOT NULL DEFAULT false,      -- déposant (dépôt-vente)
  is_prospect     boolean NOT NULL DEFAULT false,
  name            text NOT NULL,
  phone           text,
  email           text,
  city            text,
  country         char(2),
  tax_id          text,                                -- numéro de compte contribuable
  custom_fields   jsonb NOT NULL DEFAULT '{}',
  is_active       boolean NOT NULL DEFAULT true,
  created_by      uuid REFERENCES users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_by      uuid REFERENCES users(id),
  updated_at      timestamptz
);
CREATE INDEX partners_name_idx  ON partners (tenant_id, lower(name));
CREATE INDEX partners_phone_idx ON partners (tenant_id, phone);

-- ─────────────────────────────────────────────
-- Lieux
-- ─────────────────────────────────────────────

CREATE TABLE sites (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  code            text NOT NULL,
  name            text NOT NULL,
  kind            text NOT NULL CHECK (kind IN ('store', 'warehouse', 'depot', 'transit', 'work_site', 'office')),
  sells           boolean NOT NULL DEFAULT false,      -- a une caisse
  parent_id       uuid REFERENCES sites(id),
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, code)
);

CREATE TABLE locations (                               -- emplacements dans un site (rayon, réserve, zone)
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  site_id         uuid NOT NULL REFERENCES sites(id),
  name            text NOT NULL,
  UNIQUE (site_id, name)
);

CREATE TABLE user_sites (
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  user_id         uuid NOT NULL REFERENCES users(id),
  site_id         uuid NOT NULL REFERENCES sites(id),
  PRIMARY KEY (user_id, site_id)
);

-- ─────────────────────────────────────────────
-- Catalogue
-- ─────────────────────────────────────────────

CREATE TABLE categories (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  parent_id       uuid REFERENCES categories(id),      -- sous-catégorie
  name            text NOT NULL,
  UNIQUE (tenant_id, parent_id, name)
);

CREATE TABLE brands (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  name            text NOT NULL,
  UNIQUE (tenant_id, name)
);

CREATE TABLE units (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  code            text NOT NULL,                       -- pce, kg, m, l
  name            jsonb NOT NULL,
  decimals        smallint NOT NULL DEFAULT 0 CHECK (decimals BETWEEN 0 AND 3),
  UNIQUE (tenant_id, code)
);

CREATE TABLE products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  code            text NOT NULL,
  name            text NOT NULL,
  category_id     uuid REFERENCES categories(id),
  brand_id        uuid REFERENCES brands(id),
  unit_id         uuid REFERENCES units(id),
  main_supplier_id uuid REFERENCES partners(id),
  supply_mode     text NOT NULL DEFAULT 'purchase' CHECK (supply_mode IN ('purchase', 'consignment')),
  is_stockable    boolean NOT NULL DEFAULT true,       -- false = service
  has_variants    boolean NOT NULL DEFAULT false,
  description     text,
  custom_fields   jsonb NOT NULL DEFAULT '{}',
  is_active       boolean NOT NULL DEFAULT true,
  created_by      uuid REFERENCES users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_by      uuid REFERENCES users(id),
  updated_at      timestamptz,
  UNIQUE (tenant_id, code)
);
CREATE INDEX products_name_idx ON products (tenant_id, lower(name));

-- Variante = unité réellement stockée et vendue (un produit sans variante en a une seule, par défaut)
CREATE TABLE product_variants (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  product_id      uuid NOT NULL REFERENCES products(id),
  sku             text NOT NULL,
  attributes      jsonb NOT NULL DEFAULT '{}',         -- {"taille": "M", "couleur": "bleu"}
  barcode         text,
  cost_price      numeric(14,2) NOT NULL DEFAULT 0 CHECK (cost_price >= 0),
  sale_price      numeric(14,2) NOT NULL DEFAULT 0 CHECK (sale_price >= 0),
  min_stock       numeric(14,3) NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
  max_stock       numeric(14,3) CHECK (max_stock IS NULL OR max_stock >= 0),
  is_active       boolean NOT NULL DEFAULT true,
  UNIQUE (tenant_id, sku)
);
CREATE UNIQUE INDEX product_variants_barcode_uq ON product_variants (tenant_id, barcode) WHERE barcode IS NOT NULL;

CREATE TABLE product_images (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  product_id      uuid NOT NULL REFERENCES products(id),
  storage_key     text NOT NULL,
  position        smallint NOT NULL DEFAULT 0
);

-- Prix par site (optionnel ; à défaut, sale_price de la variante)
CREATE TABLE site_prices (
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  variant_id      uuid NOT NULL REFERENCES product_variants(id),
  site_id         uuid NOT NULL REFERENCES sites(id),
  sale_price      numeric(14,2) NOT NULL CHECK (sale_price >= 0),
  valid_from      date NOT NULL DEFAULT CURRENT_DATE,
  PRIMARY KEY (variant_id, site_id, valid_from)
);

-- ─────────────────────────────────────────────
-- Stock
-- ─────────────────────────────────────────────

CREATE TABLE stock_moves (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  variant_id      uuid NOT NULL REFERENCES product_variants(id),
  site_id         uuid NOT NULL REFERENCES sites(id),
  location_id     uuid REFERENCES locations(id),
  qty             numeric(14,3) NOT NULL CHECK (qty <> 0), -- + entrée, − sortie
  unit_cost       numeric(14,2) NOT NULL DEFAULT 0,
  reason          text NOT NULL CHECK (reason IN ('opening', 'sale', 'sale_return', 'purchase_receipt', 'purchase_return',
                                                  'transfer_out', 'transfer_in', 'transfer_variance', 'inventory_adjustment',
                                                  'consumption', 'site_return', 'manual_correction')),
  source_app      text NOT NULL,                       -- application qui a créé le mouvement
  ref_type        text,                                -- 'pos_ticket', 'purchase_receipt', 'stock_transfer'...
  ref_id          uuid,
  reason_note     text,                                -- obligatoire pour manual_correction (contrôle applicatif)
  created_by      uuid REFERENCES users(id),
  occurred_at     timestamptz NOT NULL DEFAULT now(),  -- heure réelle (hors ligne compris)
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX stock_moves_variant_site_idx ON stock_moves (tenant_id, variant_id, site_id, occurred_at);
CREATE INDEX stock_moves_ref_idx ON stock_moves (tenant_id, ref_type, ref_id);
CREATE TRIGGER stock_moves_append_only BEFORE UPDATE OR DELETE ON stock_moves
  FOR EACH ROW EXECUTE FUNCTION forbid_change();

-- Cache : quantité physique par variante et par site
CREATE TABLE stock_levels (
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  variant_id      uuid NOT NULL REFERENCES product_variants(id),
  site_id         uuid NOT NULL REFERENCES sites(id),
  qty_on_hand     numeric(14,3) NOT NULL DEFAULT 0,
  updated_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (variant_id, site_id)
);

-- Mise à jour du cache dans la même transaction que le mouvement
CREATE OR REPLACE FUNCTION apply_stock_move() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO stock_levels (tenant_id, variant_id, site_id, qty_on_hand, updated_at)
  VALUES (NEW.tenant_id, NEW.variant_id, NEW.site_id, NEW.qty, now())
  ON CONFLICT (variant_id, site_id)
  DO UPDATE SET qty_on_hand = stock_levels.qty_on_hand + EXCLUDED.qty_on_hand, updated_at = now();
  RETURN NEW;
END $$;
CREATE TRIGGER stock_moves_apply AFTER INSERT ON stock_moves
  FOR EACH ROW EXECUTE FUNCTION apply_stock_move();

-- Réservations (chantier, commande client) : bloquent la vente sans toucher au physique
CREATE TABLE stock_reservations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  variant_id      uuid NOT NULL REFERENCES product_variants(id),
  site_id         uuid NOT NULL REFERENCES sites(id),
  qty_reserved    numeric(14,3) NOT NULL CHECK (qty_reserved > 0),
  qty_issued      numeric(14,3) NOT NULL DEFAULT 0 CHECK (qty_issued >= 0),
  source_app      text NOT NULL,
  ref_type        text NOT NULL,
  ref_id          uuid NOT NULL,
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'cancelled')),
  created_by      uuid REFERENCES users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  CHECK (qty_issued <= qty_reserved)
);

-- Disponible à la vente = physique − réservations actives (EF-STK-03).
-- Le stock en transit est porté par le site de type 'transit' : jamais vendable.
CREATE VIEW v_stock_available WITH (security_invoker = true) AS
SELECT
  sl.tenant_id, sl.variant_id, sl.site_id, sl.qty_on_hand,
  coalesce(r.reserved, 0) AS qty_reserved,
  sl.qty_on_hand - coalesce(r.reserved, 0) AS qty_available
FROM stock_levels sl
JOIN sites s ON s.id = sl.site_id AND s.kind <> 'transit'
LEFT JOIN (
  SELECT variant_id, site_id, sum(qty_reserved - qty_issued) AS reserved
  FROM stock_reservations WHERE status = 'active'
  GROUP BY variant_id, site_id
) r ON r.variant_id = sl.variant_id AND r.site_id = sl.site_id;

CREATE VIEW v_stock_alerts WITH (security_invoker = true) AS
SELECT a.tenant_id, a.variant_id, a.site_id, a.qty_available, v.min_stock, v.max_stock,
       CASE WHEN a.qty_available <= 0 THEN 'out_of_stock'
            WHEN a.qty_available < v.min_stock THEN 'below_min'
            WHEN v.max_stock IS NOT NULL AND a.qty_available > v.max_stock THEN 'overstock' END AS alert
FROM v_stock_available a
JOIN product_variants v ON v.id = a.variant_id AND v.is_active
WHERE a.qty_available < v.min_stock OR (v.max_stock IS NOT NULL AND a.qty_available > v.max_stock) OR a.qty_available <= 0;

-- ─────────────────────────────────────────────
-- Inventaires (comptage par lots / zones)
-- ─────────────────────────────────────────────

CREATE TABLE inventory_counts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  number          text NOT NULL,
  site_id         uuid NOT NULL REFERENCES sites(id),
  kind            text NOT NULL CHECK (kind IN ('full', 'cycle', 'targeted')),
  status          text NOT NULL DEFAULT 'counting' CHECK (status IN ('counting', 'review', 'validated', 'cancelled')),
  started_at      timestamptz NOT NULL DEFAULT now(),
  validated_by    uuid REFERENCES users(id),
  validated_at    timestamptz,
  UNIQUE (tenant_id, number)
);

CREATE TABLE inventory_batches (                       -- lots de comptage (zone, rayon)
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  count_id        uuid NOT NULL REFERENCES inventory_counts(id),
  name            text NOT NULL,
  location_id     uuid REFERENCES locations(id),
  UNIQUE (count_id, name)
);

CREATE TABLE inventory_lines (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  batch_id        uuid NOT NULL REFERENCES inventory_batches(id),
  variant_id      uuid NOT NULL REFERENCES product_variants(id),
  qty_counted     numeric(14,3) NOT NULL CHECK (qty_counted >= 0),
  qty_theoretical numeric(14,3),                       -- figé à l'heure du comptage
  counted_at      timestamptz NOT NULL DEFAULT now(),
  counted_by      uuid REFERENCES users(id),
  justification   text
);

-- ─────────────────────────────────────────────
-- Isolation par entreprise (RLS)
-- ─────────────────────────────────────────────

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['partners','sites','locations','user_sites','categories','brands','units','products',
    'product_variants','product_images','site_prices','stock_moves','stock_levels','stock_reservations',
    'inventory_counts','inventory_batches','inventory_lines']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_current_tenant()) WITH CHECK (tenant_id = app_current_tenant())', t);
  END LOOP;
END $$;

COMMIT;

-- Les tables des lots suivants (caisse, ventes, achats, transferts, finance, comptabilité...)
-- sont ajoutées par la migration de chaque application, au lot correspondant,
-- en suivant les mêmes règles : tenant_id + RLS, numeric, ajout seul pour les journaux,
-- documents validés jamais supprimés.
