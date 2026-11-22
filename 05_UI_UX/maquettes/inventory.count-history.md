# inventory.count-history — Inventaire — historique

**Statut : proposée**

| | |
|---|---|
| Application | `inventory` |
| Écran | `count-history` |
| Lot | 4 |
| Prototype | Inventaire › Historique (v105) |
| Fonction de rendu | `PAGES.inv → ISUBP.historique` |

## Captures de référence

- [09_Inventaire/07_historique.png](../../03_SOURCES_REFERENCE/prototype/captures/09_Inventaire/07_historique.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période.
- Inventaires clôturés (ligne cliquable → détail des écarts et corrections générées).
- Corrections de stock (origine inventaire ou manuelle).

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

Pas de tableau de données (cartes, graphiques ou formulaire).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouvel inventaire | abandonne la saisie en cours après confirmation (`iReset`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucun inventaire clôturé pour l'instant — clôture ton premier comptage depuis Saisie puis Revue & validation. » (et 1 autre(s) message(s)). Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- inventory.count.view

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-GEN-04, EF-STK-04, EF-GEN-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Listes en cartes ; détail en plein écran.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Rien de spécifique au-delà des données (noms, montants) affichées sur les captures.
