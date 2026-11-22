# inventory.count-review — Inventaire — revue et validation

**Statut : proposée**

| | |
|---|---|
| Application | `inventory` |
| Écran | `count-review` |
| Lot | 4 |
| Prototype | Inventaire › Revue & validation (v105) |
| Fonction de rendu | `PAGES.inv → ISUBP.revue` |

## Captures de référence

- [09_Inventaire/05_revue.png](../../03_SOURCES_REFERENCE/prototype/captures/09_Inventaire/05_revue.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- 6 cartes : références comptées, en écart, unités manquantes, en surplus, impact valeur d'achat, taux de fiabilité.
- Lignes en écart par lot avec cause obligatoire ; bouton unique de clôture qui génère les corrections (vide sur la capture).

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

Pas de tableau de données (cartes, graphiques ou formulaire).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouvel inventaire | abandonne la saisie en cours après confirmation (`iReset`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucune ligne comptée. Retourne dans Saisie pour compter (manuellement ou par import en masse). ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Champs désactivés et indicateur sur le bouton de validation pendant l'enregistrement (double clic impossible). Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Message sous le champ fautif ; erreur serveur : `Toast` rouge, saisie conservée, bouton Réessayer.
- **Hors ligne** : La revue se consulte hors ligne sur l'appareil qui a compté ; la validation (génération des ajustements) demande une connexion.

## Droits nécessaires

- inventory.count.validate

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-STK-04, EF-GEN-01, EF-GEN-05 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Cartes 2 par ligne ; lignes en écart en cartes avec la cause en liste déroulante ; bouton Valider en barre fixe.

## À ne pas reproduire

- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Causes d'écart → registre configurable.
