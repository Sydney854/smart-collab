# inventory.product — Fiche produit (7 onglets) et fenêtre flottante

**Statut : proposée**

| | |
|---|---|
| Application | `inventory` |
| Écran | `product` |
| Lot | 2 |
| Prototype | Produits & Stocks › Catalogue › fiche (v105) |
| Fonction de rendu | `PSUBP.catalogue → FICHE.decl` ; `PSUBP.catalogue → FICHE.doc` ; `PSUBP.catalogue → FICHE.frn` ; `PSUBP.catalogue → FICHE.hist` ; `PSUBP.catalogue → FICHE.ident` ; `PSUBP.catalogue → FICHE.prix` ; `PSUBP.catalogue → FICHE.stock` ; `openWin(produit) → WTYPES.produit` |

## Captures de référence

- [05_Produits-Stocks/03_catalogue_fiche-ident.png](../../03_SOURCES_REFERENCE/prototype/captures/05_Produits-Stocks/03_catalogue_fiche-ident.png) — Fiche produit — onglet Identité (v105)
- [05_Produits-Stocks/04_catalogue_fiche-prix.png](../../03_SOURCES_REFERENCE/prototype/captures/05_Produits-Stocks/04_catalogue_fiche-prix.png) — Fiche produit — onglet Prix & marges (v105)
- [05_Produits-Stocks/05_catalogue_fiche-decl.png](../../03_SOURCES_REFERENCE/prototype/captures/05_Produits-Stocks/05_catalogue_fiche-decl.png) — Fiche produit — onglet Déclinaisons (v105)
- [05_Produits-Stocks/06_catalogue_fiche-stock.png](../../03_SOURCES_REFERENCE/prototype/captures/05_Produits-Stocks/06_catalogue_fiche-stock.png) — Fiche produit — onglet Stock par site (v105)
- [05_Produits-Stocks/07_catalogue_fiche-frn.png](../../03_SOURCES_REFERENCE/prototype/captures/05_Produits-Stocks/07_catalogue_fiche-frn.png) — Fiche produit — onglet Fournisseur & appro (v105)
- [05_Produits-Stocks/08_catalogue_fiche-hist.png](../../03_SOURCES_REFERENCE/prototype/captures/05_Produits-Stocks/08_catalogue_fiche-hist.png) — Fiche produit — onglet Historique (v105)
- [05_Produits-Stocks/09_catalogue_fiche-doc.png](../../03_SOURCES_REFERENCE/prototype/captures/05_Produits-Stocks/09_catalogue_fiche-doc.png) — Fiche produit — onglet Documents (v105)
- [05_Produits-Stocks/12_catalogue_fenetre-produit.png](../../03_SOURCES_REFERENCE/prototype/captures/05_Produits-Stocks/12_catalogue_fenetre-produit.png) — Fenêtre flottante — fiche produit (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- En-tête de fiche : photo, désignation, code, famille / sous-famille, badges (dépôt-vente, niveau de classement).
- 7 onglets (`EntityForm`) : Identité (champs + photo), Prix & marges, Déclinaisons (tableau déclinaison / prix / stock / code-barres), Stock par site (reçu, réexpédié, vendu, rotation, solde, quantité rayon, emplacement), Fournisseur & appro (liens Réceptions, Transferts), Historique (journal des mouvements), Documents.
- État « fenêtre flottante » : la même fiche dans une fenêtre déplaçable (réduire, agrandir, fermer), ouverte depuis une ligne de vente, de BL ou de liste.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| (sans libellé) | liste | non | valeurs du référentiel (17 entrées dans le prototype, données du client fondateur non reprises) |
| Rechercher un code ou une désignation… | texte | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **DÉCLINAISON · PRIX VENTE · STOCK · CODE-BARRES**
- **SITE · REÇU (TRANSFERTS) · RÉEXPÉDIÉ · VENDU · ROTATION · SOLDE MOUVEMENT · QTÉ RAYON · EMPLACEMENT**
- **TYPE · SITE · QUANTITÉ · SOURCE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

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
| (7 noms, n° ou codes cliquables dans la liste) | change d'onglet de la fiche (`setFT`) |
| ＋ Ajouter une photo | ouvre le choix d'un fichier (photo) (`document.getElementById`) |
| Éditer | **aucune action dans le prototype — à câbler** |
| ＋ Ajouter une déclinaison | **aucune action dans le prototype — à câbler** |
| 📦 Réceptions | ouvre l'écran ou la fiche correspondante (`versLots`) |
| ⇄ Transferts | ouvre l'écran ou la fiche correspondante (`versTransferts`) |
| Réduire | commande de la fenêtre (réduire, agrandir, fermer) (`event.stopPropagation`) |
| Agrandir | commande de la fenêtre (réduire, agrandir, fermer) (`event.stopPropagation`) |
| Fermer | commande de la fenêtre (réduire, agrandir, fermer) (`event.stopPropagation`) |
| Identité, Prix & marges, Déclinaisons … (7 éléments) | action du prototype `winTab` |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (3 éléments déplaçables).

## États

- **Fiche produit — onglet Prix & marges** : voir capture `05_Produits-Stocks/04_catalogue_fiche-prix.png` et la zone correspondante ci-dessus.
- **Fiche produit — onglet Déclinaisons** : voir capture `05_Produits-Stocks/05_catalogue_fiche-decl.png` et la zone correspondante ci-dessus.
- **Fiche produit — onglet Stock par site** : voir capture `05_Produits-Stocks/06_catalogue_fiche-stock.png` et la zone correspondante ci-dessus.
- **Fiche produit — onglet Fournisseur & appro** : voir capture `05_Produits-Stocks/07_catalogue_fiche-frn.png` et la zone correspondante ci-dessus.
- **Fiche produit — onglet Historique** : voir capture `05_Produits-Stocks/08_catalogue_fiche-hist.png` et la zone correspondante ci-dessus.
- **Fiche produit — onglet Documents** : voir capture `05_Produits-Stocks/09_catalogue_fiche-doc.png` et la zone correspondante ci-dessus.
- **Fenêtre flottante — fiche produit** : voir capture `05_Produits-Stocks/12_catalogue_fenetre-produit.png` et la zone correspondante ci-dessus.
- **Vide** : le prototype affiche « non renseigné » (et 1 autre(s) message(s)). Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de l'en-tête et de l'onglet actif. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Fiche introuvable ou droit manquant : `EmptyState` avec retour à la liste.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- inventory.product.view
- inventory.product.update
- Prix d'achat et marges masqués selon le rôle

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-STK-01, EF-STK-02, EF-STK-03, EF-GEN-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Onglets en barre défilante ; contenu plein écran.
- Fenêtre flottante remplacée par une page plein écran avec Retour.
- Tableaux d'onglet (stock par site, déclinaisons) en cartes.

## À ne pas reproduire

- Boutons « Éditer » et « ＋ Ajouter une déclinaison » sans effet.
- Stock par site : un site « non renseigné » faute de données ; afficher tous les lieux de stock du référentiel.
- Onglet Documents vide sans message d'état.
- Relevé automatique des éléments sans effet sur les captures : « Éditer », « ＋ Ajouter une déclinaison ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Niveaux de classement et badges calculés avec des seuils du client fondateur → seuils configurables.
- Produits, prix, fournisseurs : données du client fondateur.
