# Documentation métier approfondie  
## Domaine Multi-sites / Distribution — Smart Collab

**Version :** 1.0  
**Périmètre :** réseau de points de vente et/ou dépôts alimentés par une centrale, avec stocks par site, transferts, réassort et pilotage consolidé  
**Méthode :** Structure → Objets → Processus (BPM) → Règles → Événements → Optimisation → Automatisations → Modèle de données dérivé  
**Principe :** une seule entreprise, **plusieurs stocks**, un flux logistique formalisé ; le CA se fait en local, la vérité du stock et des réappro se joue **entre** les sites.

---

# 1. Vision du domaine

Le multi-sites / distribution prolonge le retail : on ne gère plus « la boutique », on gère **un réseau**.

| Question permanente | Enjeu |
|---------------------|--------|
| Où est le stock ? | Par site, pas seulement en global |
| Qui peut vendre quoi ? | Uniquement le stock **local disponible** |
| Comment réassortir une boutique ? | Transfert depuis la centrale (ou un autre site), pas seulement un achat fournisseur |
| Qui voit quoi ? | Le gérant local vs la direction réseau |
| Comment éviter les écarts ? | Workflow d’expédition / réception + journal des manquants |

Sans processus de transfert robuste, le réseau redevient une collection d’Excel et de messages informels.

```
                    FOURNISSEURS
                         │
                         ▼
                 ┌───────────────┐
                 │   CENTRALE /  │
                 │   ENTREPÔT    │
                 └───────┬───────┘
                         │ transferts
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │Boutique A│   │Boutique B│   │Boutique C│
   └────┬─────┘   └────┬─────┘   └────┬─────┘
        │              │              │
        ▼              ▼              ▼
      Clients        Clients        Clients
```

---

# 2. Niveau A — Structure de l’entreprise

## 2.1 Types de sites

| Type | Rôle |
|------|------|
| **Centrale / entrepôt** | Réception fournisseurs, stockage bulk, préparation des transferts |
| **Boutique / point de vente** | Vente, encaissement, stock de surface ± petite réserve |
| **Dépôt secondaire** | Buffer régional, parfois sans caisse |
| **Corner / pop-up** | Site léger, souvent alimenté uniquement par transfert |
| **Site fantôme / transit** | Concept logistique : stock « en route » (pas un lieu physique de vente) |

## 2.2 Organigramme type

```
                    ┌─────────────────┐
                    │   Direction     │
                    │    réseau       │
                    └────────┬────────┘
           ┌─────────────────┼─────────────────┐
           ▼                 ▼                 ▼
    ┌────────────┐    ┌────────────┐    ┌────────────┐
    │   Achats   │    │ Logistique │    │  Finance   │
    │  centraux │    │  réseau    │    │ consolidée │
    └──────┬─────┘    └──────┬─────┘    └────────────┘
           │                 │
           │                 ▼
           │          ┌──────────────┐
           │          │ Préparateurs │
           │          │  / livreurs  │
           │          └──────────────┘
           │
           ▼
    ┌──────────────────────────────────┐
    │     Directions de sites          │
    │  (gérants boutique A, B, C…)     │
    └──────────────┬───────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
   ┌──────────┐        ┌──────────┐
   │ Caissiers│        │Magasiniers│
   │  locaux  │        │  locaux  │
   └──────────┘        └──────────┘
```

## 2.3 Départements

| Département | Mission |
|-------------|---------|
| **Direction réseau** | Stratégie assortiment, objectifs CA par site, arbitrages de stock |
| **Achats centraux** | Négociation fournisseurs, commandes globales, prix d’achat |
| **Logistique** | Transferts, tournées, écarts, urgences boutique |
| **Finance consolidée** | CA multi-sites, trésorerie, règlements fournisseurs |
| **Site (boutique)** | Vente, accueil, propreté du stock local, demandes de réassort |
| **Contrôle / audit interne** | Inventaires tournants, écarts de transfert, fraudes caisse |

