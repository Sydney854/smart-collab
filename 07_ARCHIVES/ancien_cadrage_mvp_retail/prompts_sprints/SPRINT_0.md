# Prompt — Sprint 0 Fondations

```text
RUTHY’S Plus ERP — SPRINT 0 uniquement.

Contexte déjà lu : PRD, TRD, Appflow, SCHEMA SQL, PLAN (dossier 02_SPECIFICATIONS).
Respecte AGENTS.md.

Objectif Sprint 0 :
1. Initialiser l’application dans src/ (stack TRD : React + TypeScript, API Node, PostgreSQL).
2. Appliquer SCHEMA_SQL_RUTHYS_Retail_MVP.sql + seed minimal :
   - 1 site « Boutique Principale »
   - 4 utilisateurs (un par rôle : admin, gerant, caissier, magasinier)
   - mots de passe de démo documentés
3. Auth email + session ; enforcement des rôles côté serveur.
4. Wizard première configuration (Appflow parcours C) :
   - nom entreprise, site
   - domaine Retail pré-coche les modules MVP
   - modules core toujours actifs (Dashboard, Apps, Paramètres)
5. Table / persistance enabled_modules.
6. Shell : sidebar + topbar ; le menu n’affiche QUE les modules activés + core.
7. Pages placeholder pour chaque module activable (titre seulement).

Interdit dans ce sprint :
- Caisse fonctionnelle (panier, encaissement)
- Achats / BL
- Multi-sites, RH, chat, design system DreamsERP complet

Livrable final obligatoire :
- Commandes exactes pour installer, migrer, lancer
- Comment se connecter en admin puis en caissier
- Démo : wizard → activer POS + Stock → login caissier → Paramètres invisible

Écris le code dans src/. Documente les comptes de démo dans src/README.md.
```
