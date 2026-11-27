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

## Lot 1 (branche `lot-01`) — étape 1 : base de données du socle

```
src/supabase/
  migrations/20261126000100_socle_plateforme.sql   tables du socle, sécurité par entreprise (RLS activée et forcée partout)
  tests/00_supabase_local.sql                      imitation minimale de Supabase (rôles, auth.uid(), auth.jwt()) pour les tests
  tests/fixtures.sql                               deux entreprises fictives A et B, quatre personnes fictives
  tests/10_… à 40_….sql                            tests : couverture RLS, isolation A / B, ajout seul, entreprise du jeton
  scripts/test-db.sh                               crée une base jetable, applique les migrations, lance les tests
```

Principes (décisions du 26/11/2026) :
- une personne = un compte de connexion Supabase, reliée à une ou plusieurs entreprises (`memberships`) ;
- l'entreprise courante est ajoutée au jeton par la base (`custom_access_token_hook`), puis revérifiée à chaque requête (`app.current_tenant()` : la personne doit être membre active) ;
- les écrans n'ont que la lecture ; les écritures passeront par des fonctions serveur (étapes suivantes) ;
- journal d'audit et journal des accès en ajout seul, même pour le propriétaire de la base.

Tester la base (PostgreSQL 16 ou plus installé : `initdb`, `pg_ctl`, `psql` ; aucune connexion à Internet ni à Supabase) :

```bash
cd src
pnpm test:db
```

Intégration continue : `.github/workflows/ci.yml` (racine du dépôt) lance à chaque envoi les tests de l'application (types, unitaires, construction, écrans) et ceux de la base.

Supabase en local (`supabase start`) demande Docker : pas encore configuré (le conteneur de développement n'a pas Docker en marche). Les tests utilisent une base PostgreSQL seule qui imite Supabase (écart au prompt du lot 1 accepté le 26/11, décision E2).

Vérification sur le vrai Supabase (projet de développement `smart-collab-dev`, 27/11/2026) :
- migration appliquée sous le nom `socle_plateforme` (même contenu que le fichier, sans les commentaires) ; à l'arrivée du CLI Supabase, aligner l'historique (`supabase migration repair`) ;
- 23 tables, toutes avec RLS activée et forcée, aucune sans règle, aucun droit pour `anon`, aucune écriture pour `authenticated`, clé de licence illisible ;
- le test d'isolation (17 tables d'entreprise), le crochet de connexion et l'ajout seul passent, dans une transaction annulée (aucune donnée laissée) ;
- conseils de sécurité Supabase : un seul avertissement, voulu — `select_tenant` est appelable par une personne connectée (elle vérifie l'appartenance avant d'agir).
- reste à faire à l'étape 2 : brancher le crochet dans Supabase → Authentication → Hooks (`public.custom_access_token_hook`).

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
- Mosaïque (décisions du 26/11/2026) : pas de barre d'onglets ; ouverture à 70 % × 80 % du bureau en cascade ; déplacement par contour (Échap annule), redimensionnement (`react-rnd`), taille minimale 640 × 440, barre de titre toujours attrapable ; fenêtres réduites dans une barre en bas à gauche, affichée seulement s'il y en a ; plein écran sur téléphone ; 6 écrans ouverts au maximum.
- Ajouter un écran : un composant dans `apps/web/screens/`, déclaré dans `apps/web/screens/registry.tsx`. Pour la mise en page, utiliser les requêtes de conteneur (`@md:`, `@xl:`…) et non `sm:` / `lg:` : l'écran suit ainsi la largeur de la page ou de la fenêtre.

### Icônes des modules et Paramètres → Apparence

- Icônes illustrées des tuiles de modules (mosaïque, App Store, assistant) : `packages/ui/src/components/ModuleIcon.tsx` (un dessin par module, rôles de couleur `p s t n w`, 6 styles). Couleurs : `MODULE_PALETTE` et `ICON_INKS` dans `tokens.ts`. Le reste de l'interface reste en Lucide.
- Réglages (écran Paramètres) : style (`sc-icon-style`), taille (`sc-icon-size`), présentation de l'assistant (`sc-wizard`) ; listes fermées dans `packages/ui/src/icon-settings.ts`.
- Nouveau module : ajouter son dessin dans `MODULE_ICONS` (géométrie 48 × 48 + rôles + couleur + trio), puis `moduleIcon` dans `apps/web/screens/registry.tsx`.
- App Store (`?ecran=apps`) et assistant (`?ecran=setup`) : maquettes du lot 0, données fictives (`apps/web/lib/modules.ts`) ; la version réelle arrive au lot 1.

### Ajouter un composant shadcn/ui

```bash
cd src/packages/ui
pnpm dlx shadcn@4.23.0 add <nom-du-composant>
```

Le composant est copié dans `packages/ui/src/components/ui/`. Vérifier ensuite `pnpm test` (le test des couleurs signale toute couleur écrite en dur, par exemple `bg-black/10` à remplacer par `bg-overlay`). Ne pas ajouter de composant qui installe Recharts, `@dnd-kit` ou `vaul` (hors stack).

### Vercel

Projet `smart-collab-web`, dossier racine `src/apps/web` : Vercel détecte pnpm et le dépôt unique, aucune variable n'est nécessaire au lot 0.
