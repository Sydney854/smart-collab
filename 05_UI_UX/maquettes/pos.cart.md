# pos.cart — Caisse — saisie de la vente (panier)

**Statut : proposée**

| | |
|---|---|
| Application | `pos` |
| Écran | `cart` |
| Lot | 3 |
| Prototype | Caisse › Caisse (v105) |
| Fonction de rendu | `KSUBP.caisse (CS.lignes)` ; `PAGES.caisse → KSUBP.caisse` |

## Captures de référence

- [02_Caisse/01_caisse.png](../../03_SOURCES_REFERENCE/prototype/captures/02_Caisse/01_caisse.png) — Par défaut (v105)
- [02_Caisse/02_caisse_panier-rempli.png](../../03_SOURCES_REFERENCE/prototype/captures/02_Caisse/02_caisse_panier-rempli.png) — Caisse — panier rempli (3 lignes, remise, client) (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Bandeau de vente (couleur de l'écran) : n° de vente, site, type de vente, boutons Valider, Annuler, Mise en attente, Produits.
- Bloc client : recherche par nom ou téléphone, nom + téléphone, Enregistrer ; vendeur obligatoire.
- Ligne de saisie : article (scan, code, mot-clé), identifiant, stock, prix TTC, remise %, quantité, total, bouton ＋.
- Panier : article, identifiant, type (achat ferme / dépôt-vente), prix, remise, quantité modifiable, total, voir la fiche, supprimer la ligne.
- Pied : Totaux (articles, brut, remises, net à payer) · Portefeuille client (avoir, carte cadeau, points, crédit) · Encaissement (modes de règlement, montant versé, monnaie à rendre) · Dépôt-vente détecté (CA, commission, par déposant).
- Bouton Décaissement en en-tête ; sélecteur de couleur de l'écran.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 3 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Site | liste | non | valeurs du référentiel (2 entrées dans le prototype, données du client fondateur non reprises) |
| Type | liste | non | choix : NORMALE, AVOIR, DIFFÉRÉE |
| Rechercher par nom ou téléphone… | texte | non |  |
| Nom | texte | non | exemple « nouveau client » |
| Tél | texte | non | exemple « 07 … » |
| Vendeur | liste | oui | valeurs du référentiel (5 entrées dans le prototype, données du client fondateur non reprises) |
| Scanne ou tape un code, un mot-clé… | texte | non |  |
| (sans libellé) | texte | non |  |
| (sans libellé) | nombre | non |  |
| MONTANT VERSÉ | nombre | non | exemple « 0 » |
| QTÉ | nombre | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **ARTICLE · IDENTIFIANT · TYPE · PRIX TTC · REMISE · QTÉ · TOTAL LIGNE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ⇄ Décaissement | **aucune action dans le prototype — à câbler** |
| ✓ Valider | valide le document (contrôle des champs obligatoires, puis enregistrement) (`kValider`) |
| ⊘ Annuler | abandonne la saisie en cours après confirmation (`kReset`) |
| ⏸ Mise en attente | met la saisie en attente pour la reprendre plus tard (`kAttente`) |
| ▤ Produits | ouvre le sélecteur de produits (`selMode`) |
| ＋ Enregistrer | ajoute un élément (ligne, fiche ou fenêtre de création) (`cCreer`) |
| ＋ | ajoute un élément (ligne, fiche ou fenêtre de création) (`kAdd`) |
| 💵 Espèce, 💳 Carte bancaire, 🌊 Wave … (5 éléments) | change la valeur choisie (`kSet`) |
| ⊙ | ouvre la fiche du produit (`voirProduit`) |
| 🗑 | supprime ou désactive l'élément (voir « À ne pas reproduire ») (`kDel`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **Caisse — panier rempli (3 lignes, remise, client)** : voir capture `02_Caisse/02_caisse_panier-rempli.png` et la zone correspondante ci-dessus.
- **Vide** : le prototype affiche « Panier vide — recherche un article ci-dessus. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Champs désactivés et indicateur sur le bouton de validation pendant l'enregistrement (double clic impossible). Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Message sous le champ fautif ; erreur serveur : `Toast` rouge, saisie conservée, bouton Réessayer.
- **Hors ligne** : Écran hors ligne (§9) : catalogue, prix, stock du site, clients et modes de règlement lus localement ; la vente reçoit un numéro provisoire et entre dans la file. Bandeau permanent en ligne / hors ligne + nombre d'opérations en attente (EF-OFF-01). Stock insuffisant découvert à la synchronisation : vente conservée, alerte au gérant. Au-delà de la durée maximale hors ligne (EF-OFF-02), Valider est bloqué avec le message « Synchronisation nécessaire ».

## Droits nécessaires

- pos.sale.create
- pos.discount.over_limit (remise au-delà du seuil du rôle)
- pos.stock.force (vendre au-delà du stock)
- pos.session.open (une session ouverte est nécessaire)
- Prix d'achat jamais affiché au caissier

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-POS-01, EF-POS-02, EF-POS-03, EF-POS-06, EF-POS-07, EF-GEN-01, EF-VEN-03, EF-CRM-01, EF-OFF-01 à 04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Écran caisse prévu pour 1 280 px et plus (05_UI_UX/README.md, règle 4). Entre 390 et 1 279 px : message « La caisse demande un écran d'au moins 1 280 px » avec accès à la liste des ventes ; pas de saisie de vente.
- Si une version tablette est validée plus tard : panier en liste de cartes, pied en accordéon (Totaux toujours visible, Encaissement en feuille du bas).

## À ne pas reproduire

- Validation muette : quand un champ obligatoire manque, le bouton ne fait rien et n'affiche aucun message. Smart Collab signale le champ manquant (texte d'erreur sous le champ, bouton désactivé avec infobulle). (Valider sans vendeur ou sans ligne)
- Liste des vendeurs écrite en dur, différente de la liste des collaborateurs (un nom n'existe pas dans RH). Smart Collab propose les utilisateurs actifs du site ayant le rôle adéquat.
- Listes de sites écrites en dur et différentes d'un écran à l'autre (ici une partie seulement des sites). Smart Collab alimente toutes les listes de sites depuis le référentiel des sites, filtré par le périmètre de l'utilisateur.
- Type de vente « AVOIR » et « DIFFÉRÉE » proposés alors qu'aucun parcours avoir ou vente différée n'existe : n'afficher que les types réellement pris en charge (EF-POS-05).
- Pas d'ouverture ni de clôture de session de caisse (fond de caisse, comptage) : à concevoir (EF-POS-01).
- Boutons sans effet dans le prototype : « ⇄ Décaissement ». Tout bouton affiché fait quelque chose, sinon il n'est pas affiché.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Taux de commission du dépôt-vente et reconnaissance du dépôt-vente par le fournisseur de l'article → règle configurable (EF-VEN-03).
- Taux d'acquisition des points de fidélité → réglage.
- Liste des modes de règlement (opérateurs mobile money) → registre configurable par pays.
- Numérotation des ventes (compteur à 10 chiffres) → réglage de numérotation.
- Noms de sites, vendeurs, articles : données du client fondateur.
