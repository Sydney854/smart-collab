# purchase.replenishment — Réapprovisionnement (suggestions)

**Statut : proposée**

| | |
|---|---|
| Application | `purchase` |
| Écran | `replenishment` |
| Lot | 4 |
| Prototype | Achats › Réapprovisionnement (v105) |
| Fonction de rendu | `PAGES.achats → ASUBP.reappro` |

## Captures de référence

- [06_Achats/13_reappro.png](../../03_SOURCES_REFERENCE/prototype/captures/06_Achats/13_reappro.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; bandeau « Comment cette liste est calculée ».
- Filtres : famille, sous-famille, fournisseur, inclure les dormants.
- 3 cartes ; listes par fournisseur et par famille (clic droit = personnaliser) ; détail par produit (vendu, stock, à commander, valeur).
- « Commander ce fournisseur » pré-remplit une commande.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 239 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| (sans libellé) | liste | non | valeurs du référentiel (12 entrées dans le prototype, données du client fondateur non reprises) |
| Inclure les produits dormants | case à cocher | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **PRODUIT · FAMILLE · FOURNISSEUR · VENDU · STOCK · À COMMANDER · VALEUR**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouveau bon de livraison | **aucune action dans le prototype — à câbler** |
| 🛒 Commander ce fournisseur | pré-remplit une commande pour ce fournisseur (`cmdPrefillFromReappro`) |

Autres gestes : clic droit sur un graphique ou une carte : menu de personnalisation (type, couleur, masquer) — appui long sur mobile ; glisser-déposer : réordonner les sous-onglets ou les cartes (8 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- purchase.order.create (« Commander ce fournisseur »)

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-ACH-03, EF-GEN-04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Cartes 1 par ligne ; détail en cartes ; bouton Commander en barre fixe.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Boutons sans effet dans le prototype : « ＋ Nouveau bon de livraison ». Tout bouton affiché fait quelque chose, sinon il n'est pas affiché.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Formule « à commander = vendu − stock » sans délai fournisseur ni commandes en cours : la règle de Smart Collab suit EF-ACH-03 et est configurable.
