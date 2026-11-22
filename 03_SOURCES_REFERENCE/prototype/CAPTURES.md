# Captures du prototype RUTHY'S ERP

Références visuelles pour Smart Collab (voir `../README.md`, section 1) : disposition, composants, parcours, états imprimables. Les **données** affichées sont celles du prototype RUTHY'S et ne sont pas à reprendre.

## Sources

| Version | Fichier | Dépôt `Sydney854/Projet-ERP` | Captures |
|---|---|---|---|
| v105 | `RUTHYS_ERP_v105.html` | branche `claude/new-session-7aw883`, commit `fbb2fe7` | 116 |
| v107 | `versions/RUTHYS_ERP_v107_paie_etats.html` | branche `integration-v99-v107`, commit `4d12401` | 11 |
| v99 | `versions/RUTHYS_ERP_v99_inventaire_lot_par_lot.html` | branche `integration-v99-v107`, commit `4d12401` | 3 |

## Méthode

- Chromium piloté par Playwright, **vue ordinateur uniquement : 1440 px de large, page entière**.
- Navigation par les fonctions de l'application (`go()`, `setRHSub()`, `ldSel()`, `ouvrirPV()`…) ou par un vrai clic droit pour les menus contextuels. Chaque capture repart d'un chargement neuf du fichier.
- **Graphiques** : Chart.js 4.4.1 (même version que le CDN du prototype) installé en local avec npm ; la requête vers `cdnjs.cloudflare.com` est interceptée et servie depuis ce fichier, animations désactivées.
- **Contrôle des graphiques** : 46 graphiques sur 18 captures ; pour chacun, présence d'une instance Chart.js, de données non nulles et de pixels dessinés — **0 graphique vide**.
- **Rangement** : un dossier numéroté par module, dans l'ordre du menu du prototype (`captures/01_Tableau-de-bord/`, `captures/02_Caisse/`…). Dans chaque dossier, les captures sont numérotées : chaque sous-onglet d'abord, suivi de ses états (`01_direction.png`, `02_direction_nouvel-indicateur.png`…).
- Nommage : `NN_<sous-onglet>.png` (état par défaut) et `NN_<sous-onglet>_<etat>.png` ; le préfixe `v107-` / `v99-` dans l'état indique un autre prototype source que v105. Le prototype n'a qu'un thème (clair).

## Index (130 captures)

