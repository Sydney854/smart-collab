# control.product-alerts — Produits en alerte

**Statut : proposée**

| | |
|---|---|
| Application | `control` |
| Écran | `product-alerts` |
| Lot | 6 |
| Prototype | Centre de contrôle › Produits en alerte (v105) |
| Fonction de rendu | `PAGES.ctrl → XSUBP.alerte` |

## Captures de référence

- [15_Centre-de-controle/08_alerte.png](../../03_SOURCES_REFERENCE/prototype/captures/15_Centre-de-controle/08_alerte.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; bandeau ; tableau triable : nombre d'alertes, produit, identifiant, famille, stock réserve, stock rayon, stock, prix d'achat, prix de vente, alertes ; clic = fiche produit.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **NBRE · PRODUIT · IDENTIFIANT · FAMILLE · STOCK RÉSERVE · STOCK RAYON · STOCK · P. ACHAT · P. VENTE · ALERTES** — tri au clic sur 7 en-tête(s) ; ligne cliquable → ouvre la fiche du produit (`voirProduit`)

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)


Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (8 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- control.alert.view
- Prix d'achat masqué selon le rôle

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-STK-05, EF-CTL-01 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Produits en cartes avec les alertes en badges.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Règles d'alerte produit (rupture, surstock, dormant, prix) → seuils configurables (EF-STK-05).
