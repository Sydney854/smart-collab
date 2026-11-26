# sales.monthly — Ventes — détail mensuel

**Statut : proposée**

| | |
|---|---|
| Application | `sales` |
| Écran | `monthly` |
| Lot | 5 |
| Prototype | Ventes › Détail mensuel (v105) |
| Fonction de rendu | `PAGES.ventes → VSUBP.detail` |

## Captures de référence

- [03_Ventes/03_detail.png](../../03_SOURCES_REFERENCE/prototype/captures/03_Ventes/03_detail.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période.
- Tableau mensuel : mois (ordre chronologique, non triable), CA par site, total, unités, marge, achats BL, part.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **MOIS · ‹site› · ‹site› · TOTAL CA · UNITÉS · MARGE · ACHATS BL · PART** — tri au clic sur 7 en-tête(s)

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ⚙ Colonnes | **aucune action dans le prototype — à câbler** |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (3 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- sales.report.view

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-GEN-04, EF-BI-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Tableau en cartes par mois : mois, total CA, marge ; détail par site en dépliant la carte.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Une colonne par site écrite en dur (deux sites).
- Bouton « ⚙ Colonnes » sans effet.
- Relevé automatique des éléments sans effet sur les captures : « ⚙ Colonnes ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Montants : données du client fondateur.
