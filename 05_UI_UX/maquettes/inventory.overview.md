# inventory.overview — Produits & Stocks — vue d'ensemble

**Statut : proposée**

| | |
|---|---|
| Application | `inventory` |
| Écran | `overview` |
| Lot | 2 |
| Prototype | Produits & Stocks › Vue d'ensemble (v105) |
| Fonction de rendu | `PAGES.prod → PSUBP.apercu` |

## Captures de référence

- [05_Produits-Stocks/01_apercu.png](../../03_SOURCES_REFERENCE/prototype/captures/05_Produits-Stocks/01_apercu.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- En-tête avec « Nouveau produit », sous-onglets, barre de période.
- 6 cartes : CA, marge, références vendues, taux de classification, classe A, unités.
- Graphiques : CA par famille, taux de marge par famille, top 12 sous-familles, répartition par genre, rotation, ABC, évolution du CA.
- Matrice (carte de chaleur) rotation × classe ABC.
- Tableau « Performance par famille » triable ; clic = catalogue filtré sur la famille.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 3 note(s) de bas de bloc.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **RAPIDE · MOYENNE · FAIBLE · NON CALCULABLE**
- **FAMILLE · CA · PART · RÉF. · UNITÉS · MARGE · TAUX · PRIX MOYEN** — tri au clic sur 8 en-tête(s) ; ligne cliquable → ouvre l'écran ou la fiche correspondante (`versFamille`)

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouveau produit | ouvre le formulaire de création (`togNew`) |
| ◔ Vue d'ensemble | change de sous-onglet ou de vue (`setSub`) |
| ◫ Catalogue | change de sous-onglet ou de vue (`setSub`) |
| ▤ Étiquettes | change de sous-onglet ou de vue (`setSub`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (3 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelettes de cartes et de graphiques ; la barre de période reste utilisable. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Chaque carte ou graphique en erreur affiche « Données indisponibles — Réessayer » sans bloquer les autres.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- inventory.product.view
- Marges masquées selon le rôle

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-STK-05, EF-BI-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Cartes de chiffres clés : 2 par ligne, puis 1 sous 360 px.
- Graphiques : un par ligne, hauteur réduite, légende sous le graphique.
- Matrice rotation × ABC : défilement horizontal, première colonne figée.
- Performance par famille en cartes.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Bornes ABC, seuils de rotation → seuils configurables (EF-STK-05).
- Familles et sous-familles : nomenclature du client fondateur, à remplacer par les catégories de l'entreprise.