## 2.4 Rôles et responsabilités

| Rôle | Responsabilités | Limites typiques |
|------|-----------------|------------------|
| **Directeur réseau** | Pilotage consolidé, validation politiques de transfert | Ne prépare pas les colis |
| **Acheteur central** | Commandes fournisseurs, allocations initiales | Ne vend pas en caisse |
| **Responsable logistique** | Priorisation des bons de transfert, tournées, litiges transport | Ne modifie pas les prix de vente catalogue sans circuit |
| **Préparateur centrale** | Picking, emballage, expédition | Ne réceptionne pas en boutique (sauf double site) |
| **Gérant de boutique** | CA local, demandes de stock, équipe caisse | Ne passe pas forcément les commandes fournisseurs (souvent centralisé) |
| **Caissier** | Encaissement sur stock local | Ne valide pas un transfert entrant (souvent magasinier / gérant) |
| **Magasinier boutique** | Réception transferts, mise en rayon, inventaire local | N’achète pas chez le fournisseur national |

## 2.5 Ressources

- Centrales, réserves, gondoles  
- Véhicules ou prestataires de livraison inter-sites  
- Terminaux caisse par boutique  
- Assortiment national ± particularités locales (tourisme, aéroport, etc.)

## 2.6 Clients, fournisseurs, partenaires

| Catégorie | Particularité multi-sites |
|-----------|---------------------------|
| **Clients** | Locaux à chaque boutique ; parfois client réseau (carte fidélité multi-magasins) |
| **Fournisseurs** | Contractés au niveau centrale ; livraisons surtout en entrepôt |
| **Partenaires** | Transporteurs, loueurs de surfaces, prestataires d’inventaire |

## 2.7 Produits / services

- Même catalogue que le retail, mais **décisions d’assortiment par site** (références actives / inactives localement)  
- Services : retrait en boutique, réservation, parfois transfert client « commander ici, retirer là-bas » (avancé)

---

# 3. Niveau B — Objets métier

## 3.1 Chaîne logistique + vente

```
Fournisseur
    │
    ▼
Commande centrale
    │
    ▼
Réception centrale ──▶ Stock centrale
    │
    ▼
Bon de transfert (demande ou push)
    │
    ├─ Expédition ──▶ Stock centrale ↓
    │
    ▼
Transit (stock en route)
    │
    ├─ Réception boutique ──▶ Stock boutique ↑
    │        │
    │        └─ Écart éventuel
    │
    ▼
Vente caisse boutique ──▶ Stock boutique ↓
    │
    ▼
Client · Paiement · CA site
```

## 3.2 Chaîne de pilotage réseau

```
Ventes par site
Stocks par site
Transferts en cours
Commandes fournisseurs ouvertes
        │
        ▼
Réassort (suggestions)
        │
        ▼
Allocation centrale → boutiques
   ou
Transferts latéraux boutique → boutique (si autorisé)
```

## 3.3 Dictionnaire des objets

| Objet | Définition | Spécificité multi-sites |
|-------|------------|-------------------------|
| **Site** | Lieu de stock et/ou de vente | Type : centrale, boutique, dépôt |
| **Assortiment site** | Références autorisées / mises en avant | Pas forcément tout le catalogue national |
| **Stock site** | Quantité par produit × site | Y compris stock « transit » si modélisé |
| **Commande fournisseur** | Souvent portée par la centrale | Réception principalement à l’entrepôt |
| **Bon de transfert** | Ordre de mouvement inter-sites | Workflow d’états |
| **Ligne de transfert** | Produit + qté demandée / expédiée / reçue | Écart = expédié − reçu |
| **Demande de réassort** | Expression de besoin boutique | Peut devenir un transfert |
| **Session caisse** | Toujours **par site** | Une session ouverte max par site |
| **Ticket** | Vente locale | `site_id` obligatoire |
| **Règle d’allocation** | Clé de répartition du stock centrale | Option optimisation |

