# pos.held-sales — Caisse — ventes en attente

**Statut : proposée**

| | |
|---|---|
| Application | `pos` |
| Écran | `held-sales` |
| Lot | 3 |
| Prototype | Caisse › En attente (v105) |
| Fonction de rendu | `PAGES.caisse → KSUBP.attente` |

## Captures de référence

- [02_Caisse/03_attente.png](../../03_SOURCES_REFERENCE/prototype/captures/02_Caisse/03_attente.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- En-tête et sous-onglets de la caisse, barre de période.
- Carte « Ventes en attente » : une ligne par panier suspendu (n°, heure, client, lignes, montant), clic = reprendre dans la caisse.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

Pas de tableau de données (cartes, graphiques ou formulaire).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ⇄ Décaissement | **aucune action dans le prototype — à câbler** |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucune vente en attente. Depuis la caisse, le bouton « Mise en attente » suspend le panier en cours. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Disponible hors ligne : les paniers en attente sont gardés sur l'appareil de la caisse ; reprise possible sans réseau.

## Droits nécessaires

- pos.sale.create (reprendre une vente)

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-POS-02, EF-POS-06 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Liste en cartes : n° + heure, client, montant ; appui = reprendre.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours. Une liste de paniers suspendus du jour n'a pas besoin de barre de période.
- Boutons sans effet dans le prototype : « ⇄ Décaissement ». Tout bouton affiché fait quelque chose, sinon il n'est pas affiché.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Rien de spécifique au-delà des données (noms, montants) affichées sur les captures.
