# core.dashboard-finance — Tableau de bord — Financier

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `dashboard-finance` |
| Lot | 6 |
| Prototype | Tableau de bord › Financier (v105) |
| Fonction de rendu | `PAGES.dash → DSUBP.financier` ; `chartMenuOpen() → chartMenuHtml()` ; `kpiMenuOpen() → kpiMenuHtml()` |

## Captures de référence

- [01_Tableau-de-bord/03_financier.png](../../03_SOURCES_REFERENCE/prototype/captures/01_Tableau-de-bord/03_financier.png) — Par défaut (v105)
- [01_Tableau-de-bord/04_financier_menu-clic-droit-graphique.png](../../03_SOURCES_REFERENCE/prototype/captures/01_Tableau-de-bord/04_financier_menu-clic-droit-graphique.png) — Menu de personnalisation — clic droit sur un graphique (v105)
- [01_Tableau-de-bord/05_financier_menu-clic-droit-kpi.png](../../03_SOURCES_REFERENCE/prototype/captures/01_Tableau-de-bord/05_financier_menu-clic-droit-kpi.png) — Menu de personnalisation — clic droit sur une carte KPI (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- En-tête, sous-onglets et barre de période (comme Direction).
- Rangée de 8 cartes de chiffres clés (CA, réapprovisionnement, marge, valeur d'achat, charges propres, charges Centrale, résultat, rentabilité vs objectif), personnalisables au clic droit.
- Sections Performance, Chiffre d'affaires, Stock & flux, Fournisseurs, Approvisionnement : graphiques en barres/courbes et listes en barres horizontales (Top 15, taux de marge).
- État « clic droit sur un graphique » : menu Personnaliser — par indicateur : afficher/masquer, type (barres, courbe, aire), couleur ; Masquer toute la carte ; Réinitialiser.
- État « clic droit sur une carte » : menu avec « Afficher cette carte » et Réinitialiser.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 3 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| CA | case à cocher | non |  |
| Marge brute | case à cocher | non |  |
| Charges | case à cocher | non |  |
| Afficher cette carte | case à cocher | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

Pas de tableau de données (cartes, graphiques ou formulaire).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| 👁 | masque ou réaffiche la carte (`cardToggleHide`) |
| ＋ Ajouter un indicateur | ouvre / pilote le formulaire « Ajouter un indicateur » (`dashNewOpen`) |
| Masquer toute la carte | masque ou réaffiche la carte (`cardToggleHide`) |
| ✕ | ouvre un menu (`chartMenuClose`) |
| ▤ | change le type d'affichage (`chartSetType`) |
| 📈 | change le type d'affichage (`chartSetType`) |
| 🌄 | change le type d'affichage (`chartSetType`) |
| Réinitialiser | abandonne la saisie en cours après confirmation (`chartReset`) |

Autres gestes : clic droit sur un graphique ou une carte : menu de personnalisation (type, couleur, masquer) — appui long sur mobile ; glisser-déposer : réordonner les sous-onglets ou les cartes (12 éléments déplaçables).

## États

- **Menu de personnalisation — clic droit sur un graphique** : voir capture `01_Tableau-de-bord/04_financier_menu-clic-droit-graphique.png` et la zone correspondante ci-dessus.
- **Menu de personnalisation — clic droit sur une carte KPI** : voir capture `01_Tableau-de-bord/05_financier_menu-clic-droit-kpi.png` et la zone correspondante ci-dessus.
- **Vide** : le prototype affiche « Aucun indicateur ajouté sur ce sous-onglet. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelettes de cartes et de graphiques ; la barre de période reste utilisable. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Chaque carte ou graphique en erreur affiche « Données indisponibles — Réessayer » sans bloquer les autres.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- core.dashboard.view
- Prix d'achat, marges et charges masquables par rôle (§4 Données sensibles)
- studio.dashboard.configure pour enregistrer la personnalisation pour tous

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-BI-03, §7 Indicateurs et Tableaux de bord, EF-FIN-04, EF-STK-05 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Cartes de chiffres clés : 2 par ligne, puis 1 sous 360 px.
- Graphiques : un par ligne, hauteur réduite, légende sous le graphique.
- Barre de période repliée dans un bouton « Période » qui ouvre un panneau.
- Sous-onglets : barre défilante horizontale.
- Menu clic droit de personnalisation : appui long, en feuille du bas.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Salutation avec un prénom écrit en dur : afficher le prénom de l'utilisateur connecté.
- Carte « Rentabilité vs objectif » et graphique « Valeur immobilisée par vitesse » reposent sur des règles du client fondateur (voir plus bas).
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Résultat par site (marge − charges propres − part des charges de la Centrale) : formule de contribution propre au client fondateur → règle de calcul.
- Clé de répartition des charges de la Centrale entre les sites → réglage (règle de répartition).
- Estimation du coût d'achat quand le prix d'achat est inconnu (pourcentage du prix de vente) → réglage.
- Report d'une perte sur le mois suivant (« dette ») et remise à zéro annuelle → règle de calcul.
- Date de début (et de fin) d'activité de chaque site, qui conditionne l'affichage des séries → donnée de la fiche site.
- Noms des sites, exercices et montants affichés : données du client fondateur, remplacées par des données fictives.
- Objectif de rentabilité « remboursement du stock de départ » (phases) → indicateur avec cible configurable.
- « Réapprovisionnement » défini comme CA − marge → indicateur configurable.
- Marge qui ne déduit le coût du dépôt-vente que si le déposant est marqué réglé → règle de calcul.
- Seuils de vitesse d'écoulement (rapide / moyenne / faible) → seuils configurables.