## 3.4 Relations

```
┌──────────┐         ┌──────────────┐
│   Site   │◀───────▶│ Stock_level  │──▶ Product
└────┬─────┘         └──────────────┘
     │
     │ 1:N
     ▼
┌──────────────────┐
│ Stock_transfer   │
│  from_site       │
│  to_site         │
│  status          │
└────────┬─────────┘
         │ 1:N
         ▼
┌──────────────────┐
│ Transfer_line    │
│  qty_requested   │
│  qty_shipped     │
│  qty_received    │
└──────────────────┘

Site 1───N Cash_session 1───N Ticket
```

---

# 4. Niveau C — Processus métier (BPM)

## 4.1 Processus D1 — Réception fournisseur en centrale

```
Commande fournisseur (centrale)
      │
      ▼
 Arrivage · contrôle quantitatif / qualitatif
      │
      ├─ Écart ──▶ Réclamation fournisseur
      │
      ▼
 Validation réception
      │
      ▼
 Stock centrale ↑
      │
      ▼
 (Option) Allocation / propositions de transfert vers boutiques
```

**Qui :** Magasinier / réceptionnaire centrale ; validation selon seuils.  
**Données :** BL, qté commandée, qté reçue, emplacement.  
**Historisé :** chaque réception et chaque écart.

---

## 4.2 Processus D2 — Demande de réassort boutique → transfert

```
[Boutique]
 Stock bas / rupture / anticipation vente
      │
      ▼
 Demande de réassort
  (produit, qté souhaitée, urgence)
      │
      ▼
[Centrale / Logistique]
 Instruction de la demande
      │
      ├─ Refus (pas de stock, fin de vie) ──▶ Notification boutique
      │
      ▼
 Création bon de transfert
      │
      ▼
 Picking centrale
      │
      ▼
 Expédition
  - Stock centrale ↓
  - Statut = shipped
  - Qté en transit ↑
      │
      ▼
[Boutique]
 Réception
  - Saisie qté reçue
  - Écart si besoin
  - Stock boutique ↑
  - Transit ↓
  - Statut = received / closed
```

---

## 4.3 Processus D3 — Transfert « push » (piloté par la centrale)

```
Règle / campagne / nouvel arrivage
      │
      ▼
 Proposition d’allocation par site
  (historique ventes, surface, saison)
      │
      ▼
 Validation logistique / direction
      │
      ▼
 Génération des bons de transfert
      │
      ▼
 Même chaîne expédition → réception que D2
```

Utile pour les nouveautés, les opérations commerciales nationales, les déstockages.

---

## 4.4 Processus D4 — Transfert latéral boutique → boutique

```
Boutique A en surstock · Boutique B en rupture
      │
      ▼
 Demande / validation (gérants ± logistique)
      │
      ▼
 Bon de transfert A → B
      │
      ▼
 Expédition A · Réception B
```

**Règle d’autorisation :** souvent réservée aux gérants + logistique, pas aux caissiers.  
Certains réseaux **interdisent** le latéral pour forcer le passage par la centrale (traçabilité).

---

## 4.5 Processus D5 — Vente locale

```
Session caisse ouverte sur le site S
      │
      ▼
 Vente sur stock disponible de S uniquement
      │
      ▼
 Ticket · Stock S ↓ · CA rattaché à S
```

Pas de vente sur le stock centrale « par magie » : il faut d’abord **transférer**.

---

## 4.6 Processus D6 — Inventaire par site

```
Lancement inventaire (site S, zone optionnelle)
      │
      ▼
 Comptage
      │
      ▼
 Écart théorique vs compté
      │
      ▼
 Validation
      │
      ▼
 Ajustement stock S + journal
```

Les inventaires sont **site par site**. Un inventaire nationale n’est que la somme contrôlée des inventaires locaux.

