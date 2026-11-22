# purchase.receipt-entry — Réception — bon de livraison fournisseur

**Statut : proposée**

| | |
|---|---|
| Application | `purchase` |
| Écran | `receipt-entry` |
| Lot | 4 |
| Prototype | Achats › Bon de livraison (v105) |
| Fonction de rendu | `PAGES.achats → ASUBP.bl` |

## Captures de référence

- [06_Achats/01_bl.png](../../03_SOURCES_REFERENCE/prototype/captures/06_Achats/01_bl.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Bandeau (couleur de l'écran) : Valider ▾, Annuler, Mise en attente, Produits, Intégrer BL.
- En-tête : site, R.I. commande (rapprochement), fournisseur, date BL, référence du BL.
- Ligne d'ajout et tableau : produit, identifiant, famille, quantité, prix d'achat HT, écart de prix, prix de vente TTC, % marque, total, lot, péremption.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Site | liste | non | valeurs du référentiel (5 entrées dans le prototype, données RUTHY'S non reprises) |
| R.I. Cde | texte | non | exemple « n° commande » |
| Fournisseur | liste | non | valeurs du référentiel (151 entrées dans le prototype, données RUTHY'S non reprises) |
| Date BL | date | non |  |
| Réf. du B.L. | texte | non |  |
| Code, mot-clé ou description… | texte | non |  |
| (sans libellé) | texte | non |  |
| (sans libellé) | nombre | non |  |
| — | texte | non | désactivé |
| (sans libellé) | date | non | désactivé |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **PRODUITS · IDENTIFIANT · FAMILLE · QTÉ · P. ACHAT HT · ÉCART PRIX · P. VENTE TTC · % MARQ. · TOTAL LIGNE · LOT · PÉREMPTION**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ＋ Nouveau bon de livraison | **aucune action dans le prototype — à câbler** |
| [PDF] | **aucune action dans le prototype — à câbler** |
| ✓ Valider ▾ | valide le document (contrôle des champs obligatoires, puis enregistrement) (`blValider`) |
| ⊘ Annuler | abandonne la saisie en cours après confirmation (`blReset`) |
| ▮ Mise en attente | met la saisie en attente pour la reprendre plus tard (`blAttente`) |
| ▤ Produits | ouvre le sélecteur de produits (`selMode`) |
| ＋ Intégrer BL | ouvre la fenêtre d'aperçu avant impression (`blImp`) |
| ＋ | ajoute un élément (ligne, fiche ou fenêtre de création) (`blAdd`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (8 éléments déplaçables).

## États

- **Vide** : le prototype affiche « Aucune ligne. Recherche un article ci-dessus par code, mot-clé ou description. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Champs désactivés et indicateur sur le bouton de validation pendant l'enregistrement (double clic impossible). Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Message sous le champ fautif ; erreur serveur : `Toast` rouge, saisie conservée, bouton Réessayer.
- **Hors ligne** : Écran hors ligne (§9, réception de marchandises) : commandes attendues du site copiées sur l'appareil ; la réception reçoit un numéro provisoire et entre dans la file ; seule la quantité reçue entre en stock à la synchronisation.

## Droits nécessaires

- purchase.receipt.create
- purchase.receipt.validate
- Prix d'achat visible (rôle acheteur / magasinier selon réglage)

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-ACH-01, EF-GEN-01, EF-GEN-05, EF-OFF-01 à 04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Réception sur tablette ou téléphone : en-tête en accordéon, lignes en cartes (quantité reçue en gros champ), scan, Valider en barre fixe.

## À ne pas reproduire

- Bouton « ＋ Nouveau bon de livraison » de l'en-tête et « [PDF] » sans effet.
- Listes de sites écrites en dur et différentes d'un écran à l'autre (ici une partie seulement des sites). Smart Collab alimente toutes les listes de sites depuis le référentiel des sites, filtré par le périmètre de l'utilisateur.
- La quantité commandée n'est pas affichée face à la quantité reçue : à ajouter quand une commande est rapprochée (EF-ACH-01).
- Relevé automatique des éléments sans effet sur les captures : « ＋ Nouveau bon de livraison », « [PDF] ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Familles « périssables » qui imposent la date de péremption → réglage par catégorie.
- Calcul du % de marque et alerte d'écart de prix → règles configurables.
- Fournisseurs : données RUTHY'S.
