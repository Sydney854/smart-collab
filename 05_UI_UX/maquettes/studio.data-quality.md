# studio.data-quality — Qualité des données

**Statut : proposée**

| | |
|---|---|
| Application | `studio` |
| Écran | `data-quality` |
| Lot | 6 |
| Prototype | Rapports & Analyses › Qualité des données (v105) |
| Fonction de rendu | `PAGES.rap → RSUBP.qual` |

## Captures de référence

- [14_Rapports-Analyses/21_qual.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/21_qual.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Bandeau « ces compteurs doivent tendre vers zéro » ; tableau triable : anomalie, références, part, priorité, conséquence ; clic = catalogue filtré.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **ANOMALIE · RÉFÉRENCES · PART · PRIORITÉ · CONSÉQUENCE** — tri au clic sur 4 en-tête(s) ; ligne cliquable → ouvre l'écran ou la fiche correspondante (`versCatalogue`)

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)


Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- studio.report.view

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-STK-01, EF-BI-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Anomalies en cartes.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours. (sans objet ici)
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Liste des anomalies propre aux fichiers importés de RUTHY'S → contrôles de qualité configurables.
