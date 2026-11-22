# control.pos-watch — Surveillance de la caisse

**Statut : proposée**

| | |
|---|---|
| Application | `control` |
| Écran | `pos-watch` |
| Lot | 6 |
| Prototype | Centre de contrôle › Caisse (v105) |
| Fonction de rendu | `PAGES.ctrl → XSUBP.caisse` |

## Captures de référence

- [15_Centre-de-controle/04_caisse.png](../../03_SOURCES_REFERENCE/prototype/captures/15_Centre-de-controle/04_caisse.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; filtres : site, opérateur, heure de / à (et interface, type pour le journal).
- Boutons Imprimer, Excel.
- Bandeau ; volets : prix de vente modifiés, remises accordées, ventes supprimées, lignes abandonnées, stocks forcés ; liste du volet choisi.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Site | liste | non | valeurs du référentiel (3 entrées dans le prototype, données RUTHY'S non reprises) |
| Opérateur | liste | non | valeurs du référentiel (9 entrées dans le prototype, données RUTHY'S non reprises) |
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
| Prix de vente modifiés, Remises accordées, Ventes supprimées … (5 éléments) | change la valeur choisie (`setXCS`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (8 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucun événement de ce type dans la session. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- control.pos.view

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-CTL-01 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Volets en puces défilantes ; événements en cartes.

## À ne pas reproduire

- « 🖨 Imprimer » et « ↧ Excel » sans effet.
- Listes de sites écrites en dur et différentes d'un écran à l'autre (ici une partie seulement des sites). Smart Collab alimente toutes les listes de sites depuis le référentiel des sites, filtré par le périmètre de l'utilisateur.
- Le volet « ventes supprimées » suppose qu'une vente peut être supprimée : en Smart Collab elle s'annule (EF-GEN-02).
- Relevé automatique des éléments sans effet sur les captures : « 🖨 Imprimer », « ↧ Excel ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Rien de spécifique au-delà des données (noms, montants) affichées sur les captures.
