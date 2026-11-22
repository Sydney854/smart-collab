# RUTHY'S Plus ERP v105 — Documentation complète

**Prototype ERP Retail multi-sites**  
Fichier source : `RUTHYS_ERP_v105.html` (~17 702 lignes · ~7,2 Mo)  
Document généré : explication du code · détail des modules · BPM métier · modèle de données

---

# PARTIE 1 — Explication claire et structurée du code

## 1.1 Nature du fichier

C’est une **application ERP complète en un seul fichier HTML** (Single Page Application).

Tout est inclus dedans :
- HTML de structure
- CSS (design system)
- JavaScript (logique + données)
- Données métier (catalogue, ventes, stocks, clients…)

Aucune base de données externe, aucun backend. Tout tourne dans le navigateur.

---

## 1.2 Architecture globale

```
┌─────────────────────────────────────┐
│  HTML (structure)                   │
│  - Sidebar (navigation)             │
│  - Topbar (titre, user, filtres)    │
│  - Zone content (pages dynamiques)  │
├─────────────────────────────────────┤
│  CSS (~1 950 lignes)                │
│  - Design system (variables)        │
│  - Composants (KPI, cards, tables…) │
├─────────────────────────────────────┤
│  JavaScript (~15 700 lignes)        │
│  - Données embarquées               │
│  - Navigation (go / onglets)        │
│  - Rendu de chaque module           │
│  - Moteurs d’états / rapports       │
└─────────────────────────────────────┘
```

---

## 1.3 Design system (CSS)

Tout le style repose sur des **variables CSS** définies en tête :

| Variable | Rôle |
|----------|------|
| `--nav1 / --nav2` | Fond sombre de la sidebar |
| `--gold` | Couleur d’accent (sélections, boutons) |
| `--bg`, `--card`, `--line` | Surfaces et bordures |
| `--blue`, `--green`, `--red`… | Badges et états |

**Composants réutilisés partout :**
- `.kpi` → cartes indicateurs
- `.card` → blocs de contenu
- `.tbl` / tables → listes
- `.bg-a`, `.bg-r`… → badges de statut
- `.subnav` → sous-onglets dans un module
- `.btn-d`, `.btn-g` → boutons

Le design est inspiré d’un ERP pro (type Odoo / SAP léger) avec une esthétique soignée.

---

## 1.4 Navigation et modules

La liste des modules est définie ainsi :

```js
const NAV = [
  {id:'dash',   t:'Tableau de bord'},
  {id:'caisse', t:'Caisse'},
  {id:'ventes', t:'Ventes'},
  {id:'sites',  t:'Boutiques / Sites'},
  {id:'prod',   t:'Produits & Stocks'},
  {id:'achats', t:'Achats'},
  {id:'frn',    t:'Fournisseurs'},
  {id:'trf',    t:'Transferts de stock'},
  {id:'inv',    t:'Inventaire'},
  {id:'treso',  t:'Trésorerie & Comptabilité'},
  {id:'crm',    t:'Clients & CRM'},
  {id:'rh',     t:'RH & Paie'},
  {id:'mkt',    t:'Marketing'},
  {id:'rap',    t:'Rapports & Analyses'},
  {id:'ctrl',   t:'Centre de contrôle'},
  {id:'param',  t:'Paramètres'},
];
```

**Fonction centrale de navigation :**

```js
function go(id) { ... }
```

Elle :
1. Change la page active
2. Met à jour la sidebar et les onglets
3. Appelle la fonction de rendu du module concerné
4. Gère un système d’**onglets ouverts** (comme un navigateur)

---

## 1.5 Données embarquées

Les données métier sont stockées en JavaScript, souvent de façon compressée pour réduire la taille du fichier.

Principales structures :

| Constante | Contenu |
|-----------|---------|
| `CAT` / `CATRAW` | Catalogue produits (≈ 2 200 références) |
| `SALES` | Lignes de ventes historiques |
| `BLF` | Bons de livraison / achats |
| `TRF_D` | Transferts entre sites |
| `D` | Agrégats précalculés (KPI, CA mensuel, familles…) |
| Clients, segments CRM | Base clients + historique d’achats |

Exemple de format de vente (compact) :
```js
// [jour, site, indexProduit, quantité, CA]
SALES = [jour, site, prodIdx, qte, ca, ...]
```

Les **jours** sont souvent des nombres (jours depuis le 1er janvier 2024) pour faciliter les filtres de période.

---

## 1.6 Mécanismes techniques importants

