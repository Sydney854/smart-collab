# Prompt — Lot 1 : Fondations : socle, applications, droits

```text
Smart Collab — LOT 1 uniquement (Fondations : socle, applications, droits).
Les lots précédents sont validés (voir 06_LOTS/).
Respecte AGENTS.md et 02_SPECIFICATIONS/16_CONTRAT_APPLICATION.md.

À lire avant de coder :
- 02_SPECIFICATIONS/03_CATALOGUE_APPLICATIONS.md
- 02_SPECIFICATIONS/16_CONTRAT_APPLICATION.md
- 02_SPECIFICATIONS/04_ROLES_DROITS.md
- 02_SPECIFICATIONS/10_ARCHITECTURE_STACK.md
- 02_SPECIFICATIONS/11_SECURITE_NFR.md
- 02_SPECIFICATIONS/sql/001_socle_plateforme.sql

Objectif :
1. Monorepo pnpm + Turborepo (`apps/web` Next.js, `apps/site`, `apps/console`, `packages/ui|rules|schemas|i18n`, `supabase/`), Supabase en local (CLI Supabase), déploiement Vercel avec préversion par branche, intégration continue GitHub Actions. Prévoir dès maintenant l'image Docker de l'application pour l'installation chez le client.
2. Appliquer `02_SPECIFICATIONS/sql/001_socle_plateforme.sql` en migration Supabase, adapté : entreprise courante lue dans le jeton de connexion (`auth.jwt()`), table `users` reliée à `auth.users`.
3. Connexion Supabase Auth : e-mail + mot de passe, verrouillage après échecs, double authentification optionnelle (ENF-SEC-02), journal des accès (ENF-TRA-02).
4. Registre des applications et écran Apps : manifestes, dépendances, installation, désinstallation sans perte, ponts automatiques (EF-APP-01 à 06, `16_CONTRAT_APPLICATION.md`).
5. Bus d'événements : publication synchrone dans la transaction + table `event_outbox` traitée en arrière-plan (`pg_cron` + Edge Functions Supabase).
6. Rôles et droits : rôle × permission × périmètre, masques de champs, préréglages par métier (`04_ROLES_DROITS.md`).
7. Assistant de première configuration : entreprise (pays CI ou UEMOA, devise, langue), métier, applications pré-cochées, utilisateurs, récapitulatif.
8. Cadre général : menu = applications installées, onglets ouverts, barre de période, sélecteur de thème, recherche globale, notifications (vides), fr / en.
9. Journal d'audit en ajout seul (EF-GEN-03, ENF-TRA-01).

Interdit dans ce lot :
- Pas de caisse, pas de stock, pas de rapports. Les applications métier existent seulement sous forme de manifeste et de page vide.
- Tout ce qui appartient à un autre lot (02_SPECIFICATIONS/13_PLAN_LOTS.md).

Livrable obligatoire :
- Code dans src/, sur la branche lot-01.
- Tests automatiques du lot (dont l'isolation des entreprises à partir du lot 1).
- Commandes exactes pour installer, migrer, lancer et tester, mises à jour dans src/README.md.
- Comptes de démonstration et données fictives.

Démo de fin de lot :
Créer deux entreprises (Commerce de détail, Multi-sites) ; dans la première, installer Point de vente (Produits & Inventaire et Finance s'installent avec), puis désinstaller Point de vente ; se connecter en caissier et constater que Paramètres est inaccessible, même par l'adresse.
```

Liste de contrôle : `06_LOTS/lot_01/CHECKLIST.md`
