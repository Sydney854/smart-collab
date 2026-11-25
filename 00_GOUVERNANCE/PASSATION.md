# Passation — état du projet au 25/11/2026

À lire en début de session, après `AGENTS.md`. Mis à jour à chaque fin de session.

## Où en est le projet

- **Lot en cours : lot 0 — Maquettes et design** (pas encore commencé dans le code ; `src/` ne contient que `README.md`).
- Dossier de cadrage complet : cahier des charges (`02_SPECIFICATIONS/`), catalogue des 46 modules (`01_DOCUMENTATION/catalogue/CATALOGUE_MODULES.md`), plan en 12 lots avec prompts (`04_PROMPTS_AGENTS/`) et listes de contrôle (`06_LOTS/`).
- UI/UX : 76 fiches écran au statut « proposée » (`05_UI_UX/maquettes/`, index `INDEX.md`), dossier PowerPoint `05_UI_UX/DOSSIER_UI_UX_MODULES.pptx`, jetons `05_UI_UX/DESIGN_TOKENS.md`, composants `05_UI_UX/COMPOSANTS.md`.
- Références : captures du prototype (`03_SOURCES_REFERENCE/prototype/captures/`, par module) et de DreamsERP (`03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair|mode-sombre/`, par module).

## Décisions clés (détail dans `JOURNAL_DECISIONS.md`)

- Stack : Next.js + React 19 + TypeScript, Tailwind v4, Ant Design v6 + Preline habillés avec nos jetons ; Supabase (base, connexion, stockage, fonctions) ; Stripe + Wave / Orange Money ; Vercel.
- DreamsERP acheté sous licence Extended, mais **son code n'est pas dans le dépôt** : on construit avec les outils open source en s'aidant des captures.
- Aucune donnée ni règle de RUTHY'S ; données de démonstration fictives.

## Environnements prêts

| Service | Élément |
| --- | --- |
| GitHub | dépôt privé `Sydney854/smart-collab`, branche `main` |
| Supabase | projet `smart-collab-dev`, réf. `ajkginvsjljqufvdppgc`, Paris (eu-west-3), vide ; connexion e-mail confirmée, TOTP, mot de passe ≥ 10 |
| Vercel | équipe « Team ERP », projet `smart-collab-web`, dossier `src/apps/web`, Node 24, Paris (cdg1), aperçus protégés ; variables `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (secrète) |

## Prochaine tâche : lot 0

Sur une branche `lot-00` (lire `04_PROMPTS_AGENTS/LOT_00_MAQUETTES_DESIGN.md` et `06_LOTS/lot_00/CHECKLIST.md`) :
1. Créer l'application de base dans `src/apps/web` (dépôt unique pnpm + Turborepo) : Next.js, Tailwind v4, Ant Design + Preline aux jetons de `DESIGN_TOKENS.md`, thème clair / sombre, français / anglais.
2. Créer la page de démonstration des composants de `COMPOSANTS.md`, déployée en aperçu Vercel.
3. Ensuite : maquettes manquantes et validation des fiches écran, module par module (lots 1 à 3 d'abord).

## Points en attente

- Vérifier au premier déploiement que Vercel est bien relié au dépôt GitHub ; puis ajouter l'adresse Vercel dans Supabase → Authentication → Redirect URLs.
- Supprimer la variable Vercel en double `SUPABASE_SECRET_KEY1` (à faire par la cheffe de projet).
- Code d'achat et certificat de licence DreamsERP à ajouter dans `00_GOUVERNANCE/LICENCES.md` et `00_GOUVERNANCE/licences/`.
- Répartition du travail entre Claude Code et Antigravity à décider.
- Composants techniques et mesures de sécurité « à valider » (`10_ARCHITECTURE_STACK.md`, `11_SECURITE_NFR.md`).
- Quelques mentions « PostgreSQL 16 » à passer en 17 (`02_SPECIFICATIONS/README.md`).

## Façon de travailler avec la cheffe de projet

Elle n'est pas développeuse : expliquer en français simple, avancer par étapes courtes, tester avant de livrer, dire clairement ce qui est fait et ce qui ne l'est pas, ne jamais demander ni afficher de clé secrète.
