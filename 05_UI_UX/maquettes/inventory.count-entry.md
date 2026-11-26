# inventory.count-entry — Inventaire — saisie du comptage (lot par lot)

**Statut : proposée**

| | |
|---|---|
| Application | `inventory` |
| Écran | `count-entry` |
| Lot | 4 |
| Prototype | Inventaire › Saisie (v105, v99) |
| Fonction de rendu | `ISUBP.saisie → lotsPanel()` ; `PAGES.inv → ISUBP.saisie` ; `lotsPanel() (iLot → iLotCreate)` ; `lotsPanel() → iLotSel() → saisie du lot` |

## Captures de référence

- [09_Inventaire/01_saisie.png](../../03_SOURCES_REFERENCE/prototype/captures/09_Inventaire/01_saisie.png) — Par défaut (v105)
- [09_Inventaire/02_saisie_v99-aucun-lot.png](../../03_SOURCES_REFERENCE/prototype/captures/09_Inventaire/02_saisie_v99-aucun-lot.png) — Aucun lot (v99)
- [09_Inventaire/03_saisie_v99-lot-cree.png](../../03_SOURCES_REFERENCE/prototype/captures/09_Inventaire/03_saisie_v99-lot-cree.png) — Un lot créé (non sélectionné) (v99)
- [09_Inventaire/04_saisie_v99-lot-selectionne.png](../../03_SOURCES_REFERENCE/prototype/captures/09_Inventaire/04_saisie_v99-lot-selectionne.png) — Un lot sélectionné (saisie ouverte) (v99)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Bloc « Comptage tournant » : fréquences par classe A/B/C, nombre de références en retard, « Créer un inventaire ciblé », Détails.
- Bandeau de saisie (couleur de l'écran) : Revue & validation, Actualiser les quantités comptées, Nouveau lot, Import en masse, Scan caméra, Annuler, Produits, Fiches de comptage.
- En-tête d'inventaire : site, emplacement, nom, type (général, tournant, ciblé, par famille), date.
- Lots de comptage (une ligne par lot ou zone : références, unités comptées, écart net, valeur écart, statut) ; clic = ouvrir la saisie du lot.
- États : aucun lot (message « Crée d'abord un lot ») → un lot créé (ligne « À compter ») → lot sélectionné (saisie : article, identifiant, lot, stock théorique, quantité comptée, écart, valeur, ＋ ; liste des lignes comptées du lot).
- Pied : avancement du comptage, écarts constatés, impact financier.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| (sans libellé) | nombre | non |  |
| Site | liste | non | valeurs du référentiel (2 entrées dans le prototype, données du client fondateur non reprises) |
| Emplacement | liste | non | choix : RAYON, RÉSERVE |
| Nom | texte | non |  |
| Type | liste | non | choix : GÉNÉRAL, TOURNANT, CIBLÉ, PAR FAMILLE |
| Date | date | non |  |
| Code, mot-clé ou description… | texte | non |  |
| (sans libellé) | texte | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **LOT / ZONE · RÉFÉRENCES · UNITÉS COMPTÉES · ÉCART NET · VALEUR ÉCART · STATUT** — ligne cliquable → sélectionne (`iLotSel`)
- **ARTICLE · IDENTIFIANT · FAMILLE · THÉORIQUE · COMPTÉ · ÉCART · VALEUR ACHAT · VALEUR VENTE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouvel inventaire | abandonne la saisie en cours après confirmation (`iReset`) |
| ⊘ Annuler | abandonne la saisie en cours après confirmation (`iReset`) |
| 🎯 Créer un inventaire ciblé (2 451) | ajoute un élément (ligne, fiche ou fenêtre de création) (`iCreerCible`) |
| Détails ▾ | affiche / masque (`abcDetailToggle`) |
| ⟳ Actualiser les qtés comptées | recalcule les quantités comptées (`iActualiser`) |
| ＋ Nouveau lot | crée un lot de comptage (`iLot`) |
| 📥 Import en masse | affiche / masque (`iImportToggle`) |
| 📷 Scan caméra | affiche / masque (`scanToggle`) |
| ▤ Produits | crée un lot de comptage (`iNeedLot`) |
| 🖨 Fiches de comptage | **aucune action dans le prototype — à câbler** |
| 🗑 | commande de la fenêtre (réduire, agrandir, fermer) (`event.stopPropagation`) |
| ✕ | sélectionne (`iLotSel`) |
| ＋ | ajoute un élément (ligne, fiche ou fenêtre de création) (`iAdd`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **Aucun lot** : voir capture `09_Inventaire/02_saisie_v99-aucun-lot.png` et la zone correspondante ci-dessus.
- **Un lot créé (non sélectionné)** : voir capture `09_Inventaire/03_saisie_v99-lot-cree.png` et la zone correspondante ci-dessus.
- **Un lot sélectionné (saisie ouverte)** : voir capture `09_Inventaire/04_saisie_v99-lot-selectionne.png` et la zone correspondante ci-dessus.
- **Vide** : le prototype affiche « Aucun lot de comptage pour l'instant. Le comptage se fait lot par lot (une zone : rayon, vitrine, comptoir…). ＋ Nouveau lot » (et 1 autre(s) message(s)). Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Champs désactivés et indicateur sur le bouton de validation pendant l'enregistrement (double clic impossible). Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Message sous le champ fautif ; erreur serveur : `Toast` rouge, saisie conservée, bouton Réessayer.
- **Hors ligne** : Écran hors ligne (§9) : produits et stock théorique du site + lots copiés sur l'appareil ; chaque ligne comptée est horodatée et mise en file. À la synchronisation, l'écart est recalculé à la date et l'heure du comptage. Bandeau en ligne / hors ligne + opérations en attente.

## Droits nécessaires

- inventory.count.create
- inventory.count.import
- Quantité théorique masquable (comptage à l'aveugle) selon le rôle

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-STK-04, EF-OFF-01 à 04, EF-GEN-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Pensé pour le téléphone (comptage en rayon) : lots en cartes, saisie du lot en plein écran avec gros champ quantité et bouton scan.
- Bloc comptage tournant et pied (avancement, écarts, impact) en accordéon fermé.
- Barre d'actions réduite à Scan, Nouveau lot, ⋯.

## À ne pas reproduire

- Listes de sites écrites en dur et différentes d'un écran à l'autre (ici une partie seulement des sites). Smart Collab alimente toutes les listes de sites depuis le référentiel des sites, filtré par le périmètre de l'utilisateur.
- « Fiches de comptage » sans effet.
- « Créer un inventaire ciblé » propose toutes les références (aucun historique) : borner et prévisualiser avant création.
- Relevé automatique des éléments sans effet sur les captures : « 🖨 Fiches de comptage ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Fréquences de comptage par classe ABC et emplacements (rayon, réserve) → réglages.
- Types d'inventaire → registre configurable.