| Module | Sous-onglet | État | Fonction de rendu | Version | Fichier | Notes |
|---|---|---|---|---|---|---|
| Tableau de bord (`dash`) | Direction (`direction`) | Par défaut | `PAGES.dash → DSUBP.direction` | v105 | [01_Tableau-de-bord/01_direction.png](captures/01_Tableau-de-bord/01_direction.png) |  |
| Tableau de bord (`dash`) | Financier (`financier`) | Par défaut | `PAGES.dash → DSUBP.financier` | v105 | [01_Tableau-de-bord/03_financier.png](captures/01_Tableau-de-bord/03_financier.png) |  |
| Tableau de bord (`dash`) | Commercial (`commercial`) | Par défaut | `PAGES.dash → DSUBP.commercial` | v105 | [01_Tableau-de-bord/06_commercial.png](captures/01_Tableau-de-bord/06_commercial.png) |  |
| Tableau de bord (`dash`) | Opérations (`operations`) | Par défaut | `PAGES.dash → DSUBP.operations` | v105 | [01_Tableau-de-bord/07_operations.png](captures/01_Tableau-de-bord/07_operations.png) |  |
| Tableau de bord (`dash`) | Financier (`financier`) | Menu de personnalisation — clic droit sur un graphique | `chartMenuOpen() → chartMenuHtml()` | v105 | [01_Tableau-de-bord/04_financier_menu-clic-droit-graphique.png](captures/01_Tableau-de-bord/04_financier_menu-clic-droit-graphique.png) |  |
| Tableau de bord (`dash`) | Financier (`financier`) | Menu de personnalisation — clic droit sur une carte KPI | `kpiMenuOpen() → kpiMenuHtml()` | v105 | [01_Tableau-de-bord/05_financier_menu-clic-droit-kpi.png](captures/01_Tableau-de-bord/05_financier_menu-clic-droit-kpi.png) |  |
| Tableau de bord (`dash`) | Direction (`direction`) | Formulaire Nouvel indicateur | `dashNewOpen() → formulaire Nouvel indicateur` | v105 | [01_Tableau-de-bord/02_direction_nouvel-indicateur.png](captures/01_Tableau-de-bord/02_direction_nouvel-indicateur.png) |  |
| Caisse (`caisse`) | Caisse (`caisse`) | Par défaut | `PAGES.caisse → KSUBP.caisse` | v105 | [02_Caisse/01_caisse.png](captures/02_Caisse/01_caisse.png) |  |
| Caisse (`caisse`) | En attente (`attente`) | Par défaut | `PAGES.caisse → KSUBP.attente` | v105 | [02_Caisse/03_attente.png](captures/02_Caisse/03_attente.png) |  |
| Caisse (`caisse`) | Liste des ventes (`ventes`) | Par défaut | `PAGES.caisse → KSUBP.ventes` | v105 | [02_Caisse/04_ventes.png](captures/02_Caisse/04_ventes.png) |  |
| Caisse (`caisse`) | Liste des avoirs (`avoirs`) | Par défaut | `PAGES.caisse → KSUBP.avoirs` | v105 | [02_Caisse/08_avoirs.png](captures/02_Caisse/08_avoirs.png) |  |
| Caisse (`caisse`) | Caisse (`caisse`) | Caisse — panier rempli (3 lignes, remise, client) | `KSUBP.caisse (CS.lignes)` | v105 | [02_Caisse/02_caisse_panier-rempli.png](captures/02_Caisse/02_caisse_panier-rempli.png) |  |
| Caisse (`caisse`) | Liste des ventes (`ventes`) | Vente validée — détail dans la liste | `KSUBP.ventes → ldRender(listeventesK) → ventDetail()` | v105 | [02_Caisse/05_ventes_vente-validee.png](captures/02_Caisse/05_ventes_vente-validee.png) |  |
| Caisse (`caisse`) | Liste des ventes (`ventes`) | Ticket — fenêtre d'aperçu | `ldImpr(listeventesK, vente, doc) → fenetrePV()` | v105 | [02_Caisse/06_ventes_ticket.png](captures/02_Caisse/06_ventes_ticket.png) | [3] |
| Caisse (`caisse`) | Liste des ventes (`ventes`) | Menu clic droit de la liste (sous-menu Imprimer) | `ldMenu(listeventesK) → ldMenuHtml()` | v105 | [02_Caisse/07_ventes_menu-clic-droit-liste.png](captures/02_Caisse/07_ventes_menu-clic-droit-liste.png) |  |
| Ventes (`ventes`) | Vue globale (`global`) | Par défaut | `PAGES.ventes → VSUBP.global` | v105 | [03_Ventes/01_global.png](captures/03_Ventes/01_global.png) |  |
| Ventes (`ventes`) | Dépôt-vente (`dv`) | Par défaut | `PAGES.ventes → VSUBP.dv` | v105 | [03_Ventes/02_dv.png](captures/03_Ventes/02_dv.png) |  |
| Ventes (`ventes`) | Détail mensuel (`detail`) | Par défaut | `PAGES.ventes → VSUBP.detail` | v105 | [03_Ventes/03_detail.png](captures/03_Ventes/03_detail.png) |  |
| Boutiques / Sites (`sites`) | — | Par défaut | `PAGES.sites` | v105 | [04_Boutiques-Sites/01_sites.png](captures/04_Boutiques-Sites/01_sites.png) |  |
| Produits & Stocks (`prod`) | Vue d'ensemble (`apercu`) | Par défaut | `PAGES.prod → PSUBP.apercu` | v105 | [05_Produits-Stocks/01_apercu.png](captures/05_Produits-Stocks/01_apercu.png) |  |
| Produits & Stocks (`prod`) | Catalogue (`catalogue`) | Par défaut | `PAGES.prod → PSUBP.catalogue` | v105 | [05_Produits-Stocks/02_catalogue.png](captures/05_Produits-Stocks/02_catalogue.png) |  |
| Produits & Stocks (`prod`) | Étiquettes (`etiquettes`) | Par défaut | `PAGES.prod → PSUBP.etiquettes` | v105 | [05_Produits-Stocks/14_etiquettes.png](captures/05_Produits-Stocks/14_etiquettes.png) |  |
| Produits & Stocks (`prod`) | Catalogue (`catalogue`) | Fiche produit — onglet Identité | `PSUBP.catalogue → FICHE.ident` | v105 | [05_Produits-Stocks/03_catalogue_fiche-ident.png](captures/05_Produits-Stocks/03_catalogue_fiche-ident.png) |  |
| Produits & Stocks (`prod`) | Catalogue (`catalogue`) | Fiche produit — onglet Prix & marges | `PSUBP.catalogue → FICHE.prix` | v105 | [05_Produits-Stocks/04_catalogue_fiche-prix.png](captures/05_Produits-Stocks/04_catalogue_fiche-prix.png) |  |
| Produits & Stocks (`prod`) | Catalogue (`catalogue`) | Fiche produit — onglet Déclinaisons | `PSUBP.catalogue → FICHE.decl` | v105 | [05_Produits-Stocks/05_catalogue_fiche-decl.png](captures/05_Produits-Stocks/05_catalogue_fiche-decl.png) |  |
| Produits & Stocks (`prod`) | Catalogue (`catalogue`) | Fiche produit — onglet Stock par site | `PSUBP.catalogue → FICHE.stock` | v105 | [05_Produits-Stocks/06_catalogue_fiche-stock.png](captures/05_Produits-Stocks/06_catalogue_fiche-stock.png) |  |
| Produits & Stocks (`prod`) | Catalogue (`catalogue`) | Fiche produit — onglet Fournisseur & appro | `PSUBP.catalogue → FICHE.frn` | v105 | [05_Produits-Stocks/07_catalogue_fiche-frn.png](captures/05_Produits-Stocks/07_catalogue_fiche-frn.png) |  |
| Produits & Stocks (`prod`) | Catalogue (`catalogue`) | Fiche produit — onglet Historique | `PSUBP.catalogue → FICHE.hist` | v105 | [05_Produits-Stocks/08_catalogue_fiche-hist.png](captures/05_Produits-Stocks/08_catalogue_fiche-hist.png) |  |
| Produits & Stocks (`prod`) | Catalogue (`catalogue`) | Fiche produit — onglet Documents | `PSUBP.catalogue → FICHE.doc` | v105 | [05_Produits-Stocks/09_catalogue_fiche-doc.png](captures/05_Produits-Stocks/09_catalogue_fiche-doc.png) |  |
| Produits & Stocks (`prod`) | Catalogue (`catalogue`) | Création d'un produit | `PSUBP.catalogue → FICHE_NEW (togNew)` | v105 | [05_Produits-Stocks/10_catalogue_creation-produit.png](captures/05_Produits-Stocks/10_catalogue_creation-produit.png) |  |
| Produits & Stocks (`prod`) | Catalogue (`catalogue`) | Nouveau catalogue (bascule) | `PSUBP.catalogue → catalogueNew()` | v105 | [05_Produits-Stocks/11_catalogue_nouveau-catalogue.png](captures/05_Produits-Stocks/11_catalogue_nouveau-catalogue.png) |  |
| Produits & Stocks (`prod`) | Catalogue (`catalogue`) | Fenêtre flottante — fiche produit | `openWin(produit) → WTYPES.produit` | v105 | [05_Produits-Stocks/12_catalogue_fenetre-produit.png](captures/05_Produits-Stocks/12_catalogue_fenetre-produit.png) |  |
| Produits & Stocks (`prod`) | Catalogue (`catalogue`) | Liste vide (recherche sans résultat) | `PSUBP.catalogue (recherche sans résultat)` | v105 | [05_Produits-Stocks/13_catalogue_liste-vide.png](captures/05_Produits-Stocks/13_catalogue_liste-vide.png) |  |
| Achats (`achats`) | Bon de livraison (`bl`) | Par défaut | `PAGES.achats → ASUBP.bl` | v105 | [06_Achats/01_bl.png](captures/06_Achats/01_bl.png) |  |
| Achats (`achats`) | Liste BL / Avoirs (`listebl`) | Par défaut | `PAGES.achats → ASUBP.listebl` | v105 | [06_Achats/02_listebl.png](captures/06_Achats/02_listebl.png) |  |
| Achats (`achats`) | Réclamation (`recl`) | Par défaut | `PAGES.achats → ASUBP.recl` | v105 | [06_Achats/07_recl.png](captures/06_Achats/07_recl.png) |  |
| Achats (`achats`) | Liste des réclamations (`listerecl`) | Par défaut | `PAGES.achats → ASUBP.listerecl` | v105 | [06_Achats/08_listerecl.png](captures/06_Achats/08_listerecl.png) |  |
| Achats (`achats`) | Passer une commande (`commande`) | Par défaut | `PAGES.achats → ASUBP.commande` | v105 | [06_Achats/09_commande.png](captures/06_Achats/09_commande.png) |  |
| Achats (`achats`) | Liste des commandes (`listecommandes`) | Par défaut | `PAGES.achats → ASUBP.listecommandes` | v105 | [06_Achats/10_listecommandes.png](captures/06_Achats/10_listecommandes.png) |  |
| Achats (`achats`) | Suivi des approvisionnements (`suivi`) | Par défaut | `PAGES.achats → ASUBP.suivi` | v105 | [06_Achats/11_suivi.png](captures/06_Achats/11_suivi.png) |  |
| Achats (`achats`) | Réapprovisionnement (`reappro`) | Par défaut | `PAGES.achats → ASUBP.reappro` | v105 | [06_Achats/13_reappro.png](captures/06_Achats/13_reappro.png) |  |
| Achats (`achats`) | Liste BL / Avoirs (`listebl`) | Détail d'un BL (panneau divisé) | `ASUBP.listebl → ldRender(listebl) détail` | v105 | [06_Achats/03_listebl_detail-bl.png](captures/06_Achats/03_listebl_detail-bl.png) |  |
| Achats (`achats`) | Liste BL / Avoirs (`listebl`) | Fenêtre d'aperçu — onglet Aperçu (bon d'entrée) | `ldImpr(listebl, bl, doc) → fenetrePV() onglet Aperçu` | v105 | [06_Achats/04_listebl_apercu.png](captures/06_Achats/04_listebl_apercu.png) |  |
| Achats (`achats`) | Liste BL / Avoirs (`listebl`) | Fenêtre d'aperçu — onglet Imprimer | `fenetrePV() onglet Imprimer → rubImprimer` | v105 | [06_Achats/05_listebl_apercu-imprimer.png](captures/06_Achats/05_listebl_apercu-imprimer.png) |  |
| Achats (`achats`) | Liste BL / Avoirs (`listebl`) | Fenêtre d'aperçu — onglet Exporter | `fenetrePV() onglet Exporter → rubExporter` | v105 | [06_Achats/06_listebl_apercu-exporter.png](captures/06_Achats/06_listebl_apercu-exporter.png) |  |
| Achats (`achats`) | Suivi des approvisionnements (`suivi`) | Fiche lot de réception | `openLot() → ficheLot()` | v105 | [06_Achats/12_suivi_fiche-lot.png](captures/06_Achats/12_suivi_fiche-lot.png) |  |
| Fournisseurs (`frn`) | Répertoire fournisseurs (`liste`) | Par défaut | `PAGES.frn → FSUBP.liste` | v105 | [07_Fournisseurs/01_liste.png](captures/07_Fournisseurs/01_liste.png) |  |
| Fournisseurs (`frn`) | Fiche fournisseur (`fiche`) | Par défaut | `PAGES.frn → FSUBP.fiche` | v105 | [07_Fournisseurs/03_fiche.png](captures/07_Fournisseurs/03_fiche.png) |  |
| Fournisseurs (`frn`) | Performance comparée (`perf`) | Par défaut | `PAGES.frn → FSUBP.perf` | v105 | [07_Fournisseurs/04_perf.png](captures/07_Fournisseurs/04_perf.png) |  |
| Fournisseurs (`frn`) | Répertoire fournisseurs (`liste`) | Détail fournisseur (panneau divisé) | `FSUBP.liste → ldRender(frnListe) détail` | v105 | [07_Fournisseurs/02_liste_detail-fournisseur.png](captures/07_Fournisseurs/02_liste_detail-fournisseur.png) |  |
| Transferts de stock (`trf`) | Nouveau transfert (`saisie`) | Par défaut | `PAGES.trf → TSUBP.saisie` | v105 | [08_Transferts-de-stock/01_saisie.png](captures/08_Transferts-de-stock/01_saisie.png) |  |
| Transferts de stock (`trf`) | Flux entre sites (`flux`) | Par défaut | `PAGES.trf → TSUBP.flux` | v105 | [08_Transferts-de-stock/02_flux.png](captures/08_Transferts-de-stock/02_flux.png) |  |
| Transferts de stock (`trf`) | Bons de transfert (`bons`) | Par défaut | `PAGES.trf → TSUBP.bons` | v105 | [08_Transferts-de-stock/03_bons.png](captures/08_Transferts-de-stock/03_bons.png) |  |
| Transferts de stock (`trf`) | Traçabilité du stock (`trace`) | Par défaut | `PAGES.trf → TSUBP.trace` | v105 | [08_Transferts-de-stock/05_trace.png](captures/08_Transferts-de-stock/05_trace.png) |  |
| Transferts de stock (`trf`) | Écarts de réception (`ecarts`) | Par défaut | `PAGES.trf → TSUBP.ecarts` | v105 | [08_Transferts-de-stock/06_ecarts.png](captures/08_Transferts-de-stock/06_ecarts.png) |  |
| Transferts de stock (`trf`) | Bons de transfert (`bons`) | Fiche bon de transfert | `openBon() → ficheBon()` | v105 | [08_Transferts-de-stock/04_bons_fiche-bon.png](captures/08_Transferts-de-stock/04_bons_fiche-bon.png) |  |
| Inventaire (`inv`) | Saisie (`saisie`) | Par défaut | `PAGES.inv → ISUBP.saisie` | v105 | [09_Inventaire/01_saisie.png](captures/09_Inventaire/01_saisie.png) |  |
| Inventaire (`inv`) | Revue & validation (`revue`) | Par défaut | `PAGES.inv → ISUBP.revue` | v105 | [09_Inventaire/05_revue.png](captures/09_Inventaire/05_revue.png) |  |
| Inventaire (`inv`) | Corrections de stock (`correction`) | Par défaut | `PAGES.inv → ISUBP.correction` | v105 | [09_Inventaire/06_correction.png](captures/09_Inventaire/06_correction.png) |  |
| Inventaire (`inv`) | Historique (`historique`) | Par défaut | `PAGES.inv → ISUBP.historique` | v105 | [09_Inventaire/07_historique.png](captures/09_Inventaire/07_historique.png) |  |
| Inventaire (`inv`) | Saisie (`saisie`) | Aucun lot | `ISUBP.saisie → lotsPanel()` | v99 | [09_Inventaire/02_saisie_v99-aucun-lot.png](captures/09_Inventaire/02_saisie_v99-aucun-lot.png) |  |
| Inventaire (`inv`) | Saisie (`saisie`) | Un lot créé (non sélectionné) | `lotsPanel() (iLot → iLotCreate)` | v99 | [09_Inventaire/03_saisie_v99-lot-cree.png](captures/09_Inventaire/03_saisie_v99-lot-cree.png) |  |
| Inventaire (`inv`) | Saisie (`saisie`) | Un lot sélectionné (saisie ouverte) | `lotsPanel() → iLotSel() → saisie du lot` | v99 | [09_Inventaire/04_saisie_v99-lot-selectionne.png](captures/09_Inventaire/04_saisie_v99-lot-selectionne.png) |  |
| Trésorerie & Comptabilité (`treso`) | C.A. journalier (`journalier`) | Par défaut | `PAGES.treso → YSUBP.journalier` | v105 | [10_Tresorerie-Comptabilite/01_journalier.png](captures/10_Tresorerie-Comptabilite/01_journalier.png) |  |
| Trésorerie & Comptabilité (`treso`) | Décaissements (`decaiss`) | Par défaut | `PAGES.treso → YSUBP.decaiss` | v105 | [10_Tresorerie-Comptabilite/02_decaiss.png](captures/10_Tresorerie-Comptabilite/02_decaiss.png) |  |
| Trésorerie & Comptabilité (`treso`) | Règlements fournisseurs (`regl`) | Par défaut | `PAGES.treso → YSUBP.regl` | v105 | [10_Tresorerie-Comptabilite/03_regl.png](captures/10_Tresorerie-Comptabilite/03_regl.png) |  |
| Trésorerie & Comptabilité (`treso`) | Comptes et enveloppes (`comptes`) | Par défaut | `PAGES.treso → YSUBP.comptes` | v105 | [10_Tresorerie-Comptabilite/06_comptes.png](captures/10_Tresorerie-Comptabilite/06_comptes.png) |  |
| Trésorerie & Comptabilité (`treso`) | Statistiques (`stats`) | Par défaut | `PAGES.treso → YSUBP.stats` | v105 | [10_Tresorerie-Comptabilite/07_stats.png](captures/10_Tresorerie-Comptabilite/07_stats.png) |  |
| Trésorerie & Comptabilité (`treso`) | Règlements fournisseurs (`regl`) | Détail règlement (panneau divisé) | `YSUBP.regl → ldRender(regl) détail` | v105 | [10_Tresorerie-Comptabilite/04_regl_detail-reglement.png](captures/10_Tresorerie-Comptabilite/04_regl_detail-reglement.png) |  |
| Trésorerie & Comptabilité (`treso`) | Règlements fournisseurs (`regl`) | Sélecteur de couleur de sélection ouvert | `ROWSEL / rowSelPicker()` | v105 | [10_Tresorerie-Comptabilite/05_regl_selecteur-couleur-ligne-ouvert.png](captures/10_Tresorerie-Comptabilite/05_regl_selecteur-couleur-ligne-ouvert.png) | [2] |
| Clients & CRM (`crm`) | Vue d'ensemble (`vue`) | Par défaut | `PAGES.crm → CSUBP.vue` | v105 | [11_Clients-CRM/01_vue.png](captures/11_Clients-CRM/01_vue.png) |  |
| Clients & CRM (`crm`) | Clients (`clients`) | Par défaut | `PAGES.crm → CSUBP.clients` | v105 | [11_Clients-CRM/02_clients.png](captures/11_Clients-CRM/02_clients.png) |  |
| Clients & CRM (`crm`) | Fiche 360° (`fiche`) | Par défaut | `PAGES.crm → CSUBP.fiche` | v105 | [11_Clients-CRM/03_fiche.png](captures/11_Clients-CRM/03_fiche.png) |  |
| Clients & CRM (`crm`) | Segmentation (`seg`) | Par défaut | `PAGES.crm → CSUBP.seg` | v105 | [11_Clients-CRM/04_seg.png](captures/11_Clients-CRM/04_seg.png) |  |
| Clients & CRM (`crm`) | Relances & tâches (`relance`) | Par défaut | `PAGES.crm → CSUBP.relance` | v105 | [11_Clients-CRM/05_relance.png](captures/11_Clients-CRM/05_relance.png) |  |
| Clients & CRM (`crm`) | Analyses CRM (`ana`) | Par défaut | `PAGES.crm → CSUBP.ana` | v105 | [11_Clients-CRM/06_ana.png](captures/11_Clients-CRM/06_ana.png) |  |
| RH & Paie (`rh`) | Employés (`employes`) | Par défaut | `PAGES.rh → RHSUBP.employes` | v105 | [12_RH-Paie/01_employes.png](captures/12_RH-Paie/01_employes.png) |  |
| RH & Paie (`rh`) | Départements (`departements`) | Par défaut | `PAGES.rh → RHSUBP.departements` | v105 | [12_RH-Paie/08_departements.png](captures/12_RH-Paie/08_departements.png) |  |
| RH & Paie (`rh`) | Désignations / Rôles (`designations`) | Par défaut | `PAGES.rh → RHSUBP.designations` | v105 | [12_RH-Paie/11_designations.png](captures/12_RH-Paie/11_designations.png) |  |
| RH & Paie (`rh`) | Présence (`presence`) | Par défaut | `PAGES.rh → RHSUBP.presence` | v105 | [12_RH-Paie/13_presence.png](captures/12_RH-Paie/13_presence.png) |  |
| RH & Paie (`rh`) | Employés (`employes`) | Vue mosaïque | `RHSUBP.employes → rhMosaique()` | v105 | [12_RH-Paie/02_employes_mosaique.png](captures/12_RH-Paie/02_employes_mosaique.png) |  |
| RH & Paie (`rh`) | Employés (`employes`) | Menu ⋮ d'une ligne | `rhListe() → rhActMenu()` | v105 | [12_RH-Paie/03_employes_menu-action.png](captures/12_RH-Paie/03_employes_menu-action.png) |  |
| RH & Paie (`rh`) | Employés (`employes`) | Fiche employé — onglet À propos | `rhFichePage() → rhFicheTab(apropos)` | v105 | [12_RH-Paie/04_employes_fiche-apropos.png](captures/12_RH-Paie/04_employes_fiche-apropos.png) |  |
| RH & Paie (`rh`) | Employés (`employes`) | Formulaire Ajouter un employé | `rhFormPage() (rhOuvrirAjout)` | v105 | [12_RH-Paie/05_employes_formulaire-ajout.png](captures/12_RH-Paie/05_employes_formulaire-ajout.png) |  |
| RH & Paie (`rh`) | Départements (`departements`) | Popup Ajouter | `dptModalHtml()` | v105 | [12_RH-Paie/09_departements_popup-ajout.png](captures/12_RH-Paie/09_departements_popup-ajout.png) |  |
| RH & Paie (`rh`) | Départements (`departements`) | Menu ⋮ d'une ligne | `RHSUBP.departements → dptActMenu()` | v105 | [12_RH-Paie/10_departements_menu-action.png](captures/12_RH-Paie/10_departements_menu-action.png) |  |
| RH & Paie (`rh`) | Désignations / Rôles (`designations`) | Popup Ajouter | `dsgModalHtml()` | v105 | [12_RH-Paie/12_designations_popup-ajout.png](captures/12_RH-Paie/12_designations_popup-ajout.png) |  |
| RH & Paie (`rh`) | Présence (`presence`) | Popup Ajouter | `ptgModalHtml()` | v105 | [12_RH-Paie/14_presence_popup-ajout.png](captures/12_RH-Paie/14_presence_popup-ajout.png) |  |
| RH & Paie (`rh`) | Paie (`paie`) | Liste vide (au chargement) | `RHSUBP.paie` | v107 | [12_RH-Paie/15_paie_v107-liste-vide.png](captures/12_RH-Paie/15_paie_v107-liste-vide.png) |  |
| RH & Paie (`rh`) | Paie (`paie`) | Liste (paie du mois générée) | `RHSUBP.paie (paieGenererMois)` | v107 | [12_RH-Paie/16_paie_v107-liste.png](captures/12_RH-Paie/16_paie_v107-liste.png) | [4] |
| RH & Paie (`rh`) | Paie (`paie`) | Formulaire Ajouter la paie | `paieModalHtml() (paieOuvrirAjout)` | v107 | [12_RH-Paie/17_paie_v107-formulaire-ajout.png](captures/12_RH-Paie/17_paie_v107-formulaire-ajout.png) | [4] |
| RH & Paie (`rh`) | Paie (`paie`) | Menu ⋮ d'une ligne | `RHSUBP.paie → paieActMenu()` | v107 | [12_RH-Paie/18_paie_v107-menu-action.png](captures/12_RH-Paie/18_paie_v107-menu-action.png) | [4] [5] |
| RH & Paie (`rh`) | Paie (`paie`) | Fenêtre d'aperçu d'un bulletin | `paieImprimer() → paieBulletinHtml() → fenetrePV()` | v107 | [12_RH-Paie/19_paie_v107-apercu-bulletin.png](captures/12_RH-Paie/19_paie_v107-apercu-bulletin.png) | [4] |
| RH & Paie (`rh`) | Employés (`employes`) | Fiche employé, onglet À propos | `rhFichePage() → rhFicheTab(apropos)` | v107 | [12_RH-Paie/06_employes_v107-fiche-apropos.png](captures/12_RH-Paie/06_employes_v107-fiche-apropos.png) | [4] |
| RH & Paie (`rh`) | Employés (`employes`) | Fiche employé, onglet Paie | `rhFichePage() → paieFicheTab()` | v107 | [12_RH-Paie/07_employes_v107-fiche-paie.png](captures/12_RH-Paie/07_employes_v107-fiche-paie.png) | [4] |
| Marketing (`mkt`) | — | Par défaut | `PAGES.mkt` | v105 | [13_Marketing/01_mkt.png](captures/13_Marketing/01_mkt.png) |  |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | Par défaut | `PAGES.rap → RSUBP.etats` | v105 | [14_Rapports-Analyses/01_etats.png](captures/14_Rapports-Analyses/01_etats.png) | [1] |
| Rapports & Analyses (`rap`) | États planifiés (`plan`) | Par défaut | `PAGES.rap → RSUBP.plan` | v105 | [14_Rapports-Analyses/19_plan.png](captures/14_Rapports-Analyses/19_plan.png) |  |
| Rapports & Analyses (`rap`) | Analyses stratégiques (`bi`) | Par défaut | `PAGES.rap → RSUBP.bi` | v105 | [14_Rapports-Analyses/20_bi.png](captures/14_Rapports-Analyses/20_bi.png) |  |
| Rapports & Analyses (`rap`) | Qualité des données (`qual`) | Par défaut | `PAGES.rap → RSUBP.qual` | v105 | [14_Rapports-Analyses/21_qual.png](captures/14_Rapports-Analyses/21_qual.png) |  |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | État du domaine « Gestion de stocks » | `RSUBP.etats → setDomEt(stock)` | v105 | [14_Rapports-Analyses/02_etats_domaine-gestion-stocks.png](captures/14_Rapports-Analyses/02_etats_domaine-gestion-stocks.png) | [1] [6] |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | Aperçu imprimable — « Gestion de stocks » | `setDomEt(stock) → aperçu → fenetrePV()` | v105 | [14_Rapports-Analyses/03_etats_domaine-gestion-stocks-apercu.png](captures/14_Rapports-Analyses/03_etats_domaine-gestion-stocks-apercu.png) | [1] |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | État du domaine « États comptables » | `RSUBP.etats → setDomEt(compta)` | v105 | [14_Rapports-Analyses/04_etats_domaine-etats-comptables.png](captures/14_Rapports-Analyses/04_etats_domaine-etats-comptables.png) | [1] [6] |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | Aperçu imprimable — « États comptables » | `setDomEt(compta) → aperçu → fenetrePV()` | v105 | [14_Rapports-Analyses/05_etats_domaine-etats-comptables-apercu.png](captures/14_Rapports-Analyses/05_etats_domaine-etats-comptables-apercu.png) | [1] |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | État du domaine « États client » | `RSUBP.etats → setDomEt(client)` | v105 | [14_Rapports-Analyses/06_etats_domaine-etats-client.png](captures/14_Rapports-Analyses/06_etats_domaine-etats-client.png) | [1] [6] |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | Aperçu imprimable — « États client » | `setDomEt(client) → aperçu → fenetrePV()` | v105 | [14_Rapports-Analyses/07_etats_domaine-etats-client-apercu.png](captures/14_Rapports-Analyses/07_etats_domaine-etats-client-apercu.png) | [1] |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | État du domaine « État des transferts » | `RSUBP.etats → setDomEt(transferts)` | v105 | [14_Rapports-Analyses/08_etats_domaine-etat-transferts.png](captures/14_Rapports-Analyses/08_etats_domaine-etat-transferts.png) | [1] [6] |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | Aperçu imprimable — « État des transferts » | `setDomEt(transferts) → aperçu → fenetrePV()` | v105 | [14_Rapports-Analyses/09_etats_domaine-etat-transferts-apercu.png](captures/14_Rapports-Analyses/09_etats_domaine-etat-transferts-apercu.png) | [1] |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | État du domaine « Pilotage » | `RSUBP.etats → setDomEt(pilotage)` | v105 | [14_Rapports-Analyses/10_etats_domaine-pilotage.png](captures/14_Rapports-Analyses/10_etats_domaine-pilotage.png) | [1] [6] |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | Aperçu imprimable — « Pilotage » | `setDomEt(pilotage) → aperçu → fenetrePV()` | v105 | [14_Rapports-Analyses/11_etats_domaine-pilotage-apercu.png](captures/14_Rapports-Analyses/11_etats_domaine-pilotage-apercu.png) | [1] |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | État du domaine « États personnel (verrouillé) » | `RSUBP.etats → setDomEt(personnel)` | v105 | [14_Rapports-Analyses/12_etats_domaine-etats-personnel.png](captures/14_Rapports-Analyses/12_etats_domaine-etats-personnel.png) | [1] [6] |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | État du domaine « États trésorerie (verrouillé) » | `RSUBP.etats → setDomEt(treso)` | v105 | [14_Rapports-Analyses/13_etats_domaine-etats-tresorerie.png](captures/14_Rapports-Analyses/13_etats_domaine-etats-tresorerie.png) | [1] [6] |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | Sélecteur de thème ouvert | `THEMES / setTheme() (liste déroulante 🎨)` | v105 | [14_Rapports-Analyses/14_etats_selecteur-theme-ouvert.png](captures/14_Rapports-Analyses/14_etats_selecteur-theme-ouvert.png) | [1] [2] |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | États RH : Bulletin de paie | `RSUBP.etats → paieEtatPanel() (bulletin)` | v107 | [14_Rapports-Analyses/15_etats_v107-etats-rh-bulletin.png](captures/14_Rapports-Analyses/15_etats_v107-etats-rh-bulletin.png) | [1] [4] [6] |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | États RH : Bulletin de paie, aperçu | `paieEtatPanel() → fenetrePV()` | v107 | [14_Rapports-Analyses/16_etats_v107-etats-rh-bulletin-apercu.png](captures/14_Rapports-Analyses/16_etats_v107-etats-rh-bulletin-apercu.png) | [1] [4] |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | États RH : Journal de paie | `RSUBP.etats → paieEtatPanel() (journal)` | v107 | [14_Rapports-Analyses/17_etats_v107-etats-rh-journal.png](captures/14_Rapports-Analyses/17_etats_v107-etats-rh-journal.png) | [1] [4] [6] |
| Rapports & Analyses (`rap`) | Centre d'impression d'états (`etats`) | États RH : Journal de paie, aperçu | `paieEtatPanel() → fenetrePV()` | v107 | [14_Rapports-Analyses/18_etats_v107-etats-rh-journal-apercu.png](captures/14_Rapports-Analyses/18_etats_v107-etats-rh-journal-apercu.png) | [1] [4] |
| Centre de contrôle (`ctrl`) | Alertes actives (`alertes`) | Par défaut | `PAGES.ctrl → XSUBP.alertes` | v105 | [15_Centre-de-controle/01_alertes.png](captures/15_Centre-de-controle/01_alertes.png) |  |
| Centre de contrôle (`ctrl`) | Journal des opérations (`ops`) | Par défaut | `PAGES.ctrl → XSUBP.ops` | v105 | [15_Centre-de-controle/02_ops.png](captures/15_Centre-de-controle/02_ops.png) |  |
| Centre de contrôle (`ctrl`) | Journal des accès (`acces`) | Par défaut | `PAGES.ctrl → XSUBP.acces` | v105 | [15_Centre-de-controle/03_acces.png](captures/15_Centre-de-controle/03_acces.png) |  |
| Centre de contrôle (`ctrl`) | Caisse (`caisse`) | Par défaut | `PAGES.ctrl → XSUBP.caisse` | v105 | [15_Centre-de-controle/04_caisse.png](captures/15_Centre-de-controle/04_caisse.png) |  |
| Centre de contrôle (`ctrl`) | Bon de livraison (`bl`) | Par défaut | `PAGES.ctrl → XSUBP.bl` | v105 | [15_Centre-de-controle/05_bl.png](captures/15_Centre-de-controle/05_bl.png) |  |
| Centre de contrôle (`ctrl`) | Réclamations (`recl`) | Par défaut | `PAGES.ctrl → XSUBP.recl` | v105 | [15_Centre-de-controle/06_recl.png](captures/15_Centre-de-controle/06_recl.png) |  |
| Centre de contrôle (`ctrl`) | Corrections de stock (`corr`) | Par défaut | `PAGES.ctrl → XSUBP.corr` | v105 | [15_Centre-de-controle/07_corr.png](captures/15_Centre-de-controle/07_corr.png) |  |
| Centre de contrôle (`ctrl`) | Produits en alerte (`alerte`) | Par défaut | `PAGES.ctrl → XSUBP.alerte` | v105 | [15_Centre-de-controle/08_alerte.png](captures/15_Centre-de-controle/08_alerte.png) |  |
| Paramètres (`param`) | Comptes collaborateurs (`comptes`) | Par défaut | `PAGES.param → GSUBP.comptes` | v105 | [16_Parametres/01_comptes.png](captures/16_Parametres/01_comptes.png) |  |
| Paramètres (`param`) | Profils et droits (`profils`) | Par défaut | `PAGES.param → GSUBP.profils` | v105 | [16_Parametres/02_profils.png](captures/16_Parametres/02_profils.png) |  |
| Paramètres (`param`) | Paramètres des données (`donnees`) | Par défaut | `PAGES.param → GSUBP.donnees` | v105 | [16_Parametres/03_donnees.png](captures/16_Parametres/03_donnees.png) |  |
| Paramètres (`param`) | Studio ERP (`studio`) | Par défaut | `PAGES.param → GSUBP.studio` | v105 | [16_Parametres/04_studio.png](captures/16_Parametres/04_studio.png) |  |
| Paramètres (`param`) | Paramètres société (`societe`) | Par défaut | `PAGES.param → GSUBP.societe` | v105 | [16_Parametres/05_societe.png](captures/16_Parametres/05_societe.png) |  |

