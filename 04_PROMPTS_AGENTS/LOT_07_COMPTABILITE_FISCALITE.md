# Prompt — Lot 7 : Comptabilité SYSCOHADA et fiscalité

```text
Smart Collab — LOT 7 uniquement (Comptabilité SYSCOHADA et fiscalité).
Les lots précédents sont validés (voir 06_LOTS/).
Respecte AGENTS.md et 02_SPECIFICATIONS/16_CONTRAT_APPLICATION.md.

À lire avant de coder :
- 02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md (EF-CPT)
- 02_SPECIFICATIONS/16_CONTRAT_APPLICATION.md §6

Objectif :
1. Application `accounting` : plan SYSCOHADA révisé par défaut, journaux, écritures automatiques via les ponts `sales_accounting`, `purchase_accounting` et les événements de trésorerie (EF-CPT-01, 02).
2. Grand livre, balance, lettrage, rapprochement bancaire, clôture de période et d'exercice (EF-CPT-03).
3. États financiers SYSCOHADA (EF-CPT-04) ; TVA et déclarations, Côte d'Ivoire d'abord (EF-CPT-05) ; export pour l'expert-comptable (EF-CPT-06).

Interdit dans ce lot :
- Les taux et barèmes fiscaux sont des réglages datés, jamais du code.
- Tout ce qui appartient à un autre lot (02_SPECIFICATIONS/13_PLAN_LOTS.md).

Livrable obligatoire :
- Code dans src/, sur la branche lot-07.
- Tests automatiques du lot (dont l'isolation des entreprises à partir du lot 1).
- Commandes exactes pour installer, migrer, lancer et tester, mises à jour dans src/README.md.
- Comptes de démonstration et données fictives.

Démo de fin de lot :
Vendre, acheter, payer un fournisseur, puis consulter les écritures, la balance et le bilan d'un exercice de test ; clôturer une période et constater qu'aucune écriture n'y entre plus.
```

Liste de contrôle : `06_LOTS/lot_07/CHECKLIST.md`
