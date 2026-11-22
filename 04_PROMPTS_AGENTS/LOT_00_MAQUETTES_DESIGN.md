# Prompt — Lot 0 : Maquettes et design

```text
Smart Collab — LOT 0 uniquement (Maquettes et design).
Respecte AGENTS.md et 02_SPECIFICATIONS/16_CONTRAT_APPLICATION.md.

À lire avant de coder :
- 05_UI_UX/
- 03_SOURCES_REFERENCE/
- 02_SPECIFICATIONS/05_INVENTAIRE_ECRANS.md

Objectif :
1. Créer `05_UI_UX/maquettes/<application>.<écran>.md` pour chaque écran des lots 1 à 7 listé dans `05_UI_UX/INVENTAIRE_ECRANS.md` (repris du prototype ou à maquetter).
2. Pour chaque maquette : zones, champs, actions, états (vide, chargement, erreur, hors ligne), droits, exigences couvertes, textes fr et en.
3. Initialiser `packages/ui` : jetons de `05_UI_UX/DESIGN_TOKENS.md` (thème clair et sombre), composants de `05_UI_UX/COMPOSANTS.md`, page de démonstration des composants.

Interdit dans ce lot :
- Aucune logique métier, aucun serveur, aucune base de données. Aucun fichier de DreamsERP ou du prototype copié.
- Tout ce qui appartient à un autre lot (02_SPECIFICATIONS/13_PLAN_LOTS.md).

Livrable obligatoire :
- Code dans src/, sur la branche lot-00.
- Tests automatiques du lot (dont l'isolation des entreprises à partir du lot 1).
- Commandes exactes pour installer, migrer, lancer et tester, mises à jour dans src/README.md.
- Comptes de démonstration et données fictives.

Démo de fin de lot :
La page de démonstration des composants s'affiche en clair et en sombre, en français et en anglais ; la liste des maquettes est complète pour les lots 1 à 7.
```

Liste de contrôle : `06_LOTS/lot_00/CHECKLIST.md`
