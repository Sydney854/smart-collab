# transfers.receipt-gaps — Écarts de réception

**Statut : proposée**

| | |
|---|---|
| Application | `transfers` |
| Écran | `receipt-gaps` |
| Lot | 4 |
| Prototype | Transferts de stock › Écarts de réception (v105) |
| Fonction de rendu | `PAGES.trf → TSUBP.ecarts` |

## Captures de référence

- [08_Transferts-de-stock/06_ecarts.png](../../03_SOURCES_REFERENCE/prototype/captures/08_Transferts-de-stock/06_ecarts.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; bandeau d'explication ; 6 cartes.
- Tableau : n° bon (clic = fiche), date, trajet, code, désignation, expédié, reçu, écart, valeur, cause à saisir.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **N° BON · DATE · TRAJET · CODE · DÉSIGNATION · EXPÉDIÉ · REÇU · ÉCART · VALEUR · CAUSE À SAISIR**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouveau transfert | **aucune action dans le prototype — à câbler** |
| 83-S02 | ouvre l'écran ou la fiche correspondante (`openBon`) |
| 96-S01 | ouvre l'écran ou la fiche correspondante (`openBon`) |
| 67-S05 | ouvre l'écran ou la fiche correspondante (`openBon`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (5 éléments déplaçables).

## États

- **Vide** : le prototype affiche « non renseignée ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- transfers.transfer.view
- transfers.gap.justify

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-TRF-02, EF-TRF-03, EF-GEN-04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Écarts en cartes avec la cause en liste déroulante.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- La cause est affichée « non renseignée » sans moyen de la saisir sur cet écran.
- Boutons sans effet dans le prototype : « ＋ Nouveau transfert ». Tout bouton affiché fait quelque chose, sinon il n'est pas affiché.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Rien de spécifique au-delà des données (noms, montants) affichées sur les captures.
