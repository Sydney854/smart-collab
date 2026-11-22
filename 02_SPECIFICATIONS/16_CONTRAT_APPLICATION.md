# Smart Collab — Contrat d'application (modèle Odoo)

> Complète `03_CATALOGUE_APPLICATIONS.md` (EF-APP-01 à 06). Ce fichier dit **comment** chaque module devient une application installable, reliée aux autres. Il s'impose à tout le code de `src/`.

## 1. Principe

Chaque module ERP est un **paquet** autonome dans `src/apps/<id>/`. Il déclare tout ce qu'il apporte dans un **manifeste**. Le **registre des applications** (lot 1) lit les manifestes, résout les dépendances, installe, désinstalle et met à jour.

Comme dans Odoo :

| Odoo | Smart Collab |
|------|--------------|
| `__manifest__.py` (`depends`, `data`, `auto_install`) | `manifest.ts` (`depends`, `migrations`, `seeds`, `bridgeOf`) |
| Écran Apps : Installer / Désinstaller | Écran Apps (EF-APP-01) |
| Modules ponts (ex. `sale_stock`) | Applications ponts installées automatiquement (`bridgeOf`) |
| Héritage de vues | Points d'extension d'écrans (`extends`) |
| Modèles partagés (`res.partner`, `product.product`) | Fiches partagées du socle (tiers, produits, sites, employés) |

## 2. Le manifeste

```ts
// src/apps/pos/manifest.ts
export default defineApp({
  id: 'pos',                          // identifiant stable
  version: '1.0.0',
  category: 'C. Ventes & CRM',
  name: { fr: 'Point de vente', en: 'Point of Sale' },
  depends: ['core', 'inventory', 'finance'],   // installés automatiquement si absents
  offlineCapable: true,                         // écrans utilisables hors ligne (§9)
  presets: ['retail', 'multisite', 'electrical'], // métiers qui la pré-cochent
  plans: ['starter', 'business', 'enterprise'],   // formules d'abonnement qui l'incluent
  menus: [{ id: 'pos', label: 'menu.pos', icon: 'cash-register', order: 20 }],
  permissions: ['pos.session.open', 'pos.session.close', 'pos.sale.create', 'pos.sale.refund', 'pos.discount.over_limit'],
  roles: { retail: ['cashier', 'manager'], multisite: ['cashier', 'store_manager'] },
  migrations: './migrations',         // tables propres, versionnées
  seeds: './seeds',                   // réglages par défaut par métier et par pays
  publishes: ['pos.sale.validated', 'pos.sale.refunded', 'pos.session.closed'],
  subscribes: { 'inventory.product.archived': 'onProductArchived' },
  extends: [{ screen: 'crm.customer.detail', slot: 'tabs', component: 'PosHistoryTab' }],
});
```

Champs obligatoires : `id`, `version`, `category`, `name` (fr et en), `depends`, `menus`, `permissions`, `migrations`, `publishes`, `subscribes`.

## 3. Cycle de vie

| Action | Ce que fait le registre | Garde-fous |
|--------|------------------------|-----------|
| Installer | Calcule les dépendances manquantes, les affiche (EF-APP-02), exécute les migrations, charge les réglages par défaut du métier et du pays, crée menus et droits, active les ponts dont toutes les dépendances sont présentes | Refus si l'application n'est pas dans la formule ou la licence (EF-APP-06) |
| Désinstaller | Retire menus, droits et abonnements aux événements ; **conserve** tables et données (statut `archived`) | Refus si une application installée en dépend (EF-APP-03) |
| Réinstaller | Réactive menus, droits et événements ; les données archivées réapparaissent | — |
| Mettre à jour | Exécute les migrations de la nouvelle version, dans une transaction | Retour arrière si une migration échoue |

Chaque action écrit dans `audit_log` et `app_installations`.

## 4. Interconnexion par événements

- Une application **publie** un événement après une action métier ; les applications installées qui l'**écoutent** réagissent.
- **Synchrone, même transaction** : quand le stock ou l'argent bouge (ex. `pos.sale.validated` → sortie de stock, encaissement). Si un abonné échoue, toute l'opération est annulée (EF-GEN-01).
- **Asynchrone** : pour le reste (indicateurs, notifications, e-mails), via la table `event_outbox`, traitée en arrière-plan par Supabase (`pg_cron` + Edge Functions). Rejoué en cas d'échec, jamais perdu.
- Une application **non installée** n'est pas abonnée : l'événement est ignoré, rien ne casse.
- **Interdit** : écrire dans les tables d'une autre application. On passe par son service public (`apps/<id>/public.ts`) ou par un événement.

