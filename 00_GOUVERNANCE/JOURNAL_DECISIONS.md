# Journal des décisions — Smart Collab

**Lot en cours :** lot 0 — Maquettes et design

| Date | Décision | Pourquoi |
|------|----------|----------|
| 2026-11 | Le prototype HTML reste une référence d'écrans, pas du code de production | Fichier unique sans base de données ni serveur |
| 2026-11-22 | Le produit s'appelle Smart Collab ; produit multi-entreprises et multi-métiers | Vendre à d'autres entreprises que RUTHY'S |
| 2026-11-22 | Aucune donnée ni règle de RUTHY'S ; règles de calcul configurables par entreprise | Produit générique |
| 2026-11-22 | Écrans du prototype ; écrans absents maquettés en s'inspirant de DreamsERP, sans réutiliser ses fichiers *(remplacée le 23/11/2026, ligne suivante)* | Cohérence visuelle, respect de la licence |
| 2026-11-23 | DreamsERP acheté sous **licence Extended** : son code et ses composants (version React / Next.js) sont réutilisables dans Smart Collab ; données, textes et images de démonstration non repris | Gagner du temps de développement ; licence adaptée à un produit payant |
| 2026-11-22 | Chaque module est une application installable et reliée aux autres (modèle Odoo) | Modularité réelle |
| 2026-11-22 | Hors ligne : caisse, inventaire, réceptions, terrain chantier, saisie des temps | Coupures internet fréquentes |
| 2026-11-22 | Agent de code : Antigravity | Choix de la cheffe de projet |
| 2026-11-22 | Espace de travail Claude Code sur le dépôt GitHub privé `smart-collab` ; instructions dans `CLAUDE.md` (renvoie à `AGENTS.md`). Répartition du travail entre Claude Code et Antigravity à préciser | Coder avec Claude sur le même dossier |
| 2026-11-22 | Vente en abonnement en ligne **et** en installation chez le client ; facturation annuelle au minimum | Deux types de clients |
| 2026-11-22 | Lancement Côte d'Ivoire et UEMOA ; français et anglais | Marché cible |
| 2026-11-22 | Premiers métiers commercialisés : Commerce de détail et Multi-sites | Lots 1 à 7 |
| 2026-11-22 | Matériel de caisse pris en charge (imprimante de tickets, tiroir, lecteur de codes-barres) | Usage boutique |
| 2026-11-22 | Comptabilité SYSCOHADA et fiscalité des entreprises incluses | Lot 7 |
| 2026-11-22 | Référence technique de l'écran : version Next.js / React de DreamsERP — Next.js, React 19, TypeScript, Tailwind v4, Ant Design v6 + Preline habillés avec nos jetons | Gagner du temps avec des composants éprouvés ; aucun fichier DreamsERP réutilisé |
| 2026-11-22 | Serveur, base et connexion : Supabase (PostgreSQL, Supabase Auth, stockage, fonctions serveur) ; remplace la proposition Node.js + NestJS | Choix de la cheffe de projet ; isolation des entreprises par la base, moins de serveur à maintenir |
| 2026-11-22 | Paiements : Stripe (cartes) + Wave et Orange Money (mobile money) | Choix de la cheffe de projet ; accès de la société à Stripe à vérifier |
| 2026-11-22 | Déploiement en ligne : Vercel ; chez le client : conteneur Docker + Supabase auto-hébergé | Choix de la cheffe de projet ; garder les deux modes de vente |
| 2026-11-25 | Projet Supabase de développement `smart-collab-dev` créé : région Paris (eu-west-3), PostgreSQL 17, organisation Supabase « Ruthy's plus » (à transférer vers une organisation Smart Collab), référence `ajkginvsjljqufvdppgc` | Base de développement, données fictives uniquement |
| 2026-11-25 | Démarrage **sans le code DreamsERP** : écrans construits avec les outils gratuits (Next.js, React, Ant Design, Preline, Tailwind) et nos jetons ; le dossier `nextjs` de DreamsERP (licence Extended) pourra être ajouté plus tard sans changer la stack | Le code source n'est pas disponible ; ne pas bloquer le lot 0 |
| 2026-11-25 | Lot 0 : la langue et le thème sont mémorisés dans des cookies (pas de /fr ou /en dans l'adresse) ; `packages/ui/src/tokens.ts` est la seule source des couleurs ; les styles Ant Design passent dans une couche CSS sous Tailwind | Pas de « flash » au chargement ; contrôle automatique des couleurs |
| à valider | Valeurs du thème sombre et couleurs du sélecteur de thème (`05_UI_UX/DESIGN_TOKENS.md`) | Proposées au lot 0 |
| à valider | Composants techniques restants (état, données, hors ligne, tâches planifiées, documents, e-mails, langues, qualité, organisation du dépôt) | Liste dans `10_ARCHITECTURE_STACK.md`, « Composants à valider » |
| à valider | Mesures de sécurité Supabase / Vercel | Liste dans `11_SECURITE_NFR.md`, « Mise en œuvre » |
| à valider | Hébergement : Vercel + Supabase en région Paris au lancement + dossier ARTCI ; centre de données à Abidjan plus tard | Proposition `10_ARCHITECTURE_STACK.md` |
| à valider | Raccordement de Wave / Orange Money : API marchandes directes ou agrégateur UEMOA (CinetPay, PayDunya) | Proposition `12_COMMERCIALISATION.md` |
