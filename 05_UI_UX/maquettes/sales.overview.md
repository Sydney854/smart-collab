# sales.overview — Ventes — vue globale

**Statut : proposée**

| | |
|---|---|
| Application | `sales` |
| Écran | `overview` |
| Lot | 5 |
| Prototype | Ventes › Vue globale (v105) |
| Fonction de rendu | `PAGES.ventes → VSUBP.global` |

## Captures de référence

- [03_Ventes/01_global.png](../../03_SOURCES_REFERENCE/prototype/captures/03_Ventes/01_global.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période.
- 6 cartes : CA, marge, unités, panier moyen, lignes de vente, références vendues.
- Graphiques : évolution mensuelle par site, poids des sites.
- Tableau « Top 15 des ventes » triable ; clic sur un produit = fiche produit ; bouton Colonnes.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **# · CODE · PRODUIT · FAMILLE · CA · UNITÉS ‹site› · UNITÉS ‹site› · CLASSE** — tri au clic sur 7 en-tête(s)

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ⚙ Colonnes | **aucune action dans le prototype — à câbler** |
| (nom ou n° cliquable dans la ligne) | ouvre la fiche du produit (`voirProduit`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (3 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelettes de cartes et de graphiques ; la barre de période reste utilisable. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Chaque carte ou graphique en erreur affiche « Données indisponibles — Réessayer » sans bloquer les autres.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- sales.report.view
- Marge masquée selon le rôle

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-BI-03, EF-GEN-04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Cartes 2 par ligne ; graphiques un par ligne.
- Top 15 en cartes : rang, produit, CA, classe ABC.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Colonnes d'unités écrites pour deux sites nommés : une colonne par site du périmètre, ou un total + détail.
- Bouton « ⚙ Colonnes » sans effet.
- Relevé automatique des éléments sans effet sur les captures : « ⚙ Colonnes ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Noms de sites en colonnes, produits et montants : données du client fondateur.
