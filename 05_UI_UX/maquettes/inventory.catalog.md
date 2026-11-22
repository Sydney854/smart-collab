# inventory.catalog — Catalogue produits — liste

**Statut : proposée**

| | |
|---|---|
| Application | `inventory` |
| Écran | `catalog` |
| Lot | 2 |
| Prototype | Produits & Stocks › Catalogue (v105) |
| Fonction de rendu | `PAGES.prod → PSUBP.catalogue` ; `PSUBP.catalogue (recherche sans résultat)` ; `PSUBP.catalogue → catalogueNew()` |

## Captures de référence

- [05_Produits-Stocks/02_catalogue.png](../../03_SOURCES_REFERENCE/prototype/captures/05_Produits-Stocks/02_catalogue.png) — Par défaut (v105)
- [05_Produits-Stocks/11_catalogue_nouveau-catalogue.png](../../03_SOURCES_REFERENCE/prototype/captures/05_Produits-Stocks/11_catalogue_nouveau-catalogue.png) — Nouveau catalogue (bascule) (v105)
- [05_Produits-Stocks/13_catalogue_liste-vide.png](../../03_SOURCES_REFERENCE/prototype/captures/05_Produits-Stocks/13_catalogue_liste-vide.png) — Liste vide (recherche sans résultat) (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Catalogue par défaut : vues prédéfinies, recherche, famille, rotation, bascule liste / mosaïque, filtre par bon de livraison ; liste des produits (code, désignation, classe, badges dépôt-vente / dormant / alertes, stock) ; fiche à droite (voir inventory.product).
- État « nouveau catalogue » : barre d'outils pleine largeur (Imprimer ▾, Associer ▾, Activer/Désactiver, Nouveau, Modifier, Annuler, Supprimer, Recherche avancée), liste triable par code/désignation, colonne liste redimensionnable, fiche « Info. du produit » avec site et champs éditables, journal des mouvements.
- État « liste vide » : recherche sans résultat — message « Aucune référence ne correspond à ce filtre » et volet de droite « Sélectionne une référence ».

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| (sans libellé) | liste | non | valeurs du référentiel (17 entrées dans le prototype, données RUTHY'S non reprises) |
| Rechercher un code ou une désignation… | texte | non |  |
| RÉFÉRENCE | texte | non |  |
| DÉSIGNATION | texte | non |  |
| Rechercher une famille… | texte | non |  |
| PRIX D'ACHAT HT | nombre | non | exemple « 0 » |
| PRIX DE VENTE TTC | nombre | non | exemple « 0 » |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **DATE · NATURE · RÉFÉRENCE · QUANTITÉ · OPÉRATEUR · SITE** — ligne cliquable → ouvre l'écran du mouvement (réception, vente, correction, transfert) (`catnJournalGo`)

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
| ↩ Catalogue précédent | bascule entre l'ancien et le nouveau catalogue (`setCatV`) |
| ＋ Nouveau | ouvre le formulaire de création (`togNew`) |
| 🖨️ Imprimer | affiche / masque (`catPopToggle`) |
| 🔗 Associer | affiche / masque (`catPopToggle`) |
| ↻ Activer/Désactiver | affiche / masque (`catToggleActif`) |
| ✎ Modifier | valide les modifications en cours (`catModifierValider`) |
| Annuler | abandonne les modifications en cours (`catAnnulerEdit`) |
| Supprimer | supprime ou désactive l'élément (voir « À ne pas reproduire ») (`catSupprimer`) |
| 🔎 Rech. avancée | ouvre le formulaire de création (`raOpen`) |
| Tous, Achats (BL), Ventes … (5 éléments) | filtre la liste (`setJFilt`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (3 éléments déplaçables).

## États

- **Nouveau catalogue (bascule)** : voir capture `05_Produits-Stocks/11_catalogue_nouveau-catalogue.png` et la zone correspondante ci-dessus.
- **Liste vide (recherche sans résultat)** : voir capture `05_Produits-Stocks/13_catalogue_liste-vide.png` et la zone correspondante ci-dessus.
- **Vide** : le prototype affiche « non renseigné » (et 2 autre(s) message(s)). Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- inventory.product.view
- inventory.product.create
- inventory.product.update
- inventory.product.archive (pas de suppression)
- Prix d'achat masqué selon le rôle

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-STK-01, EF-STK-05, EF-GEN-04, EF-GEN-02 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Liste en cartes produit (photo, code, désignation, prix, stock, badges) ; fiche en plein écran.
- Filtres et vues repliés dans « Filtres » ; recherche toujours visible.
- Barre d'outils réduite à « Nouveau » + menu « ⋯ ».

## À ne pas reproduire

- Deux versions du catalogue coexistent (bouton « Nouveau catalogue » / « Catalogue précédent ») : Smart Collab n'en garde qu'une (la nouvelle disposition liste + fiche, à valider) sans bouton de bascule.
- « Supprimer » efface un produit pour la session : interdit (§2 interdits : pas de suppression physique d'un produit) — archivage seulement.
- Entrées « Associer » et une partie du menu Imprimer sans effet réel.
- Rafraîchissement complet de la page à chaque frappe dans la recherche (perte de focus corrigée à la main) : recherche sans rechargement.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- 17 vues prédéfinies (dormants, vendus sur un seul site, …) calculées avec des seuils RUTHY'S → vues enregistrées configurables.
- Familles, fournisseurs, codes produits : données RUTHY'S.
