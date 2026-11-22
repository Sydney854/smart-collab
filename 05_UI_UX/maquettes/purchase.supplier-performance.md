# purchase.supplier-performance — Performance comparée des fournisseurs

**Statut : proposée**

| | |
|---|---|
| Application | `purchase` |
| Écran | `supplier-performance` |
| Lot | 4 |
| Prototype | Fournisseurs › Performance comparée (v105) |
| Fonction de rendu | `PAGES.frn → FSUBP.perf` |

## Captures de référence

- [07_Fournisseurs/04_perf.png](../../03_SOURCES_REFERENCE/prototype/captures/07_Fournisseurs/04_perf.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; bandeau « Quatre angles pour juger un fournisseur ».
- Listes en barres : top 15 par CA, taux de marge.
- Tableau de performance : fournisseur (clic = fiche), réf., CA, unités, marge, taux, BL, valeur reçue, écoulement, jugement.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **# · FOURNISSEUR · RÉF. · CA · UNITÉS · MARGE · TAUX · BL · VALEUR REÇUE · ÉCOULEMENT · JUGEMENT**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouveau fournisseur | ouvre le formulaire de création (`fNew`) |
| (nom ou n° cliquable dans la ligne) | ouvre l'écran ou la fiche correspondante (`fSel`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (3 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelettes de cartes et de graphiques ; la barre de période reste utilisable. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Chaque carte ou graphique en erreur affiche « Données indisponibles — Réessayer » sans bloquer les autres.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- partners.supplier.view
- Marges masquées selon le rôle

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-BI-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Listes en barres une par ligne ; tableau en cartes.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Règles du « jugement » (seuils CA / marge / écoulement) → règles configurables.
