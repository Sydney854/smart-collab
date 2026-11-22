# Code source — Smart Collab

Rempli par Antigravity à partir du lot 1. Organisation imposée (`02_SPECIFICATIONS/10_ARCHITECTURE_STACK.md`, décisions du 22/11/2026) :

```
src/
  apps/web          application (Next.js + React 19, Tailwind v4, Ant Design v6 + Preline habillés avec nos jetons, installable hors ligne)
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
