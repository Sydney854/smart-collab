# core.apps — Applications (App Store)

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `apps` |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | M-23 (page de maquettes) ; code de démonstration : `src/apps/web/screens/AppStoreScreen.tsx` ; règles : `05_UI_UX/ICONES_MODULES.md` § 4 |

## Captures de référence

Aucune capture (écran propre à Smart Collab) : voir la maquette Smart Collab ci-dessus.

## Zones de l'écran

- En-tête : titre, phrase d'explication, filtre par famille du catalogue, recherche.
- Grille de cartes regroupées par famille : icône illustrée dans son cadre, nom, description courte, famille, statut.
- Statuts : **Toujours actif** (socle, gris), **Installée** (vert), **Installer** (contour or), **Non inclus dans l'abonnement** (EF-APP-06) avec lien vers la formule.

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Famille | liste | non | familles du catalogue (`CATALOGUE_MODULES.md` § 2) |
| Recherche | texte | non | nom et description |

## Actions (ce que fait chaque clic)

- **Installer** : ouvre une confirmation qui **liste les applications ajoutées avec elle** (dépendances, EF-APP-02 ; ex. Point de vente ajoute Produits & Inventaire et Finance) ; **Confirmer** installe le tout, met à jour le menu et inscrit l'opération au journal.
- **Désinstaller** (menu de la carte d'une application installée) : refusé avec la liste des applications qui en dépendent (EF-APP-03) ; sinon confirmation qui précise « aucune donnée n'est supprimée » ; l'application disparaît du menu.
- Clic sur la carte : fiche de l'application (description, captures, événements publiés, applications liées).

## États

- **Vide** : recherche sans résultat : `EmptyState`.
- **Chargement** : cartes squelettes.
- **Erreur** : installation refusée (droits, abonnement) : message dans la confirmation, rien n'est installé (tout ou rien).
- **Hors ligne** : consultation seule ; Installer et Désinstaller désactivés avec « Connexion nécessaire ».

## Droits nécessaires

- core.app.view (voir) ; core.app.install (installer / désinstaller, administrateur).

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-APP-01, EF-APP-02, EF-APP-03, EF-APP-04, EF-APP-06, EF-GEN-03.

## Version mobile (390 px)

- Une carte par ligne ; confirmation en plein écran.

## Textes fr / en

Principaux textes de l'écran (fichiers de traduction `packages/i18n`).

| Français | English |
|---|---|
| Applications | Apps |
| Installer | Install |
| Installée | Installed |
| Toujours actif | Always on |
| Non inclus dans votre abonnement | Not included in your plan |
| Installer {name} ajoutera aussi : {list} | Installing {name} will also add: {list} |
| Désinstaller | Uninstall |
| Impossible : {list} en dépend. | Not possible: {list} depends on it. |
| Aucune donnée n'est supprimée. | No data is deleted. |

## À ne pas reproduire

- Modules « à venir » présentés avec un bouton Installer actif (point en attente de décision, page de maquettes).
- Désinstallation qui supprime des données.

## Propre à RUTHY'S → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
