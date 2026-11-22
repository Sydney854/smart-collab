# crm.overview — CRM — vue d'ensemble

**Statut : proposée**

| | |
|---|---|
| Application | `crm` |
| Écran | `overview` |
| Lot | 5 |
| Prototype | Clients & CRM › Vue d'ensemble (v105) |
| Fonction de rendu | `PAGES.crm → CSUBP.vue` |

## Captures de référence

- [11_Clients-CRM/01_vue.png](../../03_SOURCES_REFERENCE/prototype/captures/11_Clients-CRM/01_vue.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; bouton Caisse.
- 8 cartes ; graphiques (portefeuille, CA par segment, CA par site).
- Répartition par segment (clic = clients du segment) ; meilleurs clients (clic = fiche 360°).

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **SEGMENT · DÉFINITION · CLIENTS · CA · PART · PANIER MOYEN** — tri au clic sur 5 en-tête(s) ; ligne cliquable → ouvre l'écran ou la fiche correspondante (`versCRM`)
- **# · CLIENT · SEGMENT · SCORE · VISITES · CA CUMULÉ · PANIER MOYEN · MARGE GÉNÉRÉE · DERNIER ACHAT · FAMILLE PRÉFÉRÉE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| (12 noms, n° ou codes cliquables dans la liste) | ouvre la fiche client 360° (`cOpen`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (6 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelettes de cartes et de graphiques ; la barre de période reste utilisable. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Chaque carte ou graphique en erreur affiche « Données indisponibles — Réessayer » sans bloquer les autres.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- crm.customer.view
- Marges masquées selon le rôle

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-CRM-01, EF-CRM-02, EF-BI-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Cartes de chiffres clés : 2 par ligne, puis 1 sous 360 px.
- Graphiques : un par ligne, hauteur réduite, légende sous le graphique.
- Tableaux en cartes.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Seuils de segmentation (visites, jours sans achat), score et niveaux de fidélité → règles configurables (EF-CRM-02).
- Clients : données de démonstration du prototype, à remplacer par des données fictives Smart Collab.
