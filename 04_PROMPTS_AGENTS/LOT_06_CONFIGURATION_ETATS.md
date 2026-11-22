# Prompt — Lot 6 : Moteur de configuration, états et tableaux de bord

```text
Smart Collab — LOT 6 uniquement (Moteur de configuration, états et tableaux de bord).
Les lots précédents sont validés (voir 06_LOTS/).
Respecte AGENTS.md et 02_SPECIFICATIONS/16_CONTRAT_APPLICATION.md.

À lire avant de coder :
- 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md
- 02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md (EF-BI, EF-CTL)

Objectif :
1. Application `studio` : règles, barèmes datés, indicateurs, tableaux de bord par rôle, modèles de documents et d'états, circuits de validation, numérotations, champs personnalisés, menus, apparence (§7, EF-CFG-01 à 06).
2. Centre d'états repris du prototype : critères, fenêtre d'aperçu, exports PDF, Excel, Word, CSV, image, PowerPoint, e-mail, planification (EF-BI-01 à 03).
3. Tableaux de bord Direction, Financier, Commercial, Opérations, repris du prototype, alimentés par le moteur d'indicateurs.
4. Application `control` : journal des opérations et des accès, alertes par gravité (EF-CTL-01).

Interdit dans ce lot :
- Pas de comptabilité. Le langage de règles reste un langage d'expressions, jamais du code libre.
- Tout ce qui appartient à un autre lot (02_SPECIFICATIONS/13_PLAN_LOTS.md).

Livrable obligatoire :
- Code dans src/, sur la branche lot-06.
- Tests automatiques du lot (dont l'isolation des entreprises à partir du lot 1).
- Commandes exactes pour installer, migrer, lancer et tester, mises à jour dans src/README.md.
- Comptes de démonstration et données fictives.

Démo de fin de lot :
Créer un indicateur et l'ajouter à un tableau de bord ; modifier une règle, la tester sur un exemple, l'activer ; imprimer un état et l'exporter dans les 7 formats ; planifier son envoi.
```

Liste de contrôle : `06_LOTS/lot_06/CHECKLIST.md`