### Période globale
```js
PER = { a: jourDébut, b: jourFin }
```
Tous les calculs (CA, stocks, rapports) respectent cette période.

### Filtre site
```js
RQ.site  // '' = tous, 0 = Prima Center, 1 = Aéroport…
```

### Rendu dynamique
Presque tout le contenu est généré en JavaScript via des templates de chaînes :

```js
document.getElementById('content').innerHTML = `...HTML généré...`
```

### Système d’onglets
Chaque module ouvert devient un onglet. On peut en fermer, en réordonner (drag & drop).

### Moteur de rapports hiérarchiques
Fonctions du type :
- `aggregerVentesParProduit()`
- `restitutionHierarchique()`
- `renduComptaVentes()`, `renduTransferts()`, etc.

Elles construisent des tableaux avec sous-totaux par groupe (fournisseur, famille, client…).

---

## 1.7 Points forts et limites

**Points forts**
- Tout-en-un, aucune installation
- Interface riche et cohérente
- Données réelles (ou semi-réelles) de volume important
- Moteur de rapports très abouti
- UX soignée (onglets, drag & drop, badges, graphiques)

**Limites**
- Fichier monolithique très lourd (7 Mo)
- Pas de vraie persistance serveur (tout est en mémoire / local)
- Maintenance difficile (tout est dans un seul fichier)
- Performance : le premier chargement peut être long

---

## 1.8 Résumé en une phrase

> **RUTHY’S ERP v105** est un prototype d’ERP retail multi-sites (boutiques + entrepôt) entièrement autonome dans le navigateur, avec catalogue, caisse, stocks, transferts, CRM, trésorerie et un moteur d’états avancé, le tout dans un unique fichier HTML de ~17 700 lignes.

---

# PARTIE 2 — Détail complet de chaque module

## 2.1 Tableau de bord (`dash`)

**Rôle :** Pilotage global de l’activité.

**Sous-onglets :**
- **Direction** — synthèse exécutive (CA, résultat, produits à surveiller, graphiques mensuels)
- **Financier** — focus marge, résultat, contribution
- **Commercial** — performance ventes, paniers, familles
- **Opérations** — stocks, alertes, flux logistiques

**Contenu typique :**
- KPIs cliquables (CA, marge, résultat, alertes stock)
- Graphiques Chart.js (évolution CA / résultat)
- Comparaison sites (Prima Center, Aéroport…)
- Insights automatiques (« produits dormants », écarts…)
- Filtre de période global + filtre site

---

## 2.2 Caisse (`caisse`)

**Rôle :** Point de vente (POS) en temps réel.

**Sous-onglets :**
- **Caisse** — saisie des ventes
- Autres vues liées à la session (historique de session, modes de paiement…)

**Fonctionnalités :**
- Panier de vente
- Recherche produit + suggestions
- Client rattaché à la vente (fidélité, avoir, carte cadeau)
- Modes de règlement (espèces, mobile money, chèque, virement…)
- Session de caisse (ouverture / clôture)
- Ticket de vente
- Possibilité de forcer un stock (avec journalisation)
- Lien direct avec le CRM (mise à jour des visites / CA client)

---

## 2.3 Ventes (`ventes`)

**Rôle :** Analyse des ventes et dépôt-vente.

**Sous-onglets :**
- **Vue globale** — KPIs (CA, marge, unités, panier moyen, références vendues)
- **Dépôt-vente** — suivi des produits en dépôt chez des tiers
- **Détail mensuel** — ventilation mois par mois

**Contenu :**
- Évolution mensuelle par site
- Classements (familles, produits)
- Analyse de marge
- Données issues de l’historique `SALES`

---

## 2.4 Boutiques / Sites (`sites`)

**Rôle :** Comparaison multi-points de vente.

**Fonctionnalités :**
- Comparaison Prima Center / Aéroport / autres sites
- CA, marge, panier moyen, références, taux de marge par site
- Filtres de période
- Vision consolidée ou site par site

---

## 2.5 Produits & Stocks (`prod`)

**Rôle :** Catalogue, stocks, classification.

**Sous-onglets :**
- **Vue d’ensemble** — synthèse catalogue + stocks
- **Catalogue** — liste / mosaïque des produits + fiche produit
- **Étiquettes** — génération d’étiquettes (codes-barres, prix)

**Fonctionnalités fortes :**
- ~2 200 références
- Fiche produit complète (code, désignation, famille, fournisseur, PA/PV, stock multi-sites)
- Classification ABC
- Rotation (rapide / lente / dormant)
- Stock par site (Prima, Aéroport, Centrale…)
- Création de nouveau produit (assistant)
- Modes d’affichage liste / mosaïque
- Filtres famille, sous-famille, fournisseur, rotation
- Deux versions de catalogue (ancien / nouveau)

