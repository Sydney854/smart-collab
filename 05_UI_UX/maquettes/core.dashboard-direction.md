# core.dashboard-direction — Tableau de bord — Direction

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `dashboard-direction` |
| Lot | 6 |
| Prototype | Tableau de bord › Direction (v105) |
| Fonction de rendu | `PAGES.dash → DSUBP.direction` ; `dashNewOpen() → formulaire Nouvel indicateur` |

## Captures de référence

- [01_Tableau-de-bord/01_direction.png](../../03_SOURCES_REFERENCE/prototype/captures/01_Tableau-de-bord/01_direction.png) — Par défaut (v105)
- [01_Tableau-de-bord/02_direction_nouvel-indicateur.png](../../03_SOURCES_REFERENCE/prototype/captures/01_Tableau-de-bord/02_direction_nouvel-indicateur.png) — Formulaire Nouvel indicateur (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- En-tête : salutation, sous-titre de l'exercice, bouton Actualiser.
- Sous-onglets Direction / Financier / Commercial / Opérations (réordonnables par glisser-déposer).
- Barre de période (`PeriodBar`) : année, préréglage (année, trimestres), dates Du/Au, site.
- Cartes de chiffres clés (`KpiCard`) et graphique Résultat (`ChartCard`, personnalisable au clic droit, masquable avec l'œil).
- Bandeau d'analyse (texte généré à partir des données).
- Bloc « Vos indicateurs personnalisés » + bouton « Ajouter un indicateur ».
- État « nouvel indicateur » : panneau avec 3 onglets accordéon (Évolution dans le temps, Comparaison par catégorie, Répartition), cases des mesures, Annuler / Ajouter l'indicateur.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| CA | case à cocher | non |  |
| Marge brute | case à cocher | non |  |
| Charges | case à cocher | non |  |
| Achats | case à cocher | non |  |
| Résultat | case à cocher | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

Pas de tableau de données (cartes, graphiques ou formulaire).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| 👁 | masque ou réaffiche la carte (`cardToggleHide`) |
| ＋ Ajouter un indicateur | ouvre / pilote le formulaire « Ajouter un indicateur » (`dashNewOpen`) |
| ✕ | ouvre / pilote le formulaire « Ajouter un indicateur » (`dashNewCancel`) |
| Annuler | ouvre / pilote le formulaire « Ajouter un indicateur » (`dashNewCancel`) |
| Évolution dans le temps en cours | ouvre / pilote le formulaire « Ajouter un indicateur » (`dashNewOpenCat`) |
| Comparaison par catégorie | ouvre / pilote le formulaire « Ajouter un indicateur » (`dashNewOpenCat`) |
| Répartition (un tout divisé) | ouvre / pilote le formulaire « Ajouter un indicateur » (`dashNewOpenCat`) |
| Ajouter l'indicateur | ouvre / pilote le formulaire « Ajouter un indicateur » (`dashNewSave`) |

Autres gestes : clic droit sur un graphique ou une carte : menu de personnalisation (type, couleur, masquer) — appui long sur mobile ; glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **Formulaire Nouvel indicateur** : voir capture `01_Tableau-de-bord/02_direction_nouvel-indicateur.png` et la zone correspondante ci-dessus.
- **Vide** : le prototype affiche « Aucun indicateur ajouté sur ce sous-onglet. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelettes de cartes et de graphiques ; la barre de période reste utilisable. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Chaque carte ou graphique en erreur affiche « Données indisponibles — Réessayer » sans bloquer les autres.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- core.dashboard.view (périmètre : sites autorisés)
- studio.indicator.create pour « Ajouter un indicateur »
- Montants de marge masqués si le rôle n'a pas « voir les marges »

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-BI-03, EF-APP-04, §7 Indicateurs et Tableaux de bord, EF-CFG-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Cartes de chiffres clés : 2 par ligne, puis 1 sous 360 px.
- Graphiques : un par ligne, hauteur réduite, légende sous le graphique.
- Barre de période repliée dans un bouton « Période » qui ouvre un panneau.
- Sous-onglets : barre défilante horizontale.
- Menu clic droit de personnalisation : appui long, en feuille du bas.
- Formulaire « Ajouter un indicateur » : plein écran.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Salutation avec un prénom écrit en dur : afficher le prénom de l'utilisateur connecté.
- Bandeau « … accumule une perte depuis N mois » calculé sur la règle de contribution du client fondateur : ne pas reprendre tel quel.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Résultat par site (marge − charges propres − part des charges de la Centrale) : formule de contribution propre au client fondateur → règle de calcul.
- Clé de répartition des charges de la Centrale entre les sites → réglage (règle de répartition).
- Estimation du coût d'achat quand le prix d'achat est inconnu (pourcentage du prix de vente) → réglage.
- Report d'une perte sur le mois suivant (« dette ») et remise à zéro annuelle → règle de calcul.
- Date de début (et de fin) d'activité de chaque site, qui conditionne l'affichage des séries → donnée de la fiche site.
- Noms des sites, exercices et montants affichés : données du client fondateur, remplacées par des données fictives.
