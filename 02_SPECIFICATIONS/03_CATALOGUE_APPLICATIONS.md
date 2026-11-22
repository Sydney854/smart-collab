# Smart Collab — 3. Catalogue des modules

> Extrait de `00_CAHIER_DES_CHARGES_COMPLET.md`. En cas d'écart, le cahier complet fait foi.

Le catalogue reprend le « Catalogue unifié des modules » du dépôt, complété par quatre familles présentes dans DreamsERP mais absentes du catalogue. Le Core est toujours actif ; tout le reste s'active ou se désactive dans le module Apps.

| Catégorie | Modules | Activation |
| --- | --- | --- |
| A. Core | Dashboard, Apps, Paramètres | Toujours actif |
| B. Applications transversales | Chat, Appels vocaux, Appels vidéo, Calendrier, E-mail, Gestionnaire de fichiers, Notes, À faire, Circuits de validation | Cochable |
| C. Ventes & CRM | Point de vente, Ventes, CRM & Clients, Marketing | Cochable |
| D. Chaîne d'approvisionnement | Produits & Inventaire, Achats (avec Fournisseurs), Transferts, Sites & Entrepôts, Fabrication, Maintenance, Qualité, Réparation | Cochable |
| E. Finance & Comptabilité | Finance (trésorerie, caisses, banques, mobile money, dépenses, budgets), Facturation, Paiements & Taxes, Comptabilité SYSCOHADA, Fiscalité des entreprises | Cochable |
| F. RH & Paie | RH (employés, départements, désignations), Présences et congés, Paie, Recrutement, Évaluation, Formation | Cochable |
| G. Services & Projets | Projet, Feuilles de temps, Services sur site, Assistance, Rendez-vous, Planification, Chantier | Cochable |
| H. Pilotage & Contrôle | Rapports & BI (centre d'états), Centre de contrôle, Documents, Connaissances | Cochable |
| I. Couche design | Composants, formulaires, tableaux, graphiques, icônes, dispositions de menu, thèmes clair et sombre | Toujours présente, invisible dans le choix des modules |

Ajouts par rapport au catalogue du dépôt, repérés dans DreamsERP :

- **Immobilisations** (registre, affectations, amortissement, maintenance, cession) : à ranger en Finance.
- **Recrutement, évaluation, formation, congés et jours fériés** : à ranger en RH & Paie.
- **Assistance** (messages de contact, tickets, base de connaissances, délais de traitement) : déjà prévue en G, à détailler.
- **Abonnements** (formules, modules complémentaires, transactions) : ce n'est pas un module pour les clients. Il sert à l'éditeur pour gérer les abonnements des entreprises clientes, dans une console à part (§12).

Les noms de modules, de menus et de sous-menus sont paramétrables par l'administrateur de chaque entreprise (§7).

### Chaque module est une application, reliée aux autres (modèle Odoo)

Chaque module de Smart Collab est une application à part entière, qu'on installe ou désinstalle depuis Apps comme dans Odoo. Une fois installées, les applications partagent les mêmes fiches (clients, produits, employés) et se répondent automatiquement : une opération saisie dans l'une met à jour les autres, sans ressaisie.

| Principe | Comment il est garanti |
| --- | --- |
| Une application = un paquet autonome | Chaque application a un manifeste : nom, version, catégorie, dépendances, menus, écrans, droits, tables, réglages par défaut par métier, événements qu'elle publie et qu'elle écoute |
| Dépendances | Installer Point de vente installe aussi Produits & Inventaire s'il manque ; une application dont dépend une autre application installée ne peut pas être désinstallée (l'écran dit lesquelles) |
| Installation | Crée ses tables, menus, droits et réglages par défaut, sans arrêt du service ; l'opération est journalisée |
| Désinstallation | Retire menus et écrans ; les données sont conservées et archivées, et reviennent si l'application est réinstallée |
| Fiches partagées | Une seule fiche par client, fournisseur, produit, employé ou site, utilisée par toutes les applications |
| Interconnexion par événements | Une application publie un événement (« vente validée ») ; chaque application installée qui l'écoute réagit (stock, trésorerie, client, comptabilité, indicateurs), dans la même opération quand l'argent ou le stock est en jeu |
| Extensions d'écrans | Une application peut ajouter des champs, des onglets ou des actions aux écrans d'une autre ; exemple : Chantier ajoute un onglet Réservations à la fiche produit |
| Ponts automatiques | Quand deux applications sont installées ensemble, leur liaison s'active d'elle-même ; exemple : Ventes + Comptabilité = écritures comptables automatiques |
| Mises à jour | Chaque application a sa version ; ses évolutions de tables passent par des migrations, sans perte de données |

- **EF-APP-01** L'écran Apps liste toutes les applications par catégorie, avec leur description, leur statut (installée, disponible, incluse dans l'abonnement ou non) et un bouton Installer ou Désinstaller.
- **EF-APP-02** L'installation résout les dépendances et affiche avant confirmation la liste des applications qui seront ajoutées.
- **EF-APP-03** La désinstallation est refusée tant qu'une application installée en dépend, et ne supprime jamais de données.
- **EF-APP-04** Les menus, les droits, les tableaux de bord et la recherche globale ne montrent que les applications installées.
- **EF-APP-05** Toute application publie et écoute des événements documentés dans son manifeste ; aucune application n'écrit directement dans les tables d'une autre.
- **EF-APP-06** Les applications disponibles dépendent de la formule d'abonnement ; une installation chez le client active les applications de sa licence.

> Schéma (document en ligne) : une vente validée publie l'événement « vente validée » ; Produits & Inventaire, Finance, CRM & Clients, Comptabilité et Rapports & BI y réagissent. Une application non installée ignore l'événement.

Le stock et l'argent bougent dans la même opération que le ticket ; les indicateurs se mettent à jour juste après, en tâche de fond.