---

## 2.6 Achats (`achats`)

**Rôle :** Approvisionnements et commandes fournisseurs.

**Sous-onglets :**
- **Bon de livraison** — saisie / réception BL
- **Liste BL / Avoirs**
- **Réclamation**
- **Liste des réclamations**
- **Passer une commande**
- **Liste des commandes**
- **Suivi des approvisionnements**
- **Réapprovisionnement** (suggestions)

**Fonctionnalités :**
- Réception de marchandises
- Gestion des écarts (quantité reçue vs attendue)
- Avoirs fournisseurs
- Commandes fournisseurs
- Suggestions de réappro selon stock / rotation

---

## 2.7 Fournisseurs (`frn`)

**Rôle :** Répertoire et performance fournisseurs.

**Fonctionnalités :**
- Liste des fournisseurs
- Performance (CA d’achat, nombre de BL, délais…)
- Lien avec les bons de livraison et les règlements
- Fiche fournisseur (contacts, historique)

---

## 2.8 Transferts de stock (`trf`)

**Rôle :** Mouvements entre sites (Centrale ↔ boutiques).

**Sous-onglets / modes :**
- **Saisie** de transfert
- Consultation des bons
- **Écarts de réception**

**Fonctionnalités :**
- Choix site expéditeur / destinataire
- Magasin (Rayon / Réserve)
- Workflow : Saisie → Expédié → En attente → Réceptionné → Clôturé
- Quantité expédiée vs quantité reçue
- Détection des écarts (manque / surplus)
- Possibilité de forcer un stock (avec trace dans le journal)
- Suggestions de produits à transférer (rotation, rupture)

---

## 2.9 Inventaire (`inv`)

**Rôle :** Comptages physiques et régularisation.

**Sous-onglets :**
- **Saisie** d’inventaire
- **Historique** des inventaires

**Fonctionnalités :**
- Comptage article par article (ou par lot / zone)
- Écarts inventaire (théorique vs réel)
- Import de comptage
- Scan / code-barres (prévu)
- Lots
- Validation et impact sur le stock

---

## 2.10 Trésorerie & Comptabilité (`treso`)

**Rôle :** Suivi de trésorerie et flux financiers.

**Éléments clés :**
- **Comptes** : caisses (Prima, Aéroport, Centrale), banques (SGCI, NSIA), mobile money (Wave, Orange Money, MTN)
- **Rubriques de décaissement** : règlements fournisseurs, salaires, loyer, transport, marketing, impôts, etc.
- Saisie de décaissements
- Journal des mouvements
- Règlements fournisseurs (échéances, statuts, paiements partiels)
- Enveloppes / budgets
- Lien avec la caisse (encaissements de la session)

---

## 2.11 Clients & CRM (`crm`)

**Rôle :** Base clients et fidélisation.

**Fonctionnalités :**
- Base clients construite à partir des ventes
- Segments (VIP, fidèle, régulier, nouveau…)
- Fiche client : visites, CA cumulé, panier moyen, marge, familles préférées
- Avoirs, cartes cadeaux, crédit client
- Historique des mouvements (crédits, remboursements)
- Analyses CRM (dans les rapports aussi)

---

## 2.12 RH & Paie (`rh`)

**Rôle :** Gestion des effectifs.

**Sous-onglets typiques :**
- **Employés** — fiches (poste, site, contrat, salaire)
- **Présences** — pointage, absences
- Vues liste / mosaïque
- Ajout d’un collaborateur

**Fonctionnalités :**
- Fiches employés
- Contrats (CDI…)
- Présences du jour
- Export / impression

---

## 2.13 Marketing (`mkt`)

**Rôle :** Campagnes et acquisition.

**État dans le prototype :**
- Module **présent mais peu alimenté**
- Écran d’état vide avec spécification de ce qui devrait y être :
  - Calendrier des campagnes
  - Budget / ROI
  - Promotions et remises
  - Attribution du CA aux campagnes
  - Acquisition de nouveaux clients
  - Animation des produits dormants

Le prototype signale explicitement l’absence de données de campagnes historiques.

---

## 2.14 Rapports & Analyses (`rap`)

**Rôle :** Business Intelligence et états imprimables.

