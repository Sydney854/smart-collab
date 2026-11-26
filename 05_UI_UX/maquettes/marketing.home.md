# marketing.home — Marketing

**Statut : proposée**

| | |
|---|---|
| Application | `marketing` (application proposée, absente du contrat §7 de 16_CONTRAT_APPLICATION.md) |
| Écran | `home` |
| Lot | hors lots 1 à 7 |
| Prototype | Marketing (v105) |
| Fonction de rendu | `PAGES.mkt` |

## Captures de référence

- [13_Marketing/01_mkt.png](../../03_SOURCES_REFERENCE/prototype/captures/13_Marketing/01_mkt.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Écran vide du prototype : message « Aucune donnée de campagne fournie » et liste du contenu prévu (calendrier, budget, promotions, CA attribué, ROI…). Écran absent → maquette DreamsERP (campagnes).

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

Pas de tableau de données (cartes, graphiques ou formulaire).

## Actions (ce que fait chaque clic)


## États

- **Vide** : le prototype affiche « Aucune donnée de campagne fournie » (et 1 autre(s) message(s)). Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelettes de cartes et de graphiques ; la barre de période reste utilisable. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Chaque carte ou graphique en erreur affiche « Données indisponibles — Réessayer » sans bloquer les autres.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- marketing.campaign.view

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-CRM-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- —

## À ne pas reproduire

- Module affiché dans le menu sans contenu.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Commentaire sur le pic de ventes de décembre calculé sur les données du client fondateur.
