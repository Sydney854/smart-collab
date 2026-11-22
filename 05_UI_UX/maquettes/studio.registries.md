# studio.registries — Studio — registres configurables

**Statut : proposée**

| | |
|---|---|
| Application | `studio` |
| Écran | `registries` |
| Lot | 6 |
| Prototype | Paramètres › Studio ERP (v105) |
| Fonction de rendu | `PAGES.param → GSUBP.studio` |

## Captures de référence

- [16_Parametres/04_studio.png](../../03_SOURCES_REFERENCE/prototype/captures/16_Parametres/04_studio.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Bandeau ; sous-onglets Registres, Paramètres métier, Menus & modules, KPI & tableaux de bord, Niveaux suivants ; 6 cartes ; registres configurables (module, rôle, entrées, actives, accès, Ouvrir) ; registres non exposés (pourquoi, ce qui reste réglable).

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **REGISTRE · MODULE CONCERNÉ · RÔLE · ENTRÉES · ACTIVES · ACCÈS**
- **REGISTRE · POURQUOI IL NE PEUT PAS ÊTRE ÉDITÉ · CE QUI RESTE RÉGLABLE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| Ouvrir | change la valeur choisie (`sReg`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (5 éléments déplaçables).

## États

- **Vide** : le prototype affiche « aucun seuil ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette des sections. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Enregistrement refusé : message à côté du réglage, valeur précédente conservée.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- studio.registry.configure

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-CFG-05, EF-CFG-06, §7 Champs personnalisés, Menus et libellés (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Registres en cartes ; registre ouvert en plein écran.

## À ne pas reproduire

- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Contenu des registres (motifs, rubriques, modes de règlement…) : valeurs RUTHY'S → valeurs par défaut du métier Commerce de détail.