---

## 4.7 Processus D7 — Pilotage consolidé

```
Chaque nuit / temps réel
      │
      ▼
 Agrégats :
  - CA par site / réseau
  - Stock valorisation par site
  - Transferts ouverts / en retard
  - Ruptures
  - Surstocks
      │
      ▼
 Tableaux direction réseau
```

---

## 4.8 Workflow d’état du bon de transfert

```
draft
  → confirmed      (validé logistique)
  → picking        (en préparation)
  → shipped        (parti · stock source ↓ · transit ↑)
  → partially_received
  → received       (stock dest ↑ · transit ↓)
  → closed
  → cancelled      (seulement avant shipped, ou avec contre-mouvement)
```

---

## 4.9 Matrice RACI (transferts)

| Activité | Logistique | Préparateur | Gérant boutique | Magasinier boutique | Direction |
|----------|:----------:|:-----------:|:---------------:|:-------------------:|:---------:|
| Demander réassort | C | — | R | C | I |
| Créer / valider BT | R | C | C | — | A (politique) |
| Picking / expédier | C | R | — | — | — |
| Réceptionner | I | — | C | R | — |
| Traiter écart | R | C | C | C | I |
| Autoriser latéral | R | — | C | — | A |

---

# 5. Niveau D — Règles métier

## 5.1 Stock et vente

| ID | Règle |
|----|-------|
| M01 | Une vente sur le site S ne peut débiter que le **stock de S**. |
| M02 | Stock disponible S = physique S − réservations locales (si utilisées). |
| M03 | Le stock en **transit** n’est vendable ni à la source ni à la destination. |
| M04 | Une session de caisse est **propre à un site** ; max une session `open` par site. |

## 5.2 Transferts

| ID | Règle |
|----|-------|
| M10 | À l’expédition : stock source ↓ immédiatement de la qté expédiée. |
| M11 | À la réception : stock destination ↑ de la **qté reçue** seulement. |
| M12 | Écart (expédié ≠ reçu) → mouvement d’écart / litige ; pas de silence. |
| M13 | Annulation après expédition = retour formalisé, pas suppression de l’historique. |
| M14 | On ne peut pas expédier plus que le disponible source au moment du picking. |

## 5.3 Achats et multi-sites

| ID | Règle |
|----|-------|
| M20 | Par défaut, les commandes fournisseurs sont **centrales** (paramétrable). |
| M21 | Une réception peut être ventilée multi-sites seulement si le processus d’allocation est explicite (sinon : tout en centrale puis transferts). |

## 5.4 Droits et visibilité

| ID | Règle |
|----|-------|
| M30 | Caissier : site courant uniquement. |
| M31 | Gérant : son site (± lecture autres sites selon paramètre). |
| M32 | Direction / logistique : vue réseau + tous les bons de transfert. |
| M33 | Modification de prix nationaux : rôle central, pas boutique seule (sauf politique dérogatoire). |

---

# 6. Événements métier

## 6.1 Stock et transferts

```
stock.received_at_site
stock.transfer_requested
stock.transfer_confirmed
stock.transfer_shipped
stock.transfer_in_transit
stock.transfer_received
stock.transfer_variance_declared
stock.transfer_closed
stock.adjusted_inventory
```

## 6.2 Vente et caisse

```
pos.session_opened
pos.sale_completed          -- inclut site_id
pos.session_closed
```

## 6.3 Réassort et allocation

```
replenishment.requested
replenishment.rejected
allocation.proposed
allocation.approved
```

## 6.4 Reconstruction

| Question | Événements |
|----------|------------|
| Stock de B aujourd’hui | Réceptions B + transferts reçus B − ventes B − transferts expédiés depuis B ± inventaires |
| Où sont les 50 pièces parties de la centrale ? | `transfer_shipped` puis `received` ou variance |
| Qui a validé l’écart ? | Acteur sur `transfer_variance_declared` |

