# finance.supplier-payments — Règlements fournisseurs

**Statut : proposée**

| | |
|---|---|
| Application | `finance` |
| Écran | `supplier-payments` |
| Lot | 5 |
| Prototype | Trésorerie & Comptabilité › Règlements fournisseurs (v105) |
| Fonction de rendu | `PAGES.treso → YSUBP.regl` ; `ROWSEL / rowSelPicker()` ; `YSUBP.regl → ldRender(regl) détail` |

## Captures de référence

- [10_Tresorerie-Comptabilite/03_regl.png](../../03_SOURCES_REFERENCE/prototype/captures/10_Tresorerie-Comptabilite/03_regl.png) — Par défaut (v105)
- [10_Tresorerie-Comptabilite/04_regl_detail-reglement.png](../../03_SOURCES_REFERENCE/prototype/captures/10_Tresorerie-Comptabilite/04_regl_detail-reglement.png) — Détail règlement (panneau divisé) (v105)
- [10_Tresorerie-Comptabilite/05_regl_selecteur-couleur-ligne-ouvert.png](../../03_SOURCES_REFERENCE/prototype/captures/10_Tresorerie-Comptabilite/05_regl_selecteur-couleur-ligne-ouvert.png) — Sélecteur de couleur de sélection ouvert (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; bandeau « achats classiques et dépôt-vente séparés » ; 5 cartes.
- Filtres : type, fournisseur, statut ; liste à panneau divisé (une ligne par fournisseur et par mois) : fournisseur, période, type, montant dû, statut, échéance, case de sélection en dernière colonne, « Tout sélectionner ».
- État « détail règlement » : statut (non réglé, réglé partiellement, réglé), échéance, produits de la facture.
- État « sélecteur de couleur ouvert » : choix de la couleur de surbrillance des lignes (6 couleurs).

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Type | liste | non | choix : TOUS, Dépôt-vente, Achat classique |
| Fournisseur | liste | non | valeurs du référentiel (199 entrées dans le prototype, données du client fondateur non reprises) |
| Statut | liste | non | choix : TOUS, Non réglé, Réglé partiellement, Réglé |
| ⌕ | case à cocher | non |  |
| STATUT | liste | non | choix : Non réglé, Réglé partiellement (avance), Réglé |
| ÉCHÉANCE DE RÈGLEMENT | texte | non | exemple « jj/mm/aaaa » |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **FOURNISSEUR · PÉRIODE · TYPE · MONTANT DÛ · STATUT · ÉCHÉANCE** — tri au clic sur 7 en-tête(s) ; ligne cliquable → sélectionne la ligne et ouvre le détail dans le panneau du bas (`ldSel`)
- **PRODUITS · CODE · QTÉ · MONTANT**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ☐ Tout sélectionner | sélectionne toutes les lignes visibles (`reglSelAllVisible`) |
| ✕ | ferme le panneau de détail (`ldClose`) |

Autres gestes : clic droit sur la liste : menu Excel / Imprimer / Colonnes / Couleur de fond ; glisser-déposer : réordonner les sous-onglets ou les cartes (5 éléments déplaçables).

## États

- **Détail règlement (panneau divisé)** : voir capture `10_Tresorerie-Comptabilite/04_regl_detail-reglement.png` et la zone correspondante ci-dessus.
- **Sélecteur de couleur de sélection ouvert** : voir capture `10_Tresorerie-Comptabilite/05_regl_selecteur-couleur-ligne-ouvert.png` et la zone correspondante ci-dessus.
- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- finance.supplier_payment.view
- finance.supplier_payment.record

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-ACH-04, EF-GEN-04, EF-GEN-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Liste en cartes : fournisseur + mois, montant, statut ; sélection multiple par appui long ; détail plein écran.

## À ne pas reproduire

- Période par défaut figée sur l'exercice des données de démonstration (« Année 2024 », et « Réinitialiser » y revient) : Smart Collab ouvre sur l'exercice en cours.
- Achats classiques considérés « réglés d'office » : chaque échéance suit son vrai statut.
- Montant partiel saisi sans écriture de trésorerie liée (EF-GEN-01).
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Règle « achats classiques réglés d'office, seul le dépôt-vente se suit » → réglage.
- Fournisseurs et montants : données du client fondateur.