**Cœur du module :**
- Catalogue d’**états** (comptabilité, transferts, clients, stocks…)
- Moteur de **tableau croisé** (axes : produit, famille, fournisseur, client, segment, site…)
- Décomposition **jour / mois / année**
- Favoris d’états
- Période locale (indépendante du filtre global)
- Sources de données : ventes, BL, transferts, clients, règlements

**Exemples d’états :**
- Journal des ventes
- CA par famille / fournisseur
- Marges
- Récapitulatif des recettes
- Journal des achats
- Transferts et écarts de réception
- Listing clients / produits
- Fiches clients
- Statistiques d’achats par client

C’est l’un des modules les plus aboutis du prototype.

---

## 2.15 Centre de contrôle (`ctrl`)

**Rôle :** Traçabilité et surveillance.

**Sous-onglets :**
- **Alertes actives**
- **Journal des opérations**
- **Journal des accès**
- **Caisse**
- **Bon de livraison**
- **Réclamations**
- **Corrections de stock**
- **Produits en alerte**

**Fonctionnalités :**
- Journalisation de toutes les opérations sensibles (stock forcé, prix modifié, vente supprimée…)
- Niveaux de gravité : Urgent / Important / À surveiller
- Filtres (site, opérateur, interface, type, plage horaire)
- Objectif : ne pas seulement enregistrer, mais **alerter**

---

## 2.16 Paramètres (`param`)

**Rôle :** Studio ERP / configuration.

**Contenu :**
- Paramétrage entreprise
- Comptes utilisateurs, profils, droits
- Attributs et champs personnalisés
- Personnalisation des menus / tableaux de bord / KPI
- Journal des modifications
- Vision « no-code » : l’utilisateur autorisé peut étendre le système sans développeur

Le prototype insiste sur l’idée que le **Studio ERP** différencie RUTHY’S d’un logiciel figé.

---

## 2.17 Synthèse de la couverture

| Domaine | Modules | Niveau de maturité dans le prototype |
|---------|---------|--------------------------------------|
| Pilotage | Tableau de bord, Sites, Rapports | Très élevé |
| Vente | Caisse, Ventes, CRM | Élevé |
| Stock | Produits, Transferts, Inventaire | Élevé |
| Achats | Achats, Fournisseurs | Élevé |
| Finance | Trésorerie | Moyen / élevé |
| RH | RH & Paie | Moyen |
| Marketing | Marketing | Faible (spécifié mais peu de données) |
| Gouvernance | Centre de contrôle, Paramètres | Élevé |

---

# PARTIE 3 — BPM métier complet & modèle de données Retail

## 3.1 Vue d’ensemble — Cartographie des processus

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        RUTHY'S ERP — PROCESSUS MÉTIER RETAIL                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  RÉFÉRENTIELS          APPROVISIONNEMENT         STOCK & LOGISTIQUE         │
│  ─────────────         ─────────────────         ──────────────────         │
│  • Produits            • Commande fournisseur    • Réception BL             │
│  • Fournisseurs        • Suivi appro             • Transfert inter-sites    │
│  • Clients / CRM       • Réclamation             • Inventaire physique      │
│  • Sites / Magasins    • Règlement fournisseur   • Correction de stock      │
│  • Employés                                                                 │
│                                                                             │
│  VENTE & ENCAISSEMENT              FINANCE                PILOTAGE          │
│  ────────────────────              ───────                ────────          │
│  • Caisse (POS)                    • Encaissements        • Tableau de bord │
│  • Vente comptoir                  • Décaissements        • Rapports / BI   │
│  • Dépôt-vente                     • Trésorerie           • Centre contrôle │
│  • Facturation                     • Enveloppes           • Alertes         │
│  • Fidélité / Avoirs                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.2 Processus métier détaillés (BPM)

### P1 — Gestion des référentiels (Master Data)

```
[Création / MAJ Produit]
        │
        ▼
  Saisie fiche produit
  (code, désignation, famille, sous-famille,
   fournisseur, PA, PV, stock mini, site…)
        │
        ├──────────────────┐
        ▼                  ▼
  Validation            Étiquettes
  catalogue             (prix / code-barres)
        │
        ▼
  Disponible en Caisse / Achats / Transferts / Inventaire
```

**Acteurs :** Responsable catalogue, Magasinier, Admin  
**Modules :** Produits & Stocks, Paramètres  
**Données :** Produit, Famille, Sous-famille, Fournisseur, Site, Tarif

---

### P2 — Approvisionnement (Achats)

