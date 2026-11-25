# Instructions pour les agents IA (Claude Code, Antigravity)

Tu travailles sur **Smart Collab**, un ERP web modulaire et multi-métiers, vendu à des entreprises.

## Fichiers à lire avant tout code

1. `00_GOUVERNANCE/REGLES_PROJET.md`
2. `02_SPECIFICATIONS/00_CAHIER_DES_CHARGES_COMPLET.md`
3. `02_SPECIFICATIONS/16_CONTRAT_APPLICATION.md`
4. `02_SPECIFICATIONS/sql/` (schéma du socle)
5. Le prompt du lot en cours dans `04_PROMPTS_AGENTS/` et sa liste de contrôle dans `06_LOTS/`

Ne lis **pas** `07_ARCHIVES/` : c'est un ancien cadrage, remplacé.

## Règles absolues

- **Périmètre :** uniquement les exigences (EF-…, ENF-…) citées dans le prompt du lot en cours.
- **Applications :** chaque module ERP est une application avec un manifeste (`16_CONTRAT_APPLICATION.md`). Une application n'écrit **jamais** dans les tables d'une autre : elle publie et écoute des événements, ou appelle le service public de l'autre.
- **Entreprises clientes :** chaque table métier porte `tenant_id` ; l'isolation est imposée par PostgreSQL (RLS). Un test automatique le vérifie à chaque lot.
- **Opérations « tout ou rien » :** document + lignes + mouvements de stock + mouvements de trésorerie dans une seule transaction (EF-GEN-01).
- **Aucune suppression physique** d'un document validé ; annulation par document inverse ou statut, avec motif (EF-GEN-02).
- **Traçabilité :** toute création, modification, validation ou annulation écrit dans `audit_log` (EF-GEN-03).
- **Règles de calcul :** jamais codées en dur quand elles sont listées comme configurables (`07_MOTEUR_CONFIGURATION.md`) ; elles passent par le moteur de règles partagé `packages/rules`.
- **Montants :** `numeric`, jamais `float`.
- **Droits :** vérifiés côté serveur à chaque action, rôle lu dans la session.
- **Langues :** toute chaîne affichée passe par les fichiers de traduction `fr` et `en`.
- **Interface :** reproduire les écrans de `05_UI_UX/` (prototype ou maquette validée). Le code DreamsERP n'est pas encore dans le dépôt (décision du 25/11/2026) : construis les écrans avec Next.js, Tailwind, shadcn/ui (icônes Lucide, graphiques ApexCharts, tableaux TanStack Table, formulaires react-hook-form + zod, notifications sonner, dates date-fns) et nos jetons ; n'ajoute ni Ant Design, ni Preline, ni Recharts, ni une autre famille d'icônes, en t'aidant des captures DreamsERP. Quand il sera déposé, le code DreamsERP (version React / Next.js, licence Extended, `00_GOUVERNANCE/LICENCES.md`) pourra servir de point de départ : garde l'avis de licence en tête des fichiers repris, remplace ses couleurs par nos jetons, ses données de démonstration par nos données fictives, et ses données locales par Supabase. Ne publie jamais le code DreamsERP seul (dépôt public, paquet ou modèle revendu).
- **Données de RUTHY'S :** aucune. Les données de démonstration sont fictives.
- Code applicatif dans `src/` (monorepo décrit en `10_ARCHITECTURE_STACK.md`).
- Après chaque livrable : commandes exactes pour **installer, lancer et tester**, comptes de démo, et résultat des tests.

## Langue

- Interface : français et anglais.
- Commentaires de code : français ou anglais, cohérents dans un fichier.

## Quand la cheffe de projet dit « continue »

Poursuivre le **lot en cours** indiqué dans `00_GOUVERNANCE/JOURNAL_DECISIONS.md`, jamais un nouveau lot ni un nouveau métier.

## Explication avant et après chaque étape (demande de la cheffe de projet, 25/11/2026)

- **Avant chaque étape** (lot, sous-étape ou écran) : expliquer en français simple ce qui va être construit, à quoi cela servira pour l'utilisateur, ce qui sera visible à la fin, et ce qui ne sera pas encore fait.
- **À la fin de chaque étape** : résumer ce qui a été construit et testé, puis lister les **ajustements possibles** à ce stade (présentation, textes, couleurs, ordre des champs, règles, options écartées…), en indiquant pour chacun s'il est facile maintenant ou coûteux plus tard. Attendre la décision de la cheffe de projet avant de passer à l'étape suivante.
