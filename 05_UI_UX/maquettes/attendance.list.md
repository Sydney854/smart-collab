# attendance.list — Présence — pointages

**Statut : proposée**

| | |
|---|---|
| Application | `attendance` (application proposée, absente du contrat §7 de 16_CONTRAT_APPLICATION.md) |
| Écran | `list` |
| Lot | 8 |
| Prototype | RH & Paie › Présence (v105) |
| Fonction de rendu | `PAGES.rh → RHSUBP.presence` ; `ptgModalHtml()` |

## Captures de référence

- [12_RH-Paie/13_presence.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/13_presence.png) — Par défaut (v105)
- [12_RH-Paie/14_presence_popup-ajout.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/14_presence_popup-ajout.png) — Popup Ajouter (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre d'outils ; recherche, période Du → Au, filtre de statut, tri.
- Tableau : employé, date, arrivée, départ, heures, tardif, statut, action.
- État « fenêtre Ajouter » : collaborateur*, date*, statut, heure d'arrivée, heure de départ, retard (minutes).

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Rechercher un collaborateur... | texte | non |  |
| 📅 | date | non |  |
| → | date | non |  |
| 0 pointage | liste | non | choix : Filtrer : Tous, Filtrer : Présent, Filtrer : Tardif, Filtrer : Absent, Filtrer : Équipe de nuit, Filtrer : Demi-journée |
| (sans libellé) | liste | non | choix : Trier : Plus récent, Trier : Plus ancien, Trier : A - Z, Trier : Z - A |
| COLLABORATEUR * | liste | oui | valeurs du référentiel (8 entrées dans le prototype, données du client fondateur non reprises) |
| DATE * | date | oui |  |
| STATUT | liste | non | choix : Présent, Tardif, Absent, Équipe de nuit, Demi-journée |
| HEURE D'ARRIVÉE | heure | non |  |
| HEURE DE DÉPART | heure | non |  |
| RETARD (MINUTES) | nombre | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **EMPLOYÉ · DATE · ARRIVÉE · DÉPART · HEURES · TARDIF · STATUT · ACTION**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| 🖨 Imprimer | **aucune action dans le prototype — à câbler** |
| ⇩ Exporter | **aucune action dans le prototype — à câbler** |
| ＋ Ajouter un nouveau | ajoute un élément (ligne, fiche ou fenêtre de création) (`ptgOuvrirAjout`) |
| ✕ | ferme (`ptgModalClose`) |
| Annuler | ferme (`ptgModalClose`) |
| Ajouter | enregistre (`ptgSauver`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **Popup Ajouter** : voir capture `12_RH-Paie/14_presence_popup-ajout.png` et la zone correspondante ci-dessus.
- **Vide** : le prototype affiche « Aucun pointage sur cette période. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- attendance.entry.create
- attendance.entry.view

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-RH-01, EF-GEN-04, EF-GEN-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Pointages en cartes ; fenêtre plein écran ; période dans « Filtres ».

## À ne pas reproduire

- « Imprimer » et « Exporter » sans effet.
- Statut et retard saisis à la main : proposer le calcul à partir de l'horaire de l'employé (réglage).
- Relevé automatique des éléments sans effet sur les captures : « 🖨 Imprimer », « ⇩ Exporter ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Noms, fonctions, départements et matricules des collaborateurs : données du client fondateur.
- Départements et désignations par défaut → réglages par métier (EF-CFG-06).
- Statuts de présence (tardif, équipe de nuit, demi-journée) → registre configurable.
