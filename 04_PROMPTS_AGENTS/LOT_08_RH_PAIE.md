# Prompt — Lot 8 : RH et paie

```text
Smart Collab — LOT 8 uniquement (RH et paie).
Les lots précédents sont validés (voir 06_LOTS/).
Respecte AGENTS.md et 02_SPECIFICATIONS/16_CONTRAT_APPLICATION.md.

À lire avant de coder :
- 02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md (EF-RH)
- 05_UI_UX/maquettes/hr.*

Objectif :
1. Employés, contrats, départements, désignations, présences, congés, jours fériés (EF-RH-01).
2. Moteur de paie paramétrable : rubriques, bases, taux, plafonds, barèmes datés, parts fiscales, brut → net et net → brut, charges patronales, coût employeur ; barèmes Côte d'Ivoire au lancement (EF-RH-02).
3. Bulletin selon modèle configurable, journal de paie, impression groupée dans la fenêtre d'aperçu (EF-RH-03) ; pont `payroll_accounting`.

Interdit dans ce lot :
- Aucun taux de paie écrit dans le code.
- Tout ce qui appartient à un autre lot (02_SPECIFICATIONS/13_PLAN_LOTS.md).

Livrable obligatoire :
- Code dans src/, sur la branche lot-08.
- Tests automatiques du lot (dont l'isolation des entreprises à partir du lot 1).
- Commandes exactes pour installer, migrer, lancer et tester, mises à jour dans src/README.md.
- Comptes de démonstration et données fictives.

Démo de fin de lot :
Saisir la structure de salaire d'un employé, générer la paie du mois, imprimer tous les bulletins en un seul document.
```

Liste de contrôle : `06_LOTS/lot_08/CHECKLIST.md`
