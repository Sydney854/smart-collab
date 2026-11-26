# hr.employee-list — Employés — liste et mosaïque

**Statut : proposée**

| | |
|---|---|
| Application | `hr` (application proposée, absente du contrat §7 de 16_CONTRAT_APPLICATION.md) |
| Écran | `employee-list` |
| Lot | 8 |
| Prototype | RH & Paie › Employés (v105) |
| Fonction de rendu | `PAGES.rh → RHSUBP.employes` ; `RHSUBP.employes → rhMosaique()` ; `rhListe() → rhActMenu()` |

## Captures de référence

- [12_RH-Paie/01_employes.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/01_employes.png) — Par défaut (v105)
- [12_RH-Paie/02_employes_mosaique.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/02_employes_mosaique.png) — Vue mosaïque (v105)
- [12_RH-Paie/03_employes_menu-action.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/03_employes_menu-action.png) — Menu ⋮ d'une ligne (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Titre et barre d'outils sur la même ligne : bascule liste / mosaïque, Imprimer, Exporter, Ajouter un nouveau.
- Bandeau ; recherche à gauche ; filtre (tous, en activité, non actifs) et tri (A-Z, Z-A, récent, ancien, salaire) à droite.
- Liste : ID, employé (avatar + nom, clic = fiche), courriel, désignation, département, shift, statut, action ⋮.
- État « mosaïque » : cartes (avatar, nom, fonction, département, courriel, téléphone), sans menu d'action.
- État « menu ⋮ » : Aperçu, Modifier, Supprimer.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Rechercher un collaborateur... | texte | non |  |
| 8 collaborateurs | liste | non | valeurs du référentiel (3 entrées dans le prototype, données du client fondateur non reprises) |
| (sans libellé) | liste | non | choix : Trier : A - Z, Trier : Z - A, Trier : Plus récent, Trier : Plus ancien, Trier : Haut (salaire), Trier : Bas (salaire) |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **ID EMPLOYÉ · EMPLOYÉ · COURRIEL · DÉSIGNATION · DÉPARTEMENT · SHIFT · STATUT · ACTION**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ☰ | bascule liste / mosaïque (`rhView`) |
| ▦ | bascule liste / mosaïque (`rhView`) |
| 🖨 Imprimer | **aucune action dans le prototype — à câbler** |
| ⇩ Exporter | **aucune action dans le prototype — à câbler** |
| ＋ Ajouter un nouveau | ajoute un élément (ligne, fiche ou fenêtre de création) (`rhOuvrirAjout`) |
| (nom ou n° cliquable dans la ligne) | ouvre l'écran ou la fiche correspondante (`rhApercu`) |
| ⋮ | ouvre un menu (`rhActMenu`) |
| ✎ Modifier | ajoute un élément (ligne, fiche ou fenêtre de création) (`rhOuvrirEdit`) |
| 🗑 Supprimer | supprime ou désactive l'élément (voir « À ne pas reproduire ») (`rhSupprimer`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **Vue mosaïque** : voir capture `12_RH-Paie/02_employes_mosaique.png` et la zone correspondante ci-dessus.
- **Menu ⋮ d'une ligne** : voir capture `12_RH-Paie/03_employes_menu-action.png` et la zone correspondante ci-dessus.
- **Vide** : le prototype affiche « non renseigné ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- hr.employee.view
- hr.employee.create
- hr.employee.update
- hr.employee.deactivate
- Salaires masqués selon le rôle

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-RH-01, EF-GEN-04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- La mosaïque devient la vue par défaut (cartes une par ligne).
- Recherche pleine largeur ; filtre et tri dans « Filtres ».

## À ne pas reproduire

- « Imprimer » et « Exporter » sans effet.
- « Supprimer » désactive le compte : libeller l'action « Désactiver ».
- Relevé automatique des éléments sans effet sur les captures : « 🖨 Imprimer », « ⇩ Exporter ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Noms, fonctions, départements et matricules des collaborateurs : données du client fondateur.
- Départements et désignations par défaut → réglages par métier (EF-CFG-06).
