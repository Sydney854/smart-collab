# core.apps — Applications (App Store)

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `apps` |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | M-23 (page de maquettes du lot 0, adresse dans 00_GOUVERNANCE/PASSATION.md) ; code de démonstration : `src/apps/web/screens/AppStoreScreen.tsx` ; règles : `05_UI_UX/ICONES_MODULES.md` § 4 |

## Captures de référence

Aucune capture (écran propre à Smart Collab) : voir la maquette Smart Collab ci-dessus.

## Zones de l'écran

- En-tête : titre, phrase d'explication, filtre par famille du catalogue, recherche.
- Grille de cartes regroupées par famille : icône illustrée dans son cadre, nom, description courte, famille, statut.
- Statuts : **Toujours actif** (socle, gris), **Installée** (vert), **Installer** (contour or), **Archivée** (désinstallée, données conservées) avec **Réinstaller**, **Non inclus dans l'abonnement** (EF-APP-06) avec lien vers la formule, **À venir** (module pas encore construit, gris, non cliquable, décision du 26/11/2026).
- **Fiche d'une application** (clic sur la carte, panneau latéral) : description, captures, applications dont elle dépend et qui dépendent d'elle, événements publiés et écoutés (manifeste), bouton d'action ; états : chargement en squelette, erreur avec Réessayer.

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Famille | liste | non | familles du catalogue (`CATALOGUE_MODULES.md` § 2) |
| Recherche | texte | non | nom et description |

## Actions (ce que fait chaque clic)

- **Installer** : ouvre une confirmation qui **liste les applications ajoutées avec elle** (dépendances, EF-APP-02 ; ex. Point de vente ajoute Produits & Inventaire et Finance) ; **Confirmer** installe le tout, met à jour le menu et inscrit l'opération au journal.
- **Désinstaller** (menu de la carte d'une application installée) : refusé avec la liste des applications qui en dépendent (EF-APP-03) ; sinon confirmation qui précise « aucune donnée n'est supprimée » ; l'application disparaît du menu.
- **Réinstaller** (application archivée) : les données conservées réapparaissent (contrat d'application § 3).
- Clic sur la carte : fiche de l'application (voir Zones).

## États

- **Vide** : recherche sans résultat : `EmptyState`.
- **Chargement** : cartes squelettes.
- **Erreur** : installation refusée (droits, abonnement) : message dans la confirmation, rien n'est installé (tout ou rien).
- **Hors ligne** : consultation seule ; Installer et Désinstaller désactivés avec « Connexion nécessaire ».

## Droits nécessaires

- core.app.view (voir) ; core.app.configure (installer, désinstaller, réinstaller : administrateur ; action « configurer » de 04_ROLES_DROITS.md).
- Le **serveur** revérifie à chaque installation le droit et l'abonnement (EF-APP-06), et **refuse tout accès** (écrans et services) à une application non installée ou hors abonnement (EF-APP-04) : cacher le menu ne suffit pas.

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-APP-01, EF-APP-02, EF-APP-03, EF-APP-04, EF-APP-06, EF-GEN-03, 16_CONTRAT_APPLICATION.md § 3 (réinstallation).

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
| À venir | Coming soon |
| Non inclus dans votre abonnement | Not included in your plan |
| Installer {name} ajoutera aussi : {list} | Installing {name} will also add: {list} |
| Désinstaller | Uninstall |
| Impossible : {list} en dépend. | Not possible: {list} depends on it. |
| Aucune donnée n'est supprimée. | No data is deleted. |

## À ne pas reproduire

- Modules « à venir » présentés avec un bouton Installer actif : ils s'affichent « À venir », gris et non cliquables (décision du 26/11/2026).
- Désinstallation qui supprime des données.

## Propre au client fondateur → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
