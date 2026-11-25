# Smart Collab — 10. Architecture et stack technique

> Extrait de `00_CAHIER_DES_CHARGES_COMPLET.md`. En cas d'écart, le cahier complet fait foi.

Smart Collab est une application web unique, servie à toutes les entreprises clientes depuis les mêmes serveurs, avec des données séparées par entreprise. Le dépôt regroupe l'application, le serveur, le site commercial et les bibliothèques partagées.

> Schéma : Site commercial et Application Smart Collab (Next.js, sur Vercel) → Supabase (PostgreSQL, authentification, stockage de fichiers, fonctions serveur, temps réel) ; paiements par Stripe et mobile money (Wave, Orange Money).

Le navigateur garde une copie locale pour la caisse et le terrain ; tout le reste passe par Supabase, qui vérifie les droits et isole chaque entreprise.

Décisions du 22/11/2026 : écran sur le modèle de la version **Next.js / React de DreamsERP** ; serveur, base et connexion **Supabase** ; paiements **Stripe** ; déploiement **Vercel**. Statuts : **validé** = décidé par la cheffe de projet ; **à valider** = proposition.

#### Socle validé

| Couche | Choix | Statut | Pourquoi |
| --- | --- | --- | --- |
| Application (front-end) | Next.js (App Router) + React 19, TypeScript | validé | Version Next.js de DreamsERP comme référence technique ; même base pour l'application et le site commercial |
| Style | Tailwind CSS v4, nos jetons de couleur (`05_UI_UX/DESIGN_TOKENS.md`), thème clair / sombre | validé | Comme DreamsERP ; couleurs Smart Collab |
| Composants | Ant Design v6 + Preline v4, habillés avec nos jetons ; composants maison du prototype (`05_UI_UX/COMPOSANTS.md`) construits par-dessus | validé | Tableaux, formulaires, calendriers et sélecteurs prêts tout de suite |
| Serveur et base de données | Supabase : PostgreSQL, sécurité au niveau des lignes par entreprise, fonctions SQL et fonctions serveur (Edge Functions) | validé | Base PostgreSQL déjà prévue (`sql/`), isolation des entreprises, moins de serveur à écrire et à maintenir |
| Connexion | Supabase Auth (e-mail + mot de passe, double authentification) | validé | Intégré à la base : l'entreprise et le rôle de l'utilisateur sont lus par les règles de sécurité |
| Paiements | Stripe (cartes, abonnements) ; Wave et Orange Money pour le mobile money | validé, modalités à vérifier (voir ci-dessous) | Abonnements annuels, clients internationaux et clients UEMOA |
| Déploiement | Vercel (application et site commercial) | validé | Mises en ligne automatiques depuis GitHub, préversion de chaque modification |

#### Composants à valider

