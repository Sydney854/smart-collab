# purchase.claim-list — Liste des réclamations

**Statut : proposée**

| | |
|---|---|
| Application | `purchase` |
| Écran | `claim-list` |
| Lot | 4 |
| Prototype | Achats › Liste des réclamations (v105) |
| Fonction de rendu | `PAGES.achats → ASUBP.listerecl` |

## Captures de référence

- [06_Achats/08_listerecl.png](../../03_SOURCES_REFERENCE/prototype/captures/06_Achats/08_listerecl.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de filtres : site, fournisseur ; Modifier, Supprimer, Imprimer, Réactiver, Valider l'avoir.
- Tableau : référence, date, fournisseur, R.I. BL, lignes, unités, montant, motif dominant, statut, récupéré.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Site | liste | non | valeurs du référentiel (5 entrées dans le prototype, données du client fondateur non reprises) |
| Fournisseur | liste | non | valeurs du référentiel (81 entrées dans le prototype, données du client fondateur non reprises) |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **RÉF. · DATE · FOURNISSEUR · R.I. BL · LIGNES · UNITÉS · MONTANT · MOTIF DOMINANT · STATUT · RÉCUPÉRÉ**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouveau bon de livraison | **aucune action dans le prototype — à câbler** |
| ✎ Modifier | **aucune action dans le prototype — à câbler** |
| 🗑 Supprimer | **aucune action dans le prototype — à câbler** |
| 🖨 Imprimer | **aucune action dans le prototype — à câbler** |
| ⟳ Réactiver | **aucune action dans le prototype — à câbler** |
| ✓ Valider l'Avoir | **aucune action dans le prototype — à câbler** |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (8 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucune réclamation dans les données 2024 transmises. L'écran est fonctionnel : saisis une réclamation dans l'onglet précédent pour la voir apparaître ici. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- purchase.claim.view
- purchase.claim.reactivate
- purchase.claim.validate_credit

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-ACH-02, EF-GEN-04, EF-GEN-02 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Liste en cartes : fournisseur, référence, montant, statut.

## À ne pas reproduire

- Tous les boutons d'action sans effet.
- « Supprimer » proposé sur un document validé : interdit par EF-GEN-02 ; proposer « Annuler » avec motif (document inverse ou statut), jamais de suppression physique.
- Listes de sites écrites en dur et différentes d'un écran à l'autre (ici une partie seulement des sites). Smart Collab alimente toutes les listes de sites depuis le référentiel des sites, filtré par le périmètre de l'utilisateur.
- Relevé automatique des éléments sans effet sur les captures : « ＋ Nouveau bon de livraison », « ✎ Modifier », « 🗑 Supprimer », « 🖨 Imprimer », « ⟳ Réactiver », « ✓ Valider l'Avoir ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Rien de spécifique au-delà des données (noms, montants) affichées sur les captures.