```
[Besoin stock / Suggestion réappro]
        │
        ▼
  Passer commande fournisseur
  (lignes : produit, qté, prix)
        │
        ▼
  Confirmation commande
        │
        ▼
  Réception Bon de Livraison (BL)
  ┌─────────────────────────────────┐
  │  Qté commandée vs Qté reçue     │
  │  → Écart ? → Réclamation        │
  │  → OK → Entrée en stock         │
  └─────────────────────────────────┘
        │
        ▼
  Mise à jour stock site destinataire
        │
        ▼
  Règlement fournisseur (Trésorerie)
  (échéance, paiement total / partiel)
```

**Acteurs :** Acheteur, Magasinier, Comptable  
**Modules :** Achats, Fournisseurs, Trésorerie, Inventaire  
**Données :** Commande, BL, Ligne BL, Fournisseur, Stock, Règlement

---

### P3 — Transfert inter-sites

```
[Besoin boutique / Suggestion transfert]
        │
        ▼
  Saisie bon de transfert
  (Expéditeur → Destinataire
   Magasin : Rayon / Réserve)
        │
        ▼
  Validation & Expédition
  (stock expéditeur ↓)
        │
        ▼
  Réception destinataire
  ┌─────────────────────────────────┐
  │  Qté expédiée vs Qté reçue      │
  │  → Manque / Surplus → Écart     │
  │  → Conforme → Stock destinataire│
  └─────────────────────────────────┘
        │
        ▼
  Clôture du bon
  Journalisation (Centre de contrôle)
```

**Acteurs :** Magasinier Centrale, Responsable boutique  
**Modules :** Transferts, Stocks, Centre de contrôle  
**Données :** BonTransfert, LigneTransfert, Site, StockSite, Écart

**Workflow d’état :**  
`SAISIE → EXPÉDIÉ → EN ATTENTE → RÉCEPTIONNÉ → CLÔTURÉ`

---

### P4 — Inventaire physique

```
[Lancement inventaire]
        │
        ▼
  Comptage (par zone / lot / article)
  ou Import de fichier
        │
        ▼
  Comparaison Stock théorique ↔ Stock réel
        │
        ├──────────────────┐
        ▼                  ▼
  Écart = 0            Écart ≠ 0
  (conforme)           Régularisation
        │                  │
        └────────┬─────────┘
                 ▼
          Validation inventaire
          Impact stock + Journal
```

**Acteurs :** Magasinier, Contrôleur  
**Modules :** Inventaire, Stocks, Centre de contrôle  
**Données :** SessionInventaire, LigneComptage, ÉcartInventaire, Stock

---

### P5 — Vente en caisse (POS)

```
[Ouverture session caisse]
        │
        ▼
  Identification client (optionnel)
  (fidélité, avoir, crédit)
        │
        ▼
  Ajout produits au panier
  (scan / recherche / suggestion)
        │
        ▼
  Calcul total + marge
        │
        ▼
  Choix mode de règlement
  (Espèces, Mobile Money, Chèque, Virement…)
        │
        ▼
  Encaissement
  ┌────────────────────────────────────┐
  │  • Stock site ↓                    │
  │  • CA / ticket enregistré          │
  │  • MAJ fiche client (visite, CA)   │
  │  • Écriture trésorerie             │
  └────────────────────────────────────┘
        │
        ▼
  Ticket / facture
        │
        ▼
  [Clôture session caisse]
```

**Acteurs :** Caissier, Responsable boutique  
**Modules :** Caisse, Ventes, CRM, Trésorerie, Stocks  
**Données :** SessionCaisse, Ticket, LigneTicket, Règlement, Client, Stock

---

### P6 — Dépôt-vente

```
[Mise en dépôt chez un tiers]
        │
        ▼
  Sortie stock (dépôt)
        │
        ▼
  Suivi des ventes du déposant
        │
        ▼
  Reversement / Règlement déposant
  (rubrique Trésorerie « Reversement déposants »)
```

**Modules :** Ventes (sous-onglet Dépôt-vente), Trésorerie

---

### P7 — Cycle client / CRM

```
[1ère vente client]
        │
        ▼
  Création / rattachement fiche client
        │
        ▼
  Historique : visites, CA, panier, familles préférées
        │
        ▼
  Segmentation automatique
  (Nouveau → Régulier → Fidèle → VIP)
        │
        ├─────────────────┬──────────────────┐
        ▼                 ▼                  ▼
  Avoir / Carte       Crédit client     Campagne
  cadeau              (remboursement)   marketing
```

**Acteurs :** Caissier, Responsable commercial  
**Modules :** CRM, Caisse, Marketing, Rapports  
**Données :** Client, Segment, MouvementClient, VenteClient

