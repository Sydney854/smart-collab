# Catalogue unifié des modules — Smart Collab

**Version figée** — Apps transversales **cochables** (non obligatoires)  
Domaines métier : Retail · Multi-sites · Audit/Conseil/Projet · Génie électrique · Mixte

---

> **Lecture des colonnes « Origine »** : R = écran ou fonction présent dans le prototype ; D = fonction repérée dans DreamsERP (code réutilisable sous licence Extended (voir `00_GOUVERNANCE/LICENCES.md`)) ; R+D = les deux.  
> **Fonctionnement des applications (installation, dépendances, interconnexion)** : voir `02_SPECIFICATIONS/03_CATALOGUE_APPLICATIONS.md` et `16_CONTRAT_APPLICATION.md`.

# 1. Principes de modularité

| Règle | Description |
|-------|-------------|
| **Core** | Toujours présents, non désinstallables |
| **Apps transversales** | **Cochables** à la configuration (et plus tard dans Apps) |
| **Modules métier** | Cochables selon le domaine d’activité |
| **Design System** | Couche technique permanente (non exposée comme module métier) |
| **Première config** | Wizard : entreprise → domaine → modules → utilisateurs |
| **Évolution** | Ajout / retrait possible ensuite via le module **Apps** |

---

# 2. Catégories

| Catégorie | Rôle |
|-----------|------|
| **A. Core / Système** | Fondation — non désinstallable |
| **B. Applications transversales** | Collaboration & productivité — **cochables** |
| **C. Ventes & CRM** | Cycle commercial |
| **D. Chaîne d’approvisionnement** | Stocks, achats, logistique, production |
| **E. Finance & Comptabilité** | Trésorerie, facturation, paiements |
| **F. RH & Paie** | Effectifs, présences, rémunération |
| **G. Services & Projets** | Projets, planning, assistance, chantier |
| **H. Pilotage & Contrôle** | Dashboard étendu, rapports, audit |
| **I. Design System / UX Layer** | Fondation UI (invisible dans la sélection métier) |

---

# 3. Doublons identifiés & fusions retenues

| Prototype | DreamsERP (inspiration) | Décision retenue |
|--------------|-----------|------------------|
| Tableau de bord | Dashboard Pages | **Fusion** → `Dashboard` |
| Caisse (POS) | Sales / POS interfaces | **Fusion** → `Point de Vente` |
| Ventes | Sales, Quotations, Orders | **Fusion** → `Ventes` |
| Clients & CRM | Customer Pages | **Fusion** → `CRM & Clients` |
| Produits & Stocks | Inventory + Product Management | **Fusion** → `Produits & Inventaire` |
| Achats | Purchase, Orders | **Fusion** → `Achats` |
| Fournisseurs | Supplier Pages | **Fusion** dans `Achats` (sous-module Fournisseurs) |
| Transferts de stock | Mouvements entrepôts | **Conserver** (logique multi-sites du prototype) sous Supply Chain |
| Inventaire | Inventory | **Fusion** dans `Produits & Inventaire` |
| Trésorerie & Comptabilité | Accounting, Income/Expense, Payments, Tax, Invoice | **Fusion** → `Finance` |
| Facturation (si séparé) | Invoice & Billing | **Intégré** Finance / Ventes |
| RH & Paie | HR, Attendance, Payroll | **Fusion** → `RH & Paie` |
| Marketing | — | **Conserver** (prototype) |
| Rapports & Analyses | Reports & Analytics | **Fusion** → `Rapports & BI` |
| Centre de contrôle | — | **Conserver** (prototype) |
| Boutiques / Sites | Warehouse / multi-store | **Fusion** → `Sites & Entrepôts` |
| Paramètres | Settings, User Mgmt, Roles | **Fusion** → structure Paramètres (§ 6) |
| — | Projet, Feuilles de temps, Services sur site, Assistance, Rendez-vous, Planification | **Ajouter** (Services & Projets) |
| — | Fabrication, Maintenance, Qualité, Réparation | **Ajouter** (Supply Chain étendue) |
| — | Documents, Validations, Connaissances | **Ajouter** (Pilotage / Productivité) |