---

# 7. Niveau E — Optimisation

| Situation | Apport ERP |
|-----------|------------|
| Boutique en rupture alors que la centrale a du stock | Suggestions de transfert automatiques |
| Surstock boutique A, rupture B | Détection d’équilibrage latéral ou via centrale |
| Commandes fournisseurs déconnectées des ventes locales | Besoin réseau = f(ventes site, stocks site, délais, en-cours transferts) |
| CA comparé au feeling | Classement sites, panier moyen, ruptures perdues estimées |
| Transferts « perdus » | Âge des bons `shipped` non reçus · alertes |

### Moteur de besoin boutique (simplifié)

```
Besoin(produit, site) ≈
    max(0,
      stock_cible(site)
    − stock_actuel(site)
    − transferts_en_cours_vers(site)
    + ventes_prévues_horizon
    )
```

### Allocation centrale (simplifié)

```
Stock_centrale_disponible
  réparti selon :
    poids des ventes récentes
  × poids de la taille de site
  × corrections manuelles direction
```

---

# 8. Niveau F — Automatisations

## 8.1 Alerte rupture + proposition de transfert

```
Stock boutique < seuil
  ET stock centrale ≥ qté proposée
  → Alerte gérant + logistique
  → Brouillon de bon de transfert
  → Validation humaine (logistique)
  → Picking
```

## 8.2 Relance réception

```
Bon statut = shipped
  ET date_expédition + N jours < aujourd’hui
  ET non reçu
  → Alerte destination + logistique
  → Escalade J+N2
```

## 8.3 Équilibrage de surstock

```
Site A : stock >> cible
Site B : stock < seuil
  → Proposition transfert A → B (si politique latérale active)
  → Sinon proposition A → centrale (retour) puis centrale → B
```

## 8.4 Réassort post-réception fournisseur

```
Réception centrale validée sur articles à répartition auto
  → Calcul allocation
  → Brouillons de BT par boutique
  → File de validation logistique
```

---

# 9. Modèle de données dérivé

## 9.1 Socle (retail étendu)

| Table | Extension multi-sites |
|-------|------------------------|
| `sites` | `kind` = warehouse \| store \| depot |
| `stock_levels` | PK (product_id, site_id) |
| `stock_moves` | `reason` enrichi : `transfer_out`, `transfer_in`, `transfer_variance` |
| `tickets` | `site_id` NOT NULL |
| `cash_sessions` | unique open per `site_id` |

## 9.2 Entités transfert

| Table | Contenu |
|-------|---------|
| `stock_transfers` | `from_site_id`, `to_site_id`, `status`, `shipped_at`, `received_at`, `created_by` |
| `stock_transfer_lines` | `product_id`, `qty_requested`, `qty_shipped`, `qty_received` |
| `replenishment_requests` | Demande boutique avant BT |
| `site_assortments` | Produit actif oui/non par site (option) |
| `domain_events` | Journal |

## 9.3 Schéma

```
sites
  │
  ├── stock_levels ──────── products
  ├── cash_sessions ─────── tickets
  │
  ├── stock_transfers (from_site / to_site)
  │         │
  │         └── stock_transfer_lines
  │
  └── replenishment_requests

stock_moves (tous motifs, toujours site_id + product_id)
```

## 9.4 Transit

Deux options de modélisation :

| Option | Description |
|--------|-------------|
| **A. Site virtuel TRANSIT** | À l’expédition : move source → TRANSIT ; à la réception : TRANSIT → dest |
| **B. Quantité implicite** | `sum(qty_shipped − qty_received)` sur BT non clos = transit |

L’option A simplifie les états de stock « où est la marchandise ? ».

## 9.5 Formules

```
on_hand(product, site) = projection stock_levels

in_transit(product) = Σ (shipped − received) sur lignes BT non closed

available_for_sale(product, site) = on_hand − reservations(site)
```

---

