# Sources de référence — Smart Collab

Ces sources servent à **voir** à quoi doivent ressembler les écrans. Le prototype n'est jamais copié dans `src/` ; le code DreamsERP peut l'être sous licence Extended (voir `00_GOUVERNANCE/LICENCES.md`).

## 1. Prototype (écrans à reproduire)

- Le prototype est représenté dans ce dépôt par ses **captures** et ses **fiches écran**, pas par son code (décision du 25/11/2026) :
  - captures des écrans v105, v107 (Paie, états RH) et v99 (inventaire lot par lot) : `prototype/CAPTURES.md` et `prototype/captures/` ;
  - une fiche par écran (zones, champs, colonnes, actions, fonction de rendu du prototype) : `05_UI_UX/maquettes/` ;
  - couleurs, polices et tailles relevées dans sa feuille de style : `05_UI_UX/DESIGN_TOKENS.md` ;
  - règles métier : `07_ARCHIVES/ancien_cadrage_mvp_retail/RUTHYS_ERP_v105_Documentation_Complete.md`.
- Les fichiers HTML du prototype ne sont **pas** copiés ici : ils contiennent les données réelles de RUTHY'S. Ils restent dans le dépôt `Sydney854/Projet-ERP`.
- Si un comportement n'est pas clair sur un écran précis, on extrait **ce morceau seulement**, sans données, à la demande de la cheffe de projet.
- On reprend : la **disposition**, les **composants**, les **parcours**, les **états imprimables**.
- On ne reprend pas : les **données** embarquées ni les **calculs** propres au client fondateur (objectifs, contribution des sites, 40/40/20…). Ils deviennent des réglages du moteur de configuration.

## 2. DreamsERP (inspiration pour les écrans absents du prototype)

- Décision du 23/11/2026 : DreamsERP acheté sous **licence Extended** ; ses composants et son code (version React / Next.js) sont réutilisables dans Smart Collab (voir `00_GOUVERNANCE/LICENCES.md`).
- Index des pages de démonstration par module : `DREAMSERP_INDEX.md`.
- Captures de toutes les pages (menu + pages liées, 231 pages en thème sombre et clair) et de leurs fonctionnalités (en-tête, menus, onglets, fenêtres), vue ordinateur 1440 px : `DREAMSERP/CAPTURES.md` et `DREAMSERP/captures/`.
- Site commercial et documentation des six versions (Tailwind, Angular, React, Next.js, Vue, Laravel) : dossier `DREAMSERP/SITE_DOCUMENTATION/` (`CAPTURES.md`, `captures/`, `STACKS_TECHNIQUES.md`).
- Usage : regarder la structure d'une page (en-tête, cartes, filtres, colonnes, actions) puis dessiner la maquette Smart Collab dans `05_UI_UX/maquettes/`.