---

# 4. Catalogue final par catégorie

## A. Core / Système *(toujours actifs — non désinstallables)*

| Module | Origine | Description |
|--------|--------|-------------|
| **Dashboard** | Fusion R+D | Vues Direction, Financier, Commercial, Opérations |
| **Apps** | Smart Collab (modèle Odoo) | Installation / activation / désactivation des modules |
| **Paramètres** | Fusion R+D | System, Users, Roles, Security, Integrations… (voir § 6) |

---

## B. Applications transversales *(cochables)*

| Module | Origine | Description |
|--------|--------|-------------|
| **Chat** | DreamsERP | Messagerie interne |
| **Voice Call** | DreamsERP | Appels audio |
| **Video Call** | DreamsERP | Appels vidéo |
| **Calendar** | DreamsERP | Agenda, événements, RDV |
| **Email** | DreamsERP | Boîte mail / templates |
| **File Manager** | DreamsERP | Gestion documentaire |
| **Notes** | DreamsERP | Notes rapides |
| **To Do** | DreamsERP | Tâches personnelles / équipe |
| **Workflow & Approvals** | DreamsERP + Validations | Circuits de validation |

> Ces modules sont **proposés cochés ou non** selon le preset de domaine, mais **toujours modifiables** par l’utilisateur.

---

## C. Ventes & CRM *(cochables)*

| Module | Origine | Contenu unifié |
|--------|--------|----------------|
| **Point de Vente** | R+D | Caisse, tickets, modes de paiement, session de caisse |
| **Ventes** | R+D | Commandes, devis, dépôt-vente, historique |
| **CRM & Clients** | R+D | Fiches clients, segments, avoirs, crédit, fidélité |
| **Marketing** | R | Campagnes, promotions, ROI |

---

## D. Chaîne d’approvisionnement *(cochables)*

| Module | Origine | Contenu unifié |
|--------|--------|----------------|
| **Produits & Inventaire** | R+D | Catalogue, stocks multi-sites, ABC, rotation, étiquettes, comptages |
| **Achats** | R+D | Commandes, BL, réclamations, réappro, **fournisseurs** |
| **Transferts** | R | Centrale ↔ sites, écarts de réception |
| **Sites & Entrepôts** | R+D | Comparaison multi-sites, entrepôts |
| **Fabrication** | D | Nomenclatures, ordres de fabrication |
| **Maintenance** | D | Équipements, interventions |
| **Qualité** | D | Contrôles, non-conformités |
| **Réparation** | D | SAV, ordres de réparation |

---

## E. Finance & Comptabilité *(cochables)*

