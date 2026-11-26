# control.alerts — Alertes actives

**Statut : proposée**

| | |
|---|---|
| Application | `control` |
| Écran | `alerts` |
| Lot | 6 |
| Prototype | Centre de contrôle › Alertes actives (v105) |
| Fonction de rendu | `PAGES.ctrl → XSUBP.alertes` |

## Captures de référence

- [15_Centre-de-controle/01_alertes.png](../../03_SOURCES_REFERENCE/prototype/captures/15_Centre-de-controle/01_alertes.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; bandeau (nombre d'alertes urgentes) ; alertes sur opérations, alertes sur données ; règles de surveillance (règle, sévérité, condition, déclenchements, état).

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **RÈGLE · SÉVÉRITÉ · CONDITION · DÉCLENCHEMENTS · ÉTAT**

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
- control.rule.configure

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-CTL-01 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Alertes en cartes par gravité.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Règles et seuils de surveillance → règles configurables (§7 Seuils et alertes).
