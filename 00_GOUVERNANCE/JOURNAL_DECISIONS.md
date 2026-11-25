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
| 2026-11-22 | Référence technique de l'écran : version Next.js / React de DreamsERP — Next.js, React 19, TypeScript, Tailwind v4, Ant Design v6 + Preline habillés avec nos jetons *(composants remplacés par shadcn/ui le 25/11/2026)* | Gagner du temps avec des composants éprouvés ; aucun fichier DreamsERP réutilisé |
| 2026-11-22 | Serveur, base et connexion : Supabase (PostgreSQL, Supabase Auth, stockage, fonctions serveur) ; remplace la proposition Node.js + NestJS | Choix de la cheffe de projet ; isolation des entreprises par la base, moins de serveur à maintenir |
| 2026-11-22 | Paiements : Stripe (cartes) + Wave et Orange Money (mobile money) | Choix de la cheffe de projet ; accès de la société à Stripe à vérifier |
| 2026-11-22 | Déploiement en ligne : Vercel ; chez le client : conteneur Docker + Supabase auto-hébergé | Choix de la cheffe de projet ; garder les deux modes de vente |
| 2026-11-25 | Projet Supabase de développement `smart-collab-dev` créé : région Paris (eu-west-3), PostgreSQL 17, organisation Supabase « Ruthy's plus » (à transférer vers une organisation Smart Collab), référence `ajkginvsjljqufvdppgc` | Base de développement, données fictives uniquement |
| 2026-11-25 | Démarrage **sans le code DreamsERP** : écrans construits avec les outils gratuits (Next.js, React, Tailwind ; Ant Design + Preline remplacés par shadcn/ui le même jour) et nos jetons ; le dossier `nextjs` de DreamsERP (licence Extended) pourra être ajouté plus tard sans changer la stack | Le code source n'est pas disponible ; ne pas bloquer le lot 0 |
| 2026-11-25 | Interface : **shadcn/ui** (blocs menu latéral et tableau de bord) à la place d'Ant Design + Preline ; icônes **Lucide** ; graphiques **ApexCharts** seul ; tableaux TanStack Table ; formulaires react-hook-form + zod ; notifications sonner ; dates date-fns (fr, en) ; police **Inter**, accent **or** et bleu marine (jetons inchangés) | Sans le code DreamsERP, shadcn/ui donne le rendu le plus proche avec un seul système de style (Tailwind) ; décision de la cheffe de projet |
| 2026-11-25 | Lot 0 : la langue et le thème sont mémorisés dans des cookies (pas de /fr ou /en dans l'adresse) ; `packages/ui/src/tokens.ts` est la seule source des couleurs, vérifiée par un test automatique | Pas de « flash » au chargement ; contrôle automatique des couleurs |
| 2026-11-25 | Lot 0, étapes 2-3 : écran actif du menu en or plein ; menu latéral à 240 px ; onglets des écrans ouverts gardés ; pas de glisser-déposer des lignes de tableau (`@dnd-kit` écarté) ; `react-day-picker` ajouté à la stack ; tableau de bord de démonstration gardé tel quel | Choix de la cheffe de projet après revue de l'étape 2-3 |
| 2026-11-25 | **Menu principal à 2 modes d'affichage.** **Liste** : modules à gauche, contenu à droite (modèle actuel). **Mosaïque** : une tuile par module ; un clic ouvre une fenêtre déplaçable, redimensionnable, agrandissable et réductible. Règles : bouton de changement de mode dans l'en-tête ; choix retenu par utilisateur (navigateur d'abord, profil plus tard) ; chaque écran s'affiche en page ou en fenêtre sans être écrit deux fois ; fenêtres réduites dans la barre d'onglets ; sur téléphone, fenêtre toujours en plein écran ; 6 fenêtres ouvertes au maximum ; outil de déplacement / redimensionnement à proposer avant installation | Choix de la cheffe de projet |
| 2026-11-25 | Le prototype est représenté par ses captures, ses fiches écran, ses jetons et sa documentation, pas par son code (les fichiers HTML contiennent les données de RUTHY'S) ; extraction ciblée sans données si besoin | Ne jamais faire entrer de données réelles dans le dépôt (`03_SOURCES_REFERENCE/README.md`) |
| 2026-11-25 | Lot 0, étape 4 : thème sombre, couleurs du sélecteur et jetons ajoutés validés tels que proposés (`05_UI_UX/DESIGN_TOKENS.md`) ; choix actif des boutons à choix en or ; bouton d'annulation rouge pâle ; montants en francs entiers ; exports Excel / PDF affichés « bientôt » jusqu'au centre d'états ; barre de période = **date de début puis date de fin**, un calendrier d'un mois pour chacune, qui se referme après le choix ; fenêtres du mode Mosaïque avec `react-rnd` | Choix de la cheffe de projet après revue de la page de démonstration |
| 2026-11-25 | Maquettes livrées aussi en artefact claude.ai (numérotées M-xx, commentables), en plus de l'adresse de l'aperçu Vercel | Demande de la cheffe de projet : commenter plus facilement |
| à valider | Composants techniques restants (état, données, hors ligne, tâches planifiées, documents, e-mails, langues, qualité, organisation du dépôt) | Liste dans `10_ARCHITECTURE_STACK.md`, « Composants à valider » |
| à valider | Mesures de sécurité Supabase / Vercel | Liste dans `11_SECURITE_NFR.md`, « Mise en œuvre » |
| à valider | Hébergement : Vercel + Supabase en région Paris au lancement + dossier ARTCI ; centre de données à Abidjan plus tard | Proposition `10_ARCHITECTURE_STACK.md` |
| à valider | Raccordement de Wave / Orange Money : API marchandes directes ou agrégateur UEMOA (CinetPay, PayDunya) | Proposition `12_COMMERCIALISATION.md` |
