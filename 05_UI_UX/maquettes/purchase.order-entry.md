# purchase.order-entry — Commande fournisseur — saisie

**Statut : proposée**

| | |
|---|---|
| Application | `purchase` |
| Écran | `order-entry` |
| Lot | 4 |
| Prototype | Achats › Passer une commande (v105) |
| Fonction de rendu | `PAGES.achats → ASUBP.commande` |

## Captures de référence

- [06_Achats/09_commande.png](../../03_SOURCES_REFERENCE/prototype/captures/06_Achats/09_commande.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Bandeau : Valider la commande, Annuler.
- En-tête : fournisseur, date.
- Ligne d'ajout ; tableau : produit, identifiant, famille, quantité, prix d'achat prévu, total.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Fournisseur | liste | non | valeurs du référentiel (151 entrées dans le prototype, données RUTHY'S non reprises) |
| Date commande | date | non |  |
| Code, mot-clé ou description… | texte | non |  |
| (sans libellé) | texte | non |  |
| (sans libellé) | nombre | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **PRODUITS · IDENTIFIANT · FAMILLE · QTÉ · P. ACHAT PRÉVU · TOTAL LIGNE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouveau bon de livraison | **aucune action dans le prototype — à câbler** |
| ✓ Valider la commande | valide le document (contrôle des champs obligatoires, puis enregistrement) (`cmdValider`) |
| ⊘ Annuler | abandonne la saisie en cours après confirmation (`cmdReset`) |
| ＋ | ajoute un élément (ligne, fiche ou fenêtre de création) (`cmdAdd`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (8 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucune ligne. Recherche un article ci-dessus, ou pré-remplis depuis Réapprovisionnement. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Champs désactivés et indicateur sur le bouton de validation pendant l'enregistrement (double clic impossible). Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Message sous le champ fautif ; erreur serveur : `Toast` rouge, saisie conservée, bouton Réessayer.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- purchase.order.create
- purchase.order.validate (seuil de montant)

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-ACH-01, EF-ACH-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Formulaire plein écran ; lignes en cartes ; Valider en barre fixe.

## À ne pas reproduire

- Validation muette : quand un champ obligatoire manque, le bouton ne fait rien et n'affiche aucun message. Smart Collab signale le champ manquant (texte d'erreur sous le champ, bouton désactivé avec infobulle). (Valider sans fournisseur)
- Boutons sans effet dans le prototype : « ＋ Nouveau bon de livraison ». Tout bouton affiché fait quelque chose, sinon il n'est pas affiché.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Numérotation CMD-xxxx → réglage de numérotation.
