# sales.consignment — Ventes — dépôt-vente

**Statut : proposée**

| | |
|---|---|
| Application | `sales` |
| Écran | `consignment` |
| Lot | 5 |
| Prototype | Ventes › Dépôt-vente (v105) |
| Fonction de rendu | `PAGES.ventes → VSUBP.dv` |

## Captures de référence

- [03_Ventes/02_dv.png](../../03_SOURCES_REFERENCE/prototype/captures/03_Ventes/02_dv.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période.
- 6 cartes : CA dépôt-vente, marge, déposants actifs, références déposées, unités, prix moyen.
- Bandeau de lecture (part du dépôt-vente).
- Graphique « part du dépôt-vente », liste « Top déposants par CA ».
- Tableau « Détail par déposant » triable ; clic sur une ligne = fiche fournisseur du déposant.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **# · DÉPOSANT / ARTISAN · RÉF. · CA · PART · UNITÉS · MARGE · TAUX · STATUT** — tri au clic sur 7 en-tête(s) ; ligne cliquable → ouvre l'écran ou la fiche correspondante (`versFournisseur`)

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ⚙ Colonnes | **aucune action dans le prototype — à câbler** |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (3 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelettes de cartes et de graphiques ; la barre de période reste utilisable. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Chaque carte ou graphique en erreur affiche « Données indisponibles — Réessayer » sans bloquer les autres.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- sales.report.view
- Marges masquées selon le rôle

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-VEN-03, EF-BI-03, EF-GEN-04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Cartes 2 par ligne.
- Détail par déposant en cartes : déposant, CA, part, statut.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Bouton « ⚙ Colonnes » sans effet.
- Relevé automatique des éléments sans effet sur les captures : « ⚙ Colonnes ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Taux de commission du dépôt-vente → règle configurable (EF-VEN-03).
- Statut de règlement du déposant utilisé dans le calcul de marge → règle de calcul.
- Déposants et montants : données RUTHY'S.
