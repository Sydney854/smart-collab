# studio.scheduled-reports — États planifiés

**Statut : proposée**

| | |
|---|---|
| Application | `studio` |
| Écran | `scheduled-reports` |
| Lot | 6 |
| Prototype | Rapports & Analyses › États planifiés (v105) |
| Fonction de rendu | `PAGES.rap → RSUBP.plan` |

## Captures de référence

- [14_Rapports-Analyses/19_plan.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/19_plan.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Bandeau ; 6 cartes ; « Programmer un envoi » ; tableau : état, fréquence, période couverte, destinataires, format, dernier envoi, statut, Suspendre / Activer, 🗑.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **ÉTAT · FRÉQUENCE · PÉRIODE COUVERTE · DESTINATAIRES · FORMAT · DERNIER ENVOI · STATUT**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Programmer un envoi | ouvre le formulaire de création (`planNew`) |
| Suspendre | affiche / masque (`planTog`) |
| Activer | affiche / masque (`planTog`) |
| 🗑 | supprime ou désactive l'élément (voir « À ne pas reproduire ») (`planDel`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **Vide** : le prototype affiche « à 07h00 » (et 1 autre(s) message(s)). Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- studio.report.schedule

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-BI-02 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Envois en cartes ; Programmer en barre fixe.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours. (barre de période inutile sur cet écran)
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Envois d'exemple : données du client fondateur.
