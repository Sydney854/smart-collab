# finance.daily-cash — C.A. journalier (journée de caisse)

**Statut : proposée**

| | |
|---|---|
| Application | `finance` |
| Écran | `daily-cash` |
| Lot | 3 |
| Prototype | Trésorerie & Comptabilité › C.A. journalier (v105) |
| Fonction de rendu | `PAGES.treso → YSUBP.journalier` |

## Captures de référence

- [10_Tresorerie-Comptabilite/01_journalier.png](../../03_SOURCES_REFERENCE/prototype/captures/10_Tresorerie-Comptabilite/01_journalier.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; sélecteur de couleur de sélection de ligne.
- 6 cartes : CA TTC, encaissé comptant, réglé par portefeuille, crédits, décaissements, solde de caisse.
- Décomposition de l'encaissement, ventilation par mode de paiement, ventes de la session (liste à panneau divisé, réutilise le détail de vente).

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

Pas de tableau de données (cartes, graphiques ou formulaire).

## Actions (ce que fait chaque clic)


Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (5 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucune vente dans la session. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelettes de cartes et de graphiques ; la barre de période reste utilisable. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Chaque carte ou graphique en erreur affiche « Données indisponibles — Réessayer » sans bloquer les autres.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- finance.cash.view
- rowSel : couleur de sélection (préférence)

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-FIN-02, EF-POS-01, EF-GEN-04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Cartes 2 par ligne ; ventes en cartes.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Modes de paiement → registre configurable.