Format d'un événement :

```ts
type DomainEvent<T> = {
  id: string;            // UUID
  tenantId: string;
  type: string;          // 'pos.sale.validated'
  occurredAt: string;    // ISO 8601
  actorId: string;
  siteId?: string;
  payload: T;            // données utiles, versionnées
  version: number;
};
```

## 5. Points d'extension d'écrans

Une application peut ajouter, dans les écrans d'une autre, des **onglets**, **champs**, **colonnes de liste**, **actions** ou **cartes de tableau de bord**, uniquement aux emplacements (`slots`) que l'écran déclare. Si l'application qui étend est désinstallée, son ajout disparaît.

## 6. Applications ponts

Une application pont n'a pas de menu : elle relie deux applications et s'installe **automatiquement** quand les deux sont présentes (`bridgeOf: ['sales', 'accounting']`). Exemples :

| Pont | Relie | Effet |
|------|-------|-------|
| `sales_accounting` | Ventes + Comptabilité | Écritures de vente automatiques |
| `purchase_accounting` | Achats + Comptabilité | Écritures d'achat automatiques |
| `payroll_accounting` | Paie + Comptabilité | Écritures de paie |
| `pos_crm` | Point de vente + CRM | Historique et segment du client mis à jour à chaque ticket |
| `project_stock` | Chantier + Produits & Inventaire | Réservations et consommations de chantier |

## 7. Applications des lots 1 à 7

| id | Application | Dépend de | Lot |
|----|-------------|-----------|-----|
| `core` | Socle : entreprises, utilisateurs, rôles, Apps, Paramètres, Dashboard, journal | — | 1 |
| `partners` | Tiers (clients, fournisseurs, déposants) | core | 2 |
| `inventory` | Produits & Inventaire (catalogue, sites, stock, inventaires) | core, partners | 2, 4 |
| `finance` | Finance (comptes, encaissements, dépenses, budgets, répartition) | core | 3, 5 |
| `pos` | Point de vente | core, inventory, finance | 3 |
| `sales` | Ventes et facturation | core, partners, inventory, finance | 5 |
| `crm` | CRM & Clients | core, partners | 5 |
| `purchase` | Achats & Fournisseurs | core, partners, inventory, finance | 4 |
| `transfers` | Transferts & Sites | core, inventory | 4 |
| `studio` | Moteur de configuration, centre d'états, tableaux de bord | core | 6 |
| `control` | Centre de contrôle | core | 6 |
| `accounting` | Comptabilité SYSCOHADA et fiscalité | core, finance | 7 |

## 8. Catalogue des événements (lots 1 à 7)

| Événement | Publié par | Écouté par (si installé) |
|-----------|-----------|--------------------------|
| `core.app.installed` / `core.app.uninstalled` | core | toutes |
| `inventory.stock.moved` | inventory | studio, control |
| `inventory.count.validated` | inventory | accounting, control |
| `pos.session.opened` / `pos.session.closed` | pos | finance, control |
| `pos.sale.validated` | pos | inventory (sync), finance (sync), crm, accounting, studio |
| `pos.sale.refunded` | pos | inventory (sync), finance (sync), crm, accounting |
| `sales.invoice.issued` | sales | finance, accounting, crm |
| `sales.payment.received` | sales | finance (sync), accounting |
| `purchase.receipt.validated` | purchase | inventory (sync), accounting |
| `purchase.payment.made` | purchase | finance (sync), accounting |
| `transfers.transfer.shipped` | transfers | inventory (sync) |
| `transfers.transfer.received` | transfers | inventory (sync), control |
| `finance.movement.recorded` | finance | accounting, studio |
| `accounting.period.closed` | accounting | finance, sales, purchase (blocage des dates) |

## 9. Tests imposés par application

1. Installation seule (avec dépendances), puis désinstallation : aucune donnée perdue.
2. Désinstallation refusée si une application installée en dépend.
3. Chaque événement publié a au moins un test d'abonné.
4. Isolation : un utilisateur d'une entreprise ne voit aucune donnée d'une autre.
