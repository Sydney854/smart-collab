# control.access-log — Journal des accès

**Statut : proposée**

| | |
|---|---|
| Application | `control` |
| Écran | `access-log` |
| Lot | 6 |
| Prototype | Centre de contrôle › Journal des accès (v105) |
| Fonction de rendu | `PAGES.ctrl → XSUBP.acces` |

## Captures de référence

- [15_Centre-de-controle/03_acces.png](../../03_SOURCES_REFERENCE/prototype/captures/15_Centre-de-controle/03_acces.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; filtres : site, opérateur, heure de / à (et interface, type pour le journal).
- Boutons Imprimer, Excel.
- Tableau : connecté le, poste, adresse IP, opérateur, déconnecté le, durée, observation.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Site | liste | non | valeurs du référentiel (3 entrées dans le prototype, données du client fondateur non reprises) |
| Opérateur | liste | non | valeurs du référentiel (9 entrées dans le prototype, données du client fondateur non reprises) |
| De | heure | non |  |
| à | heure | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **CONNECTÉ LE · POSTE · ADRESSE IP · OPÉRATEUR · DÉCONNECTÉ LE · DURÉE · OBSERVATION**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| 🖨 Imprimer | **aucune action dans le prototype — à câbler** |
| ↧ Excel | **aucune action dans le prototype — à câbler** |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (8 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- control.log.view

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-CTL-01 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Connexions en cartes.

## À ne pas reproduire

- « 🖨 Imprimer » et « ↧ Excel » sans effet.
- Listes de sites écrites en dur et différentes d'un écran à l'autre (ici une partie seulement des sites). Smart Collab alimente toutes les listes de sites depuis le référentiel des sites, filtré par le périmètre de l'utilisateur.
- Relevé automatique des éléments sans effet sur les captures : « 🖨 Imprimer », « ↧ Excel ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Connexions d'exemple : données fictives du prototype.
