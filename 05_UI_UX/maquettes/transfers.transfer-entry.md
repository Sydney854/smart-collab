# transfers.transfer-entry — Transfert de stock — saisie, départ et réception

**Statut : proposée**

| | |
|---|---|
| Application | `transfers` |
| Écran | `transfer-entry` |
| Lot | 4 |
| Prototype | Transferts de stock › Nouveau transfert (v105) |
| Fonction de rendu | `PAGES.trf → TSUBP.saisie` |

## Captures de référence

- [08_Transferts-de-stock/01_saisie.png](../../03_SOURCES_REFERENCE/prototype/captures/08_Transferts-de-stock/01_saisie.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Bandeau (couleur de l'écran) : Mise en attente, Valider le départ, Mettre en réception, Valider la réception, Annuler, Suggestion, Produits.
- En-tête : date, n° transfert, mode (manuel / depuis un BL), commentaire, site et magasin expéditeur, site et magasin destinataire.
- Ligne d'ajout ; tableau : produit, identifiant, famille, quantité suggérée, transférée, réceptionnée, écart, PRMP, total.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 2 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Date | date | non |  |
| N° transfert | texte | non |  |
| Mode | liste | non | choix : MANUEL, TRANSFERT DE BL |
| Commentaire | texte | non | exemple « facultatif » |
| SITE EXPÉDITEUR | liste | non | valeurs du référentiel (6 entrées dans le prototype, données RUTHY'S non reprises) |
| MAGASIN EXPÉDITEUR | liste | non | désactivé ; choix : STOCK CENTRAL |
| SITE DESTINATAIRE | liste | non | valeurs du référentiel (5 entrées dans le prototype, données RUTHY'S non reprises) |
| MAGASIN DESTINATAIRE | liste | non | choix : RAYON, RÉSERVE |
| Code, mot-clé ou description… | texte | non |  |
| (sans libellé) | texte | non |  |
| (sans libellé) | nombre | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **PRODUITS · IDENTIFIANT · FAMILLE · QTÉ SUGGÉRÉE · QTÉ TRANSFÉRÉE · QTÉ RÉCEPTIONNÉE · QTÉ ÉCART · P. ACHAT PRMP · TOTAL LIGNE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouveau transfert | **aucune action dans le prototype — à câbler** |
| ▮ Mise en attente | met la saisie en attente pour la reprendre plus tard (`tsAttente`) |
| ✓ Valider le départ | fait passer le transfert à l'étape suivante (`tsEtape`) |
| ↓ Mettre en réception | fait passer le transfert à l'étape suivante (`tsEtape`) |
| ✓ Valider la réception | fait passer le transfert à l'étape suivante (`tsEtape`) |
| ⊘ Annuler | abandonne la saisie en cours après confirmation (`tsReset`) |
| ⚙ Suggestion | ouvre la suggestion de quantités (`tsSugOpen`) |
| ▤ Produits | ouvre le sélecteur de produits (`selMode`) |
| ＋ | ajoute un élément (ligne, fiche ou fenêtre de création) (`tsAdd`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (5 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucune ligne. Recherche un article, ou utilise le bouton Suggestion. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Champs désactivés et indicateur sur le bouton de validation pendant l'enregistrement (double clic impossible). Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Message sous le champ fautif ; erreur serveur : `Toast` rouge, saisie conservée, bouton Réessayer.
- **Hors ligne** : Réception hors ligne (§9) : bons de transfert attendus du site copiés sur l'appareil ; la réception (quantités reçues, écarts) entre dans la file. La création et l'expédition demandent une connexion.

## Droits nécessaires

- transfers.transfer.create
- transfers.transfer.ship
- transfers.transfer.receive
- transfers.stock.force

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-TRF-01, EF-TRF-02, EF-GEN-01, EF-OFF-01 à 04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Réception sur téléphone : en-tête en accordéon, lignes en cartes avec quantité reçue, scan, Valider en barre fixe.

## À ne pas reproduire

- Les trois étapes (départ, mise en réception, réception) sont proposées en même temps quel que soit l'état : n'afficher que l'action de l'étape courante.
- Statuts réduits à expédié / en attente / réceptionné : appliquer la chaîne complète d'EF-TRF-01.
- Bouton « ＋ Nouveau transfert » de l'en-tête sans effet.
- Relevé automatique des éléments sans effet sur les captures : « ＋ Nouveau transfert ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Liste des sites et magasins (Centrale, boutiques, rayon / réserve) → référentiel des sites.
- Règles de suggestion de quantité → réglage.
