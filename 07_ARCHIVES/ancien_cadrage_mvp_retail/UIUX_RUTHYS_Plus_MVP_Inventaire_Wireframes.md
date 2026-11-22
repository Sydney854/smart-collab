# RUTHY’S Plus — Inventaire d’écrans · Wireframes · UI/UX  
## MVP Retail (fusion RUTHY’S + stack type DreamsERP)

**Base produit :** prototype RUTHY’S Plus (menus, parcours, métier)  
**Base technique cible :** React + TypeScript + Tailwind (approche type DreamsERP : composants, layout admin, tables, forms)  
**Périmètre :** MVP Retail uniquement (PRD + Appflow + schéma SQL déjà figés)

Ce document ne contient **aucune capture** du template commercial DreamsERP.  
Les écrans décrits sont ceux de **RUTHY’S Plus**.

---

# PARTIE 1 — Inventaire des écrans (menus & sous-menus)

## 1.1 Navigation shell (toujours présente)

| Élément | Contenu |
|---------|---------|
| **Sidebar** | Logo RUTHY’S · liste des modules **activés** · bas : user + déconnexion |
| **Topbar** | Titre de page · site courant · période (si applicable) · notifications (placeholder MVP) |
| **Zone contenu** | Écran actif |

Modules **Core** (toujours visibles) : Dashboard · Apps · Paramètres  

Modules métier (visibles seulement s’ils sont activés) : Caisse · Ventes · Clients · Produits · Achats · Finance · Rapports  

---

## 1.2 Carte menu → écrans

### Dashboard
| Écran | Sous-écrans / onglets | Rôle principal |
|-------|----------------------|----------------|
| `dash.home` | — | CA jour, CA mois, tickets, panier moyen, alertes stock |

### Caisse (Point de Vente)
| Écran | Sous-écrans | Rôle |
|-------|-------------|------|
| `pos.session` | Ouverture / clôture | Session caisse |
| `pos.cart` | Panier + recherche produit + client + paiement | Vente |
| `pos.ticket` | Récap ticket après encaissement | Confirmation |

### Ventes
| Écran | Sous-écrans | Rôle |
|-------|-------------|------|
| `sales.list` | Filtres date / site | Historique tickets |
| `sales.detail` | Lecture seule | Détail d’un ticket |

### Clients (CRM)
| Écran | Sous-écrans | Rôle |
|-------|-------------|------|
| `crm.list` | Recherche nom / tél | Liste clients |
| `crm.form` | Création / édition | Fiche client |
| `crm.detail` | Historique d’achats | CA, visites, dernier achat |

### Produits & Inventaire
| Écran | Sous-écrans | Rôle |
|-------|-------------|------|
| `inv.list` | Filtres famille / alerte | Catalogue + stock |
| `inv.form` | Création / édition | Fiche produit |
| `inv.opening` | Stock d’ouverture (une fois) | Initialisation |

### Achats
| Écran | Sous-écrans | Rôle |
|-------|-------------|------|
| `purch.orders` | Liste commandes | Suivi BC |
| `purch.order_form` | Nouvelle / détail commande | Lignes fournisseur |
| `purch.receive` | Réception BL | Qté reçue vs attendue |

### Finance (légère)
| Écran | Sous-écrans | Rôle |
|-------|-------------|------|
| `fin.moves` | Liste mouvements | Encaissements / décaissements |
| `fin.out_form` | Saisie décaissement | Loyer, divers… |

### Rapports
| Écran | Sous-écrans | Rôle |
|-------|-------------|------|
| `rep.hub` | 4 états | CA · stock · top produits · clients |

### Apps
| Écran | Sous-écrans | Rôle |
|-------|-------------|------|
| `apps.manage` | Cases modules | Activer / désactiver |

### Paramètres
| Écran | Sous-écrans | Rôle |
|-------|-------------|------|
| `set.company` | Entreprise + site | Raison sociale, devise XOF |
| `set.users` | Liste + formulaire | Comptes et rôles |

### Hors menu (parcours)
| Écran | Quand |
|-------|--------|
| `auth.login` | Avant session |
| `wizard.company` | 1ère config |
| `wizard.modules` | 1ère config |
| `wizard.team` | 1ère config |
| `wizard.recap` | 1ère config |

**Total MVP :** ~22 écrans / états d’écran.

---

# PARTIE 2 — Wireframes originaux (structure)

Convention : zones de gauche à droite / haut en bas. Pas de pixels figés — structure pour React + Tailwind.