| Couche | Proposition | Pourquoi |
| --- | --- | --- |
| Navigation et état | Routes Next.js ; Redux Toolkit (thème, disposition, session) ; TanStack Query (chargement et cache des listes) | Organisation de DreamsERP Next.js |
| Accès aux données | Client Supabase (`supabase-js`) avec types générés depuis la base ; migrations par la CLI Supabase (fichiers `sql/` versionnés) | Remplace Prisma / Drizzle, qui ne sont plus nécessaires |
| Formulaires et validation | Formulaires Ant Design + schémas Zod partagés entre écran et fonctions serveur | Une seule définition des règles de saisie |
| Graphiques et icônes | ApexCharts (ECharts pour les jauges) ; icônes Lucide | Comme DreamsERP, un seul jeu d'icônes |
| Hors ligne | Application installable (service worker), base locale IndexedDB (Dexie), file d'opérations synchronisée vers Supabase | Caisse et écrans terrain sans réseau (§9) |
| Moteur de règles | Bibliothèque TypeScript partagée navigateur / fonctions serveur | Mêmes résultats en ligne et hors ligne (EF-CFG-02) |
| Fichiers | Supabase Storage (dossiers privés par entreprise) | Photos produits, justificatifs, pièces jointes |
| Tâches planifiées | `pg_cron` de Supabase + Edge Functions (ou tâches planifiées Vercel) | Rapports planifiés, relances, alertes ; remplace Redis + BullMQ |
| Temps réel | Supabase Realtime | Chat, notifications, écrans de caisse partagés |
| Documents | PDF générés côté serveur depuis les modèles (outil à choisir, compatible avec les limites de durée de Vercel) ; Excel avec ExcelJS | Mêmes modèles à l'écran et à l'impression |
| E-mails et SMS | Service d'envoi transactionnel (ex. Resend ou Brevo) ; SMS par un opérateur local | Factures, relances, codes de connexion |
| Langues | next-intl (français et anglais) | ENF-USA-02 |
| Qualité | Vitest (tests unitaires), Playwright (tests d'écrans), GitHub Actions (contrôle à chaque modification), Sentry (erreurs en production) | Chaque lot testé avant livraison |
| Organisation du code | Dépôt unique pnpm + Turborepo : `apps/web`, `apps/site`, `apps/console`, `packages/ui`, `packages/rules`, `packages/schemas`, `supabase/` | Code partagé entre application, site et console |

DreamsERP est acheté sous **licence Extended** (décision du 23 novembre 2026, `00_GOUVERNANCE/LICENCES.md`) : sa version Next.js / React est le **point de départ du code de l'écran** (composants, dispositions, écrans), adapté à nos jetons, à Supabase et aux exigences. Ses données de démonstration, textes et images ne sont pas repris. Détail des six versions de DreamsERP : `03_SOURCES_REFERENCE/DREAMSERP/SITE_DOCUMENTATION/STACKS_TECHNIQUES.md`.

#### Environnements

| Environnement | Supabase | Région | Vercel |
| --- | --- | --- | --- |
| Développement | `smart-collab-dev` (réf. `ajkginvsjljqufvdppgc`, PostgreSQL 17), créé le 25/11/2026 | Paris (eu-west-3) | Fonctions en Paris (cdg1), aperçus protégés |
| Production | `smart-collab-prod`, à créer avant la mise en vente (offre Pro, sauvegardes à un instant donné) | Paris (eu-west-3) | Paris (cdg1) |

Connexion de `smart-collab-dev` réglée le 25/11/2026 : e-mail avec confirmation, double authentification TOTP, mot de passe de 10 caractères minimum (minuscules, majuscules, chiffres), adresse du site `http://localhost:3000` (SEC-MO-04).

Les clés ne sont jamais écrites dans le dépôt : variables secrètes de Vercel, de l'environnement Claude Code et fichier local `.env.local` (exclu de Git).

#### Points de vigilance liés à ces choix

1. **Installation chez le client** (mode de vente décidé le 22/11/2026) : Vercel n'existe qu'en ligne. Pour ce mode, l'application Next.js est livrée en conteneur Docker et Supabase est auto-hébergé (version open source). À prévoir dès le lot 1 pour ne pas dépendre de fonctions propres à Vercel.
2. **Paiements** : un compte Stripe doit appartenir à une société d'un pays pris en charge par Stripe ; une société de droit ivoirien seule peut ne pas y avoir accès. Paystack, filiale de Stripe, annonce une couverture en Côte d'Ivoire avec mobile money : à vérifier. Wave et Orange Money se branchent par leurs API marchandes ou par un agrégateur (CinetPay, PayDunya). À distinguer : le paiement de l'abonnement Smart Collab, et les modes de règlement des ventes des clients en caisse (registre configurable).
3. **Localisation des données** : choisir la région Supabase de Paris et la même région pour les fonctions Vercel ; l'autorisation de transfert ARTCI reste nécessaire (voir l'hébergement ci-dessous).
4. **Scripts SQL existants** (`sql/001`, `sql/002`) : l'entreprise courante est lue dans `app.tenant_id` ; avec Supabase, elle sera lue dans le jeton de connexion (`auth.jwt()`) et la table `users` sera reliée à `auth.users`. Adaptation à faire au lot 1.
5. **Limites de Vercel** : durée maximale des fonctions ; les traitements longs (gros exports, génération de nombreux bulletins) passent par des tâches planifiées ou des fonctions Supabase.

### Hébergement et installation chez le client (proposition à valider)

Le même logiciel tourne dans les deux modes de vente. En ligne : Vercel et Supabase (région Paris). Chez le client : application en conteneur Docker et Supabase auto-hébergé.

| Mode | Où | Pour qui | Points d'attention |
| --- | --- | --- | --- |
| Abonnement en ligne, au lancement | Vercel + Supabase, région Paris | PME qui ne veulent rien installer | Données personnelles hébergées hors de Côte d'Ivoire : autorisation préalable de l'ARTCI exigée pour le transfert, demandée par une société de droit ivoirien, avec un rapport annuel |
| Abonnement en ligne, plus tard | Centre de données à Abidjan | Clients qui exigent que leurs données restent en Côte d'Ivoire | Coût et redondance à comparer |
| Installation chez le client | Serveur du client (Linux et Docker) : application Next.js en conteneur + Supabase auto-hébergé | Entreprises à connexion faible ou à politique interne stricte | Mises à jour par paquets signés, licence activée par clé, sauvegardes à la charge du client ou par contrat de maintenance |

Avant la commercialisation en ligne : déposer la déclaration des traitements et la demande d'autorisation de transfert auprès de l'ARTCI ([résumé de la loi 2013-450](https://www.dlapiperdataprotection.com/index.html?c=CI&t=law)).

