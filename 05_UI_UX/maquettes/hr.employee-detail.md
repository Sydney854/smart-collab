# hr.employee-detail — Fiche employé (À propos, Paie)

**Statut : proposée**

| | |
|---|---|
| Application | `hr` (application proposée, absente du contrat §7 de 16_CONTRAT_APPLICATION.md) |
| Écran | `employee-detail` |
| Lot | 8 |
| Prototype | RH & Paie › Employés › fiche (v105, v107) |
| Fonction de rendu | `rhFichePage() → paieFicheTab()` ; `rhFichePage() → rhFicheTab(apropos)` |

## Captures de référence

- [12_RH-Paie/04_employes_fiche-apropos.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/04_employes_fiche-apropos.png) — Fiche employé — onglet À propos (v105)
- [12_RH-Paie/06_employes_v107-fiche-apropos.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/06_employes_v107-fiche-apropos.png) — Fiche employé, onglet À propos (v107)
- [12_RH-Paie/07_employes_v107-fiche-paie.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/07_employes_v107-fiche-paie.png) — Fiche employé, onglet Paie (v107)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Fil d'Ariane « ← Employés / nom ».
- Carte profil à gauche : photo, nom, fonction, statut, matricule, courriel, téléphone, département, date d'inscription, shift.
- Onglets à droite : À propos, Présence, Feuilles, Paie, Documents.
- À propos : informations personnelles, détails de l'emploi ; en v107, structure de paie éditable (salaire de base, sursalaire, transport, parts fiscales).
- Paie (v107) : net mensuel et coût employeur estimés, historique des bulletins (bouton Bulletin).

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 2 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| SALAIRE DE BASE (FCFA) | nombre | non |  |
| SURSALAIRE (FCFA) | nombre | non |  |
| TRANSPORT NON IMPOSABLE (FCFA) | nombre | non |  |
| PARTS FISCALES | liste | non | valeurs du référentiel (9 entrées dans le prototype, données RUTHY'S non reprises) |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **PÉRIODE · BRUT · RETENUES · NET · RÈGLEMENT · STATUT**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ← Employés | revient à la liste (`rhRetourListe`) |
| (5 noms, n° ou codes cliquables dans la liste) | change d'onglet de la fiche (`rhSetFT`) |
| ✎ Modifier la fiche | ajoute un élément (ligne, fiche ou fenêtre de création) (`rhOuvrirEdit`) |
| 🖨 Bulletin | ouvre la fenêtre d'aperçu avant impression (`paieImprimer`) |

## États

- **Fiche employé, onglet À propos** : voir capture `12_RH-Paie/06_employes_v107-fiche-apropos.png` et la zone correspondante ci-dessus.
- **Fiche employé, onglet Paie** : voir capture `12_RH-Paie/07_employes_v107-fiche-paie.png` et la zone correspondante ci-dessus.
- **Vide** : le prototype affiche « non renseigné ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de l'en-tête et de l'onglet actif. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Fiche introuvable ou droit manquant : `EmptyState` avec retour à la liste.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- hr.employee.view
- hr.employee.update
- payroll.structure.update (salaire, sursalaire, transport, parts)
- Salaires masqués selon le rôle

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-RH-01, EF-RH-02 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Carte profil au-dessus, réduite ; onglets en barre défilante.
- Historique des bulletins en cartes.

## À ne pas reproduire

- v107 : la structure de paie se modifie directement dans la fiche, sans bouton Enregistrer ni confirmation : passer par Modifier / Enregistrer, tracé (EF-GEN-03).
- Onglets Feuilles et Documents vides « à construire ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Noms, fonctions, départements et matricules des collaborateurs : données RUTHY'S.
- Départements et désignations par défaut → réglages par métier (EF-CFG-06).
- Rubriques de paie et barème appliqués pour l'estimation → barèmes datés configurables (EF-RH-02).