## 2.1 Shell

```
┌──────────┬────────────────────────────────────────────┐
│ LOGO     │  Titre page          [Site]  [User]        │
│          ├────────────────────────────────────────────┤
│ Dashboard│                                            │
│ Caisse   │              CONTENU ÉCRAN                 │
│ Ventes   │                                            │
│ Clients  │                                            │
│ Produits │                                            │
│ Achats   │                                            │
│ Finance  │                                            │
│ Rapports │                                            │
│ ───────  │                                            │
│ Apps     │                                            │
│ Paramètres│                                           │
└──────────┴────────────────────────────────────────────┘
```

Sidebar ~240 px desktop · collapse icônes sur tablette · drawer sur mobile.

---

## 2.2 Dashboard (`dash.home`)

```
[ KPI CA jour ] [ KPI CA mois ] [ KPI Tickets ] [ KPI Panier ]

[ Alertes stock — tableau : produit | site | qté | seuil ]
```

Actions : clic alerte → `inv.form`.

---

## 2.3 Caisse — Session (`pos.session`)

```
Titre : Session de caisse
Site : Boutique Principale
État : Fermée

[ Fond de caisse (XOF) ]   [ Bouton : Ouvrir la caisse ]
```

Si déjà ouverte : badge « Session ouverte depuis HH:MM » + bouton « Aller au panier » + « Fermer la caisse ».

---

## 2.4 Caisse — Panier (`pos.cart`)  ★ écran critique

```
┌─────────────────────────────┬──────────────────────┐
│ Recherche produit           │ Client               │
│ [____________] 🔍           │ [Nom / tél] [Nouveau]│
│                             │ Jean Kouassi         │
│ Résultats / suggestions     ├──────────────────────┤
│ • Code  Nom  Prix  Stock    │ PANIER               │
│                             │ Ligne  qté  PU  Total│
│                             │ ...                  │
│                             │ TOTAL  XX XXX F     │
│                             │ ○ Espèces ○ MM ○ …  │
│                             │ [ ENCAISSER ]        │
└─────────────────────────────┴──────────────────────┘
```

Règles UI : bouton Encaisser désactivé pendant la requête ; stock insuffisant = message sous la recherche, ligne non ajoutée.

---

## 2.5 Ticket (`pos.ticket`)

```
Ticket V-0042
Date · Caissier · Client?

Tableau lignes
Total · Mode de paiement

[ Nouvelle vente ]   [ Retour historique ]
```

---

## 2.6 Liste ventes (`sales.list`)

```
Filtres : [Date du] [Date au]  [Rechercher]

Tableau : N° | Date | Client | Total | Mode | Caissier
Clic ligne → sales.detail
```

---

## 2.7 Clients

**Liste** : recherche + tableau Nom | Tél | Ville | Segment | CA  
**Fiche** : champs éditables + bloc « Historique » (5 derniers tickets)  
**Création rapide** (modale depuis la caisse) : Nom + Téléphone seulement

---

## 2.8 Produits

**Liste** :
```
[Recherche] [Famille ▼] [☐ Sous seuil seulement]
Tableau : Code | Nom | Famille | Stock | PV | Alerte
```

**Fiche** :
```
Code*  Nom*  Famille  Fournisseur
PA*  PV*  Seuil min
Stock d’ouverture (si nouveau)
[ Enregistrer ]
```

---

## 2.9 Achats

**Nouvelle commande** :
```
Fournisseur*
Lignes : Produit | Qté | Coût
[ + Ligne ]  [ Confirmer la commande ]
```

**Réception** :
```
BC-0003 · Fournisseur X
Lignes : Produit | Commandé | Déjà reçu | À saisir (reçu)
Écart affiché en orange si ≠ 
[ Valider la réception ]
```

---

## 2.10 Finance

```
[ Nouveau décaissement ]
Tableau : Date | Compte | Sens | Catégorie | Libellé | Montant
(Les encaissements vente sont en lecture seule)
```

Formulaire décaissement : Compte · Catégorie · Libellé · Montant · Date

---

## 2.11 Rapports

```
Cartes cliquables :
[ CA période ] [ Stock valorisé ] [ Top produits ] [ Clients ]
→ tableau + export CSV simple (MVP)
```

---

## 2.12 Apps

```
Cases à cocher par module métier
Core grisés (Dashboard, Apps, Paramètres)
[ Enregistrer ] → menu se met à jour
```

---

## 2.13 Paramètres

