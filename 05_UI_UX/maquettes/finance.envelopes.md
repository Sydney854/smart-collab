# finance.envelopes — Comptes et enveloppes

**Statut : proposée**

| | |
|---|---|
| Application | `finance` |
| Écran | `envelopes` |
| Lot | 5 |
| Prototype | Trésorerie & Comptabilité › Comptes et enveloppes (v105) |
| Fonction de rendu | `PAGES.treso → YSUBP.comptes` |

## Captures de référence

- [10_Tresorerie-Comptabilite/06_comptes.png](../../03_SOURCES_REFERENCE/prototype/captures/10_Tresorerie-Comptabilite/06_comptes.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; écran « Répartition par enveloppes — désactivée » (message seul).

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

Pas de tableau de données (cartes, graphiques ou formulaire).

## Actions (ce que fait chaque clic)


Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (5 éléments déplaçables).

## États

- **Vide** : le prototype affiche « ⏸ Répartition par enveloppes — désactivée Cette technique de pilotage n'est plus utilisée pour le moment (remplacée par le suivi de Contribution par site). Le m ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelettes de cartes et de graphiques ; la barre de période reste utilisable. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Chaque carte ou graphique en erreur affiche « Données indisponibles — Réessayer » sans bloquer les autres.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- finance.account.view
- finance.rule.configure

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-FIN-01, EF-FIN-03, EF-FIN-04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Message plein écran.

## À ne pas reproduire

- L'écran affiche un module désactivé : n'afficher dans le menu que ce qui est actif (EF-APP-04).
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Technique de répartition par enveloppes → règle de répartition configurable (EF-FIN-03).
