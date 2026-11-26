# core.dashboard-sales — Tableau de bord — Commercial

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `dashboard-sales` |
| Lot | 6 |
| Prototype | Tableau de bord › Commercial (v105) |
| Fonction de rendu | `PAGES.dash → DSUBP.commercial` |

## Captures de référence

- [01_Tableau-de-bord/06_commercial.png](../../03_SOURCES_REFERENCE/prototype/captures/01_Tableau-de-bord/06_commercial.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- En-tête, sous-onglets, barre de période.
- Cartes : références vendues, panier moyen, meilleur site, meilleur produit, rentabilité vs objectif.
- « Comparer deux sites » : cases à cocher des sites + graphique en barres groupées.
- Listes en barres : CA par famille, marge par famille, répartition par site, classes ABC, top produits — liens « Voir tout » vers Produits.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Sites | case à cocher (une par site du référentiel) | non | données du client fondateur non reprises |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

Pas de tableau de données (cartes, graphiques ou formulaire).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| 👁 | masque ou réaffiche la carte (`cardToggleHide`) |
| Voir tout → | ouvre l'écran ou la fiche correspondante (`versCatalogue`) |
| ＋ Ajouter un indicateur | ouvre / pilote le formulaire « Ajouter un indicateur » (`dashNewOpen`) |

Autres gestes : clic droit sur un graphique ou une carte : menu de personnalisation (type, couleur, masquer) — appui long sur mobile ; glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucun indicateur ajouté sur ce sous-onglet. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelettes de cartes et de graphiques ; la barre de période reste utilisable. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Chaque carte ou graphique en erreur affiche « Données indisponibles — Réessayer » sans bloquer les autres.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- core.dashboard.view

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-BI-03, §7 Indicateurs, EF-STK-05 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Cartes de chiffres clés : 2 par ligne, puis 1 sous 360 px.
- Graphiques : un par ligne, hauteur réduite, légende sous le graphique.
- Barre de période repliée dans un bouton « Période » qui ouvre un panneau.
- Sous-onglets : barre défilante horizontale.
- Menu clic droit de personnalisation : appui long, en feuille du bas.
- Cases « Comparer deux sites » en puces horizontales défilantes.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Salutation avec un prénom écrit en dur : afficher le prénom de l'utilisateur connecté.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Noms des sites, exercices et montants affichés : données du client fondateur, remplacées par des données fictives.
- Bornes des classes ABC → seuils configurables.