**Entreprise** : nom, logo (option), site par défaut  
**Utilisateurs** : liste + créer (nom, email, rôle, site, actif)

---

## 2.14 Wizard (1ère fois)

Étapes horizontales : 1 Entreprise → 2 Modules → 3 Équipe → 4 Récap → Entrée Dashboard

---

# PARTIE 3 — UI / UX RUTHY’S Plus (MVP)

## 3.1 Positionnement

| Source | Ce qu’on garde |
|--------|----------------|
| **RUTHY’S v105** | Logique métier, menus retail, parcours caisse / stock / clients, ton « ERP boutique » |
| **Approche DreamsERP (tech, pas copies d’écran)** | React, Tailwind, layout admin (sidebar + topbar), composants réutilisables (card, table, badge, modal, form) |

Objectif UX : **un caissier encaisse en moins de 3 clics** après ouverture de session.

---

## 3.2 Design tokens (proposés)

Inspirés de l’esthétique sombre / or du prototype RUTHY’S, exprimés pour Tailwind.

| Token | Usage | Suggestion |
|-------|--------|------------|
| `--nav` | Fond sidebar | Navy très sombre `#0f172a` |
| `--nav-text` | Texte menu | Gris clair |
| `--accent` | Sélection, CTA principal | Or / ambre `#d4a017` |
| `--bg` | Fond page | `#f1f5f9` (clair) ou dark mode `#020617` |
| `--card` | Cartes | Blanc / `#0b1220` |
| `--ok` | Succès, stock OK | Vert |
| `--warn` | Alerte seuil | Orange |
| `--danger` | Erreur, refus stock | Rouge |
| `--radius` | Coins | 8–12 px |
| `--font` | UI | Inter ou system-ui |

Affichage monétaire : **francs entiers XOF** (`12 500 F`) — pas de décimales à l’écran.

---

## 3.3 Composants UI réutilisables (à coder une fois)

| Composant | Où |
|-----------|-----|
| `AppShell` | Sidebar + topbar |
| `KpiCard` | Dashboard |
| `DataTable` | Listes (ventes, produits, clients…) |
| `SearchInput` | Caisse, listes |
| `StatusBadge` | Session, alerte stock, statut BC |
| `Modal` | Client rapide, confirmations |
| `FormField` / `Select` | Fiches |
| `PrimaryButton` / `GhostButton` | Actions |
| `EmptyState` | Listes vides |
| `PageHeader` | Titre + actions |

Pas besoin du catalogue complet DreamsERP (accordion, lightbox, etc.) pour le MVP.

---

## 3.4 Principes UX

1. **Caisse d’abord** : écran le plus dense, clavier-friendly (Entrée = ajouter).
2. **Une action primaire par écran** (Encaisser, Valider réception, Enregistrer).
3. **Erreurs en français**, sous le champ ou en toast discret (messages Appflow).
4. **Pas de suppression dure** : void / inactif.
5. **Menu = vérité modules** : ce qui n’est pas activé n’existe pas dans la nav.
6. **Mobile** : listes et fiches OK ; **caisse optimisée desktop** (≥ 1280 px) au MVP.

---

## 3.5 Priorité visuelle (ordre de polish)

| Priorité | Écran | Pourquoi |
|----------|--------|----------|
| P0 | `pos.cart` | Cœur du métier |
| P0 | `dash.home` | Confiance gérant |
| P1 | `inv.list` / `inv.form` | Stock lisible |
| P1 | `purch.receive` | Écarts visibles |
| P2 | Wizard, Apps, Paramètres | Peu fréquents mais clairs |
| P2 | Rapports | Tableaux simples suffisent |

---

## 3.6 Ce qui n’est pas dans ce UI/UX MVP

- Dark/light switch complet (on peut figer un thème)
- RTL
- Chat / Calendar / File Manager
- Personnalisation no-code des menus
- Graphiques complexes (1 sparkline CA max si le temps le permet)

---

# Synthèse

| Livrable | Statut dans ce fichier |
|----------|------------------------|
| Inventaire écrans & sous-menus MVP | Partie 1 — ~22 écrans |
| Wireframes structurels originaux | Partie 2 |
| Doc UI/UX RUTHY’S + stack type DreamsERP | Partie 3 |

**Prochaine étape concrète possible :**  
implémenter le **shell + wizard + menu modulaire** (Sprint 0), puis l’écran **panier caisse** (Sprint 2) avec ces wireframes comme référence.
