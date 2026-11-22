# studio.print-preview — Fenêtre d'aperçu, impression et export

**Statut : proposée**

| | |
|---|---|
| Application | `studio` |
| Écran | `print-preview` |
| Lot | 6 |
| Prototype | Fenêtre commune (ouverte ici depuis Achats › Liste BL) (v105) |
| Fonction de rendu | `fenetrePV() onglet Exporter → rubExporter` ; `fenetrePV() onglet Imprimer → rubImprimer` ; `ldImpr(listebl, bl, doc) → fenetrePV() onglet Aperçu` |

## Captures de référence

- [06_Achats/04_listebl_apercu.png](../../03_SOURCES_REFERENCE/prototype/captures/06_Achats/04_listebl_apercu.png) — Fenêtre d'aperçu — onglet Aperçu (bon d'entrée) (v105)
- [06_Achats/05_listebl_apercu-imprimer.png](../../03_SOURCES_REFERENCE/prototype/captures/06_Achats/05_listebl_apercu-imprimer.png) — Fenêtre d'aperçu — onglet Imprimer (v105)
- [06_Achats/06_listebl_apercu-exporter.png](../../03_SOURCES_REFERENCE/prototype/captures/06_Achats/06_listebl_apercu-exporter.png) — Fenêtre d'aperçu — onglet Exporter (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de titre : nom de l'état, zoom, fermer.
- Onglets : Aperçu, Imprimer, Exporter, Rechercher, Annoter.
- Aperçu : zoom (100 %, largeur, page entière, deux pages), modes (déplacement, sélection, mire, annotation, zoom lasso), plein écran, volet miniatures, navigation de pages.
- Imprimer : imprimante, couleur / noir et blanc, recto-verso, pages (toutes, courante, plage), copies, assemblées, « Lancer l'impression ».
- Exporter : duplicata, Word, Excel, PDF, HTML, XML, e-mail avec contenu intégré, e-mail avec PDF attaché.
- Document : en-tête société, titre de l'état, critères, tableau, pied (édité le, par, page x / y).

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Site | liste | non | valeurs du référentiel (1 entrées dans le prototype, données RUTHY'S non reprises) |
| Type doc. | liste | non | choix : TOUS, BON DE LIVRAISON, AVOIR |
| Fournisseur | liste | non | valeurs du référentiel (133 entrées dans le prototype, données RUTHY'S non reprises) |
| (sans libellé) | texte | non |  |
| (sans libellé) | liste | non | choix : 🖨 Microsoft Print to PDF — Prêt, 🖨 HP LaserJet Pro M404 — Prêt, 🖨 EPSON L3150 Series — Impression en cours, 🧾 Star TSP100 Cutter (TSP143) — Prêt · ticket, 🖨 Microsoft XPS Document Writer — Prêt |
| Couleur | choix | non |  |
| Noir et blanc | choix | non |  |
| Recto-verso | case à cocher | non |  |
| Toutes les pages | choix | non |  |
| Page courante | choix | non |  |
| Pages | choix | non |  |
| Pages | texte | non | désactivé ; exemple « 1-10, 25-30, 35 » |
| Copies | nombre | non |  |
| Assemblées | case à cocher | non | désactivé |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **TYPE · RI · FOURNISSEUR · DATE DU DOCUMENT · N° RÉFÉRENCE · TOTAL HT · TOTAL TTC · % MQ. · ÉCOULÉ · STATUT** — tri au clic sur 10 en-tête(s) ; ligne cliquable → sélectionne la ligne et ouvre le détail dans le panneau du bas (`ldSel`)
- **PRODUITS · IDENTIFIANT · STOCK AV. · QTÉ BL · P. ACHAT HT · VARIATION PA · P. VENTE TTC · % MQ. · VENDU · RESTE · ÉCOULÉ · TOTAL LIGNE**
- **RANG · IDENTIFIANT · PRODUIT · STOCK AV. · Q. ENTRÉE · P. VTE TTC · % M · VAL. MRG · P. ACHA HT · MONT. TTC**

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
| 👁 Aperçu, 🖨 Imprimer, ↗ Exporter … (5 éléments) | change d'onglet de la fenêtre (Aperçu, Imprimer, Exporter…) (`pvTab`) |
| ▤ 100 %, Largeur, Page entière … (6 éléments) | change le zoom (`pvZoom`) |
| ✋ Déplacement, 🅃 Sélection, ⊕ Mire … (5 éléments) | change l'outil de pointeur (`pvMode`) |
| ⤢ Plein écran | passe en plein écran (`pvFull`) |
| ▥ Volet miniatures | affiche ou masque les miniatures (`pvMini`) |
| ⏫, 🔼, 🔽 … (5 éléments) | change de page (`pvPage`) |
| (élément de la liste — nom propre au prototype) | **aucune action dans le prototype — à câbler** |
| 🖨 Lancer l'impression | lance l'impression (`pvLancer`) |
| 1 | change de page (`pvPage`) |
| x2 Duplicata, W Word, X Excel … (6 éléments) | exporte la liste (`pvExport`) |
| ✉ Email avec contenu intégré | prépare l'envoi par e-mail (simulé) (`pvMail`) |
| 📎 Email avec PDF attaché | prépare l'envoi par e-mail (simulé) (`pvMail`) |

Autres gestes : clic droit sur la liste : menu Excel / Imprimer / Colonnes / Couleur de fond ; glisser-déposer : réordonner les sous-onglets ou les cartes (8 éléments déplaçables).

## États

- **Fenêtre d'aperçu — onglet Imprimer** : voir capture `06_Achats/05_listebl_apercu-imprimer.png` et la zone correspondante ci-dessus.
- **Fenêtre d'aperçu — onglet Exporter** : voir capture `06_Achats/06_listebl_apercu-exporter.png` et la zone correspondante ci-dessus.
- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Indicateur « Préparation du document… » dans la zone d'aperçu. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Échec de génération : message dans la fenêtre avec Réessayer ; l'export reste désactivé.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- <application>.<document>.print
- <application>.<document>.export

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-BI-01, EF-POS-04, EF-RH-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Fenêtre plein écran ; onglets en barre du bas ; miniatures masquées ; zoom par pincement.
- Exporter / Imprimer en feuille du bas.

## À ne pas reproduire

- Liste d'imprimantes fictive écrite en dur et « Propriétés de l'imprimante » sans effet : utiliser l'impression du navigateur et les imprimantes configurées (EF-POS-07).
- Exports simulés (message « le fichier serait produit ici ») sauf CSV : exports réels dans les 7 formats d'EF-BI-01 (PDF, Excel, Word, CSV, image, PowerPoint, e-mail) — l'image et PowerPoint manquent, HTML et XML sont en trop.
- Onglets Rechercher et Annoter : à confirmer ou retirer.
- Relevé automatique des éléments sans effet sur les captures : « ＋ Nouveau bon de livraison », « ✎ Modifier », « 🗑 Supprimer », « (élément de la liste — nom propre au prototype) ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- En-tête du document (raison sociale, RCCM, NCC) : données RUTHY'S → Paramètres société.
