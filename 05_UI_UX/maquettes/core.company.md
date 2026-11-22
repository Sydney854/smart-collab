# core.company — Paramètres société

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `company` |
| Lot | 1 |
| Prototype | Paramètres › Paramètres société (v105) |
| Fonction de rendu | `PAGES.param → GSUBP.societe` |

## Captures de référence

- [16_Parametres/05_societe.png](../../03_SOURCES_REFERENCE/prototype/captures/16_Parametres/05_societe.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Identité de la société ; sites et emplacements (site, rôle, emplacements, ventes suivies) ; règles de gestion paramétrables (règle, valeur, où elle s'applique).

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **SITE · RÔLE · EMPLACEMENTS · VENTES SUIVIES**
- **RÈGLE · VALEUR · OÙ ELLE S'APPLIQUE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)


Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (5 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette des sections. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Enregistrement refusé : message à côté du réglage, valeur précédente conservée.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- core.company.configure

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

§7 Apparence, Numérotation, EF-STK-02, EF-CFG-05 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Sections en accordéon ; sites en cartes.

## À ne pas reproduire

- Informations affichées en lecture seule sans bouton Modifier.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Identité (raison sociale, RCCM, NCC), sites et règles de gestion : données RUTHY'S → assistant de première configuration.