---

### P8 — Trésorerie & paiements

```
                    ENCAISSEMENTS
                    (issues de la Caisse)
                           │
                           ▼
              ┌────────────────────────┐
              │  Comptes :             │
              │  • Caisses sites       │
              │  • Banques             │
              │  • Mobile Money        │
              └────────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         ▼                                   ▼
   DÉCAISSEMENTS                      RÈGLEMENTS
   (saisie manuelle)                  FOURNISSEURS
   • Salaires                         (issus des BL)
   • Loyer                            • Échéance
   • Transport                        • Statut (réglé /
   • Marketing                          partiel / en attente)
   • Impôts
   • Divers
```

**Modules :** Trésorerie & Comptabilité  
**Données :** Compte, MouvementTréso, Décaissement, RèglementFournisseur, Rubrique

---

### P9 — Pilotage & contrôle

```
[Données transactionnelles]
        │
        ├──────────────┬──────────────┬──────────────┐
        ▼              ▼              ▼              ▼
  Tableau de bord  Rapports BI   Centre de      Alertes
  (Direction /     (états        contrôle       (stock bas,
   Financier /      comptables,  (journal ops,   dormants,
   Commercial /     marges,       accès,          écarts…)
   Opérations)      clients…)     corrections)
```

**Modules :** Dashboard, Rapports, Centre de contrôle  
**Données :** Agrégats (KPI), JournalOpération, Alerte

---

### P10 — RH (support)

```
[Fiche employé] → Contrat / Site / Poste / Salaire
        │
        ▼
  Présences / Pointage / Absences
        │
        ▼
  (Lien futur avec paie & décaissements salaires)
```

**Modules :** RH & Paie, Trésorerie (rubrique salaires)

---

## 3.3 Modèle de données Retail

### 3.3.1 Diagramme entité-relation (simplifié)

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    SITE      │       │  FOURNISSEUR │       │   FAMILLE    │
│──────────────│       │──────────────│       │──────────────│
│ id           │       │ id           │       │ id           │
│ nom          │◄──┐   │ nom          │       │ nom          │
│ type         │   │   │ tel, ville   │       └──────┬───────┘
└──────┬───────┘   │   └──────┬───────┘              │
       │           │          │                      │
       │           │          │               ┌──────▼───────┐
       │           │          │               │ SOUS_FAMILLE │
       │           │          │               └──────┬───────┘
       │           │          │                      │
┌──────▼───────────▼──────────▼──────────────────────▼───────┐
│                         PRODUIT                            │
│────────────────────────────────────────────────────────────│
│ code, désignation, PA, PV, fournisseur_id, famille_id,     │
│ sous_famille_id, stock_mini, rotation, abc, actif          │
└──────┬───────────────────────────────────┬─────────────────┘
       │                                   │
┌──────▼──────────┐                 ┌──────▼──────────┐
│   STOCK_SITE    │                 │  LIGNE_VENTE    │
│─────────────────│                 │─────────────────│
│ produit_id      │                 │ ticket_id       │
│ site_id         │                 │ produit_id      │
│ quantite        │                 │ qte, ca, marge  │
│ valeur_pa       │                 │ site_id, jour   │
└─────────────────┘                 └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │     TICKET      │
                                    │─────────────────│
                                    │ n°, date, site  │
                                    │ client_id       │
                                    │ total, mode_reg │
                                    │ session_id      │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │     CLIENT      │
                                    │─────────────────│
                                    │ nom, tel, ville │
                                    │ segment         │
                                    │ ca_cumule       │
                                    │ avoir, crédit   │
                                    └─────────────────┘
