# Code source — Smart Collab

Organisation imposée (`02_SPECIFICATIONS/10_ARCHITECTURE_STACK.md`, décisions du 22/11/2026) :

```
src/
  apps/web          application (Next.js + React 19, Tailwind v4, shadcn/ui, Lucide, ApexCharts, TanStack Table, react-hook-form + zod, sonner, date-fns, habillés avec nos jetons, installable hors ligne)
  apps/console      console éditeur
  apps/site         site commercial (Next.js, lot 12)
  apps/<id>/        une application ERP = manifest.ts + migrations + seeds + public.ts (16_CONTRAT_APPLICATION.md)
  packages/ui       composants (05_UI_UX/COMPOSANTS.md)
  packages/rules    moteur de règles partagé navigateur / fonctions serveur
  packages/schemas  schémas Zod partagés
  packages/i18n     traductions fr / en
  supabase/         base PostgreSQL, sécurité par entreprise, connexion, stockage, fonctions serveur (Edge Functions), tâches planifiées
    migrations/     migrations SQL versionnées (dont 02_SPECIFICATIONS/sql/, adaptées à Supabase Auth)
    functions/      fonctions serveur (paiements Stripe / Wave / Orange Money, documents, file d'événements)
  docker/           image de l'application pour l'installation chez le client (avec Supabase auto-hébergé)
```

Mise en ligne : Vercel (préversion par branche, production depuis la branche principale) et Supabase en région Paris. Les secrets (clé d'administration Supabase, clés Stripe) restent dans les variables secrètes de Vercel et de Supabase, jamais dans le code ni dans le navigateur (`11_SECURITE_NFR.md`, SEC-MO-02).

Après chaque lot, documenter ici : commandes d'installation et de lancement (dont `supabase start` en local), comptes de démonstration, adresse locale, commande des tests.

## État au lot 0 (branche `lot-00`)

Ce qui existe :

```
src/
  package.json, pnpm-workspace.yaml, turbo.json   dépôt unique pnpm + Turborepo
  apps/web           application Next.js 16 (React 19, Tailwind v4, shadcn/ui, next-intl)
    app/page.tsx     page unique : le cadre à 2 modes (Liste / Mosaïque) affiche les écrans ; écran courant dans l'adresse (/?ecran=…)
    screens/         écrans (écrits une fois, affichés en page ou en fenêtre) : tableau de bord, composants (démo), modules à venir
    tests/unit       test « aucune couleur codée en dur hors des jetons »
    tests/e2e        tests d'écran Playwright (ordinateur + téléphone)
  packages/ui        jetons (tokens.ts = seule source des couleurs), composants shadcn/ui (src/components/ui), composants de COMPOSANTS.md
  packages/i18n      traductions fr / en (messages/fr.json, messages/en.json)
```

Pas encore de base de données ni de connexion : rien à migrer au lot 0 (pas de `supabase start`).

### Prérequis

- Node.js 22 ou plus (Vercel : Node 24)
- pnpm 10 : `corepack enable` (ou `npm install -g pnpm@10`)

### Installer

```bash
cd src
pnpm install
```

### Lancer en développement

```bash
cd src
pnpm dev
```

Puis ouvrir http://localhost:3000 (tableau de bord) ou http://localhost:3000/?ecran=components (les 14 composants ; l'ancienne adresse /demo y mène)

### Construire et lancer comme en production

```bash
cd src
pnpm build
pnpm --filter @smart-collab/web start
```

### Tester

Tests unitaires (jetons, montants, traductions, couleurs en dur) :

```bash
cd src
pnpm test
```

Tests d'écran dans un navigateur (après `pnpm build`) :

```bash
cd src
pnpm test:e2e
```

Contrôle des types :

```bash
cd src
pnpm typecheck
```

### Comptes de démonstration

Aucun au lot 0 (pas de connexion). L'utilisatrice affichée « Awa Koné, Administratrice (démo) » et toutes les données de la page sont fictives (`apps/web/lib/demo-data.ts`).

### Thème et langue

- Thème clair / sombre et couleur principale : bouton lune et palette en haut à droite ; choix mémorisés dans les cookies `sc-theme` et `sc-accent`.
- Langue : bouton FR / EN ; choix mémorisé dans le cookie `NEXT_LOCALE` (français par défaut). Les adresses ne changent pas selon la langue.
- Les couleurs ne s'écrivent que dans `packages/ui/src/tokens.ts` ; Tailwind n'a plus ses couleurs par défaut. Classes disponibles : noms shadcn (`bg-primary` = or, `text-muted-foreground`, `border-border`, `bg-sidebar`…) et nos couleurs d'état (`text-green`, `bg-amber-l`…). Correspondance : `05_UI_UX/DESIGN_TOKENS.md`.

### Modes d'affichage (Liste / Mosaïque)

- Bouton dans l'en-tête ; choix retenu dans le cookie `sc-layout` (`list` ou `mosaic`).
- Mosaïque : fenêtres déplaçables et redimensionnables (`react-rnd`), réduites dans la barre d'onglets, plein écran sur téléphone, 6 écrans ouverts au maximum (onglets compris).
- Ajouter un écran : un composant dans `apps/web/screens/`, déclaré dans `apps/web/screens/registry.tsx`. Pour la mise en page, utiliser les requêtes de conteneur (`@md:`, `@xl:`…) et non `sm:` / `lg:` : l'écran suit ainsi la largeur de la page ou de la fenêtre.

### Ajouter un composant shadcn/ui

```bash
cd src/packages/ui
pnpm dlx shadcn@4.23.0 add <nom-du-composant>
```

Le composant est copié dans `packages/ui/src/components/ui/`. Vérifier ensuite `pnpm test` (le test des couleurs signale toute couleur écrite en dur, par exemple `bg-black/10` à remplacer par `bg-overlay`). Ne pas ajouter de composant qui installe Recharts, `@dnd-kit` ou `vaul` (hors stack).

### Vercel

Projet `smart-collab-web`, dossier racine `src/apps/web` : Vercel détecte pnpm et le dépôt unique, aucune variable n'est nécessaire au lot 0.
