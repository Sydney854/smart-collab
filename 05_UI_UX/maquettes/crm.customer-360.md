# crm.customer-360 — Fiche client 360°

**Statut : proposée**

| | |
|---|---|
| Application | `crm` |
| Écran | `customer-360` |
| Lot | 5 |
| Prototype | Clients & CRM › Fiche 360° (v105) |
| Fonction de rendu | `PAGES.crm → CSUBP.fiche` |

## Captures de référence

- [11_Clients-CRM/03_fiche.png](../../03_SOURCES_REFERENCE/prototype/captures/11_Clients-CRM/03_fiche.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Sans client choisi, le prototype réaffiche le fichier client (capture). La fiche 360° s'ouvre au clic sur un nom.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Nom, téléphone, e-mail, ID… | texte | non |  |
| (sans libellé) | liste | non | choix : Tous les segments, VIP, Fidèle, Régulier, Nouveau, À risque … |
| Téléphone | case à cocher | non |  |
| E-mail | case à cocher | non |  |
| Ville | case à cocher | non |  |
| Segment | case à cocher | non |  |
| Score | case à cocher | non |  |
| RFM | case à cocher | non |  |
| Achats | case à cocher | non |  |
| CA cumulé | case à cocher | non |  |
| Marge générée | case à cocher | non |  |
| Panier moyen | case à cocher | non |  |
| Dernier achat | case à cocher | non |  |
| Boutique | case à cocher | non |  |
| Points | case à cocher | non |  |
| Commercial | case à cocher | non |  |
| Niveau fidélité | case à cocher | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **ID · CLIENT · TÉLÉPHONE · SEGMENT · DERNIER ACHAT · CA CUMULÉ · ACHATS · PANIER MOYEN · BOUTIQUE · SCORE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| (136 noms, n° ou codes cliquables dans la liste) | ouvre la fiche client 360° (`cOpen`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (6 éléments déplaçables).

## États

- **Vide** : le prototype affiche « (7 j) » (et 78 autre(s) message(s)). Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de l'en-tête et de l'onglet actif. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Fiche introuvable ou droit manquant : `EmptyState` avec retour à la liste.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- crm.customer.view
- crm.customer.update
- crm.wallet.update (avoir, crédit, carte cadeau)

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-CRM-01 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Fiche plein écran, sections en accordéon.

## À ne pas reproduire

- Le sous-onglet « fiche » ouvert sans sélection réaffiche la liste du sous-onglet précédent (doublon). Smart Collab : pas de sous-onglet fiche dans le menu ; la fiche s'ouvre depuis une ligne de la liste, sinon état vide « Choisissez… ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Seuils de segmentation (visites, jours sans achat), score et niveaux de fidélité → règles configurables (EF-CRM-02).
- Clients : données de démonstration du prototype, à remplacer par des données fictives Smart Collab.
