# Smart Collab — dépôt de cadrage et de développement

**Produit :** ERP web modulaire et multi-métiers. Chaque module est une application installable, reliée aux autres (modèle Odoo).
**Métiers :** Commerce de détail · Multi-sites / Distribution · Audit / Conseil / Projet · Génie électrique · Mixte.
**Lancement :** Côte d'Ivoire et zone UEMOA · français et anglais · abonnement en ligne **et** installation chez le client.
**Agent de code :** Antigravity.
**Version du cadrage :** 22 novembre 2026.

Ce dépôt est le **cerveau du projet**. La cheffe de projet décide ; l'agent code **uniquement** ce qui est écrit ici.

---

## Par où commencer

1. Lire `00_GOUVERNANCE/REGLES_PROJET.md` (5 min).
2. Ouvrir Antigravity **dans ce dossier**.
3. Coller le prompt `04_PROMPTS_AGENTS/00_LECTURE_DEPOT.md`.
4. Lancer le lot en cours (`04_PROMPTS_AGENTS/LOT_XX_….md`), en commençant par le lot 0.
5. Tester la démo décrite à la fin du prompt.
6. Ne passer au lot suivant **que si** `06_LOTS/lot_XX/CHECKLIST.md` est cochée à 100 %.

---

## Structure

| Dossier | Contenu |
|---------|---------|
| `00_GOUVERNANCE` | Règles du projet, interdits, journal des décisions |
| `01_DOCUMENTATION` | Fiches métier (réglages par défaut de chaque métier), catalogue des modules |
| `02_SPECIFICATIONS` | **Cahier des charges** complet et découpé en 15 fichiers, contrat d'application, schéma SQL |
| `03_SOURCES_REFERENCE` | Références visuelles : prototype (écrans) et DreamsERP (inspiration) — jamais de code copié |
| `04_PROMPTS_AGENTS` | Un prompt par lot, à coller dans Antigravity |
| `05_UI_UX` | Charte, jetons de design, inventaire des écrans, maquettes |
| `06_LOTS` | Une liste de contrôle par lot |
| `07_ARCHIVES` | Ancien cadrage « MVP Retail » — **ne pas faire lire à l'agent** |
| `src` | Code généré par l'agent (vide au départ) |

---

## Documents de référence (ordre de lecture pour l'agent)

| Fichier | Rôle |
|---------|------|
| `02_SPECIFICATIONS/00_CAHIER_DES_CHARGES_COMPLET.md` | Source de vérité unique |
| `02_SPECIFICATIONS/03_CATALOGUE_APPLICATIONS.md` + `16_CONTRAT_APPLICATION.md` | Comment chaque module est une application installable et reliée |
| `02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md` | Exigences numérotées (EF-…) citées par les prompts |
| `02_SPECIFICATIONS/10_ARCHITECTURE_STACK.md` | Stack imposée |
| `02_SPECIFICATIONS/sql/` | Schéma SQL du socle (lots 1 et 2) |
| `02_SPECIFICATIONS/13_PLAN_LOTS.md` | Ordre de construction |

---

## Règle d'or

> Un lot = un prompt = une démo testable.
> Jamais « construis tout l'ERP ».

## Stack imposée (résumé, détail en `10_ARCHITECTURE_STACK.md`)

- Next.js + React 19 + TypeScript + Tailwind CSS v4 · shadcn/ui + Lucide + ApexCharts habillés avec nos jetons (Inter, or et bleu marine) · application installable (hors ligne) — référence technique : version Next.js / React de DreamsERP
- Supabase : PostgreSQL (sécurité au niveau des lignes par entreprise), connexion Supabase Auth, stockage, fonctions serveur
- Paiements Stripe + Wave / Orange Money · déploiement Vercel (en ligne) et Docker + Supabase auto-hébergé (chez le client)
- Monorepo pnpm + Turborepo (à valider)
- Langues `fr` et `en` · devise, fuseau et pays par entreprise (défaut : XOF, `Africa/Abidjan`, CI)

Si l'agent propose autre chose : **rappeler `10_ARCHITECTURE_STACK.md`**.
