# control.operations-log — Journal des opérations

**Statut : proposée**

| | |
|---|---|
| Application | `control` |
| Écran | `operations-log` |
| Lot | 6 |
| Prototype | Centre de contrôle › Journal des opérations (v105) |
| Fonction de rendu | `PAGES.ctrl → XSUBP.ops` |

## Captures de référence

- [15_Centre-de-controle/02_ops.png](../../03_SOURCES_REFERENCE/prototype/captures/15_Centre-de-controle/02_ops.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; filtres : site, opérateur, heure de / à (et interface, type pour le journal).
- Boutons Imprimer, Excel.
- Journal (vide sur la capture : « Encaisse une vente… l'action apparaîtra ici »).

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Site | liste | non | valeurs du référentiel (3 entrées dans le prototype, données du client fondateur non reprises) |
| Opérateur | liste | non | valeurs du référentiel (9 entrées dans le prototype, données du client fondateur non reprises) |
| Interface | liste | non | valeurs du référentiel (9 entrées dans le prototype, données du client fondateur non reprises) |
| Type | liste | non | valeurs du référentiel (14 entrées dans le prototype, données du client fondateur non reprises) |
| De | heure | non |  |
| à | heure | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

Pas de tableau de données (cartes, graphiques ou formulaire).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| 🖨 Imprimer | **aucune action dans le prototype — à câbler** |
| ↧ Excel | **aucune action dans le prototype — à câbler** |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (8 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucune opération enregistrée dans cette session. Encaisse une vente, corrige un stock ou valide un transfert : l'action apparaîtra ici immédiatement. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- control.log.view

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-CTL-01, EF-GEN-03, EF-GEN-04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Opérations en cartes ; filtres dans « Filtres ».

## À ne pas reproduire

- « 🖨 Imprimer » et « ↧ Excel » sans effet.
- Listes de sites écrites en dur et différentes d'un écran à l'autre (ici une partie seulement des sites). Smart Collab alimente toutes les listes de sites depuis le référentiel des sites, filtré par le périmètre de l'utilisateur.
- Relevé automatique des éléments sans effet sur les captures : « 🖨 Imprimer », « ↧ Excel ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Opérateurs : données du client fondateur.
