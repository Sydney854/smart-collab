# Passation — état du projet au 26/11/2026

À lire en début de session, après `AGENTS.md`. Mis à jour à chaque fin de session.

## Où en est le projet

- **Lot en cours : lot 1 — Fondations** (branche `lot-01`, partie de `lot-00`), sur accord écrit du 26/11/2026. Le lot 0 (branche `lot-00`) est livré : application de base shadcn/ui, coquille à 2 modes (Liste / Mosaïque, fenêtres comme la vidéo de référence), icônes des modules, App Store, assistant, Paramètres → Apparence, 13 fiches du lot 1 ; sa liste de contrôle n'est pas à 100 % (voir « Points en attente »). `lot-00` n'est pas encore fusionnée dans `main`.
- Dossier de cadrage complet : cahier des charges (`02_SPECIFICATIONS/`), catalogue des 46 modules (`01_DOCUMENTATION/catalogue/CATALOGUE_MODULES.md`), plan en 12 lots avec prompts (`04_PROMPTS_AGENTS/`) et listes de contrôle (`06_LOTS/`).
- UI/UX : 76 fiches écran au statut « proposée » (`05_UI_UX/maquettes/`, index `INDEX.md`), dossier PowerPoint `05_UI_UX/DOSSIER_UI_UX_MODULES.pptx`, jetons `05_UI_UX/DESIGN_TOKENS.md`, composants `05_UI_UX/COMPOSANTS.md`.
- Références : captures du prototype (`03_SOURCES_REFERENCE/prototype/captures/`, par module) et de DreamsERP (`03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair|mode-sombre/`, par module).

## Décisions clés (détail dans `JOURNAL_DECISIONS.md`)

- Stack : Next.js + React 19 + TypeScript, Tailwind v4, **shadcn/ui**, Lucide, ApexCharts, TanStack Table, react-hook-form + zod, sonner, date-fns, habillés avec nos jetons (Inter, or, bleu marine) ; Supabase (base, connexion, stockage, fonctions) ; Stripe + Wave / Orange Money ; Vercel.
- DreamsERP acheté sous licence Extended, mais **son code n'est pas dans le dépôt** : on construit avec les outils open source en s'aidant des captures.
- Aucune donnée ni règle de RUTHY'S ; données de démonstration fictives.

## Environnements prêts

| Service | Élément |
| --- | --- |
| GitHub | dépôt privé `Sydney854/smart-collab`, branche `main` |
| Supabase | projet `smart-collab-dev`, réf. `ajkginvsjljqufvdppgc`, Paris (eu-west-3), vide ; connexion e-mail confirmée, TOTP, mot de passe ≥ 10 |
| Vercel | équipe « Team ERP », projet `smart-collab-web`, dossier `src/apps/web`, Node 24, Paris (cdg1), aperçus protégés ; variables `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (secrète) |

## Prochaine tâche : lot 1 (avant : lot 0, terminé ci-dessous)

Sur une branche `lot-00` (lire `04_PROMPTS_AGENTS/LOT_00_MAQUETTES_DESIGN.md` et `06_LOTS/lot_00/CHECKLIST.md`) :
1. Créer l'application de base dans `src/apps/web` (dépôt unique pnpm + Turborepo) : Next.js, Tailwind v4, shadcn/ui aux jetons de `DESIGN_TOKENS.md`, thème clair / sombre, français / anglais.
2. Créer la page de démonstration des composants de `COMPOSANTS.md`, déployée en aperçu Vercel.
3. Ensuite : maquettes manquantes et validation des fiches écran, module par module (lots 1 à 3 d'abord).

## Points en attente

- **Lot 0 non clos (accord du 26/11 pour avancer quand même)** : validation des 89 fiches ; fiches manquantes du lot 1 (masques de champs, création de compte par invitation), de la caisse (modèle de ticket 80 mm / A4, ouverture / clôture de session, retour depuis un ticket) et des lots 2 à 7 ; **nettoyage du PowerPoint `05_UI_UX/DOSSIER_UI_UX_MODULES.pptx` (noms de sites réels du client fondateur) par la session de pilotage, sans le partager d'ici là** (l'ancienne version reste dans l'historique du dépôt privé).
- **Avant la base du lot 1** : faire trancher « une personne peut-elle appartenir à plusieurs entreprises ? » (décision Q5c du 26/11).
- Au lot 1 : prévoir dans l'entreprise de démonstration un module construit **non installé**, pour montrer le bouton « Installer » (décision Q3).

- **Pour le lot 1 (contrôle de sécurité du 26/11/2026)** : la présentation de l'assistant et le style d'icône par défaut sont des réglages **de l'entreprise** ; au lot 1, les enregistrer par une action serveur réservée à l'administrateur (rôle lu dans la session, filtre sur l'entreprise), et non plus seulement dans le navigateur. Ajouter aussi les en-têtes de sécurité (protection contre l'affichage dans une autre page) avec la connexion.

- Lien Vercel ↔ GitHub vérifié le 25/11/2026 : chaque envoi sur `main` déclenche un déploiement. Les déploiements échouent tant que `src/apps/web` n'existe pas (attendu). Après le premier déploiement réussi, ajouter l'adresse Vercel dans Supabase → Authentication → Redirect URLs.
- Code d'achat et certificat de licence DreamsERP à ajouter dans `00_GOUVERNANCE/LICENCES.md` et `00_GOUVERNANCE/licences/`.
- Répartition du travail entre Claude Code et Antigravity à décider.
- Composants techniques et mesures de sécurité « à valider » (`10_ARCHITECTURE_STACK.md`, `11_SECURITE_NFR.md`).
- Quelques mentions « PostgreSQL 16 » à passer en 17 (`02_SPECIFICATIONS/README.md`).

## Façon de travailler avec la cheffe de projet

- **Maquettes livrées aussi en artefact** (page claude.ai à commenter), en plus de l'adresse de l'aperçu Vercel : une maquette numérotée (M-01, M-02…) par écran ou état, avec ce qu'elle montre, les points à regarder et les ajustements en attente. Page actuelle du lot 0 : https://claude.ai/artifact/GT62apmrcXFuQqiXYwpRuE (à mettre à jour au même lien à chaque étape).

Avant chaque étape : expliquer ce qui va être construit. À la fin : résumer, lister les ajustements possibles (faciles maintenant ou coûteux plus tard), attendre sa décision (règle dans `AGENTS.md`).

Elle n'est pas développeuse : expliquer en français simple, avancer par étapes courtes, tester avant de livrer, dire clairement ce qui est fait et ce qui ne l'est pas, ne jamais demander ni afficher de clé secrète.
