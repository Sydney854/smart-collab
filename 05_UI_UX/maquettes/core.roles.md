# core.roles — Profils et droits

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `roles` |
| Lot | 1 |
| Prototype | Paramètres › Profils et droits (v105) |
| Fonction de rendu | `PAGES.param → GSUBP.profils` |

## Captures de référence

- [16_Parametres/02_profils.png](../../03_SOURCES_REFERENCE/prototype/captures/16_Parametres/02_profils.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Bandeau ; une carte par profil (description, nombre de droits) ; « Créer un profil personnalisé » ; matrice des droits par profil (domaine · action × profil).

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 6 note(s) de bas de bloc.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **DOMAINE · ACTION · CAISSIÈRE · RESPONSABLE · GESTIONNAIRE · RESPONSABLE · COMPTABLE · RESPONSABLE · DIRECTION**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Créer un profil personnalisé | ouvre le formulaire de création (`newProf`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (5 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette des sections. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Enregistrement refusé : message à côté du réglage, valeur précédente conservée.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- core.role.manage

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

§4 Rôles et droits, EF-CFG-05 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Profils en cartes ; matrice remplacée par la liste des droits d'un profil choisi.

## À ne pas reproduire

- En-têtes de colonnes de la matrice tronqués (« RESPONSABLE » ×3) : libellés complets ou infobulles.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Profils prédéfinis du client fondateur → rôles préréglés par métier (§4).
