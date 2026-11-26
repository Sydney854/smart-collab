# finance.expenses — Décaissements

**Statut : proposée**

| | |
|---|---|
| Application | `finance` |
| Écran | `expenses` |
| Lot | 5 |
| Prototype | Trésorerie & Comptabilité › Décaissements (v105) |
| Fonction de rendu | `PAGES.treso → YSUBP.decaiss` |

## Captures de référence

- [10_Tresorerie-Comptabilite/02_decaiss.png](../../03_SOURCES_REFERENCE/prototype/captures/10_Tresorerie-Comptabilite/02_decaiss.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période.
- Ligne de saisie : rubrique obligatoire, précision, date, montant, Enregistrer.
- Grand-livre des décaissements (triable, filtre par rubrique) et détail par rubrique (vides sur la capture).

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| (sans libellé) | liste | oui | valeurs du référentiel (10 entrées dans le prototype, données du client fondateur non reprises) |
| précision facultative | texte | non |  |
| (sans libellé) | date | non |  |
| 0 | nombre | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

Pas de tableau de données (cartes, graphiques ou formulaire).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ✓ Enregistrer | ajoute un élément (ligne, fiche ou fenêtre de création) (`decAdd`) |
| ＋ | ajoute un élément (ligne, fiche ou fenêtre de création) (`decAdd`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (5 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucun décaissement enregistré. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Champs désactivés et indicateur sur le bouton de validation pendant l'enregistrement (double clic impossible). Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Message sous le champ fautif ; erreur serveur : `Toast` rouge, saisie conservée, bouton Réessayer.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- finance.expense.create
- finance.expense.view
- finance.expense.cancel (avec motif)

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-FIN-02, EF-GEN-03, EF-GEN-04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Saisie en formulaire plein écran ; grand-livre en cartes.

## À ne pas reproduire

- Validation muette : quand un champ obligatoire manque, le bouton ne fait rien et n'affiche aucun message. Smart Collab signale le champ manquant (texte d'erreur sous le champ, bouton désactivé avec infobulle).
- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Suppression d'un décaissement par 🗑 : annulation avec motif (EF-GEN-02).
- Pas de justificatif joint (EF-FIN-02).
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Rubriques de décaissement → registre configurable (catégories de dépenses).
