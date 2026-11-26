# core.sites-comparison — Comparaison des boutiques et sites

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `sites-comparison` |
| Lot | 6 |
| Prototype | Boutiques / Sites (v105) |
| Fonction de rendu | `PAGES.sites` |

## Captures de référence

- [04_Boutiques-Sites/01_sites.png](../../03_SOURCES_REFERENCE/prototype/captures/04_Boutiques-Sites/01_sites.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- En-tête et barre de période.
- Une carte par site : CA, marge, taux de marge, unités, panier moyen, références + mini-courbe.
- Graphiques : profil comparé (radar, indices base 100) et CA mensuel comparé (courbes superposées).
- Tableau comparatif triable : indicateur, valeur par site, écart, ▲ sur le meilleur site.
- Bandeau « Lecture » (commentaire généré).

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **INDICATEUR · ‹site› · ‹site› · ÉCART ‹site›/‹site›** — tri au clic sur 4 en-tête(s)

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)


## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelettes de cartes et de graphiques ; la barre de période reste utilisable. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Chaque carte ou graphique en erreur affiche « Données indisponibles — Réessayer » sans bloquer les autres.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- core.dashboard.view (sites du périmètre seulement)

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-BI-03, §7 Indicateurs (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Cartes de site empilées, une par ligne.
- Radar remplacé par des barres horizontales (plus lisible en étroit).
- Tableau comparatif : passe en cartes « indicateur → valeurs par site ».

## À ne pas reproduire

- Comparaison limitée à deux sites alors que l'entreprise en a davantage : Smart Collab compare N sites (choix des sites à comparer).
- Sous-titre « sur l'exercice 2024 » écrit en dur.
- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Choix des deux sites comparés et commentaire « Lecture » calculés sur les données du client fondateur.
- Noms des sites, exercices et montants affichés : données du client fondateur, remplacées par des données fictives.
