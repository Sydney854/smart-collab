# transfers.transfer-list — Bons de transfert et fiche bon

**Statut : proposée**

| | |
|---|---|
| Application | `transfers` |
| Écran | `transfer-list` |
| Lot | 4 |
| Prototype | Transferts de stock › Bons de transfert (v105) |
| Fonction de rendu | `PAGES.trf → TSUBP.bons` ; `openBon() → ficheBon()` |

## Captures de référence

- [08_Transferts-de-stock/03_bons.png](../../03_SOURCES_REFERENCE/prototype/captures/08_Transferts-de-stock/03_bons.png) — Par défaut (v105)
- [08_Transferts-de-stock/04_bons_fiche-bon.png](../../03_SOURCES_REFERENCE/prototype/captures/08_Transferts-de-stock/04_bons_fiche-bon.png) — Fiche bon de transfert (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; filtres expéditeur, destinataire, « avec écart uniquement ».
- Tableau : n° bon (clic = fiche), date, expéditeur, destinataire, lignes, expédié, reçu, écart, valeur, statut.
- État « fiche bon » : en-tête trajet, retour / fermer, tableau des lignes (expédié, reçu, écart, prix, total).

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| (sans libellé) | liste | non | valeurs du référentiel (7 entrées dans le prototype, données du client fondateur non reprises) |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **N° BON · DATE · EXPÉDITEUR · DESTINATAIRE · LIGNES · EXPÉDIÉ · REÇU · ÉCART · VALEUR · STATUT**
- **PRODUITS · CODE · EXPÉDIÉ · REÇU · ÉCART · PRIX ACHAT · TOTAL LIGNE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouveau transfert | **aucune action dans le prototype — à câbler** |
| Avec écart uniquement 3 | déplie ou replie un filtre (`togEcart`) |
| (171 noms, n° ou codes cliquables dans la liste) | ouvre l'écran ou la fiche correspondante (`openBon`) |
| ← Retour aux transferts | ferme (`closeBon`) |
| ✕ | ferme (`closeBon`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (5 éléments déplaçables).

## États

- **Fiche bon de transfert** : voir capture `08_Transferts-de-stock/04_bons_fiche-bon.png` et la zone correspondante ci-dessus.
- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- transfers.transfer.view
- transfers.transfer.print

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-TRF-01, EF-GEN-04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Liste en cartes (n°, trajet, statut, écart) ; fiche plein écran.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Bouton « ＋ Nouveau transfert » sans effet.
- Relevé automatique des éléments sans effet sur les captures : « ＋ Nouveau transfert ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Codes de site dans les numéros de bon (S01…) → numérotation configurable.
