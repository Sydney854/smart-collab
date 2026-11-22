# inventory.product-create — Création d'un produit

**Statut : proposée**

| | |
|---|---|
| Application | `inventory` |
| Écran | `product-create` |
| Lot | 2 |
| Prototype | Produits & Stocks › Nouveau produit (v105) |
| Fonction de rendu | `PSUBP.catalogue → FICHE_NEW (togNew)` |

## Captures de référence

- [05_Produits-Stocks/10_catalogue_creation-produit.png](../../03_SOURCES_REFERENCE/prototype/captures/05_Produits-Stocks/10_catalogue_creation-produit.png) — Création d'un produit (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- La fiche produit vide et éditable (même modèle que la fiche) : désignation, référence (proposée), fournisseur, famille, sous-famille, genre, mode d'approvisionnement (achat ferme / dépôt-vente), photo.
- Barre « Annuler / Créer la fiche » ; message « désignation et fournisseur requis ».

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| (sans libellé) | liste | non | valeurs du référentiel (17 entrées dans le prototype, données RUTHY'S non reprises) |
| Rechercher un code ou une désignation… | texte | non |  |
| DÉSIGNATION | texte | non | exemple « Ex. ROBE LONGUE PAGNE BLEU T/L » |
| RÉFÉRENCE | texte | non | exemple « générée automatiquement » |
| FOURNISSEUR | texte | non | exemple « Rechercher un fournisseur… » |
| FAMILLE | texte | non | exemple « Rechercher une famille… » |
| SOUS-FAMILLE | texte | non | exemple « Rechercher une sous-famille… » |
| GENRE | liste | non | choix : —, Homme, Femme, Enfant, Mixte |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

Pas de tableau de données (cartes, graphiques ou formulaire).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ✨ Nouveau catalogue | bascule entre l'ancien et le nouveau catalogue (`setCatV`) |
| ＋ Nouveau produit | ouvre le formulaire de création (`togNew`) |
| ◔ Vue d'ensemble | change de sous-onglet ou de vue (`setSub`) |
| ◫ Catalogue | change de sous-onglet ou de vue (`setSub`) |
| ▤ Étiquettes | change de sous-onglet ou de vue (`setSub`) |
| ☰ Liste | bascule liste / mosaïque (`setMode`) |
| ▦ Mosaïque | bascule liste / mosaïque (`setMode`) |
| 📦 Filtrer par bon de livraison 422 sur la période ▾ | déplie ou replie un filtre (`togBL`) |
| (nom ou n° cliquable dans la ligne) | ouvre l'écran ou la fiche correspondante (`selP`) |
| ✕ Annuler | ajoute un élément (ligne, fiche ou fenêtre de création) (`catAnnulerCreer`) |
| ✓ Créer la fiche | ajoute un élément (ligne, fiche ou fenêtre de création) (`catCreerValider`) |
| (7 noms, n° ou codes cliquables dans la liste) | change d'onglet de la fiche (`setFT`) |
| ＋ Ajouter une photo | ouvre le choix d'un fichier (photo) (`document.getElementById`) |
| Achat ferme | valide les modifications en cours (`catEditSet`) |
| Dépôt-vente | valide les modifications en cours (`catEditSet`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (3 éléments déplaçables).

## États

- **Vide** : le prototype affiche « — désignation et fournisseur requis » (et 1 autre(s) message(s)). Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Champs désactivés et indicateur sur le bouton de validation pendant l'enregistrement (double clic impossible). Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Message sous le champ fautif ; erreur serveur : `Toast` rouge, saisie conservée, bouton Réessayer.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- inventory.product.create

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-STK-01, EF-GEN-03, §7 Numérotation, Champs personnalisés (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Formulaire plein écran, un champ par ligne ; Annuler / Créer en barre fixe en bas.

## À ne pas reproduire

- Champs obligatoires non marqués (seul un texte gris le dit) : astérisque et message par champ.
- Validation muette : quand un champ obligatoire manque, le bouton ne fait rien et n'affiche aucun message. Smart Collab signale le champ manquant (texte d'erreur sous le champ, bouton désactivé avec infobulle).
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Mode d'approvisionnement « dépôt-vente » et genre (Homme/Femme/Enfant/Mixte) : attributs RUTHY'S → champs personnalisés / attributs configurables.
- Référence proposée selon un format RUTHY'S → règle de numérotation.
