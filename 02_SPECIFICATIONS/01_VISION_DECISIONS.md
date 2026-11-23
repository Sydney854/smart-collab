# Smart Collab — 1. Vision et décisions de cadrage

> Extrait de `00_CAHIER_DES_CHARGES_COMPLET.md`. En cas d'écart, le cahier complet fait foi.

Smart Collab est un ERP web modulaire, vendu à des entreprises de plusieurs métiers. Chaque opération y est saisie une seule fois ; tableaux de bord, rapports et contrôles en découlent, selon des règles de calcul que chaque entreprise configure elle-même.

Le prototype RUTHY'S ERP (v105 à v107) sert uniquement de référence pour les écrans et les fonctionnalités. Aucune donnée ni aucune règle de RUTHY'S n'est reprise.

| N° | Décision | Conséquence |
| --- | --- | --- |
| D1 | Le produit s'appelle Smart Collab | Documents, dépôt, interface et site commercial portent ce nom |
| D2 | Produit multi-entreprises et multi-métiers | Données de chaque entreprise cliente strictement séparées (§10, §11) |
| D3 | Aucune donnée ni règle de RUTHY'S | Base vide à l'installation ; données de démonstration fictives (§12) |
| D4 | Écrans : ceux du prototype ; les écrans absents partent des écrans DreamsERP, dont le code est réutilisable sous licence Extended (décision du 23/11/2026) | Inventaire des écrans (§5) |
| D5 | Règles de calcul configurables par entreprise | Moteur de configuration (§7) |
| D6 | Rôles : un préréglage par métier, modifiable par l'administrateur | Rôles et droits (§4) |
| D7 | Hors ligne pour la caisse, l'inventaire, les réceptions, le terrain chantier et la saisie des temps | Mode hors ligne (§9) |
| D8 | Le code est produit par l'agent Antigravity | Gouvernance (§14) |
| D9 | Niveau de finition visé : celui de DreamsERP, avec en plus un vrai serveur et une vraie base | Architecture (§10), site commercial (§12) |
| D10 | Chaque module est une application installable, reliée aux autres, sur le modèle d'Odoo | Fonctionnement des modules (§3) |
| D11 | Vente en abonnement en ligne et en installation chez le client | §10, §12 |
| D12 | Lancement en Côte d'Ivoire et dans la zone UEMOA, en français et en anglais | §6, §11 |
| D13 | Premiers métiers commercialisés : Commerce de détail et Multi-sites | Plan de livraison (§13) |
| D14 | Comptabilité SYSCOHADA et fiscalité des entreprises incluses | §3, §6, lot 7 |

Hors du premier périmètre : application mobile native, boutique en ligne.

