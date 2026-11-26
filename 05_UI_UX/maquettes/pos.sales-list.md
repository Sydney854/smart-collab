# pos.sales-list — Caisse — liste des ventes et ticket

**Statut : proposée**

| | |
|---|---|
| Application | `pos` |
| Écran | `sales-list` |
| Lot | 3 |
| Prototype | Caisse › Liste des ventes (v105) |
| Fonction de rendu | `KSUBP.ventes → ldRender(listeventesK) → ventDetail()` ; `PAGES.caisse → KSUBP.ventes` ; `ldImpr(listeventesK, vente, doc) → fenetrePV()` ; `ldMenu(listeventesK) → ldMenuHtml()` |

## Captures de référence

- [02_Caisse/04_ventes.png](../../03_SOURCES_REFERENCE/prototype/captures/02_Caisse/04_ventes.png) — Par défaut (v105)
- [02_Caisse/05_ventes_vente-validee.png](../../03_SOURCES_REFERENCE/prototype/captures/02_Caisse/05_ventes_vente-validee.png) — Vente validée — détail dans la liste (v105)
- [02_Caisse/06_ventes_ticket.png](../../03_SOURCES_REFERENCE/prototype/captures/02_Caisse/06_ventes_ticket.png) — Ticket — fenêtre d'aperçu (v105)
- [02_Caisse/07_ventes_menu-clic-droit-liste.png](../../03_SOURCES_REFERENCE/prototype/captures/02_Caisse/07_ventes_menu-clic-droit-liste.png) — Menu clic droit de la liste (sous-menu Imprimer) (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de filtres : site, opérateur, règlement ; boutons Modifier, Imprimer, Excel.
- Synthèses : répartition par mode de règlement, performance par vendeur.
- Liste à panneau divisé (`DataList`) : opérateur, date, heure, n° de vente, site, client, règlement, lignes, montant, dépôt-vente ; tri par en-tête.
- État « vente validée » : panneau de détail en bas (articles, quantités, prix, total, dépôt-vente), clic sur un article = fiche produit en fenêtre.
- État « menu clic droit » : Exporter vers Excel, Imprimer ▸ (tickets, paysage, lignes sélectionnées, par famille, récapitulatifs jour / mode / opérateur), Sélectionner les colonnes ▸, Couleur de fond ▸.
- État « ticket » : fenêtre d'aperçu (voir studio.print-preview) avec le document du ticket.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Site | liste | non | valeurs du référentiel (3 entrées dans le prototype, données du client fondateur non reprises) |
| Opérateur | liste | non | valeurs du référentiel (5 entrées dans le prototype, données du client fondateur non reprises) |
| Règlement | liste | non | choix : TOUS, Espèce, Carte bancaire, Wave, Orange Money, MTN Money |
| (sans libellé) | texte | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **VENDEUR · VENTES · CA · PANIER MOYEN**
- **OPÉRATEUR · DATE · HEURE · N° VENTE · SITE · CLIENT · RÈGLEMENT · LIGNES · MONTANT · DÉPÔT-VENTE** — tri au clic sur 10 en-tête(s) ; ligne cliquable → sélectionne la ligne et ouvre le détail dans le panneau du bas (`ldSel`)
- **PRODUIT · IDENTIFIANT · QTÉ · P. UNITAIRE · TOTAL LIGNE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ⇄ Décaissement | **aucune action dans le prototype — à câbler** |
| ✎ Modifier | **aucune action dans le prototype — à câbler** |
| 🖨 Imprimer | **aucune action dans le prototype — à câbler** |
| ↧ Excel | **aucune action dans le prototype — à câbler** |
| ✕ | ferme le panneau de détail (`ldClose`) |
| (nom ou n° cliquable dans la ligne) | ouvre l'écran ou la fiche correspondante (`openWin`) |
| 👁 Aperçu, 🖨 Imprimer, ↗ Exporter … (5 éléments) | change d'onglet de la fenêtre (Aperçu, Imprimer, Exporter…) (`pvTab`) |
| ▤ 100 %, Largeur, Page entière … (6 éléments) | change le zoom (`pvZoom`) |
| ✋ Déplacement, 🅃 Sélection, ⊕ Mire … (5 éléments) | change l'outil de pointeur (`pvMode`) |
| ⤢ Plein écran | passe en plein écran (`pvFull`) |
| ▥ Volet miniatures | affiche ou masque les miniatures (`pvMini`) |
| ⏫, 🔼, 🔽 … (5 éléments) | change de page (`pvPage`) |
| 🎨 Couleur de fond ▸ | **aucune action dans le prototype — à câbler** |
| 📗 Exporter la table vers Excel… | exporte la liste (`ldExcel`) |
| 🖨 Imprimer ▸ | change de sous-onglet ou de vue (`ldSub`) |
| ▦ Sélectionner les colonnes… ▸ | change de sous-onglet ou de vue (`ldSub`) |
| Imprimer le(s) ticket(s), Imprimer en paysage, Imprimer les lignes sélectionnées … (7 éléments) | ouvre la fenêtre d'aperçu avant impression (`ldImpr`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **Vente validée — détail dans la liste** : voir capture `02_Caisse/05_ventes_vente-validee.png` et la zone correspondante ci-dessus.
- **Ticket — fenêtre d'aperçu** : voir capture `02_Caisse/06_ventes_ticket.png` et la zone correspondante ci-dessus.
- **Menu clic droit de la liste (sous-menu Imprimer)** : voir capture `02_Caisse/07_ventes_menu-clic-droit-liste.png` et la zone correspondante ci-dessus.
- **Vide** : le prototype affiche « Aucune vente enregistrée dans cette session. Les 7 754 lignes de vente 2024 de tes fichiers sont analysées dans l'onglet Ventes ; cet écran affiche les encaisse » (et 1 autre(s) message(s)). Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Hors ligne : la liste montre les ventes de la session de l'appareil (marquées « en attente d'envoi ») ; l'impression du ticket fonctionne hors ligne ; le retour (EF-POS-05) demande une connexion.

## Droits nécessaires

- pos.sale.view (périmètre : son site ; tous sites pour le gérant)
- pos.sale.print
- pos.sale.export
- pos.sale.refund (retour depuis le ticket)

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-GEN-04, EF-POS-04, EF-POS-05, EF-BI-01, EF-GEN-02 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Liste en cartes : n° + heure, client, montant, mode de règlement ; badge dépôt-vente.
- Filtres repliés dans un bouton « Filtres ».
- Détail de la vente : plein écran avec bouton Retour.
- Menu clic droit : appui long, en feuille du bas.
- Synthèses : en accordéon fermé par défaut.

## À ne pas reproduire

- Note 3 de CAPTURES.md — « Imprimer le(s) ticket(s) » ouvre la fenêtre d'aperçu avec un texte provisoire, sans mise en page de ticket. Le modèle de ticket 80 mm et A4 est à maquetter (voir INVENTAIRE_ECRANS.md, À maquetter).
- Les entrées du menu Imprimer de cette liste ouvrent la fenêtre d'aperçu avec un gabarit vide (seul le bon d'entrée des achats a une vraie mise en page). Chaque document imprimable a un modèle (Studio, Modèles de documents).
- Liste des vendeurs écrite en dur, différente de la liste des collaborateurs (un nom n'existe pas dans RH). Smart Collab propose les utilisateurs actifs du site ayant le rôle adéquat. (filtre Opérateur)
- Listes de sites écrites en dur et différentes d'un écran à l'autre (ici une partie seulement des sites). Smart Collab alimente toutes les listes de sites depuis le référentiel des sites, filtré par le périmètre de l'utilisateur.
- Boutons Modifier, Imprimer et Excel de la barre de filtres sans effet ; « Modifier » une vente validée est de toute façon interdit (EF-GEN-05).
- Message vide qui parle des « fichiers » de l'utilisatrice (« Les 7 754 lignes de vente 2024 de tes fichiers… ») : texte d'état vide neutre.
- Relevé automatique des éléments sans effet sur les captures : « ⇄ Décaissement », « ✎ Modifier », « 🖨 Imprimer », « ↧ Excel », « 🎨 Couleur de fond ▸ ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Récapitulatifs par mode de règlement et par vendeur : modes de règlement du client fondateur → registre configurable.
- Données des ventes et des vendeurs : client fondateur.
