# Prompt — Lot 2 : Référentiels et stock

```text
Smart Collab — LOT 2 uniquement (Référentiels et stock).
Les lots précédents sont validés (voir 06_LOTS/).
Respecte AGENTS.md et 02_SPECIFICATIONS/16_CONTRAT_APPLICATION.md.

À lire avant de coder :
- 02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md (EF-GEN, EF-STK-01 à 03)
- 02_SPECIFICATIONS/08_MODELE_DONNEES.md
- 02_SPECIFICATIONS/sql/002_referentiels_stock.sql
- 05_UI_UX/maquettes/inventory.*

Objectif :
1. Applications `partners` et `inventory` : migrations depuis `sql/002_referentiels_stock.sql`.
2. Tiers (clients, fournisseurs, déposants), sites et emplacements, catégories et sous-catégories, marques, unités.
3. Fiche produit en 7 onglets reprise du prototype, variantes, photos, prix par site, champs personnalisés (EF-STK-01).
4. Stock calculé uniquement par mouvements ; mouvement d'ouverture ; disponible = physique − réservations (EF-STK-02, 03).
5. Import CSV des produits, tiers et stocks d'ouverture, avec rapport d'erreurs ligne par ligne.
6. Alertes de rupture et de surstock (vue `v_stock_alerts`), listes conformes à EF-GEN-04.

Interdit dans ce lot :
- Pas de caisse, pas d'achats, pas de transferts. Aucune règle de calcul codée en dur.
- Tout ce qui appartient à un autre lot (02_SPECIFICATIONS/13_PLAN_LOTS.md).

Livrable obligatoire :
- Code dans src/, sur la branche lot-02.
- Tests automatiques du lot (dont l'isolation des entreprises à partir du lot 1).
- Commandes exactes pour installer, migrer, lancer et tester, mises à jour dans src/README.md.
- Comptes de démonstration et données fictives.

Démo de fin de lot :
Importer 1 000 produits avec variantes, saisir un stock d'ouverture sur deux sites, constater les alertes, consulter la fiche produit en 7 onglets.
```

Liste de contrôle : `06_LOTS/lot_02/CHECKLIST.md`
