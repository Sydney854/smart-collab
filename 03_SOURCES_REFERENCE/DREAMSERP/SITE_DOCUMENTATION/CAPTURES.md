# Captures DreamsERP — site commercial et documentation

Pages publiques de l'éditeur, séparées des captures de l'application (`../CAPTURES.md`). Capturées le 22/11/2026. **Inspiration seulement** : rien n'est repris dans Smart Collab.

- `captures/site.*.png` : page d'accueil commerciale.
- `captures/doc.*.png` : documentation des six versions (Tailwind, Angular, React, Next.js, Vue, Laravel).
- `STACKS_TECHNIQUES.md` : contenu technique comparé des six versions.

## Index (38 captures)

Page d'accueil commerciale (`https://dreamserp.dreamstechnologies.com/`) et documentation des six versions. Même méthode que `../CAPTURES.md` : Chromium piloté par Playwright, 1440 px, page entière ou écran visible. Le site commercial et la documentation n'ont pas de bouton jour / nuit : une seule version (claire). Pour les onglets et la FAQ, seule la section concernée est capturée ; la barre de navigation fixe et l'indicateur de défilement ont été neutralisés pendant ces captures pour ne pas masquer la section. Les réponses de la FAQ restent ouvertes l'une après l'autre (comportement du site). Le journal des modifications (`documentation/changelog.html`) est capturé avec les pages de l'application : `../captures/mode-sombre/19_Aide/02_documentation-changelog.png`. Contenu technique des six versions : `STACKS_TECHNIQUES.md`.