# 10. Indicateurs de pilotage

| KPI | Niveau |
|-----|--------|
| CA, marge, panier moyen | Par site et consolidé |
| Taux de rupture | Par site × famille |
| Délai moyen demande → réception | Logistique |
| Taux d’écart de transfert | expédié vs reçu |
| Âge du stock | Par site |
| Part du stock en transit | Risque et immobilisation |
| Surstock vs rupture croisés | Opportunités d’équilibrage |
| Fill rate centrale | Demandes honorées / demandées |

---

# 11. Parcours utilisateurs

## 11.1 Gérant boutique
1. Voir stock local et alertes  
2. Créer une demande de réassort  
3. Réceptionner un BT (ou déléguer)  
4. Suivre le CA du jour  

## 11.2 Logistique centrale
1. File des demandes  
2. Créer / valider les BT  
3. Suivre expéditions non reçues  
4. Traiter écarts  

## 11.3 Préparateur
1. BT à picker  
2. Confirmer qté expédiée  
3. Marquer shipped  

## 11.4 Direction réseau
1. Dashboard multi-sites  
2. Comparer performances  
3. Valider campagnes d’allocation  

## 11.5 Caissier
1. Caisse sur **son** site  
2. Aucun choix de « piocher » le stock d’un autre magasin  

---

# 12. Modules Smart Collab typiques

| Besoin | Module |
|--------|--------|
| Vente locale | Point de Vente · Ventes |
| Stock par site | Produits & Inventaire · Sites & Entrepôts |
| Transferts | Transferts |
| Achats centraux | Achats |
| Clients | CRM |
| Pilotage | Dashboard · Rapports · Centre de contrôle |
| Finance | Finance |

Preset **Multi-sites** = Retail + Transferts + Sites + Centre de contrôle souvent activé.

---

# 13. Critères de réussite d’un MVP multi-sites

1. Deux sites avec stocks **indépendants**.  
2. Vente en boutique A impossible sur qté seulement présente en centrale.  
3. BT : expédition diminue A, réception augmente B, écart journalisé.  
4. Liste des BT `shipped` non reçus visible.  
5. Dashboard : CA site A vs B vs réseau.  
6. Droits : caissier A ne bascule pas sur le stock B.  
7. Inventaire et ajustement **par site**.

---

# 14. Liens avec les autres domaines

| Domaine | Interaction |
|---------|-------------|
| **Retail** | Multi-sites = retail **répété** + couche logistique |
| **Génie électrique** | Chantier = site temporaire ; mêmes idées de transfert / stock par lieu |
| **Conseil** | Peu de stock ; éventuellement multi-bureaux pour le temps et le CA, pas pour le WMS |

```
RETAIL (1 site)
    │
    ▼
MULTI-SITES (N stocks + transferts)
    │
    ├── Génie électrique (site « chantier »)
    └── Distribution pure (centrale forte, boutiques légères)
```

---

# 15. Synthèse

```
FOURNISSEUR → CENTRALE → TRANSFERT → BOUTIQUE → CLIENT
                 │                      │
                 └──── pilotage réseau ─┘

Règle d’or : on ne vend que ce qui est LOCAL et DISPONIBLE.
Règle d’or 2 : tout mouvement inter-sites a un ÉTAT et un ÉVÉNEMENT.
Règle d’or 3 : l’écart n’est pas un oubli, c’est un FAIT enregistré.
```

```
PROCESSUS (réassort, BT, réception, vente)
  → OBJETS (site, transfer, line, session)
  → ÉVÉNEMENTS (shipped, received, variance…)
  → RÈGLES (stock local, transit non vendable)
  → DONNÉES
  → AUTOMATISATIONS (propositions, relances)
  → PILOTAGE RÉSEAU
```

---

*Document domaine Multi-sites / Distribution — Smart Collab*  
*Pont entre le BPM Retail mono-site et les réseaux à centrale + points de vente.*
