# inventory.labels — Étiquettes produits

**Statut : proposée**

| | |
|---|---|
| Application | `inventory` |
| Écran | `labels` |
| Lot | 2 |
| Prototype | Produits & Stocks › Étiquettes (v105) |
| Fonction de rendu | `PAGES.prod → PSUBP.etiquettes` |

## Captures de référence

- [05_Produits-Stocks/14_etiquettes.png](../../03_SOURCES_REFERENCE/prototype/captures/05_Produits-Stocks/14_etiquettes.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période (inutile ici).
- Paramètres de planche : étiquette rayon, 1re étiquette, marges haute et gauche.
- Ligne d'ajout : produit, identifiant, prix, quantité, lot, péremption, ＋.
- File d'impression (tableau) + boutons Imprimer, Produits, Initialiser, Aperçu & impression.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Étiquette rayon | case à cocher | non |  |
| 1ère étiquette : Marquage | nombre | non |  |
| Marge Haute | nombre | non |  |
| Marge Gauche | nombre | non |  |
| (sans libellé) | texte | non |  |
| (sans libellé) | nombre | non |  |
| — | texte | non | désactivé |
| (sans libellé) | date | non | désactivé |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **PRODUITS · IDENTIFIANT · P. VENTE TTC · QTÉ · N° DE LOT · PÉREMPTION**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouveau produit | ouvre le formulaire de création (`togNew`) |
| ◔ Vue d'ensemble | change de sous-onglet ou de vue (`setSub`) |
| ◫ Catalogue | change de sous-onglet ou de vue (`setSub`) |
| ▤ Étiquettes | change de sous-onglet ou de vue (`setSub`) |
| 🖨 Imprimer | ouvre la fenêtre d'aperçu avant impression (`apercuEtiquettes`) |
| 👁 Aperçu & impression | ouvre la fenêtre d'aperçu avant impression (`apercuEtiquettes`) |
| ▤ Produits | ouvre le sélecteur de produits (`selMode`) |
| ⊘ Initialiser l'interface | abandonne la saisie en cours après confirmation (`etqReset`) |
| ✕ | change la valeur choisie (`etqSet`) |
| ＋ Ajouter | ajoute un élément (ligne, fiche ou fenêtre de création) (`etqAdd`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (3 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucun produit dans la file d'impression. Sélectionne un produit ci-dessus et clique Ajouter. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Champs désactivés et indicateur sur le bouton de validation pendant l'enregistrement (double clic impossible). Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Message sous le champ fautif ; erreur serveur : `Toast` rouge, saisie conservée, bouton Réessayer.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- inventory.label.print

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-STK-01, EF-BI-01, §7 Modèles de documents (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Paramètres de planche en accordéon ; file d'impression en cartes ; bouton Aperçu en barre fixe.

## À ne pas reproduire

- Barre de période affichée sur un écran qui n'en a pas besoin.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Format de planche (65 étiquettes) → modèle de document configurable.
