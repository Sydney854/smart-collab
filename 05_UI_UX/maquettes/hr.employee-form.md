# hr.employee-form — Employé — formulaire Ajouter / Modifier

**Statut : proposée**

| | |
|---|---|
| Application | `hr` (application proposée, absente du contrat §7 de 16_CONTRAT_APPLICATION.md) |
| Écran | `employee-form` |
| Lot | 8 |
| Prototype | RH & Paie › Employés › Ajouter un nouveau (v105) |
| Fonction de rendu | `rhFormPage() (rhOuvrirAjout)` |

## Captures de référence

- [12_RH-Paie/05_employes_formulaire-ajout.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/05_employes_formulaire-ajout.png) — Formulaire Ajouter un employé (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Titre « Ajouter un employé », Annuler / Sauvegarder.
- Informations personnelles : nom*, e-mail, téléphone, naissance, genre.
- Détails de l'emploi : matricule (proposé), embauche, désignation*, département, shift, salaire.
- Colonne de droite : photo de profil, statut.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| NOM DU COLLABORATEUR * | texte | oui |  |
| E-MAIL | e-mail | non |  |
| TÉLÉPHONE | texte | non |  |
| DATE DE NAISSANCE | date | non |  |
| GENRE | liste | non | choix : —, Homme, Femme, Autre |
| MATRICULE | texte | non |  |
| DATE D'EMBAUCHE | date | non |  |
| DÉSIGNATION * | texte | oui |  |
| DÉPARTEMENT | liste | non | choix : Direction, Département commercial, Logistique, Comptabilité |
| SHIFT | liste | non | choix : —, Jour, Nuit |
| SALAIRE (FCFA) | nombre | non |  |
| (sans libellé) | liste | non | choix : Actif, Inactif |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

Pas de tableau de données (cartes, graphiques ou formulaire).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| Annuler | abandonne la saisie en cours après confirmation (`rhFormAnnuler`) |
| Sauvegarder l'employé | enregistre (`rhFormSauver`) |
| ＋ Ajouter une photo | ouvre le choix d'un fichier (photo) (`document.getElementById`) |

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Champs désactivés et indicateur sur le bouton de validation pendant l'enregistrement (double clic impossible). Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Message sous le champ fautif ; erreur serveur : `Toast` rouge, saisie conservée, bouton Réessayer.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- hr.employee.create
- hr.employee.update

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-RH-01, EF-GEN-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Formulaire en une colonne ; photo en tête ; Sauvegarder en barre fixe.

## À ne pas reproduire

- Un seul champ « Nom du collaborateur » (le modèle DreamsERP sépare prénom et nom) : à trancher en maquette.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Noms, fonctions, départements et matricules des collaborateurs : données RUTHY'S.
- Départements et désignations par défaut → réglages par métier (EF-CFG-06).
