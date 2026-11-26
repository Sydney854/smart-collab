# inventory.adjustments — Corrections de stock

**Statut : proposée**

| | |
|---|---|
| Application | `inventory` |
| Écran | `adjustments` |
| Lot | 4 |
| Prototype | Inventaire › Corrections de stock (v105) |
| Fonction de rendu | `PAGES.inv → ISUBP.correction` |

## Captures de référence

- [09_Inventaire/06_correction.png](../../03_SOURCES_REFERENCE/prototype/captures/09_Inventaire/06_correction.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- En-tête : « vendeur », site, stock, date, motif obligatoire, commentaire.
- Ligne d'ajout : article, identifiant, + ou −, ＋.
- Tableau : produit, identifiant, quantité corrigée, PRMP, prix de vente, impact achat, impact vente.
- Valider / Annuler / Produits.
- Carte « Corrections enregistrées cette session ».

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 2 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Vendeur | liste | non | valeurs du référentiel (4 entrées dans le prototype, données du client fondateur non reprises) |
| Site | liste | non | valeurs du référentiel (2 entrées dans le prototype, données du client fondateur non reprises) |
| Stock | liste | non | choix : RAYON, RÉSERVE |
| Date | date | non |  |
| Motif | liste | oui | valeurs du référentiel (10 entrées dans le prototype, données du client fondateur non reprises) |
| Commentaire | texte | non |  |
| Code, mot-clé ou description… | texte | non |  |
| (sans libellé) | texte | non |  |
| + ou − | nombre | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **PRODUITS · IDENTIFIANT · QTÉ CORRIGÉE · PRMP ACHAT HT · P. VENTE TTC · IMPACT ACHAT · IMPACT VENTE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouvel inventaire | abandonne la saisie en cours après confirmation (`iReset`) |
| ✓ Valider | valide le document (contrôle des champs obligatoires, puis enregistrement) (`crValider`) |
| ⊘ Annuler | abandonne la saisie en cours après confirmation (`crReset`) |
| ▤ Produits | ouvre le sélecteur de produits (`selMode`) |
| ＋ | ajoute un élément (ligne, fiche ou fenêtre de création) (`crAdd`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucune ligne de correction. » (et 1 autre(s) message(s)). Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Champs désactivés et indicateur sur le bouton de validation pendant l'enregistrement (double clic impossible). Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Message sous le champ fautif ; erreur serveur : `Toast` rouge, saisie conservée, bouton Réessayer.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- inventory.adjustment.create
- inventory.adjustment.validate (seuil de valeur)

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-STK-02, EF-GEN-01, EF-GEN-03, EF-CTL-01 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Formulaire en plein écran ; lignes en cartes ; Valider en barre fixe.

## À ne pas reproduire

- Validation muette : quand un champ obligatoire manque, le bouton ne fait rien et n'affiche aucun message. Smart Collab signale le champ manquant (texte d'erreur sous le champ, bouton désactivé avec infobulle).
- Champ « Vendeur » sur une correction de stock : c'est l'auteur (utilisateur connecté, non modifiable).
- Listes de sites écrites en dur et différentes d'un écran à l'autre (ici une partie seulement des sites). Smart Collab alimente toutes les listes de sites depuis le référentiel des sites, filtré par le périmètre de l'utilisateur.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Motifs de correction → registre configurable.
