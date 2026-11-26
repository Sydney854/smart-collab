# studio.print-centre — Centre d'impression d'états

**Statut : proposée**

| | |
|---|---|
| Application | `studio` |
| Écran | `print-centre` |
| Lot | 6 |
| Prototype | Rapports & Analyses › Centre d'impression d'états (v105) |
| Fonction de rendu | `PAGES.rap → RSUBP.etats` ; `RSUBP.etats → setDomEt(client)` ; `RSUBP.etats → setDomEt(compta)` ; `RSUBP.etats → setDomEt(personnel)` ; `RSUBP.etats → setDomEt(pilotage)` ; `RSUBP.etats → setDomEt(stock)` ; `RSUBP.etats → setDomEt(transferts)` ; `RSUBP.etats → setDomEt(treso)` ; `THEMES / setTheme() (liste déroulante 🎨)` ; `setDomEt(client) → aperçu → fenetrePV()` ; `setDomEt(compta) → aperçu → fenetrePV()` ; `setDomEt(pilotage) → aperçu → fenetrePV()` ; `setDomEt(stock) → aperçu → fenetrePV()` ; `setDomEt(transferts) → aperçu → fenetrePV()` |

## Captures de référence

- [14_Rapports-Analyses/01_etats.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/01_etats.png) — Par défaut (v105)
- [14_Rapports-Analyses/02_etats_domaine-gestion-stocks.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/02_etats_domaine-gestion-stocks.png) — État du domaine « Gestion de stocks » (v105)
- [14_Rapports-Analyses/03_etats_domaine-gestion-stocks-apercu.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/03_etats_domaine-gestion-stocks-apercu.png) — Aperçu imprimable — « Gestion de stocks » (v105)
- [14_Rapports-Analyses/04_etats_domaine-etats-comptables.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/04_etats_domaine-etats-comptables.png) — État du domaine « États comptables » (v105)
- [14_Rapports-Analyses/05_etats_domaine-etats-comptables-apercu.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/05_etats_domaine-etats-comptables-apercu.png) — Aperçu imprimable — « États comptables » (v105)
- [14_Rapports-Analyses/06_etats_domaine-etats-client.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/06_etats_domaine-etats-client.png) — État du domaine « États client » (v105)
- [14_Rapports-Analyses/07_etats_domaine-etats-client-apercu.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/07_etats_domaine-etats-client-apercu.png) — Aperçu imprimable — « États client » (v105)
- [14_Rapports-Analyses/08_etats_domaine-etat-transferts.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/08_etats_domaine-etat-transferts.png) — État du domaine « État des transferts » (v105)
- [14_Rapports-Analyses/09_etats_domaine-etat-transferts-apercu.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/09_etats_domaine-etat-transferts-apercu.png) — Aperçu imprimable — « État des transferts » (v105)
- [14_Rapports-Analyses/10_etats_domaine-pilotage.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/10_etats_domaine-pilotage.png) — État du domaine « Pilotage » (v105)
- [14_Rapports-Analyses/11_etats_domaine-pilotage-apercu.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/11_etats_domaine-pilotage-apercu.png) — Aperçu imprimable — « Pilotage » (v105)
- [14_Rapports-Analyses/12_etats_domaine-etats-personnel.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/12_etats_domaine-etats-personnel.png) — État du domaine « États personnel (verrouillé) » (v105)
- [14_Rapports-Analyses/13_etats_domaine-etats-tresorerie.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/13_etats_domaine-etats-tresorerie.png) — État du domaine « États trésorerie (verrouillé) » (v105)
- [14_Rapports-Analyses/14_etats_selecteur-theme-ouvert.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/14_etats_selecteur-theme-ouvert.png) — Sélecteur de thème ouvert (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Titre, sélecteur de thème du centre d'impression (🎨), sous-onglets.
- Colonne gauche « États disponibles » : domaines en cartes défilantes (gestion de stocks, états comptables, états client, état des transferts, pilotage, états personnel / RH, états trésorerie), recherche, liste des états du domaine (favoris ★ en stock).
- Colonne droite « Détermination des critères » : blocs numérotés qui s'activent selon l'état (période, décomposition, nature d'approvisionnement, stock, regroupement + contenu du critère) ; bouton « Imprimer l'état sélectionné ».
- États « domaine » : un par domaine ; domaines verrouillés (module non construit) avec message.
- États « aperçu » : la fenêtre d'aperçu avec le document de l'état (listing, journal des ventes, listing client, transferts, tableau de bord direction).
- État « sélecteur de thème ouvert » : 6 thèmes (Olive, Bleu, Ardoise, Bordeaux, Vert, Indigo).

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Rechercher un état… | texte | non |  |
| Site | liste | non | valeurs du référentiel (4 entrées dans le prototype, données du client fondateur non reprises) |
| Magasin | liste | non | choix : TOUS, RÉSERVE, RAYON |
| (sans libellé) | liste | non | choix : 2022, 2023, 2024, 2025, 2026 |
| Décomposer par mois | case à cocher | non | désactivé |
| Décomposer par jour | case à cocher | non | désactivé |
| Achat ferme | choix | non | désactivé |
| Dépôt-vente | choix | non | désactivé |
| Tous les produits | choix | non | désactivé |
| Stock > à | case à cocher | non | désactivé |
| Stock < à | case à cocher | non | désactivé |
| Stock = à | case à cocher | non | désactivé |
| Peu importe | case à cocher | non | désactivé |
| Stock >= à | case à cocher | non | désactivé |
| Stock <= à | case à cocher | non | désactivé |
| Stock <> de | case à cocher | non | désactivé |
| Stock <> de | nombre | non | désactivé |
| REGROUPÉ PAR | liste | non | valeurs du référentiel (18 entrées dans le prototype, données du client fondateur non reprises) |
| (sans libellé) | texte | non |  |
| CONTENU DU CRITÈRE DE REGROUPEMENT | liste | non | valeurs du référentiel (8 entrées dans le prototype, données du client fondateur non reprises) |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **PRODUIT · CODE · STOCK TOTAL · PRIX ACHAT · PRIX VENTE**
- **CODE · DÉSIGNATION · QTÉ · CA**
- **CODE · DÉSIGNATION · PRIX VENTE · QTÉ TRANSFÉRÉE · QTÉ REÇUE · N° BON**
- **FAMILLE · CA · PART · MARGE · TAUX**
- **CONSTAT · VOLUME · CONSÉQUENCE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| (7 noms, n° ou codes cliquables dans la liste) | affiche les états du domaine (`setDomEt`) |
| 1 Listing des produits | choisit l'état à imprimer et affiche ses critères (`etSel`) |
| 🖨 Imprimer l'état sélectionné suivant les critères ci-dessus | ouvre la fenêtre d'aperçu avant impression (`apercuEtatDom`) |
| ✕ | ferme la fenêtre d'aperçu (`fermerPV`) |
| 👁 Aperçu, 🖨 Imprimer, ↗ Exporter … (5 éléments) | change d'onglet de la fenêtre (Aperçu, Imprimer, Exporter…) (`pvTab`) |
| ▤ 100 %, Largeur, Page entière … (6 éléments) | change le zoom (`pvZoom`) |
| ✋ Déplacement, 🅃 Sélection, ⊕ Mire … (5 éléments) | change l'outil de pointeur (`pvMode`) |
| ⤢ Plein écran | passe en plein écran (`pvFull`) |
| ▥ Volet miniatures | affiche ou masque les miniatures (`pvMini`) |
| ⏫, 🔼, 🔽 … (5 éléments) | change de page (`pvPage`) |
| (6 noms, n° ou codes cliquables dans la liste) | choisit l'état à imprimer et affiche ses critères (`mOpen`) |
| ◈ Listing | choisit l'état à imprimer et affiche ses critères (`mOpen`) |
| ◈ Statistiques des achats par client | choisit l'état à imprimer et affiche ses critères (`mOpen`) |
| ◈ Fiche client | choisit l'état à imprimer et affiche ses critères (`mOpen`) |
| ◈ Transferts | choisit l'état à imprimer et affiche ses critères (`mOpen`) |
| ◈ Écarts de réception | choisit l'état à imprimer et affiche ses critères (`mOpen`) |
| (10 noms, n° ou codes cliquables dans la liste) | choisit l'état à imprimer et affiche ses critères (`mOpenPilot`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **État du domaine « Gestion de stocks »** : voir capture `14_Rapports-Analyses/02_etats_domaine-gestion-stocks.png` et la zone correspondante ci-dessus.
- **Aperçu imprimable — « Gestion de stocks »** : voir capture `14_Rapports-Analyses/03_etats_domaine-gestion-stocks-apercu.png` et la zone correspondante ci-dessus.
- **État du domaine « États comptables »** : voir capture `14_Rapports-Analyses/04_etats_domaine-etats-comptables.png` et la zone correspondante ci-dessus.
- **Aperçu imprimable — « États comptables »** : voir capture `14_Rapports-Analyses/05_etats_domaine-etats-comptables-apercu.png` et la zone correspondante ci-dessus.
- **État du domaine « États client »** : voir capture `14_Rapports-Analyses/06_etats_domaine-etats-client.png` et la zone correspondante ci-dessus.
- **Aperçu imprimable — « États client »** : voir capture `14_Rapports-Analyses/07_etats_domaine-etats-client-apercu.png` et la zone correspondante ci-dessus.
- **État du domaine « État des transferts »** : voir capture `14_Rapports-Analyses/08_etats_domaine-etat-transferts.png` et la zone correspondante ci-dessus.
- **Aperçu imprimable — « État des transferts »** : voir capture `14_Rapports-Analyses/09_etats_domaine-etat-transferts-apercu.png` et la zone correspondante ci-dessus.
- **État du domaine « Pilotage »** : voir capture `14_Rapports-Analyses/10_etats_domaine-pilotage.png` et la zone correspondante ci-dessus.
- **Aperçu imprimable — « Pilotage »** : voir capture `14_Rapports-Analyses/11_etats_domaine-pilotage-apercu.png` et la zone correspondante ci-dessus.
- **État du domaine « États personnel (verrouillé) »** : voir capture `14_Rapports-Analyses/12_etats_domaine-etats-personnel.png` et la zone correspondante ci-dessus.
- **État du domaine « États trésorerie (verrouillé) »** : voir capture `14_Rapports-Analyses/13_etats_domaine-etats-tresorerie.png` et la zone correspondante ci-dessus.
- **Sélecteur de thème ouvert** : voir capture `14_Rapports-Analyses/14_etats_selecteur-theme-ouvert.png` et la zone correspondante ci-dessus.
- **Vide** : le prototype affiche « Sélectionne un état dans la liste. » (et 2 autre(s) message(s)). Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette des sections. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Enregistrement refusé : message à côté du réglage, valeur précédente conservée.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- studio.report.view (domaines selon les applications installées)
- studio.report.print
- studio.report.export
- États confidentiels réservés

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-BI-01, EF-BI-02, §7 États et rapports (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Deux étapes : 1) liste des domaines puis des états (plein écran), 2) critères en accordéon avec bouton Imprimer en barre fixe.
- Aperçu plein écran.

## À ne pas reproduire

- Note 1 de CAPTURES.md — un `#` égaré dans la feuille de style du prototype fait ignorer la couleur du thème au chargement : le domaine sélectionné et l'en-tête de l'état s'affichent blanc sur blanc tant qu'on n'a pas changé de thème. Smart Collab charge le thème (jetons) avant le premier affichage.
- Note 6 de CAPTURES.md — après un clic sur un domaine, la barre des domaines revient au début et le domaine actif sort du champ. Smart Collab garde le domaine actif visible (défilement conservé ou liste verticale).
- Au chargement, un domaine est actif mais aucun état n'est choisi (« Sélectionne un état dans la liste ») : présélectionner le premier état ou n'activer aucun domaine.
- Domaines verrouillés affichés : n'afficher que les domaines des applications installées (EF-APP-04).
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- En-tête des documents (raison sociale, RCCM, NCC, adresse) : données société du client fondateur → Paramètres société / modèles de documents.
- Liste des états et regroupements propres aux habitudes du client fondateur → états configurables (§7).
- Segments client et sites dans les critères : données du client fondateur.