```

### 3.3.2 Entités principales

| Entité | Attributs clés | Origine dans le code |
|--------|----------------|----------------------|
| **Site** | id, nom, type (boutique/entrepôt) | `SITEN`, `TRF_D.sites` |
| **Produit** | code, nom, famille, sous-famille, frn, PA, PV, stock | `CAT` / `CATRAW` |
| **StockSite** | produit × site → quantité | calculé / enrichi (`_st`) |
| **Fournisseur** | id, nom, tel, ville | référentiel + BL |
| **Client** | nom, tel, ville, segment, CA, visites, avoir, crédit | CRM construit depuis ventes |
| **Ticket / Vente** | n°, date, site, client, total, mode règlement | `SALES`, session caisse |
| **LigneVente** | ticket, produit, qté, CA | `SALES` (format compact) |
| **CommandeAchat** | n°, frn, date, lignes, statut | module Achats |
| **BL (BonLivraison)** | n°, frn, date, lignes (qté, valeur) | `BLF` |
| **BonTransfert** | n°, expéditeur, destinataire, statut, lignes | `TRF_D.bons` |
| **LigneTransfert** | produit, qté expédiée, qté reçue | `b.lignes` |
| **SessionInventaire** | date, site, lignes comptage, écarts | module Inventaire |
| **SessionCaisse** | date, vendeur, ventes, encaissements | `CS` |
| **CompteTréso** | id, libellé, type (caisse/banque/MM) | `COMPTES` |
| **Décaissement** | date, rubrique, compte, montant, libellé | `DEC` |
| **RèglementFrn** | frn, mois, montant, statut, échéance | `REGL_FRN` |
| **Employé** | nom, poste, site, contrat, salaire | module RH |
| **JournalOpération** | type, gravité, site, opérateur, détail | `LOG` (Centre de contrôle) |

### 3.3.3 Relations clés

| Relation | Cardinalité | Description |
|----------|-------------|-------------|
| Produit → Famille | N:1 | Classification |
| Produit → Fournisseur | N:1 | Approvisionnement principal |
| Produit ↔ Site | N:N | via StockSite |
| Ticket → Client | N:1 | (ou anonyme) |
| Ticket → Site | N:1 | Lieu de vente |
| Ticket → LigneVente | 1:N | Détail |
| BL → Fournisseur | N:1 | Réception |
| BL → LigneBL | 1:N | Produits reçus |
| BonTransfert → Site (exp/dest) | N:1 + N:1 | Flux logistique |
| Client → Segment | N:1 | CRM |
| Décaissement → CompteTréso | N:1 | Sortie d’argent |
| RèglementFrn → Fournisseur | N:1 | Paiement |

### 3.3.4 Règles de gestion stock (résumé)

```
Stock disponible (site) =
    Stock initial
  + Entrées BL
  + Réceptions transferts
  + Régularisations inventaire (+)
  − Sorties ventes (caisse)
  − Expéditions transferts
  − Régularisations inventaire (−)
```

Toute opération sensible (force stock, correction, prix modifié) est **journalisée** dans le Centre de contrôle.

---

## 3.4 Chaîne de valeur Retail (bout-en-bout)

```
FOURNISSEUR
    │ Commande + BL
    ▼
CENTRALE / ENTREPÔT
    │ Transfert
    ▼
BOUTIQUE (Prima / Aéroport…)
    │ Vente caisse
    ▼
CLIENT
    │ Encaissement
    ▼
TRÉSORERIE
    │ Règlement fournisseur / charges
    ▼
