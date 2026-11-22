# DreamsERP — contenu technique des six versions

**Statut : proposée** · relevé le 22/11/2026 dans la documentation en ligne de l'éditeur (captures `captures/doc.*.png`, voir `CAPTURES.md` de ce dossier).

DreamsERP est vendu en six versions qui affichent les mêmes écrans : **Tailwind (HTML)**, **Angular**, **React**, **Next.js**, **Vue** et **Laravel**. Cette fiche résume ce que la documentation de chacune dit de sa technique, pour comparer avec le socle choisi par Smart Collab (`02_SPECIFICATIONS/10_ARCHITECTURE_STACK.md`).

Rappel : DreamsERP sert d'**inspiration seulement**. Aucun fichier n'est réutilisé (décision du 22/11/2026), et la licence Envato (Regular / Extended) ne couvre qu'un seul produit final. Les idées notées en fin de fiche sont à réécrire, pas à copier.

Sources : [documentation](https://dreamserp.dreamstechnologies.com/documentation/) ·
[Tailwind](https://dreamserp.dreamstechnologies.com/documentation/tailwind.html) ·
[Angular](https://dreamserp.dreamstechnologies.com/documentation/angular.html) ·
[React](https://dreamserp.dreamstechnologies.com/documentation/react.html) ·
[Next.js](https://dreamserp.dreamstechnologies.com/documentation/nextjs.html) ·
[Vue](https://dreamserp.dreamstechnologies.com/documentation/vue.html) ·
[Laravel](https://dreamserp.dreamstechnologies.com/documentation/laravel.html)

## 1. Comparaison rapide

| | Tailwind (HTML) | Angular | React | Next.js | Vue | Laravel |
|---|---|---|---|---|---|---|
| Version de la doc | v1.0.3 | v1.0.3 | v1.0.4 | v1.0.4 | v1.0.4 | v1.0.4 |
| Langage | HTML5, JavaScript ES6 | TypeScript | TypeScript (~6.0.2) | TypeScript (^5) | TypeScript (`main.ts`) | PHP 8.4 (8.3 minimum) |
| Cadre | aucun (pages statiques) | Angular, CLI 22 | React 19.3.1 | Next.js 16.3.8 (App Router) + React 19.3.1 | Vue 3.5.44 | Laravel 13.39.0 |
| Outil de construction | Vite | Angular CLI (`ng`) | Vite 8 | Next.js | Vite | Vite (+ Composer) |
| Node.js | 18 ou plus | 24 ou plus | ^24.4.1 | ^24.4.1 | ^24.4.1 | requis pour Vite |
| Tailwind CSS | v4 (`@theme` dans le CSS) | v4.3 annoncé, mais installation décrite à l'ancienne (`tailwind.config.js`) | v4.3.2, configuration dans le CSS (`@source`, `@plugin`) | v4.3.2 via PostCSS, sans `tailwind.config.js` | v4.1.13 avec un tableau `content` (style v3) | Tailwind 4 |
| Comportements (menus, fenêtres, onglets) | Preline | Preline | Preline v4 (réinitialisé après chaque changement de page) | Preline | Preline | Preline (pages Blade) |
| Bibliothèque de composants | — | — | Ant Design v6 | Ant Design v6 | ant-design-vue, Flowbite | — |
| Navigation | une page HTML par écran, morceaux communs inclus au build (`@@include`) | routes Angular (`app.routes.ts`) | React Router v7, pages chargées à la demande (~222 routes) | App Router, groupes de routes | Vue Router, pages chargées à la demande | routes `web.php`, gabarits Blade |
| État partagé | — | services (`app/core`) | Redux Toolkit | Redux Toolkit | non précisé (la doc parle de Redux, voir §4) | non décrit |
| Données | en dur dans les pages | en dur | **services « maquette d'abord »** : données d'exemple, bascule vers une API REST | idem React | en dur | base MySQL ou SQLite, migrations (contenu non décrit) |
| Création / modification réelles | non | non | **oui** (gardées dans le navigateur) | **oui** | non | non décrit |
| Connexion et rôles | pages seulement | pages seulement | **comptes de démonstration, 3 rôles** | **idem React** | pages seulement | non décrit |
| Export PDF / Excel | bouton seulement | bouton seulement | **fichiers réels** (lignes affichées) | **idem React** | bouton seulement | bouton seulement |
| Graphiques | ApexCharts, ECharts, Chart.js | ApexCharts | ApexCharts, Chart.js, ECharts | idem React | ApexCharts (vue3-apexcharts), ECharts (vue-echarts) | non précisé |
| Icônes | Lucide, Phosphor, Font Awesome, Tabler | Lucide (Tabler cité dans les crédits) | polices d'icônes hébergées localement | idem React | Lucide, Iconoir, Phosphor, Tabler, Font Awesome | Lucide, Phosphor, Font Awesome, Tabler |
| Lancer en local | `npm run dev` → port 3000 | `ng serve` → port 4200 | `npm run dev` → port 5173, chemin `/react` | `npm run dev` | `npm run dev` → port 3000 | `php artisan serve` → port 8000 |
| Livrable | dossier `dist/` (statique) | dossier `dist/` | dossier `dist/`, servi sous `/react` | export statique `out/` (`output: "export"`), servi sous `/nextjs` | build Vite | application PHP (`public/`) |

## 2. Points communs aux six versions

- **Mêmes écrans** : 3 variantes de tableau de bord annoncées (9 en ligne), 10+ applications (employés et présence, CRM, finance, stock, calendrier, kanban, tâches, messagerie, fichiers), 200+ pages, 24 composants d'interface (accordéon, alertes, avatars, badges, fil d'Ariane, boutons, cartes, presse-papiers, couleurs, glisser-déposer « Dragula », menus, grille, images, visionneuse, fenêtres, onglets, panneau latéral, pagination, infobulles, progression, curseur, typographie).
- **Police** : Geist (Google Fonts), remplaçable par une variable `--font-family-primary` dans le bloc `@theme`.
- **Couleurs** : jetons dans `@theme` (`--color-primary`, `--color-secondary`, `--color-success`, `--color-warning`, `--color-danger`) ; les éléments s'y réfèrent par `@apply` et variables (ex. `--topbar-bg`).
- **Thème sombre** : attribut `data-theme="dark"` sur `<html>` et variante Tailwind `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))` ; le choix est mémorisé dans le navigateur et appliqué avant l'affichage pour éviter un éclair blanc.
- **Droite-à-gauche (RTL)** : `dir="rtl"` sur `<html>` ; les marges et alignements basculent grâce aux propriétés logiques de Tailwind.
- **Dispositions** : menu normal, menu réduit à 56 px (icônes, déplié au survol), menu caché, survol, pleine largeur, RTL (et « deux colonnes » cité dans la doc Angular).
- **Logos** : trois fichiers SVG (`logo.svg` clair, `logo-small.svg` menu réduit, `logo-white.svg` sombre).
- **Hors périmètre de l'éditeur** : le support couvre les bogues du modèle, pas l'installation ni le développement ; un développement sur mesure (branchement d'une base, d'une API) est vendu à part.

## 3. Détail par version

### Tailwind (HTML statique)
- Structure : `src/` (pages HTML, `partials/` pour en-tête, barre du haut, menu, pied, scripts ; `assets/css`, `img`, `js`, `libs`), `plugins/` (inclusion de fichiers au build), `dist/` (sortie), `vite.config.js`, `postcss.config.js`.
- Chaque page assemble les morceaux communs : `@@include('partials/topbar.html')`, `sidebar.html`, `footer.html`, `script.html`.
- Scripts : `assets/js/script.js` (commun, en module) ; scripts par page pour les graphiques (`apex-chart-data.js`, `echart-chart-data.js`), les tableaux (`datatable.js`), la visionneuse (`lightbox.js`). Toutes les données des graphiques et tableaux sont écrites dans ces fichiers.
- C'est la version capturée dans ce dossier (`*.png`). Aucune donnée ni logique réelle.

### Angular
- Prérequis : Node 24, Angular CLI 22 (`npm install -g @angular/cli@22`), Tailwind 4.3.
- Structure : `src/app/core` (modèles, routes, services), `features/` (pages : `auth`, `error`, `Pages`), `layouts/` (en-tête, pied), `shared/` (composants partagés), `app.config.ts`, `app.routes.ts`.
- Commandes : `ng serve` (port 4200), `ng build` → `dist/`.
- Tailwind : la doc fait installer `tailwindcss` puis `npx tailwindcss init -p` et un `tailwind.config.js` avec `@tailwindcss/forms` et Preline — méthode de Tailwind v3, incohérente avec la v4 annoncée (voir §4).
- Icônes : Lucide seulement d'après la doc.

### React
- Prérequis : React 19.3.1, TypeScript ~6.0.2, Node ^24.4.1, Vite 8 ; compilateur React activé.
- Structure : `src/components/` (fil d'Ariane, sélecteurs de date et de période, en-tête, menu, pied, liste déroulante…), `src/views/` (un dossier par module : `crm`, `hrm`, `finance`, `inventory`, `pos`, `projects`, `purchase`, `sales`, `support`, `system`…), `src/routes/`, `src/redux/`, `src/core/`.
- Navigation : `react-router-dom` v7 ; `all_routes.tsx` (chemins), `router.link.tsx` (~222 routes `{ id, path, element, route, meta_title }`, réparties en pages publiques, connexion, caisse, démonstrations de disposition), `router.tsx` (une disposition par groupe), `lazyRoute.tsx` (chargement à la demande avec squelette d'attente, puis réinitialisation de Preline), `dynamicTitle.tsx` (titre de l'onglet).
- **Couche de données** : un service par entité, `createCrudService(nom, adresse, données d'exemple)`, qui offre `useList()` (lecture) et `useCrud()` (`data, isLoading, refetch, create, update, remove`). Par défaut, les données d'exemple (`src/core/data/mock/`) ; `VITE_USE_MOCK=false` + `VITE_API_URL` pour appeler une vraie API REST sans toucher aux pages. En mode maquette, les modifications sont gardées dans le navigateur (clés `erp-data:`), `__erp.resetDemoData()` les efface.
- **Fenêtres Ajouter / Modifier / Supprimer branchées** (`useSelectedRow`, `useModalForm`), numérotation qui continue celle de la liste (#RF0020 → #RF0021), pages de modification et de détail ouvertes avec un identifiant dans l'adresse.
- **Connexion et droits** : comptes de démonstration (`demoUsers.ts`) ; inscription, mot de passe oublié, vérification, réinitialisation et verrouillage fonctionnent contre ces comptes. Trois rôles : Admin (tout ; créer, modifier, supprimer), Manager (tout sauf Système), Staff (modules de base ; créer et modifier). Règles dans `access.ts` (sections du menu visibles) et `permissions.ts` (composant `<Can>` qui masque une action).
- **Export et impression** : « Exporter en PDF / Excel » produit de vrais fichiers avec exactement les lignes affichées (recherche, filtre, tri et colonnes compris), géré une seule fois dans la disposition (`useExportLinks()`) ; l'impression masque en-tête, menu et pied.
- **Enchaînement des documents** (`src/core/domain/flows.ts`, chaque étape écrite dans un journal d'audit) : Ventes devis accepté → commande → bon de livraison → facture, facture remboursée → remboursement ; Achats demande de prix attribuée → bon de commande approuvé → réception → paiement ; Stock ajustements et transferts terminés → niveaux de stock ; RH offre acceptée → intégration → employé ; CRM prospect converti → affaire.
- Thème : Redux (`layoutSlice.ts`), clé `dt-theme` dans le navigateur, `LayoutSync.tsx` écrit `data-theme` et `dir="rtl"` sur `<html>`.
- Tailwind v4.3.2 configuré dans `src/style/css/style.css` (`@import "tailwindcss"`, `@plugin "@tailwindcss/forms"`, `@source` pour Preline, `@layer`, `@custom-variant dark`) via le greffon `@tailwindcss/vite` ; le `tailwind.config.js` restant est inutilisé.
- Build : `tsc -b && vite build` → `dist/`, servi sous `/react` (`base` dans `vite.config.ts`).

### Next.js
- Prérequis : Next.js 16.3.8, React 19.3.1, TypeScript ^5, Node ^24.4.1 ; composants serveur, compilateur React.
- **Mêmes couche de données, CRUD, rôles, exports et enchaînement de documents que React** (variables `NEXT_PUBLIC_USE_MOCK`, `NEXT_PUBLIC_API_URL` ; identifiant passé en paramètre `?id=` plutôt que dans le chemin, pour rester compatible avec l'export statique).
- Structure App Router par **groupes de routes** : `(public-pages)` 196 pages avec la disposition menu + en-tête, `(auth-pages)` sans habillage, `(layout-demo-pages)`, `(pos-pages)` disposition caisse ; à l'intérieur, un groupe par module (`(crm)`, `(hrm)`, `(inventory)`…) qui n'ajoute rien à l'adresse.
- Disposition racine `src/app/layout.tsx` : métadonnées, petit script en ligne qui lit `dt-theme` et pose `data-theme` avant le premier affichage (d'où `suppressHydrationWarning`), police Geist ; `StoreProvider` (Redux) et `QueryProvider` (client de requêtes + règles d'enchaînement).
- Métadonnées par page : `generateMetadata` avec `getPageMetadata(nomDePage)`.
- Build : `output: "export"` → site statique dans `out/`, servi sous `/nextjs` ; Tailwind v4.3.2 via `@tailwindcss/postcss`, sans fichier de configuration.

### Vue
- Prérequis : Vue ≥ 3.5.44, Node ^24.4.1, Vite.
- Structure : `src/app`, `assets` (css, icônes, images), `components`, `router`, `views` (dont `views/layouts/layouts-header.vue`, `layouts-sidebar.vue`), `main.ts`, `App.vue`.
- `main.ts` : `createApp`, Vue Router, **ant-design-vue**, `vue3-apexcharts`, `vue-echarts` (jauge), `vue3-select-component`, Preline, Font Awesome, Lucide, Iconoir, Phosphor, Tabler.
- Tailwind v4.1.13 avec un tableau `content` qui inclut **Flowbite** et `flowbite-vue`, greffons `@tailwindcss/forms`, `@tailwindcss/typography`, `flowbite/plugin`.
- Pas de couche de données, de CRUD, de rôles ni d'export décrits.

### Laravel
- Prérequis : Laravel 13.39.0, PHP 8.4 (8.3 minimum), Composer, extensions PHP `bcmath, ctype, fileinfo, json, mbstring, openssl, pdo, tokenizer, xml`, Node.js pour Vite, MySQL ou SQLite, serveur Apache / Nginx (XAMPP, WAMP, MAMP en local).
- Structure Laravel standard : `app/Http/Controllers`, `Middleware`, `Models`, `config/`, `database/` (factories, migrations, seeders), `resources/views` (`layouts/`, `partials/`, `pages/`), `routes/web.php` et `api.php`, `public/build`.
- Pages en **Blade** : une disposition maîtresse, des sections de contenu, des morceaux inclus (barre du haut, menu, pied), des composants pour les fenêtres.
- Installation : `composer install`, `npm install`, `cp .env.example .env`, `php artisan key:generate`, base dans `.env`, `php artisan migrate`, `npm run build`, `php artisan serve` (port 8000).
- La doc ne décrit ni modèles métier, ni contrôleurs de données, ni authentification : c'est la version HTML servie par Laravel.

## 4. Incohérences relevées dans la documentation

- **FAQ du site commercial** : « pas de fonctions serveur, pas de base de données, pas d'authentification, pas d'API, pas de logique métier ». Vrai pour Tailwind, Angular et Vue ; les versions React et Next.js (v1.0.4) ont pourtant une couche de données, des comptes de démonstration, des rôles et un enchaînement de documents — tous côté navigateur, sans serveur.
- **Thème** : la doc Tailwind dit que le choix est gardé dans `sessionStorage` (`__THEME_CONFIG__`) avec clair par défaut ; le site en ligne s'ouvre en **sombre** et lit d'abord `localStorage["data-theme"]`.
- **Vue** : la section thème sombre parle de Redux et de fichiers `.ts` repris de React — copier-coller, Vue n'utilise pas Redux.
- **Angular** : Tailwind « 4.3 » annoncé mais installation de type v3 (`npx tailwindcss init -p`, `tailwind.config.js`).
- **Laravel** : la doc parle de « compilation SCSS » alors que le style est en Tailwind.
- **Versions** : Tailwind et Angular en v1.0.3, les autres en v1.0.4 ; certains numéros de version (React 19.3.1, TypeScript 6.0.2, Next.js 16.3.8, Laravel 13.39.0) sont ceux annoncés par l'éditeur, non vérifiés ici.

## 5. Ce que Smart Collab en retient

Décision du 22/11/2026 : la version Next.js / React de DreamsERP devient la **référence technique** de l'écran (voir §6). Les autres versions n'apportent rien de plus au projet ; Next.js est retenu pour le **site commercial**.

Idées de conception à reprendre **en les réécrivant** (aucun code copié) — à confronter aux exigences avant adoption :

| Idée vue dans DreamsERP React / Next.js | Équivalent Smart Collab |
|---|---|
| Un service par entité, données d'exemple puis API REST sans changer les pages | Couche d'accès aux données côté écran (TanStack Query) ; données de démonstration fictives pour l'environnement démo |
| Rôles qui masquent sections et actions (`access.ts`, `<Can>`) | Modèle rôle × module × action × périmètre (04_ROLES_DROITS.md), vérifié **aussi** par le serveur — dans DreamsERP la vérification n'est que dans le navigateur |
| Export PDF / Excel des lignes affichées, géré une seule fois | EF-BI-01 ; PDF généré côté serveur depuis les modèles (10_ARCHITECTURE_STACK.md) |
| Enchaînement devis → commande → livraison → facture, chaque étape dans un journal d'audit | EF-GEN-01, EF-GEN-03 ; flux configurables par le moteur (07_MOTEUR_CONFIGURATION.md) |
| Pages chargées à la demande avec squelette d'attente | État « chargement » des fiches écran (`05_UI_UX/maquettes/`) |
| Thème appliqué avant le premier affichage, variante `dark` sur un attribut | Jetons de `05_UI_UX/DESIGN_TOKENS.md`, thèmes clair / sombre |
| Numérotation qui prolonge celle de la liste | Règles de numérotation configurables (§7 Numérotation) |

À ne pas reprendre : données gardées dans le navigateur comme seule mémoire, comptes de démonstration en dur, droits vérifiés seulement à l'écran, suppression physique des enregistrements (contraire à EF-GEN-02).

## 6. Stack retenue (décisions du 22/11/2026)

La version **Next.js / React** de DreamsERP est la référence technique de l'écran de Smart Collab : Next.js, React 19, TypeScript, Tailwind v4, **Ant Design v6 + Preline habillés avec nos jetons de couleur**. Ce que DreamsERP fait dans le navigateur (données gardées localement, comptes de démonstration, droits seulement à l'écran) est remplacé par **Supabase** (base PostgreSQL, connexion, stockage, fonctions serveur). Paiements **Stripe** et **Wave / Orange Money** ; déploiement **Vercel**. Détail, composants encore à valider et points de vigilance : `02_SPECIFICATIONS/10_ARCHITECTURE_STACK.md` ; mesures de sécurité : `02_SPECIFICATIONS/11_SECURITE_NFR.md`.
