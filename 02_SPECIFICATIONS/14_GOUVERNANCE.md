# Smart Collab — 14. Gouvernance du développement

> Extrait de `00_CAHIER_DES_CHARGES_COMPLET.md`. En cas d'écart, le cahier complet fait foi.

Antigravity écrit le code ; ce cahier des charges et les fichiers du dossier de cadrage sont sa seule source de vérité. Le dépôt a été reconstruit le 22 novembre 2026 sous le nom smart-collab, aligné sur ce cahier des charges ; l'ancien cadrage « MVP Retail » est rangé dans ses archives.

### Fait dans le dépôt, reste avant le lot 1

- [x] Renommer le projet en Smart Collab (README, AGENTS.md, documents).
- [x] Remplacer le PRD, le TRD, l'Appflow et le plan « MVP Retail » par ce cahier des charges découpé en fichiers.
- [x] Corriger les contradictions relevées : une seule stack (§10), multi-sites dans le premier périmètre, modes de règlement réels, journal des opérations dans le schéma.
- [x] Retirer du schéma SQL et des documents tout ce qui est propre à RUTHY'S.
- [x] Préparer un prompt et une liste de contrôle par lot dans `04_PROMPTS_AGENTS` et `06_LOTS`.
- [ ] Déposer les maquettes validées dans `05_UI_UX/maquettes`, un fichier par écran, avec la capture du prototype ou de la page DreamsERP d'inspiration (lot 0).

### Règles de travail

1. Un lot = un prompt = une démo testable ; jamais « construis tout l'ERP ».
2. Chaque prompt cite les identifiants d'exigences du lot (EF-…, ENF-…) ; l'agent ne code rien qui n'y figure pas.
3. Une branche Git par lot, fusionnée seulement après la démo et la liste de contrôle validées par la cheffe de projet.
4. Les tests automatiques du lot passent avant la fusion.
5. Toute décision qui change ce cahier des charges est notée dans le journal des décisions du dépôt, puis reportée ici.
6. Le prototype et l'archive DreamsERP restent dans `03_SOURCES_REFERENCE` comme référence visuelle ; leur code n'est jamais copié dans `src/`.