## Notes

1. **Centre d'impression : thème par défaut appliqué avant la capture** (`setTheme(THEME)`, ce que fait le sélecteur 🎨). Un `#` égaré dans le CSS du prototype (ligne 1651 de v105, 1652 de v107) fait ignorer la règle `:root{--et-p:…}` au chargement : sans cela, le domaine sélectionné et l'en-tête de l'état s'affichent blanc sur blanc. Défaut du prototype, non corrigé ici.
2. **Liste déroulante native** : Chromium sans interface ne dessine pas la liste ouverte d'un `<select>` ; elle est reproduite par une liste superposée sous le sélecteur, avec les mêmes options.
3. **Pas de mise en page de ticket en v105** : « Imprimer le(s) ticket(s) » ouvre la fenêtre d'aperçu avec un texte provisoire (« la mise en page suit le même modèle que le bon d'entrée »). La capture montre ce qui existe.
4. **Bulletins de paie** générés avec le bouton « Générer la paie de <mois> » de l'application, à partir des salaires déjà présents dans v107 (8 collaborateurs). Aucune donnée ajoutée pour la capture.
5. Le tableau de paie (11 colonnes) est plus large que l'écran à 1440 px : il a été défilé horizontalement jusqu'à la colonne Actes pour montrer le menu ⋮.
6. Après un clic sur un domaine, la barre des domaines revient au début : le domaine actif peut être hors champ (comportement réel du prototype).
