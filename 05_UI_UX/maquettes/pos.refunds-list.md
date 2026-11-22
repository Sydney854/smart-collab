# pos.refunds-list — Caisse — liste des avoirs

**Statut : proposée**

| | |
|---|---|
| Application | `pos` |
| Écran | `refunds-list` |
| Lot | 3 |
| Prototype | Caisse › Liste des avoirs (v105) |
| Fonction de rendu | `PAGES.caisse → KSUBP.avoirs` |

## Captures de référence

- [02_Caisse/08_avoirs.png](../../03_SOURCES_REFERENCE/prototype/captures/02_Caisse/08_avoirs.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de filtres : site, type d'avoir (non livrés, livrés, tous) ; Modifier, Imprimer, Excel.
- Tableau : n° avoir, date, vente d'origine, client, articles, montant, motif, traitement, statut.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Site | liste | non | valeurs du référentiel (3 entrées dans le prototype, données RUTHY'S non reprises) |
| Type d'avoir | liste | non | choix : AVOIRS NON LIVRÉS, AVOIRS LIVRÉS, TOUS |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **N° AVOIR · DATE · VENTE D'ORIGINE · CLIENT · ARTICLES · MONTANT · MOTIF · TRAITEMENT · STATUT**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ⇄ Décaissement | **aucune action dans le prototype — à câbler** |
| ✎ Modifier | **aucune action dans le prototype — à câbler** |
| 🖨 Imprimer | **aucune action dans le prototype — à câbler** |
| ↧ Excel | **aucune action dans le prototype — à câbler** |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucun avoir dans les données transmises. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- pos.sale.refund
- pos.refund.view

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-POS-05, EF-GEN-02, EF-GEN-04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Liste en cartes : n° avoir + date, client, montant, statut.

## À ne pas reproduire

- Aucune création d'avoir n'existe dans le prototype : la liste est toujours vide et la note qui dit « un avoir se crée depuis une vente » est trompeuse. Le parcours retour/avoir depuis le ticket d'origine est à maquetter (EF-POS-05).
- Boutons Modifier, Imprimer, Excel sans effet.
- Listes de sites écrites en dur et différentes d'un écran à l'autre (ici une partie seulement des sites). Smart Collab alimente toutes les listes de sites depuis le référentiel des sites, filtré par le périmètre de l'utilisateur.
- Relevé automatique des éléments sans effet sur les captures : « ⇄ Décaissement », « ✎ Modifier », « 🖨 Imprimer », « ↧ Excel ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Rien de spécifique au-delà des données (noms, montants) affichées sur les captures.
