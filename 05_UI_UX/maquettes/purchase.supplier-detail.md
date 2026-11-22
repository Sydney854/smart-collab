# purchase.supplier-detail — Fiche fournisseur

**Statut : proposée**

| | |
|---|---|
| Application | `purchase` |
| Écran | `supplier-detail` |
| Lot | 4 |
| Prototype | Fournisseurs › Fiche fournisseur (v105) |
| Fonction de rendu | `PAGES.frn → FSUBP.fiche` |

## Captures de référence

- [07_Fournisseurs/03_fiche.png](../../03_SOURCES_REFERENCE/prototype/captures/07_Fournisseurs/03_fiche.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Sans fournisseur choisi, le prototype réaffiche le répertoire (capture). La fiche complète (identité, conditions, règlements par mois cliquables, réceptions) s'ouvre via « Fiche complète » depuis le répertoire.

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

Autres gestes : clic droit sur la liste : menu Excel / Imprimer / Colonnes / Couleur de fond ; glisser-déposer : réordonner les sous-onglets ou les cartes (3 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette de l'en-tête et de l'onglet actif. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Fiche introuvable ou droit manquant : `EmptyState` avec retour à la liste.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- partners.supplier.view
- partners.supplier.update

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-ACH-04, EF-BI-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Fiche plein écran, sections en accordéon.

## À ne pas reproduire

- Le sous-onglet « fiche » ouvert sans sélection réaffiche la liste du sous-onglet précédent (doublon). Smart Collab : pas de sous-onglet fiche dans le menu ; la fiche s'ouvre depuis une ligne de la liste, sinon état vide « Choisissez… ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Rien de spécifique au-delà des données (noms, montants) affichées sur les captures.
