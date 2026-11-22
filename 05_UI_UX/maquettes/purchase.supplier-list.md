# purchase.supplier-list — Répertoire fournisseurs

**Statut : proposée**

| | |
|---|---|
| Application | `purchase` |
| Écran | `supplier-list` |
| Lot | 4 |
| Prototype | Fournisseurs › Répertoire fournisseurs (v105) |
| Fonction de rendu | `FSUBP.liste → ldRender(frnListe) détail` ; `PAGES.frn → FSUBP.liste` |

## Captures de référence

- [07_Fournisseurs/01_liste.png](../../03_SOURCES_REFERENCE/prototype/captures/07_Fournisseurs/01_liste.png) — Par défaut (v105)
- [07_Fournisseurs/02_liste_detail-fournisseur.png](../../03_SOURCES_REFERENCE/prototype/captures/07_Fournisseurs/02_liste_detail-fournisseur.png) — Détail fournisseur (panneau divisé) (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- 6 cartes (fournisseurs, actifs, artisans déposants, ayant livré, premier par CA, sans référence).
- Recherche, type ; liste à panneau divisé : rang, fournisseur, type, famille dominante, règlement, réf., CA, part, marge, taux, BL ; clic droit = menu.
- État « détail fournisseur » : panneau condensé avec Fiche complète et Catalogue.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Rechercher un fournisseur… | texte | non |  |
| (sans libellé) | liste | non | choix : Tous les types, Fabricant, Grossiste, Importateur, Artisan déposant, Coopérative … |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **# · FOURNISSEUR · TYPE · FAMILLE DOMINANTE · RÈGLEMENT · RÉF. · CA · PART · MARGE · TAUX · BL** — tri au clic sur 11 en-tête(s) ; ligne cliquable → sélectionne la ligne et ouvre le détail dans le panneau du bas (`ldSel`)

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouveau fournisseur | ouvre le formulaire de création (`fNew`) |
| (nom ou n° cliquable dans la ligne) | ouvre l'écran ou la fiche correspondante (`fSel`) |
| ◫ Catalogue | ouvre le catalogue filtré sur le fournisseur (`frnCatalogue`) |
| ✕ | ferme le panneau de détail (`ldClose`) |

Autres gestes : clic droit sur la liste : menu Excel / Imprimer / Colonnes / Couleur de fond ; glisser-déposer : réordonner les sous-onglets ou les cartes (3 éléments déplaçables).

## États

- **Détail fournisseur (panneau divisé)** : voir capture `07_Fournisseurs/02_liste_detail-fournisseur.png` et la zone correspondante ci-dessus.
- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- partners.supplier.view
- partners.supplier.create
- Marges masquées selon le rôle

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-GEN-04, EF-BI-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Liste en cartes : fournisseur, type, CA ; détail plein écran.

## À ne pas reproduire

- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Types de fournisseur (artisan déposant, coopérative…) → registre.
- Fournisseurs : données RUTHY'S.
