# transfers.flows — Flux entre sites

**Statut : proposée**

| | |
|---|---|
| Application | `transfers` |
| Écran | `flows` |
| Lot | 4 |
| Prototype | Transferts de stock › Flux entre sites (v105) |
| Fonction de rendu | `PAGES.trf → TSUBP.flux` |

## Captures de référence

- [08_Transferts-de-stock/02_flux.png](../../03_SOURCES_REFERENCE/prototype/captures/08_Transferts-de-stock/02_flux.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; bandeau « Organisation logistique ».
- 6 cartes ; flux entre sites (barres), réceptions par site et par mois (graphique), bilan par site (tableau).

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **SITE · RÔLE · BONS REÇUS · ENTRÉES (U.) · SORTIES (U.) · SOLDE NET · VALEUR ENTRÉE · VALEUR SORTIE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouveau transfert | **aucune action dans le prototype — à câbler** |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (5 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelettes de cartes et de graphiques ; la barre de période reste utilisable. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Chaque carte ou graphique en erreur affiche « Données indisponibles — Réessayer » sans bloquer les autres.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- transfers.transfer.view

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-BI-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Cartes de chiffres clés : 2 par ligne, puis 1 sous 360 px.
- Graphiques : un par ligne, hauteur réduite, légende sous le graphique.
- Bilan par site en cartes.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Bouton « ＋ Nouveau transfert » sans effet.
- Relevé automatique des éléments sans effet sur les captures : « ＋ Nouveau transfert ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Organisation « Centrale qui redistribue » décrite dans le bandeau : modèle logistique du client fondateur, à rendre neutre.
