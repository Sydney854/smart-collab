# purchase.order-list — Liste des commandes fournisseurs

**Statut : proposée**

| | |
|---|---|
| Application | `purchase` |
| Écran | `order-list` |
| Lot | 4 |
| Prototype | Achats › Liste des commandes (v105) |
| Fonction de rendu | `PAGES.achats → ASUBP.listecommandes` |

## Captures de référence

- [06_Achats/10_listecommandes.png](../../03_SOURCES_REFERENCE/prototype/captures/06_Achats/10_listecommandes.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; 3 cartes (commandes, en attente de réception, valeur engagée).
- Liste à panneau divisé des commandes (statuts Envoyée / Reçue / Annulée) — vide sur la capture : message renvoyant vers « Passer une commande » ou Réapprovisionnement.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

Pas de tableau de données (cartes, graphiques ou formulaire).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouveau bon de livraison | **aucune action dans le prototype — à câbler** |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (8 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucune commande créée pour l'instant. Utilise "Passer une commande", ou le bouton "→ Commander" depuis Réapprovisionnement. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- purchase.order.view
- purchase.order.receive
- purchase.order.cancel

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-ACH-01, EF-GEN-04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Cartes de chiffres 1 par ligne ; commandes en cartes.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Boutons sans effet dans le prototype : « ＋ Nouveau bon de livraison ». Tout bouton affiché fait quelque chose, sinon il n'est pas affiché.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Rien de spécifique au-delà des données (noms, montants) affichées sur les captures.