| Module | Origine | Contenu unifié |
|--------|--------|----------------|
| **Finance** | R+D | Trésorerie, caisses, banques, mobile money, décaissements, enveloppes |
| **Facturation** | D (+ R) | Factures clients, avoirs, relances |
| **Paiements & Taxes** | D | Règlements, TVA, états fiscaux |
| **Comptabilité SYSCOHADA** | D | Plan comptable, journaux, grand livre, balance, états financiers |
| **Fiscalité des entreprises** | — | TVA, déclarations, retenues, impôt sur les bénéfices (Côte d'Ivoire puis UEMOA) |
| **Immobilisations** | D | Registre, affectations, amortissements, maintenance, cession |

---

## F. RH & Paie *(cochables)*

| Module | Origine | Contenu unifié |
|--------|--------|----------------|
| **RH & Paie** | R+D | Employés, contrats, organigramme |
| **Présences** | R+D | Pointage, absences |
| **Paie** | R+D | Bulletins, charges sociales, barèmes par pays |
| **Recrutement, évaluation, formation** | D | Offres, candidats, entretiens, intégration, évaluations, formations |

---

## G. Services & Projets *(cochables)*

| Module | Origine | Description |
|--------|--------|-------------|
| **Projet** | D | Projets, jalons, livrables |
| **Feuilles de temps** | D | Temps passé, imputation |
| **Services sur site** | D | Interventions terrain |
| **Assistance** | D | Support / tickets |
| **Rendez-vous** | D | Prise de RDV |
| **Planification** | D | Planning ressources / équipes |
| **Chantier** | Extension métier | Suivi chantiers (génie électrique, installation) |

> Le module **Chantier** est une extension métier utile pour le domaine « Génie électrique » (prestations installation / chantier).

---

## H. Pilotage & Contrôle *(cochables)*

| Module | Source | Notes |
|--------|--------|------|
| **Rapports & BI** | R+D | États, tableaux croisés, exports |
| **Centre de contrôle** | R | Journal des opérations, alertes, traçabilité |
| **Documents** | D | GED (peut s’appuyer sur File Manager) |
| **Connaissances** | D | Base de connaissances / wiki interne |

---

## I. Design System / UX Layer *(fondation — non cochable)*

Couche technique **toujours présente**, construite à partir des écrans du prototype ; les composants et le code de DreamsERP (version React / Next.js) sont réutilisés sous licence Extended (voir `00_GOUVERNANCE/LICENCES.md`).

### Base UI
Alerts · Accordion · Avatar · Badges · Buttons · Breadcrumb · Cards · Dropdown · Grid · Images · Modals · Offcanvas · Pagination · Popovers · Progress · Tabs · Typography

### Advanced UI
Dragula · Clipboard · Range Slider · Lightbox

### Forms
Form Elements · Select2 · Form Editor · Form Picker

### Tables
Basic Tables · Data Table

### Charts
ApexCharts · Chart.js

### Icons
FontAwesome · Tabler · Lucide · Phosphor

### Layouts
Mini Sidebar · Hover View · Hidden Menu · Full Width · RTL · Light / Dark mode

---

# 5. Domaines métier (presets de première configuration)

À la première utilisation, l’utilisateur choisit un **domaine**.  
Les modules ci-dessous sont **pré-cochés** (modifiables).

## 5.1 Commerce de détail / Retail / Boutique

| Catégorie | Modules pré-sélectionnés |
|-----------|--------------------------|
| Core | Dashboard, Apps, Paramètres |
| Ventes & CRM | Point de Vente, Ventes, CRM & Clients |
| Supply Chain | Produits & Inventaire, Achats |
| Finance | Finance, Facturation |
| Pilotage | Rapports & BI |
| Transversal (suggestion) | Calendar, To Do, File Manager |

**Focus :** caisse, stock boutique, clients, encaissements.

---

## 5.2 Multi-sites / Distribution

| Catégorie | Modules pré-sélectionnés |
|-----------|--------------------------|
| Core | Dashboard, Apps, Paramètres |
| Ventes & CRM | Point de Vente, Ventes, CRM & Clients |
| Supply Chain | Produits & Inventaire, Achats, **Transferts**, **Sites & Entrepôts** |
| Finance | Finance, Facturation, Paiements & Taxes |
| Pilotage | Rapports & BI, **Centre de contrôle** |
| Transversal (suggestion) | Calendar, Chat, File Manager, Workflow & Approvals, To Do |

**Focus :** transferts inter-sites, comparaison de boutiques, traçabilité, règlements fournisseurs.

---

## 5.3 Audit / Conseil / Projet

| Catégorie | Modules pré-sélectionnés |
|-----------|--------------------------|
| Core | Dashboard, Apps, Paramètres |
| Services & Projets | **Projet**, **Feuilles de temps**, **Rendez-vous**, **Planification**, Assistance |
| Ventes & CRM | CRM & Clients, Ventes (devis / commandes) |
| Finance | Facturation, Finance |
| Pilotage | Rapports & BI, Documents, Connaissances |
| Transversal (suggestion) | Calendar, Email, Notes, To Do, File Manager, Chat, Workflow & Approvals |

**Focus :** missions, temps passé, livrables, facturation au forfait / à l’heure, collaboration.

---

## 5.4 Entreprise génie électrique  
*(Vente matériel électrique industriel & domestique + prestations installation / chantier)*

| Catégorie | Modules pré-sélectionnés |
|-----------|--------------------------|
| Core | Dashboard, Apps, Paramètres |
| Ventes & CRM | Point de Vente, Ventes, CRM & Clients |
| Supply Chain | Produits & Inventaire, Achats, Sites & Entrepôts, **Réparation**, Maintenance (option) |
| Services & Projets | **Projet**, **Services sur site**, **Planification**, **Chantier**, Feuilles de temps, Rendez-vous |
| Finance | Finance, Facturation, Paiements & Taxes |
| RH | RH & Paie, Présences (équipes terrain) |
| Pilotage | Rapports & BI, Centre de contrôle, Documents |
| Transversal (suggestion) | Calendar, Chat, File Manager, To Do, Workflow & Approvals, Notes |

**Focus double :**
1. **Négoce** — catalogue matériel électrique, stock, caisse / commandes, fournisseurs, clients  
2. **Prestations** — devis installation, planning équipes, suivi chantier, feuilles de temps, facturation travaux

---

## 5.5 Mixte *(personnalisé)*

| Catégorie | Modules pré-sélectionnés |
|-----------|--------------------------|
| Core | Dashboard, Apps, Paramètres |
| Autres | **Aucun pré-coché** — l’utilisateur compose librement |

Utile pour les organisations hybrides ou les phases de cadrage.

---

# 6. Structure Paramètres (figée)

```
Paramètres
├── System
│   ├── User Management
│   ├── Roles & Permissions
│   ├── Delete Requests
│   └── Settings
│       ├── General
│       ├── Security
│       ├── Notifications
│       └── Integrations
├── Entreprise / Sites
├── Catalogue & Attributs
├── Studio ERP / Personnalisation
└── Journal des modifications
```

| Rubrique | Contenu |
|----------|---------|
| **User Management** | Comptes, activation / désactivation, profils |
| **Roles & Permissions** | Rôles (Admin, Caissier, Magasinier, Chef de chantier…) + droits par module |
| **Delete Requests** | Demandes de suppression (audit / RGPD) |
| **General** | Raison sociale, devise, langue, fuseau, logo |
| **Security** | Politique mots de passe, 2FA, sessions, IP |
| **Notifications** | Canaux (in-app, email), événements notifiés |
| **Integrations** | API, webhooks, mobile money, outils externes |
| **Entreprise / Sites** | Multi-sociétés, boutiques, entrepôts |
| **Catalogue & Attributs** | Familles, champs personnalisés produits |
| **Studio ERP** | Menus, KPI, tableaux de bord personnalisés |
| **Journal des modifications** | Historique de configuration |

---

# 7. Wizard de première configuration

```
Étape 1 — Entreprise
  Nom, pays, devise, logo, type de structure

Étape 2 — Domaine métier
  ○ Commerce de détail / Retail / Boutique
  ○ Multi-sites / Distribution
  ○ Audit / Conseil / Projet
  ○ Entreprise génie électrique
  ○ Mixte (personnalisé)

Étape 3 — Modules
  Cases à cocher par catégorie (A exclus — Core figé)
  Apps transversales cochables
  Pré-cochage selon le preset du domaine
  L’utilisateur peut tout modifier

Étape 4 — Utilisateurs & rôles de base
  Compte Admin + premier utilisateur opérationnel
  Rôles proposés selon le domaine

Étape 5 — Récapitulatif & Lancement
  Liste des modules activés
  Confirmation → entrée dans l’ERP
```

Après le lancement, le module **Apps** permet d’installer ou désinstaller à tout moment (sauf Core).

---

# 8. Vue synthétique

```
┌────────────────────────────────────────────────────────────┐
│  CORE (toujours)                                           │
│  Dashboard · Apps · Paramètres                             │
├────────────────────────────────────────────────────────────┤
│  APPS TRANSVERSALES (cochables)                            │
│  Chat · Voice · Video · Calendar · Email · Files ·         │
│  Notes · To Do · Workflow & Approvals                      │
├────────────────────────────────────────────────────────────┤
│  MÉTIER (cochable — presets par domaine)                   │
│  Ventes & CRM │ Supply Chain │ Finance │ RH │              │
│  Services & Projets │ Pilotage                             │
├────────────────────────────────────────────────────────────┤
│  DESIGN SYSTEM (invisible métier, toujours présent)        │
│  Base UI · Advanced UI · Forms · Tables · Charts · Layouts │
└────────────────────────────────────────────────────────────┘
```

---

# 9. Matrice Domaine × Modules (résumé)

| Module | Retail | Multi-sites | Audit/Projet | Génie élec. | Mixte |
|--------|:------:|:-----------:|:------------:|:-----------:|:-----:|
| Point de Vente | ● | ● | | ● | ○ |
| Ventes | ● | ● | ● | ● | ○ |
| CRM & Clients | ● | ● | ● | ● | ○ |
| Marketing | ○ | ○ | ○ | ○ | ○ |
| Produits & Inventaire | ● | ● | | ● | ○ |
| Achats | ● | ● | | ● | ○ |
| Transferts | | ● | | ○ | ○ |
| Sites & Entrepôts | ○ | ● | | ● | ○ |
| Fabrication | | | | ○ | ○ |
| Maintenance | | | | ○ | ○ |
| Qualité | | | | ○ | ○ |
| Réparation | | | | ● | ○ |
| Finance | ● | ● | ● | ● | ○ |
| Facturation | ● | ● | ● | ● | ○ |
| Paiements & Taxes | ○ | ● | ○ | ● | ○ |
| Comptabilité SYSCOHADA | ● | ● | ● | ● | ○ |
| Fiscalité des entreprises | ● | ● | ● | ● | ○ |
| RH & Paie | ○ | ○ | ○ | ● | ○ |
| Présences | ○ | ○ | ○ | ● | ○ |
| Paie | ○ | ○ | ○ | ○ | ○ |
| Projet | | | ● | ● | ○ |
| Feuilles de temps | | | ● | ● | ○ |
| Services sur site | | | ○ | ● | ○ |
| Assistance | | | ● | ○ | ○ |
| Rendez-vous | | | ● | ● | ○ |
| Planification | | | ● | ● | ○ |
| Chantier | | | | ● | ○ |
| Rapports & BI | ● | ● | ● | ● | ○ |
| Centre de contrôle | ○ | ● | ○ | ● | ○ |
| Documents | ○ | ○ | ● | ● | ○ |
| Connaissances | ○ | ○ | ● | ○ | ○ |
| Chat | ○ | ● | ● | ● | ○ |
| Calendar | ● | ● | ● | ● | ○ |
| Email | ○ | ○ | ● | ○ | ○ |
| File Manager | ● | ● | ● | ● | ○ |
| Notes | ○ | ○ | ● | ● | ○ |
| To Do | ● | ● | ● | ● | ○ |
| Workflow & Approvals | ○ | ● | ● | ● | ○ |
| Voice / Video Call | ○ | ○ | ○ | ○ | ○ |

**Légende :** ● = pré-coché dans le preset · ○ = disponible, non pré-coché

---

# 10. Statut du document

| Élément | Statut |
|---------|--------|
| Catalogue des modules | **Figé** |
| Fusions Smart Collab / DreamsERP | **Retenues** |
| Apps transversales | **Cochables** (non obligatoires) |
| Domaines métier | Retail · Multi-sites · Audit/Conseil/Projet · Génie électrique · Mixte |
| Structure Paramètres | **Figée** |
| Wizard 1ère config | **Défini** |

---

*Document de référence produit — Smart Collab*  
*Modularité type Odoo · Configuration par domaine métier*