PILOTAGE (Dashboard + Rapports + Contrôle)
```

---

## 3.5 Matrice Processus × Modules

| Processus | Modules principaux | Données critiques |
|-----------|--------------------|-------------------|
| Référentiels | Produits, Paramètres, Fournisseurs | Produit, Famille, Frn, Site |
| Approvisionnement | Achats, Fournisseurs, Trésorerie | Commande, BL, Règlement |
| Transfert | Transferts, Stocks | BonTransfert, StockSite |
| Inventaire | Inventaire, Stocks, Contrôle | SessionInventaire, Écart |
| Vente POS | Caisse, Ventes, CRM, Trésorerie | Ticket, LigneVente, Client |
| CRM / Fidélité | CRM, Caisse | Client, Segment, Mouvement |
| Trésorerie | Trésorerie | Compte, Décaissement, Règlement |
| Pilotage | Dashboard, Rapports, Contrôle | KPI, Journal, Alertes |
| RH | RH & Paie | Employé, Présence |

---


---

# PARTIE 4 — Catalogue unifié des modules RUTHY’S Plus × DreamsERP

**Version figée** — Apps transversales **cochables** (non obligatoires)

Domaines métier : Retail · Multi-sites · Audit/Conseil/Projet · Génie électrique · Mixte

---


**Version figée** — Apps transversales **cochables** (non obligatoires)  
Domaines métier : Retail · Multi-sites · Audit/Conseil/Projet · Génie électrique · Mixte

---

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

| RUTHY’S Plus | DreamsERP | Décision retenue |
|--------------|-----------|------------------|
| Tableau de bord | Dashboard Pages | **Fusion** → `Dashboard` |
| Caisse (POS) | Sales / POS interfaces | **Fusion** → `Point de Vente` |
| Ventes | Sales, Quotations, Orders | **Fusion** → `Ventes` |
| Clients & CRM | Customer Pages | **Fusion** → `CRM & Clients` |
| Produits & Stocks | Inventory + Product Management | **Fusion** → `Produits & Inventaire` |
| Achats | Purchase, Orders | **Fusion** → `Achats` |
| Fournisseurs | Supplier Pages | **Fusion** dans `Achats` (sous-module Fournisseurs) |
| Transferts de stock | Mouvements entrepôts | **Conserver** (logique multi-sites RUTHY’S) sous Supply Chain |
| Inventaire | Inventory | **Fusion** dans `Produits & Inventaire` |
| Trésorerie & Comptabilité | Accounting, Income/Expense, Payments, Tax, Invoice | **Fusion** → `Finance` |
| Facturation (si séparé) | Invoice & Billing | **Intégré** Finance / Ventes |
| RH & Paie | HR, Attendance, Payroll | **Fusion** → `RH & Paie` |
| Marketing | — | **Conserver** RUTHY’S |
| Rapports & Analyses | Reports & Analytics | **Fusion** → `Rapports & BI` |
| Centre de contrôle | — | **Conserver** RUTHY’S |
| Boutiques / Sites | Warehouse / multi-store | **Fusion** → `Sites & Entrepôts` |
| Paramètres | Settings, User Mgmt, Roles | **Fusion** → structure Paramètres (§ 6) |
| — | Projet, Feuilles de temps, Services sur site, Assistance, Rendez-vous, Planification | **Ajouter** (Services & Projets) |
| — | Fabrication, Maintenance, Qualité, Réparation | **Ajouter** (Supply Chain étendue) |
| — | Documents, Validations, Connaissances | **Ajouter** (Pilotage / Productivité) |

---

# 4. Catalogue final par catégorie

## A. Core / Système *(toujours actifs — non désinstallables)*

| Module | Source | Description |
|--------|--------|-------------|
| **Dashboard** | Fusion R+D | Vues Direction, Financier, Commercial, Opérations |
| **Apps** | RUTHY’S (modèle Odoo) | Installation / activation / désactivation des modules |
| **Paramètres** | Fusion R+D | System, Users, Roles, Security, Integrations… (voir § 6) |

---

## B. Applications transversales *(cochables)*

| Module | Source | Description |
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

| Module | Source | Contenu unifié |
|--------|--------|----------------|
| **Point de Vente** | R+D | Caisse, tickets, modes de paiement, session de caisse |
| **Ventes** | R+D | Commandes, devis, dépôt-vente, historique |
| **CRM & Clients** | R+D | Fiches clients, segments, avoirs, crédit, fidélité |
| **Marketing** | R | Campagnes, promotions, ROI |

---

## D. Chaîne d’approvisionnement *(cochables)*

| Module | Source | Contenu unifié |
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

| Module | Source | Contenu unifié |
|--------|--------|----------------|
| **Finance** | R+D | Trésorerie, caisses, banques, mobile money, décaissements, enveloppes |
| **Facturation** | D (+ R) | Factures clients, avoirs, relances |
| **Paiements & Taxes** | D | Règlements, TVA, états fiscaux |
| **Comptabilité** | D | Journal, grand livre, bilans (option complète) |

---

## F. RH & Paie *(cochables)*

| Module | Source | Contenu unifié |
|--------|--------|----------------|
| **RH & Paie** | R+D | Employés, contrats, organigramme |
| **Présences** | R+D | Pointage, absences |
| **Paie** | D | Bulletins, charges sociales |

---

## G. Services & Projets *(cochables)*

| Module | Source | Description |
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

Couche technique **toujours présente** (DreamsERP + design RUTHY’S).

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
| Comptabilité | ○ | ○ | ○ | ○ | ○ |
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
| Fusions RUTHY’S / DreamsERP | **Retenues** |
| Apps transversales | **Cochables** (non obligatoires) |
| Domaines métier | Retail · Multi-sites · Audit/Conseil/Projet · Génie électrique · Mixte |
| Structure Paramètres | **Figée** |
| Wizard 1ère config | **Défini** |

---

*Document de référence produit — RUTHY’S Plus × DreamsERP*  
*Modularité type Odoo · Configuration par domaine métier*

---

# Fin du document

*Documentation assemblée à partir de l’analyse du prototype RUTHY’S ERP v105 et du catalogue unifié RUTHY’S Plus × DreamsERP.*

*Contenu :*
1. Explication du code
2. Détail des 16 modules
3. BPM métier + modèle de données Retail
4. Catalogue unifié des modules (fusions, domaines métier, Paramètres, wizard)