| Module | Sous-onglet | État | Fonction de rendu | Fichier |
|---|---|---|---|---|
| Site commercial (`site`) | Accueil | Page d'accueil commerciale (page entière) | `index.html` | [site.accueil.png](captures/site.accueil.png) |
| Site commercial (`site`) | Accueil | Page d'accueil — premier écran (en-tête, bandeau d'accroche) | `index.html` | [site.accueil.ecran.png](captures/site.accueil.ecran.png) |
| Site commercial (`site`) | Accueil | Section « Explore Key Modules Live », onglet « Inventory » | `index.html` | [site.accueil.modules-inventory.png](captures/site.accueil.modules-inventory.png) |
| Site commercial (`site`) | Accueil | Section « Explore Key Modules Live », onglet « CRM » | `index.html` | [site.accueil.modules-crm.png](captures/site.accueil.modules-crm.png) |
| Site commercial (`site`) | Accueil | Section « Explore Key Modules Live », onglet « Finance » | `index.html` | [site.accueil.modules-finance.png](captures/site.accueil.modules-finance.png) |
| Site commercial (`site`) | Accueil | Section « Explore Key Modules Live », onglet « POS » | `index.html` | [site.accueil.modules-pos.png](captures/site.accueil.modules-pos.png) |
| Site commercial (`site`) | Accueil | Section « Explore Key Modules Live », onglet « Projects » | `index.html` | [site.accueil.modules-projects.png](captures/site.accueil.modules-projects.png) |
| Site commercial (`site`) | Accueil | Section « ERP UI Pages & Dashboard Demos », onglet « Applications » | `index.html` | [site.accueil.pages-applications.png](captures/site.accueil.pages-applications.png) |
| Site commercial (`site`) | Accueil | Section « ERP UI Pages & Dashboard Demos », onglet « Inventory » | `index.html` | [site.accueil.pages-inventory.png](captures/site.accueil.pages-inventory.png) |
| Site commercial (`site`) | Accueil | Section « ERP UI Pages & Dashboard Demos », onglet « Sales » | `index.html` | [site.accueil.pages-sales.png](captures/site.accueil.pages-sales.png) |
| Site commercial (`site`) | Accueil | Section « ERP UI Pages & Dashboard Demos », onglet « Purchases » | `index.html` | [site.accueil.pages-purchases.png](captures/site.accueil.pages-purchases.png) |
| Site commercial (`site`) | Accueil | Section « ERP UI Pages & Dashboard Demos », onglet « Finance » | `index.html` | [site.accueil.pages-finance.png](captures/site.accueil.pages-finance.png) |
| Site commercial (`site`) | Accueil | Section « ERP UI Pages & Dashboard Demos », onglet « HRM » | `index.html` | [site.accueil.pages-hrm.png](captures/site.accueil.pages-hrm.png) |
| Site commercial (`site`) | Accueil | FAQ ouverte : « What is Dreams ERP? » | `index.html` | [site.accueil.faq-1.png](captures/site.accueil.faq-1.png) |
| Site commercial (`site`) | Accueil | FAQ ouverte : « Does it include backend functionality? » | `index.html` | [site.accueil.faq-2.png](captures/site.accueil.faq-2.png) |
| Site commercial (`site`) | Accueil | FAQ ouverte : « Can I use it with Laravel, Node.js, Django, or ASP.NET Backend? » | `index.html` | [site.accueil.faq-3.png](captures/site.accueil.faq-3.png) |
| Site commercial (`site`) | Accueil | FAQ ouverte : « Is the template responsive? » | `index.html` | [site.accueil.faq-4.png](captures/site.accueil.faq-4.png) |
| Site commercial (`site`) | Accueil | FAQ ouverte : « Does it include documentation? » | `index.html` | [site.accueil.faq-5.png](captures/site.accueil.faq-5.png) |
| Site commercial (`site`) | Accueil | FAQ ouverte : « Do I get future updates? » | `index.html` | [site.accueil.faq-6.png](captures/site.accueil.faq-6.png) |
| Documentation (`doc`) | index | Documentation — choix de la version | `documentation/` | [doc.index.png](captures/doc.index.png) |
| Documentation (`doc`) | tailwind | Documentation Tailwind (HTML) (page entière) | `documentation/tailwind.html` | [doc.tailwind.png](captures/doc.tailwind.png) |
| Documentation (`doc`) | tailwind | Documentation Tailwind (HTML) — premier écran (menu, en-tête, barre de progression de lecture) | `documentation/tailwind.html` | [doc.tailwind.ecran.png](captures/doc.tailwind.ecran.png) |
| Documentation (`doc`) | tailwind | Documentation Tailwind (HTML) — menu latéral replié | `documentation/tailwind.html` | [doc.tailwind.menu-replie.png](captures/doc.tailwind.menu-replie.png) |
| Documentation (`doc`) | angular | Documentation Angular (page entière) | `documentation/angular.html` | [doc.angular.png](captures/doc.angular.png) |
| Documentation (`doc`) | angular | Documentation Angular — premier écran (menu, en-tête, barre de progression de lecture) | `documentation/angular.html` | [doc.angular.ecran.png](captures/doc.angular.ecran.png) |
| Documentation (`doc`) | angular | Documentation Angular — menu latéral replié | `documentation/angular.html` | [doc.angular.menu-replie.png](captures/doc.angular.menu-replie.png) |
| Documentation (`doc`) | react | Documentation React (page entière) | `documentation/react.html` | [doc.react.png](captures/doc.react.png) |
| Documentation (`doc`) | react | Documentation React — premier écran (menu, en-tête, barre de progression de lecture) | `documentation/react.html` | [doc.react.ecran.png](captures/doc.react.ecran.png) |
| Documentation (`doc`) | react | Documentation React — menu latéral replié | `documentation/react.html` | [doc.react.menu-replie.png](captures/doc.react.menu-replie.png) |
| Documentation (`doc`) | nextjs | Documentation Next.js (page entière) | `documentation/nextjs.html` | [doc.nextjs.png](captures/doc.nextjs.png) |
| Documentation (`doc`) | nextjs | Documentation Next.js — premier écran (menu, en-tête, barre de progression de lecture) | `documentation/nextjs.html` | [doc.nextjs.ecran.png](captures/doc.nextjs.ecran.png) |
| Documentation (`doc`) | nextjs | Documentation Next.js — menu latéral replié | `documentation/nextjs.html` | [doc.nextjs.menu-replie.png](captures/doc.nextjs.menu-replie.png) |
| Documentation (`doc`) | vue | Documentation Vue (page entière) | `documentation/vue.html` | [doc.vue.png](captures/doc.vue.png) |
| Documentation (`doc`) | vue | Documentation Vue — premier écran (menu, en-tête, barre de progression de lecture) | `documentation/vue.html` | [doc.vue.ecran.png](captures/doc.vue.ecran.png) |
| Documentation (`doc`) | vue | Documentation Vue — menu latéral replié | `documentation/vue.html` | [doc.vue.menu-replie.png](captures/doc.vue.menu-replie.png) |
| Documentation (`doc`) | laravel | Documentation Laravel (page entière) | `documentation/laravel.html` | [doc.laravel.png](captures/doc.laravel.png) |
| Documentation (`doc`) | laravel | Documentation Laravel — premier écran (menu, en-tête, barre de progression de lecture) | `documentation/laravel.html` | [doc.laravel.ecran.png](captures/doc.laravel.ecran.png) |
| Documentation (`doc`) | laravel | Documentation Laravel — menu latéral replié | `documentation/laravel.html` | [doc.laravel.menu-replie.png](captures/doc.laravel.menu-replie.png) |
