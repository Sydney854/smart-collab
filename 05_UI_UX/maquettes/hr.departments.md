# hr.departments — Départements

**Statut : proposée**

| | |
|---|---|
| Application | `hr` (application proposée, absente du contrat §7 de 16_CONTRAT_APPLICATION.md) |
| Écran | `departments` |
| Lot | 8 |
| Prototype | RH & Paie › Départements (v105) |
| Fonction de rendu | `PAGES.rh → RHSUBP.departements` ; `RHSUBP.departements → dptActMenu()` ; `dptModalHtml()` |

## Captures de référence

- [12_RH-Paie/08_departements.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/08_departements.png) — Par défaut (v105)
- [12_RH-Paie/09_departements_popup-ajout.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/09_departements_popup-ajout.png) — Popup Ajouter (v105)
- [12_RH-Paie/10_departements_menu-action.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/10_departements_menu-action.png) — Menu ⋮ d'une ligne (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre d'outils sur la ligne du titre ; recherche, filtre, tri.
- Tableau : code, département, responsable, employés, créé le, statut, action ⋮ (Modifier, Supprimer).
- État « fenêtre Ajouter » (centrée) : code proposé, nom*, responsable, statut ; Annuler / Sauvegarder.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Rechercher un département... | texte | non |  |
| 4 départements | liste | non | choix : Filtrer : Tous, Filtrer : Actifs, Filtrer : Inactifs |
| (sans libellé) | liste | non | choix : Trier : A - Z, Trier : Z - A, Trier : Plus récent, Trier : Plus ancien |
| CODE | texte | non |  |
| NOM DU DÉPARTEMENT * | texte | oui |  |
| RESPONSABLE | liste | non | valeurs du référentiel (9 entrées dans le prototype, données du client fondateur non reprises) |
| STATUT | liste | non | choix : Actif, Inactif |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **CODE · DÉPARTEMENT · RESPONSABLE · EMPLOYÉS · CRÉÉ LE · STATUT · ACTION**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| 🖨 Imprimer | **aucune action dans le prototype — à câbler** |
| ⇩ Exporter | **aucune action dans le prototype — à câbler** |
| ＋ Ajouter un nouveau | ajoute un élément (ligne, fiche ou fenêtre de création) (`dptOuvrirAjout`) |
| ⋮ | ouvre un menu (`dptActMenu`) |
| ✕ | ferme (`dptModalClose`) |
| Annuler | ferme (`dptModalClose`) |
| Sauvegarder | enregistre (`dptSauver`) |
| ✎ Modifier | ajoute un élément (ligne, fiche ou fenêtre de création) (`dptOuvrirEdit`) |
| 🗑 Supprimer | supprime ou désactive l'élément (voir « À ne pas reproduire ») (`dptSupprimer`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **Popup Ajouter** : voir capture `12_RH-Paie/09_departements_popup-ajout.png` et la zone correspondante ci-dessus.
- **Menu ⋮ d'une ligne** : voir capture `12_RH-Paie/10_departements_menu-action.png` et la zone correspondante ci-dessus.
- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- hr.department.manage

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-RH-01, EF-GEN-04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Départements en cartes ; fenêtre en plein écran.

## À ne pas reproduire

- « Imprimer » et « Exporter » sans effet.
- Suppression physique (bloquée seulement si des employés sont rattachés) : archiver plutôt.
- Relevé automatique des éléments sans effet sur les captures : « 🖨 Imprimer », « ⇩ Exporter ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Noms, fonctions, départements et matricules des collaborateurs : données du client fondateur.
- Départements et désignations par défaut → réglages par métier (EF-CFG-06).
