# purchase.supply-tracking — Suivi des approvisionnements et fiche lot

**Statut : proposée**

| | |
|---|---|
| Application | `purchase` |
| Écran | `supply-tracking` |
| Lot | 4 |
| Prototype | Achats › Suivi des approvisionnements (v105) |
| Fonction de rendu | `PAGES.achats → ASUBP.suivi` ; `openLot() → ficheLot()` |

## Captures de référence

- [06_Achats/11_suivi.png](../../03_SOURCES_REFERENCE/prototype/captures/06_Achats/11_suivi.png) — Par défaut (v105)
- [06_Achats/12_suivi_fiche-lot.png](../../03_SOURCES_REFERENCE/prototype/captures/06_Achats/12_suivi_fiche-lot.png) — Fiche lot de réception (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; bascule Par lot / Par fournisseur / Alertes.
- 6 cartes : lots reçus, valeur reçue, lots écoulés, écoulement partiel, lots dormants, délai 1re vente.
- Graphiques : courbe d'écoulement moyenne, valeur immobilisée par vitesse.
- Tableau des lots : lot, date, fournisseur, réf., unités, valeur, J+30/60/90, écoulé, 1re vente, vitesse ; clic sur le n° = fiche lot.
- État « fiche lot » : retour, liens catalogue / fournisseur, cartes (écoulé, reste, 1re vente, mise en rayon, écoulé par site), graphique d'écoulement, produits du lot (clic = fiche produit).

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 2 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| (sans libellé) | liste | non | choix : Toutes vitesses (422), Rapide — ≥80% (86), Moyenne — 40-80% (118), Faible — <40% (218) |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **LOT · DATE · FOURNISSEUR · RÉF. · UNITÉS · VALEUR · J+30 · J+60 · J+90 · ÉCOULÉ · 1ÈRE VENTE · VITESSE**
- **CODE · DÉSIGNATION · FAMILLE · REÇU · VENDU ‹site› · VENDU ‹site› · ÉCOULÉ · 1ÈRE VENTE · SITE DOMINANT** — tri au clic sur 7 en-tête(s) ; ligne cliquable → ouvre la fiche du produit (`voirProduit`)

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouveau bon de livraison | **aucune action dans le prototype — à câbler** |
| 📦 Par lot | change de sous-onglet ou de vue (`setASV`) |
| ◍ Par fournisseur | change de sous-onglet ou de vue (`setASV`) |
| ⚠ Alertes 231 | change de sous-onglet ou de vue (`setASV`) |
| (149 noms, n° ou codes cliquables dans la liste) | ouvre l'écran ou la fiche correspondante (`openLot`) |
| ← Retour au suivi | ferme (`closeLot`) |
| ◫ Ses références au catalogue | ouvre l'écran ou la fiche correspondante (`versLotProduits`) |
| ☰ Fiche fournisseur | ouvre l'écran ou la fiche correspondante (`versFournisseur`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (8 éléments déplaçables).

## États

- **Fiche lot de réception** : voir capture `06_Achats/12_suivi_fiche-lot.png` et la zone correspondante ci-dessus.
- **Vide** : le prototype affiche « jamais » (et 1 autre(s) message(s)). Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelettes de cartes et de graphiques ; la barre de période reste utilisable. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Chaque carte ou graphique en erreur affiche « Données indisponibles — Réessayer » sans bloquer les autres.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- purchase.receipt.view

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-STK-05, EF-BI-03, EF-ACH-01 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Cartes 2 par ligne ; tableau des lots en cartes (lot, fournisseur, écoulé %, vitesse) ; fiche lot plein écran.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Colonnes d'écoulement par site écrites pour deux sites seulement.
- Boutons sans effet dans le prototype : « ＋ Nouveau bon de livraison ». Tout bouton affiché fait quelque chose, sinon il n'est pas affiché.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Jalons J+30 / J+60 / J+90 et seuils de vitesse d'écoulement → seuils configurables.
- Lots et fournisseurs : données RUTHY'S.
