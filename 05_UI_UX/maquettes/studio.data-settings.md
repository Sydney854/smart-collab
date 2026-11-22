# studio.data-settings — Paramètres des données (seuils)

**Statut : proposée**

| | |
|---|---|
| Application | `studio` |
| Écran | `data-settings` |
| Lot | 6 |
| Prototype | Paramètres › Paramètres des données (v105) |
| Fonction de rendu | `PAGES.param → GSUBP.donnees` |

## Captures de référence

- [16_Parametres/03_donnees.png](../../03_SOURCES_REFERENCE/prototype/captures/16_Parametres/03_donnees.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Bandeau « point de référence unique » ; 6 cartes ; groupes de paramètres à gauche (rotation, écoulement des lots, alertes, caisse et fidélité, validation, segmentation, fidélité, ABC, objectifs & rentabilité) ; à droite le groupe choisi (champs numériques) et « Effet de ces paramètres ».

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 2 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| (sans libellé) | nombre | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **INDICATEUR · VALEUR ACTUELLE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| (9 noms, n° ou codes cliquables dans la liste) | sélectionne (`pdSel`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (5 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette des sections. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Enregistrement refusé : message à côté du réglage, valeur précédente conservée.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- studio.settings.configure

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-CFG-03, EF-CFG-04, EF-CFG-05, EF-CFG-06 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Groupes en liste plein écran ; groupe choisi en formulaire.

## À ne pas reproduire

- Valeurs modifiées sans enregistrement explicite, sans version ni test : EF-CFG-03 (tester avant d'activer), 04 (versionner), 05 (tracer, annuler).
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Tous les seuils présents (rotation, écoulement, commission dépôt-vente, double validation, client VIP, objectifs et rentabilité…) sont les réglages de RUTHY'S : ils deviennent les réglages par défaut d'un métier, pas des valeurs du produit.
