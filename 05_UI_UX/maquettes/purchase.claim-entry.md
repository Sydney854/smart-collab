# purchase.claim-entry — Réclamation fournisseur — saisie

**Statut : proposée**

| | |
|---|---|
| Application | `purchase` |
| Écran | `claim-entry` |
| Lot | 4 |
| Prototype | Achats › Réclamation (v105) |
| Fonction de rendu | `PAGES.achats → ASUBP.recl` |

## Captures de référence

- [06_Achats/07_recl.png](../../03_SOURCES_REFERENCE/prototype/captures/06_Achats/07_recl.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Bandeau : Valider ▾, Annuler, Produits.
- En-tête : fournisseur, date, référence, R.I. BL.
- Ligne d'ajout avec motif obligatoire ; tableau : produit, identifiant, quantité retour, prix, total, motif, justificatif.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Fournisseur | liste | non | valeurs du référentiel (151 entrées dans le prototype, données du client fondateur non reprises) |
| Date réclamation | date | non |  |
| Réf. Réclamation | texte | non |  |
| R.I. BL | texte | non | exemple « n° du BL » |
| Code, mot-clé ou description… | texte | non |  |
| (sans libellé) | texte | non |  |
| (sans libellé) | nombre | non |  |
| (sans libellé) | liste | non | valeurs du référentiel (9 entrées dans le prototype, données du client fondateur non reprises) |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **PRODUITS · IDENTIFIANT · QTÉ RETOUR · P. ACHAT HT · TOTAL LIGNE · MOTIF · JUSTIFICATIF**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouveau bon de livraison | **aucune action dans le prototype — à câbler** |
| ✓ Valider ▾ | **aucune action dans le prototype — à câbler** |
| [PDF] | **aucune action dans le prototype — à câbler** |
| ⊘ Annuler | abandonne la saisie en cours après confirmation (`rcReset`) |
| ▤ Produits | ouvre le sélecteur de produits (`selMode`) |
| ＋ | ajoute un élément (ligne, fiche ou fenêtre de création) (`rcAdd`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (8 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucune ligne de réclamation. » (et 1 autre(s) message(s)). Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Champs désactivés et indicateur sur le bouton de validation pendant l'enregistrement (double clic impossible). Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Message sous le champ fautif ; erreur serveur : `Toast` rouge, saisie conservée, bouton Réessayer.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- purchase.claim.create
- purchase.claim.validate

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-ACH-02, EF-GEN-01 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Formulaire plein écran ; lignes en cartes ; justificatif par photo (appareil photo du téléphone).

## À ne pas reproduire

- « Valider ▾ » et « [PDF] » sans effet : la réclamation ne peut pas être enregistrée.
- Pas de lien direct vers la réception d'origine (saisie libre du R.I.) : choisir le BL dans une liste (EF-ACH-02).
- Relevé automatique des éléments sans effet sur les captures : « ＋ Nouveau bon de livraison », « ✓ Valider ▾ », « [PDF] ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Motifs de réclamation → registre configurable.
