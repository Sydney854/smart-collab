# purchase.receipt-list — Liste des bons de livraison et avoirs

**Statut : proposée**

| | |
|---|---|
| Application | `purchase` |
| Écran | `receipt-list` |
| Lot | 4 |
| Prototype | Achats › Liste BL / Avoirs (v105) |
| Fonction de rendu | `ASUBP.listebl → ldRender(listebl) détail` ; `PAGES.achats → ASUBP.listebl` |

## Captures de référence

- [06_Achats/02_listebl.png](../../03_SOURCES_REFERENCE/prototype/captures/06_Achats/02_listebl.png) — Par défaut (v105)
- [06_Achats/03_listebl_detail-bl.png](../../03_SOURCES_REFERENCE/prototype/captures/06_Achats/03_listebl_detail-bl.png) — Détail d'un BL (panneau divisé) (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de filtres : site, type de document, fournisseur ; actualiser, Modifier, Imprimer, Supprimer.
- Liste à panneau divisé : type, RI, fournisseur, date, n° référence, totaux HT/TTC, % marque, écoulé, statut ; tri par en-tête ; clic droit = menu Excel / Imprimer / Colonnes.
- État « détail BL » : panneau du bas avec les lignes (stock avant, quantité, prix, variation, prix de vente, % marque, vendu, reste, écoulé, total), lien Catalogue, clic article = fiche produit.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Site | liste | non | valeurs du référentiel (1 entrées dans le prototype, données du client fondateur non reprises) |
| Type doc. | liste | non | choix : TOUS, BON DE LIVRAISON, AVOIR |
| Fournisseur | liste | non | valeurs du référentiel (133 entrées dans le prototype, données du client fondateur non reprises) |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **TYPE · RI · FOURNISSEUR · DATE DU DOCUMENT · N° RÉFÉRENCE · TOTAL HT · TOTAL TTC · % MQ. · ÉCOULÉ · STATUT** — tri au clic sur 10 en-tête(s) ; ligne cliquable → sélectionne la ligne et ouvre le détail dans le panneau du bas (`ldSel`)
- **PRODUITS · IDENTIFIANT · STOCK AV. · QTÉ BL · P. ACHAT HT · VARIATION PA · P. VENTE TTC · % MQ. · VENDU · RESTE · ÉCOULÉ · TOTAL LIGNE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouveau bon de livraison | **aucune action dans le prototype — à câbler** |
| ✎ Modifier | **aucune action dans le prototype — à câbler** |
| 🗑 Supprimer | **aucune action dans le prototype — à câbler** |
| 🖨 Imprimer | ouvre la fenêtre d'aperçu avant impression (`ldImpr`) |
| ◫ Catalogue | ouvre l'écran ou la fiche correspondante (`versLotProduits`) |
| ✕ | ferme le panneau de détail (`ldClose`) |
| (nom ou n° cliquable dans la ligne) | ouvre l'écran ou la fiche correspondante (`openWin`) |

Autres gestes : clic droit sur la liste : menu Excel / Imprimer / Colonnes / Couleur de fond ; glisser-déposer : réordonner les sous-onglets ou les cartes (8 éléments déplaçables).

## États

- **Détail d'un BL (panneau divisé)** : voir capture `06_Achats/03_listebl_detail-bl.png` et la zone correspondante ci-dessus.
- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- purchase.receipt.view
- purchase.receipt.print
- purchase.receipt.export
- purchase.receipt.cancel (avec motif)

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-GEN-04, EF-GEN-02, EF-BI-01, EF-ACH-01 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Liste en cartes : fournisseur, n° et date, total TTC, statut ; détail en plein écran.
- Filtres dans « Filtres ».

## À ne pas reproduire

- « Supprimer » proposé sur un document validé : interdit par EF-GEN-02 ; proposer « Annuler » avec motif (document inverse ou statut), jamais de suppression physique.
- Boutons Modifier et Supprimer sans effet.
- Listes de sites écrites en dur et différentes d'un écran à l'autre (ici une partie seulement des sites). Smart Collab alimente toutes les listes de sites depuis le référentiel des sites, filtré par le périmètre de l'utilisateur.
- Relevé automatique des éléments sans effet sur les captures : « ＋ Nouveau bon de livraison », « ✎ Modifier », « 🗑 Supprimer ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Indicateur « écoulé » (part vendue du lot) → indicateur configurable.
- Fournisseurs et montants : données du client fondateur.
