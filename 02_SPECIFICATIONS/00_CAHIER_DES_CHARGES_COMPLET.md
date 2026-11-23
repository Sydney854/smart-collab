# Cahier des charges — Smart Collab

Version du 22 novembre 2026 · source : document en ligne « Cahier des charges — Smart Collab »

## 1. Vision et décisions de cadrage

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

## 2. Métiers couverts et préréglages

Smart Collab couvre quatre métiers et un profil Mixte. Le métier choisi à la première configuration pré-coche les modules et les rôles ; l'entreprise peut tout modifier ensuite. Les documents de référence sont les quatre fiches métier du dépôt, à renommer Smart Collab.

| Métier | Objet central | Lieux de stock | Facturation | Modules pré-cochés (hors Core) |
| --- | --- | --- | --- | --- |
| Commerce de détail | Ticket de caisse et stock | Une boutique | Immédiate en caisse | Point de vente, Ventes, CRM & Clients, Produits & Inventaire, Achats, Finance, Facturation, Rapports & BI |
| Multi-sites / Distribution | Bon de transfert | Centrale, boutiques, dépôts, stock en transit | Caisse par site, consolidation réseau | Ceux du commerce de détail + Transferts, Sites & Entrepôts, Paiements & Taxes, Centre de contrôle |
| Audit / Conseil / Projet | Mission et temps passé | Aucun | Forfait (jalons), régie (temps × taux) ou mixte | Projet, Feuilles de temps, Rendez-vous, Planification, Assistance, CRM & Clients, Ventes, Facturation, Finance, Rapports & BI, Documents, Connaissances |
| Génie électrique | Chantier et réservation de matériel | Magasin, entrepôt, chantiers temporaires | Caisse magasin + situations de travaux | Point de vente, Ventes, CRM & Clients, Produits & Inventaire, Achats, Sites & Entrepôts, Réparation, Projet, Services sur site, Planification, Chantier, Feuilles de temps, Rendez-vous, Finance, Facturation, Paiements & Taxes, RH & Paie, Présences, Rapports & BI, Centre de contrôle, Documents |
| Mixte | Composition libre | Selon les modules activés | Selon les modules activés | Aucun : l'entreprise compose |

Règle de composition (profil Mixte) : quand deux métiers partagent un objet, la règle la plus stricte s'applique. Exemple : une réservation chantier bloque la vente au comptoir de la quantité réservée.

Les règles décrites dans les fiches métier (« pas de vente sur du stock en transit », « alerte à 80 % du budget d'une mission », « une situation ne dépasse pas 100 % du contrat ») deviennent les réglages par défaut du métier, modifiables dans le moteur de configuration (§7).

## 3. Catalogue des modules

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

## 4. Rôles et droits

Chaque métier livre une liste de rôles préréglée ; l'administrateur peut ensuite créer, renommer, fusionner ou désactiver des rôles. Les fiches métier donnaient des listes différentes selon le document : la liste retenue ci-dessous est la plus complète.

| Métier | Nombre | Rôles préréglés |
| --- | --- | --- |
| Commerce de détail | 4 | Administrateur, Gérant, Caissier, Magasinier |
| Multi-sites / Distribution | 8 | Administrateur, Directeur réseau, Acheteur central, Responsable logistique, Préparateur, Gérant de boutique, Caissier, Magasinier |
| Audit / Conseil / Projet | 7 | Administrateur, Associé / Direction, Commercial, Chef de mission, Consultant, Finance, Assistant(e) |
| Génie électrique | 10 | Administrateur, Direction, Commercial, Projeteur (bureau d'études), Acheteur, Magasinier, Vendeur / caissier, Chef de chantier, Technicien, Finance |
| Mixte | 1 + modules | Administrateur, puis les rôles proposés par chaque module activé |

### Modèle de droits

Un droit = un rôle × un module × une action × un périmètre.

- **Actions** : voir, créer, modifier, valider, annuler, exporter, imprimer, configurer.
- **Périmètre** : toute l'entreprise, un ou plusieurs sites, son équipe, ses propres données (exemple : un consultant ne voit que ses missions, un caissier que son site).
- **Données sensibles** : prix d'achat, marges, salaires et taux internes sont masquables par rôle, champ par champ.
- **Seuils de validation** : un rôle peut valider jusqu'à un montant ou un pourcentage de remise, au-delà la demande remonte au niveau supérieur (circuits de validation, §7).

Les droits sont toujours vérifiés par le serveur, y compris quand un écran est ouvert directement par son adresse. Un utilisateur peut cumuler plusieurs rôles et plusieurs sites.

## 5. Inventaire des écrans

Les écrans existants du prototype sont repris tels quels comme maquette ; les écrans absents sont maquettés avant d'être codés, en prenant la page DreamsERP correspondante comme référence de structure (231 pages fournies dans l'archive Tailwind). Les écrans propres à Smart Collab sont à concevoir.

| Module | Repris du prototype | À maquetter (référence DreamsERP) |
| --- | --- | --- |
| Cadre général | Menu latéral, onglets ouverts, barre de période et calendrier, sélecteur de couleurs, personnalisation des graphiques et cartes au clic droit | Barre du haut (changement de société, langue, notifications, recherche globale), dispositions de menu, mode sombre |
| Connexion | — | Connexion, inscription, mot de passe oublié, réinitialisation, vérification e-mail, verrouillage d'écran, erreurs 404 / 500 |
| Tableaux de bord | Direction, Financier, Commercial, Opérations, comparaison de sites | Tableaux par module : RH, stock, CRM, caisse, finance, ventes, achats, projets, support |
| Point de vente | Caisse, session, panier, client, règlements, ticket | Commandes de caisse, impression codes-barres et QR, paramètres d'impression |
| Ventes | Vue globale, dépôt-vente, détail mensuel | Devis, commandes, factures, factures récurrentes, modèles de facture, avoirs, ventes au comptant, remboursements, bons de livraison, analyse |
| CRM & Clients | Liste, segments, fiche client, avoirs, cartes cadeaux, crédit | Contacts, pistes, affaires, pipeline, campagnes, avis clients, analyse |
| Produits & Inventaire | Vue d'ensemble, catalogue (liste, mosaïque), fiche produit en 7 onglets, étiquettes, inventaire lot par lot, revue et validation, corrections, historique | Catégories, marques, unités, ajustement de stock |
| Achats & Fournisseurs | Bon de livraison, avoirs, réclamations, commandes, suivi des approvisionnements, réapprovisionnement, répertoire et fiche fournisseur | Retours d'achat, analyse des achats |
| Transferts & Sites | Saisie, flux entre sites, bons, traçabilité, écarts de réception, comparaison des boutiques | Entrepôts |
| Finance | Comptes, décaissements, journal, règlements fournisseurs, enveloppes, objectifs | Dépenses et catégories, paiements, flux de trésorerie, budget, taxes, 5 rapports (dépenses, revenus, compte de résultat, revenus contre dépenses, taxes), immobilisations |
| RH & Paie | Employés (liste, mosaïque, fiche), départements, désignations, présence, paie, bulletin | Congés et types, jours fériés, recrutement (offres, candidats, entretiens, intégration), évaluation, formation, analyse RH |
| Projets & Services | — | Projets, tâches, feuilles de temps, jalons, allocation des ressources, analyse projet |
| Rapports & BI | Centre d'impression d'états, états planifiés, analyses stratégiques, qualité des données, fenêtre d'aperçu, impression et export | — |
| Centre de contrôle | Alertes, journal des opérations, journal des accès, caisse, bons de livraison, réclamations, corrections, produits en alerte | — |
| Applications | — | Chat, appels, calendrier, e-mail, fichiers, notes, à faire, circuits de validation (niveaux, demandes, actions) |
| Documents & Assistance | — | Dépôt de documents, politiques et manuels, conformité, circuits documentaires, messages, tickets, base de connaissances, délais de traitement |
| Paramètres | Entreprise, utilisateurs, attributs, studio, journal des modifications | Gestion des utilisateurs, rôles et permissions, demandes de suppression, paramètres généraux, sécurité, notifications, intégrations, profil |

Écrans propres à Smart Collab, à concevoir :

- Assistant de première configuration (entreprise, métier, modules, utilisateurs, récapitulatif).
- Module Apps (activation des modules).
- Studio de configuration : règles de calcul, indicateurs, modèles de documents, tableaux de bord (§7).
- Génie électrique : devis matériel et main-d'œuvre, chantiers, réservations, besoins matériel, situations de travaux, écrans terrain du technicien.
- Conseil : contrats, missions, facturation au forfait et en régie (dérivés des écrans Projets).
- Indicateur de connexion et file des opérations en attente (§9).
- Console éditeur : entreprises clientes, abonnements, modules complémentaires, transactions (§12).

Les écrans du prototype contenant des données ou des calculs propres à RUTHY'S (objectifs et rentabilité, contribution des sites) sont repris pour leur forme seulement : leurs calculs deviennent des réglages du moteur de configuration.

## 6. Exigences fonctionnelles par module

Chaque exigence porte un identifiant stable (EF-module-numéro) qui sert aux prompts d'Antigravity et à la recette. Les seuils, taux et formules cités sont des réglages par défaut, modifiables (§7).

### Garanties communes à tous les modules (non configurables)

- **EF-GEN-01** Toute opération qui touche au stock ou à l'argent s'écrit en une seule fois : document + lignes + mouvements de stock + mouvements de trésorerie, ou rien.
- **EF-GEN-02** Aucune suppression définitive d'un document validé : annulation par un document inverse ou un statut, avec motif.
- **EF-GEN-03** Chaque création, modification, validation et annulation est tracée : qui, quand, ancienne valeur, nouvelle valeur, motif.
- **EF-GEN-04** Toute liste offre recherche, filtres, tri, pagination, sélection multiple, export (PDF, Excel, CSV) et impression.
- **EF-GEN-05** Un document validé n'est plus modifiable ; sa numérotation est unique et sans doublon par entreprise.

### Point de vente

- **EF-POS-01** Ouverture et clôture de session par caisse avec fond de caisse, comptage par mode de règlement et écart affiché.
- **EF-POS-02** Panier par scan, code ou recherche ; remise par ligne et globale dans la limite du rôle.
- **EF-POS-03** Règlement en plusieurs modes sur un même ticket (espèces, carte, mobile money par opérateur, chèque, virement, avoir, crédit client).
- **EF-POS-04** Ticket imprimable (80 mm et A4) et envoyable par e-mail ou messagerie.
- **EF-POS-05** Retour et remboursement liés au ticket d'origine.
- **EF-POS-06** Fonctionne hors ligne (§9).

* **EF-POS-07** Prend en charge l'imprimante de tickets, le tiroir-caisse (ouverture au règlement en espèces) et le lecteur de codes-barres ; les modèles testés sont listés dans la documentation.

### Ventes et facturation

- **EF-VEN-01** Chaîne devis → commande → bon de livraison → facture → encaissement, chaque étape reprenant la précédente sans ressaisie.
- **EF-VEN-02** Factures récurrentes, avoirs, acomptes, relances d'impayés.
- **EF-VEN-03** Dépôt-vente : stock déposé suivi à part, reversement au déposant selon règle configurable.

### CRM & Clients

- **EF-CRM-01** Fiche client unique : coordonnées, historique d'achats, chiffre d'affaires, panier moyen, avoirs, crédit, cartes cadeaux.
- **EF-CRM-02** Segmentation par règles configurables (fréquence, montant, ancienneté).
- **EF-CRM-03** Pistes, affaires et pipeline par étapes ; campagnes avec mesure du chiffre d'affaires attribué.

### Produits & Inventaire

- **EF-STK-01** Fiche produit : code, désignation, catégorie et sous-catégorie, marque, unité, variantes (taille, couleur, etc.), photos, prix d'achat et de vente, seuils, fournisseur, champs personnalisés.
- **EF-STK-02** Stock tenu par lieu (boutique, centrale, dépôt, chantier) et calculé uniquement à partir des mouvements.
- **EF-STK-03** Disponible à la vente = stock physique − réservations ; le stock en transit n'est pas vendable.
- **EF-STK-04** Inventaire complet ou tournant, par lots et zones, scan et import ; revue des écarts, justification, valorisation, puis validation qui génère les ajustements.
- **EF-STK-05** Alertes de rupture, de surstock et de produits dormants selon seuils configurables ; classement ABC et rotation.

### Achats & Fournisseurs

- **EF-ACH-01** Commande fournisseur → réception (bon de livraison) avec quantité reçue ≠ commandée ; seule la quantité reçue entre en stock.
- **EF-ACH-02** Réclamations et retours fournisseur liés à la réception.
- **EF-ACH-03** Suggestions de réapprovisionnement à partir des ventes, du stock, des commandes en cours et du délai fournisseur.
- **EF-ACH-04** Échéances et règlements fournisseurs, partiels ou totaux.

### Transferts & Sites

- **EF-TRF-01** Bon de transfert : brouillon → validé → en préparation → expédié → reçu (partiellement ou totalement) → clôturé.
- **EF-TRF-02** L'expédition sort le stock du site source ; la réception n'ajoute que la quantité reçue ; tout écart est enregistré.
- **EF-TRF-03** Alerte sur les bons expédiés non reçus après un délai configurable ; propositions de transfert sur rupture.

### Finance

- **EF-FIN-01** Comptes de trésorerie : caisses, banques, comptes mobile money, comptes virtuels.
- **EF-FIN-02** Encaissements automatiques depuis les ventes ; dépenses saisies par catégorie avec justificatif.
- **EF-FIN-03** Répartition automatique d'une vente entre comptes virtuels selon des règles configurables (exemple : part réapprovisionnement, part marge, puis ventilation de la marge).
- **EF-FIN-04** Budgets et enveloppes avec suivi des écarts ; flux de trésorerie et prévisions.
- **EF-FIN-05** Taxes paramétrables par pays ; immobilisations et amortissements.

### RH & Paie

- **EF-RH-01** Dossier employé, contrats, départements, désignations, présences, congés, jours fériés.
- **EF-RH-02** Moteur de paie paramétrable : rubriques, bases, taux, plafonds, barèmes d'impôt, parts fiscales, du brut au net et du net au brut, charges patronales et coût employeur. Les barèmes de Côte d'Ivoire sont fournis au lancement, puis ceux des autres pays de l'UEMOA ; chacun est daté de son entrée en vigueur.
- **EF-RH-03** Bulletin imprimable selon un modèle configurable ; journal de paie ; impression groupée.
- **EF-RH-04** Recrutement, évaluation, formation (à maquetter).

### Projets, Conseil et Chantiers

- **EF-PRJ-01** Contrat au forfait, en régie ou mixte ; mission ou projet avec équipe, jalons, budget en jours ou en montant.
- **EF-PRJ-02** Feuilles de temps : brouillon → soumise → validée ou rejetée → verrouillée une fois facturée.
- **EF-PRJ-03** Facture au forfait depuis les jalons ; facture en régie = temps validés × taux ; alerte à un pourcentage de budget configurable.
- **EF-CHT-01** Devis mixte (matériel, main-d'œuvre, forfait) ; à l'acceptation, création du projet, du chantier et des besoins matériel.
- **EF-CHT-02** Réservation de stock, transfert vers le chantier, consommation imputée au coût du projet, retour de fin de chantier.
- **EF-CHT-03** Situations de travaux par avancement, plafonnées au montant du contrat et des avenants.

### Rapports & BI, Centre de contrôle

- **EF-BI-01** Centre d'états : chaque état a ses critères (période, site, regroupement, décomposition), s'affiche dans la fenêtre d'aperçu et s'exporte en PDF, Excel, Word, CSV, image, PowerPoint ou par e-mail.
- **EF-BI-02** Modèles d'états enregistrables et planifiables (envoi automatique).
- **EF-BI-03** Navigation du global au détail : entreprise → site → famille → produit → transactions.
- **EF-CTL-01** Journal des opérations et des accès ; alertes classées par gravité sur les opérations sensibles (stock forcé, prix modifié, annulation, écart de caisse).

### Comptabilité et fiscalité

- **EF-CPT-01** Plan comptable SYSCOHADA révisé fourni par défaut, modifiable ; journaux (ventes, achats, caisse, banque, opérations diverses).
- **EF-CPT-02** Écritures générées automatiquement par les autres applications installées (ventes, achats, trésorerie, paie, immobilisations) selon des schémas d'imputation configurables ; saisie manuelle possible.
- **EF-CPT-03** Grand livre, balance, lettrage, rapprochement bancaire, clôture de période et d'exercice ; une période clôturée n'accepte plus d'écriture.
- **EF-CPT-04** États financiers SYSCOHADA : bilan, compte de résultat, tableau des flux de trésorerie, notes annexes.
- **EF-CPT-05** Fiscalité : TVA collectée et déductible, déclarations périodiques, retenues à la source, impôt sur les bénéfices, avec des réglages par pays de l'UEMOA, la Côte d'Ivoire en premier.
- **EF-CPT-06** Export des données comptables pour l'expert-comptable et les logiciels tiers (format à définir).

## 7. Moteur de configuration

Tout ce qui varie d'une entreprise à l'autre se règle dans le Studio de configuration, sans toucher au code. Seules les garanties communes (EF-GEN) restent fixes.

| Élément configurable | Ce que l'administrateur règle | Exemples |
| --- | --- | --- |
| Règles de calcul | Formules sur les champs des documents, avec conditions | Marge, commission, répartition d'une vente entre comptes, prix de vente suggéré |
| Barèmes | Tables de taux, tranches, plafonds, datées par période de validité | Impôt sur salaires, cotisations sociales, taxes |
| Indicateurs | Source, mesure, agrégat, filtres, comparaison, seuils et couleurs d'alerte | Chiffre d'affaires du jour, taux de rupture, dépassement de budget |
| Tableaux de bord | Disposition des cartes et graphiques par rôle, glisser-déposer, filtres par défaut | Tableau Direction, tableau Gérant de boutique |
| Modèles de documents | En-tête, logo, colonnes, mentions, format (ticket 80 mm, A4, A5) | Ticket, facture, bon de livraison, bulletin de paie, bon de transfert |
| États et rapports | Source, critères, regroupements, colonnes, totaux, mise en forme, planification d'envoi | Journal des ventes, stock valorisé, écarts d'inventaire |
| Circuits de validation | Niveaux, seuils de montant, valideurs, délais et relances | Remise au-delà de 10 %, commande au-delà d'un montant |
| Seuils et alertes | Valeurs déclenchant une alerte ou une proposition automatique | Stock minimum, délai de transfert non reçu |
| Numérotation | Préfixe, compteur, remise à zéro par an ou par site | V-2026-0001 |
| Champs personnalisés | Champs ajoutés aux fiches et formulaires, listes de choix | Matière d'un tissu, puissance d'un câble |
| Menus et libellés | Ordre, noms et visibilité des menus et sous-menus | Renommer « Point de vente » en « Caisse » |
| Apparence | Couleurs, logo, disposition du menu, thème clair ou sombre | Couleurs de la marque du client |

### Exigences du moteur

- **EF-CFG-01** Les formules s'écrivent dans un langage d'expressions simple et sûr (champs, opérateurs, fonctions SI, MIN, MAX, ARRONDI, BARÈME), jamais en code libre.
- **EF-CFG-02** Le même moteur de calcul tourne sur le serveur et dans le navigateur, pour que le mode hors ligne donne les mêmes résultats.
- **EF-CFG-03** Toute règle se teste sur un exemple avant activation (« avec ces valeurs, le résultat serait… »).
- **EF-CFG-04** Chaque configuration est versionnée et datée ; un document garde la version de règle en vigueur le jour où il a été validé.
- **EF-CFG-05** Toute modification de configuration est tracée dans le journal des modifications et peut être annulée.
- **EF-CFG-06** Chaque métier livre un jeu de réglages par défaut, prêt à l'emploi à la première configuration.

## 8. Modèle de données

Une seule base pour tous les métiers : un socle commun et des extensions qui ne servent que lorsque leur module est actif. Le schéma SQL du dépôt (MVP Retail) est repris comme point de départ puis étendu.

### Principes

- Chaque table porte l'identifiant de l'entreprise cliente ; l'isolation est imposée par la base elle-même (sécurité au niveau des lignes de PostgreSQL), pas seulement par le code.
- Montants en décimal exact (numeric), jamais en nombre à virgule flottante ; devise et fuseau horaire par entreprise.
- Le stock n'est jamais saisi : il est la somme des mouvements. Une table de niveaux de stock sert de cache recalculable.
- Identifiants générés côté client possibles (UUID) pour le mode hors ligne, avec une clé d'idempotence par opération.
- Colonnes de traçabilité partout : créé par, créé le, modifié par, modifié le, statut ; pas de suppression physique.
- Journal d'événements métier unique (type, objet, données avant et après, auteur, date, motif).

| Domaine de données | Tables principales | Utilisé par |
| --- | --- | --- |
| Plateforme | entreprises, abonnements, modules activés, utilisateurs, rôles, permissions, sessions | Tous |
| Configuration | règles, barèmes, indicateurs, tableaux de bord, modèles de documents, modèles d'états, circuits de validation, numérotations, champs personnalisés, versions | Tous |
| Tiers | tiers (client, fournisseur, prospect, déposant), contacts, adresses | Tous |
| Lieux | sites (boutique, centrale, dépôt, transit, chantier, bureau), emplacements | Tous |
| Catalogue | produits, variantes, catégories, marques, unités, tarifs, codes-barres, photos | Commerce, multi-sites, génie électrique |
| Stock | mouvements de stock, niveaux, réservations, inventaires et lignes de comptage, ajustements | Commerce, multi-sites, génie électrique |
| Caisse et ventes | sessions de caisse, tickets, lignes, règlements, devis, commandes, bons de livraison, factures, avoirs | Commerce, multi-sites, génie électrique, conseil (factures) |
| Achats | commandes fournisseurs, réceptions, réclamations, retours, échéances | Commerce, multi-sites, génie électrique |
| Transferts | bons de transfert, lignes (demandé, expédié, reçu), demandes de réassort | Multi-sites, génie électrique |
| Finance | comptes de trésorerie, mouvements, dépenses, budgets, enveloppes, taxes, immobilisations | Tous |
| RH et paie | employés, contrats, présences, congés, périodes de paie, bulletins, rubriques | Tous (optionnel) |
| Projets et conseil | contrats, missions, membres, jalons, feuilles de temps, livrables, notes de frais | Conseil, génie électrique |
| Chantiers | chantiers, besoins matériel, interventions, situations de travaux | Génie électrique |
| Collaboration | messages, événements de calendrier, tâches, notes, fichiers, documents, tickets d'assistance | Tous (optionnel) |
| Contrôle | journal d'événements, journal des accès, alertes, demandes de suppression | Tous |
| Synchronisation | appareils, file des opérations reçues hors ligne, conflits | Modules hors ligne |

Le schéma complet (colonnes, contraintes, index) est livré module par module, en migrations versionnées, au fil des lots (§13).

## 9. Mode hors ligne

Cinq familles d'écrans continuent de fonctionner pendant une coupure internet, puis envoient leurs opérations au serveur au retour de la connexion. Le reste de l'application (configuration, rapports, administration) demande une connexion.

| Écrans hors ligne | Métiers | Données gardées sur l'appareil |
| --- | --- | --- |
| Caisse | Commerce, multi-sites, génie électrique | Catalogue et prix du site, stock du site, clients, modes de règlement, session en cours |
| Inventaire (comptage) | Commerce, multi-sites, génie électrique | Produits et stock théorique du site, lots de comptage |
| Réception de marchandises et de transferts | Commerce, multi-sites, génie électrique | Commandes et bons de transfert attendus sur le site |
| Terrain chantier (compte-rendu, heures, matériel utilisé) | Génie électrique | Interventions du jour, besoins et stock du chantier |
| Saisie des temps | Conseil, génie électrique | Missions et tâches affectées à l'utilisateur |

### Fonctionnement

1. L'application s'installe sur le poste comme une application web installée ; ses écrans restent disponibles sans réseau.
2. Les données nécessaires au site et à l'utilisateur sont copiées dans le navigateur et rafraîchies dès que la connexion est là.
3. Chaque opération faite hors ligne reçoit un identifiant unique et un numéro provisoire propre à l'appareil, puis entre dans une file d'attente.
4. Au retour de la connexion, la file est envoyée dans l'ordre ; le serveur revérifie chaque opération et attribue le numéro définitif.
5. Une opération envoyée deux fois n'est enregistrée qu'une fois (clé d'idempotence).

### Règles en cas de conflit

- **Stock insuffisant découvert à la synchronisation** : la vente est conservée (le client est parti avec la marchandise) et une alerte part au gérant. Réglage possible : bloquer la vente hors ligne au-delà du stock local connu.
- **Prix modifié pendant la coupure** : le prix appliqué au moment de la vente est conservé.
- **Comptage d'inventaire sur un produit vendu entre-temps** : l'écart est recalculé à la date et l'heure du comptage.
- **Conflit non résolu automatiquement** : il entre dans une file de conflits à traiter par un responsable ; rien n'est perdu.

### Exigences

- **EF-OFF-01** Un bandeau indique en permanence en ligne ou hors ligne, et le nombre d'opérations en attente.
- **EF-OFF-02** Durée maximale de travail hors ligne réglable par entreprise (exemple : 72 heures), au-delà de laquelle la caisse demande une synchronisation.
- **EF-OFF-03** Les données locales sont chiffrées et effacées à la déconnexion de l'utilisateur, sauf la file non encore envoyée.
- **EF-OFF-04** Les calculs faits hors ligne utilisent le même moteur de règles que le serveur (EF-CFG-02).

## 10. Architecture et stack technique

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

## 11. Sécurité, traçabilité et exigences non fonctionnelles

Les données d'une entreprise cliente ne doivent jamais être visibles d'une autre, et toute opération sensible doit pouvoir être retrouvée : ce sont les deux exigences qui priment sur toutes les autres.

### Sécurité

- **ENF-SEC-01** Isolation des entreprises impôsée par la base (sécurité au niveau des lignes) et vérifiée par des tests automatiques à chaque livraison.
- **ENF-SEC-02** Connexion par e-mail et mot de passe (stocké haché), double authentification proposable, politique de mot de passe et durée de session réglables, verrouillage après échecs répétés.
- **ENF-SEC-03** Droits vérifiés par le serveur à chaque action ; le rôle est lu dans la session, jamais dans la requête.
- **ENF-SEC-04** HTTPS partout ; fichiers et sauvegardes chiffrés.
- **ENF-SEC-05** Demandes de suppression de données personnelles traitées par un circuit validé et tracé. Conformité à la loi ivoirienne 2013-450 (déclaration et autorisations ARTCI) et aux lois équivalentes des pays de l'UEMOA servis.

### Mise en œuvre avec Supabase et Vercel (à valider)

| N° | Mesure | Ce qu'elle protège |
| --- | --- | --- |
| SEC-MO-01 | Sécurité au niveau des lignes activée et **forcée** sur toutes les tables, entreprise lue dans le jeton de connexion ; aucune table sans règle ; test automatique « un utilisateur de l'entreprise A ne voit rien de B » à chaque livraison | Isolation des entreprises (ENF-SEC-01) |
| SEC-MO-02 | Clé d'administration Supabase (`service_role`) jamais dans le navigateur ni dans le code de l'écran : seulement dans les fonctions serveur et les variables secrètes de Vercel | Contournement total de la sécurité |
| SEC-MO-03 | Rôle et entreprise ajoutés au jeton par la base (« custom claims »), jamais choisis par l'écran ; chaque action sensible revérifiée par une fonction SQL ou serveur | Droits (ENF-SEC-03) |
| SEC-MO-04 | Supabase Auth : mots de passe longs, vérification de l'e-mail, double authentification obligatoire pour les administrateurs et l'éditeur, durée de session et verrouillage réglés, protection contre les robots sur la connexion | Comptes (ENF-SEC-02) |
| SEC-MO-05 | Fichiers dans des dossiers privés par entreprise, liens de téléchargement signés et à durée limitée | Justificatifs, bulletins, photos |
| SEC-MO-06 | Paiements : aucune donnée de carte chez nous (page de paiement Stripe) ; messages de retour Stripe et mobile money (webhooks) vérifiés par signature et traités une seule fois | Fraude, double encaissement |
| SEC-MO-07 | Vercel : HTTPS forcé, en-têtes de sécurité (CSP, HSTS, anti-iframe), limitation du nombre de requêtes sur la connexion et les API, préversions protégées par mot de passe, secrets séparés par environnement (test, démo, production) | Attaques web, fuite par une préversion |
| SEC-MO-08 | Sauvegardes Supabase avec restauration à un instant donné (offre payante), restauration testée chaque mois ; données en région Paris | Perte de données, localisation |
| SEC-MO-09 | Accès aux consoles Supabase, Vercel, Stripe et GitHub : comptes nominatifs, double authentification, droits minimum, revue trimestrielle | Prise de contrôle de l'infrastructure |
| SEC-MO-10 | Journal d'audit en ajout seul dans la base (aucune modification ni suppression possible, même par l'application) ; journal des connexions Supabase conservé | Traçabilité (ENF-TRA-01, 02) |
| SEC-MO-11 | Base locale hors ligne (IndexedDB) limitée aux données du site et vidée à la déconnexion ; durée maximale hors ligne (EF-OFF-02) | Vol ou perte d'un appareil de caisse |
| SEC-MO-12 | Dépendances surveillées (alertes GitHub), revue de sécurité avant chaque lot, test d'intrusion externe avant la commercialisation | Failles connues |

### Traçabilité

- **ENF-TRA-01** Journal des opérations non modifiable : utilisateur, date, heure, appareil, ancienne et nouvelle valeur, motif, validation.
- **ENF-TRA-02** Journal des accès : connexions, échecs, changements de rôle.
- **ENF-TRA-03** Toute modification sensible est réversible par une opération inverse tracée.

### Performance et disponibilité

| Mesure | Cible |
| --- | --- |
| Ajout d'une ligne au panier de caisse | Moins de 300 ms perçus |
| Validation d'un ticket | Moins de 1,5 s, écritures comprises |
| Ouverture d'un tableau de bord | Moins de 2 s |
| Recherche dans le catalogue | Moins de 500 ms sur 50 000 références |
| Disponibilité du service | 99,5 % par mois (proposé) |
| Sauvegarde | Quotidienne, conservée 30 jours, restauration testée chaque mois |
| Perte de données maximale en cas d'incident | 24 heures en ligne ; aucune pour les opérations en file hors ligne |

### Usage

- **ENF-USA-01** Navigateurs Chrome, Edge, Firefox et Safari récents ; caisse optimisée à partir de 1 280 px, autres écrans utilisables dès 390 px (téléphone).
- **ENF-USA-02** Interface, documents imprimés et site commercial en français et en anglais dès le lancement, langue choisie par utilisateur, prêts pour d'autres langues ; montants, dates et fuseau horaire selon l'entreprise.
- **ENF-USA-03** Contrastes et navigation au clavier conformes au niveau AA des règles d'accessibilité web.
- **ENF-USA-04** Une entreprise cliente peut exporter toutes ses données à tout moment.

## 12. Site commercial, démo en ligne et abonnements

Smart Collab se vend comme DreamsERP se présente : un site qui montre le produit, une démo où l'on clique pour de vrai, une documentation publique. La différence : derrière la démo il y a un vrai logiciel, et le client s'abonne au lieu d'acheter des fichiers.

### Mode de vente retenu : les deux

Smart Collab se vend de deux façons. En abonnement en ligne, le client crée un compte et utilise le logiciel hébergé par l'éditeur, comme Odoo en ligne. En installation chez le client, le même logiciel est installé sur son serveur, avec une licence et un contrat de maintenance. Dans les deux cas, la facturation est au minimum annuelle.

### Le site commercial

| Page | Contenu |
| --- | --- |
| Accueil | Promesse, métiers couverts, captures, appel à l'essai et à la démo |
| Une page par métier | Problèmes résolus, modules pré-cochés, écrans clés, bouton vers la démo de ce métier |
| Modules | Catalogue des modules avec aperçu de chaque écran |
| Tarifs | Formules, prix, comparatif, modules complémentaires |
| Démo en ligne | Accès direct, sans inscription, à une entreprise fictive par métier |
| Documentation et historique des versions | Guides utilisateur et administrateur, nouveautés par version |
| Contact, essai gratuit, connexion | Formulaire, création de compte, accès client |

### Démo en ligne

- Une entreprise de démonstration par métier, avec des données fictives cohérentes (ventes, stocks, clients, missions, chantiers sur 12 mois).
- Un rôle choisissable à l'entrée (gérant, caissier, chef de mission…) pour voir l'application avec ses droits.
- Remise à zéro automatique chaque nuit.

### Essai, abonnement et console éditeur

- Essai gratuit de 14 jours (proposé) qui mène directement à l'assistant de première configuration.
- Formules par métier, puis prix selon le nombre d'utilisateurs, de sites et les applications complémentaires ; facturation annuelle au minimum, pluriannuelle possible.
- Installation chez le client : licence annuelle par clé, mises à jour incluses, prestation d'installation et de formation facturée à part.
- Paiement en ligne de l'abonnement par carte via **Stripe** (décision du 22/11/2026) et par mobile money **Wave et Orange Money** (puis MTN, Moov), par leurs API marchandes ou un agrégateur de la zone UEMOA ; accès de la société à Stripe à vérifier (voir `10_ARCHITECTURE_STACK.md`). Candidats à comparer : CinetPay et PayDunya ([comparatif août 2026](https://kolonell.com/fr/blog/agregateur-paiement-afrique-francophone-comparatif-cinetpay-paydunya-2026)). Le comparatif ne garantit pas leur prise en charge des abonnements récurrents : Smart Collab émet donc lui-même la facture annuelle et un lien de paiement, puis relance avant l'échéance.
- Console éditeur, séparée de l'application client : entreprises clientes, formules, applications complémentaires, licences d'installation, transactions, suspension en cas d'impayé, support. Les pages « Membership » de DreamsERP servent d'inspiration pour la maquette.

## 13. Plan de livraison par lots

Smart Collab se construit en 13 lots ; chacun se termine par une démo testable et une liste de contrôle cochée à 100 % avant de passer au suivant. Les lots 1 à 7 rendent le produit vendable aux métiers Commerce de détail et Multi-sites, comptabilité comprise ; les suivants ajoutent les autres métiers et la commercialisation.

| Lot | Contenu | Critère de recette |
| --- | --- | --- |
| 0. Maquettes et design | Bibliothèque de composants tirée du prototype, thèmes, maquettes des écrans absents inspirées de DreamsERP (§5) | Chaque écran des lots 1 à 7 a sa maquette validée |
| 1. Fondations | Monorepo, entreprises clientes, connexion, rôles et droits, registre des applications et écran Apps (installation, dépendances, désinstallation), bus d'événements, assistant de première configuration, cadre général (menu, onglets, barre de période, thèmes), français et anglais, journal des opérations | Deux entreprises ne voient jamais les données l'une de l'autre ; installer une application installe ses dépendances ; une application désinstallée disparaît du menu sans perte de données ; un caissier n'accède pas aux Paramètres, même par l'adresse |
| 2. Référentiels et stock | Tiers, sites, produits et variantes, catégories, unités, mouvements et niveaux de stock, import CSV | 1 000 produits importés ; le stock d'un site = somme de ses mouvements |
| 3. Caisse et ventes | Sessions, panier, règlements multiples, ticket, retours, historique, imprimante, tiroir et lecteur de codes-barres, caisse hors ligne | 10 ventes faites hors ligne se synchronisent sans doublon ; le tiroir s'ouvre au règlement en espèces ; chiffre d'affaires du jour = somme des tickets |
| 4. Achats, réceptions, transferts, inventaire | Commandes, réceptions, réclamations, bons de transfert, écarts, inventaire par lots ; réception et comptage hors ligne | Une réception partielle n'ajoute que la quantité reçue ; un écart de transfert est enregistré ; un inventaire validé génère ses ajustements |
| 5. Finance et CRM | Comptes, encaissements, dépenses, budgets, répartition automatique, devis, factures, avoirs, fiches clients | Une vente alimente les bons comptes selon la règle configurée ; l'historique client correspond aux tickets |
| 6. Configuration, états et tableaux de bord | Studio (règles, indicateurs, modèles), centre d'états, fenêtre d'aperçu et exports, tableaux de bord par rôle, centre de contrôle | Une règle modifiée s'applique aux nouveaux documents seulement ; un état s'exporte dans les 7 formats |
| 7. Comptabilité et fiscalité | Plan SYSCOHADA, journaux, écritures automatiques depuis les autres applications, grand livre, balance, lettrage, rapprochement, clôtures, états financiers, TVA et déclarations (Côte d'Ivoire d'abord) | Une vente, un achat et un règlement produisent leurs écritures ; la balance est équilibrée ; le bilan d'un exercice de test se génère |
| 8. RH et paie | Employés, présences, congés, moteur de paie paramétrable, barèmes Côte d'Ivoire puis UEMOA, bulletins, journal de paie, écritures de paie | Un bulletin de référence fourni par un client est reproduit au franc près |
| 9. Conseil | Contrats, missions, jalons, feuilles de temps, facturation au forfait et en régie, saisie des temps hors ligne | Les 6 critères de réussite de la fiche métier Conseil passent |
| 10. Génie électrique | Devis mixtes, chantiers, réservations, transferts chantier, consommations, situations, terrain hors ligne | Les 7 critères de réussite de la fiche métier Génie électrique passent |
| 11. Applications et documents | Chat, calendrier, tâches, fichiers, notes, circuits de validation, documents, assistance | Un circuit de validation à 2 niveaux bloque puis libère une commande |
| 12. Commercialisation et installation | Site commercial bilingue, démos par métier, essai, abonnements annuels, paiement, console éditeur, paquet d'installation chez le client avec licence par clé, documentation publique | Un visiteur passe de la démo à l'essai puis à l'abonnement sans intervention ; une installation sur un serveur vierge fonctionne en moins d'une heure |

Chaque lot comprend ses tests automatiques : calculs du moteur de règles, isolation des entreprises, parcours critiques de bout en bout.

## 14. Gouvernance du développement

Antigravity écrit le code ; ce cahier des charges et les fichiers du dossier de cadrage sont sa seule source de vérité. Le dépôt a été reconstruit le 22 novembre 2026 sous le nom smart-collab, aligné sur ce cahier des charges ; l'ancien cadrage « MVP Retail » est rangé dans ses archives.

### Fait dans le dépôt, reste avant le lot 1

- [x] Renommer le projet en Smart Collab (README, AGENTS.md, documents).
- [x] Remplacer le PRD, le TRD, l'Appflow et le plan « MVP Retail » par ce cahier des charges découpé en fichiers.
- [x] Corriger les contradictions relevées : une seule stack (§10), multi-sites dans le premier périmètre, modes de règlement réels, journal des opérations dans le schéma.
- [x] Retirer du schéma SQL et des documents tout ce qui est propre à RUTHY'S.
- [x] Préparer un prompt et une liste de contrôle par lot dans `04_PROMPTS_AGENTS` et `06_LOTS`.
- [ ] Déposer les maquettes validées dans `05_UI_UX/maquettes`, un fichier par écran, avec la capture du prototype ou de la page DreamsERP d'inspiration (lot 0).

### Règles de travail

1. Un lot = un prompt = une démo testable ; jamais « construis tout l'ERP ».
2. Chaque prompt cite les identifiants d'exigences du lot (EF-…, ENF-…) ; l'agent ne code rien qui n'y figure pas.
3. Une branche Git par lot, fusionnée seulement après la démo et la liste de contrôle validées par la cheffe de projet.
4. Les tests automatiques du lot passent avant la fusion.
5. Toute décision qui change ce cahier des charges est notée dans le journal des décisions du dépôt, puis reportée ici.
6. Le prototype reste dans `03_SOURCES_REFERENCE` comme référence visuelle ; son code n'est jamais copié dans `src/`. Le code DreamsERP (version React / Next.js) peut l'être sous licence Extended, selon `00_GOUVERNANCE/LICENCES.md` (décision du 23/11/2026).

## 15. Points ouverts

Les neuf décisions ont été prises le 22 novembre 2026 ; deux demandent encore une proposition de ma part, faite dans ce document (hébergement §10, prestataire de paiement §12).

| Sujet | Décision | Reporté en |
| --- | --- | --- |
| Mode de vente | Les deux : abonnement en ligne hébergé par l'éditeur et installation chez le client | §12, §10, lot 12 |
| Licence DreamsERP | Achetée sous licence Extended (23/11/2026) : code et composants réutilisables dans Smart Collab ; données, textes et images de démonstration non repris | §5, §10, §14, `00_GOUVERNANCE/LICENCES.md` |
| Pays de lancement | Côte d'Ivoire et zone UEMOA | §6 (paie, taxes, comptabilité), §12 |
| Premier métier commercialisé | Commerce de détail et Multi-sites | §13 (lots 1 à 7) |
| Hébergement | Proposition faite, à valider | §10 |
| Paiement des abonnements | Facturation annuelle au minimum ; prestataire proposé, à valider | §12 |
| Langues | Français et anglais dès le lancement | §11, lot 1 |
| Matériel de caisse | Imprimante de tickets, tiroir-caisse et lecteur de codes-barres pris en charge | §6, lot 3 |
| Comptabilité légale | À prévoir : comptabilité SYSCOHADA et fiscalité des entreprises | §3, §6, lot 7 |

Reste à trancher :

- [ ] Valider la proposition d'hébergement (§10).
- [ ] Choisir le prestataire de paiement des abonnements (§12).
- [ ] Préciser les modèles d'imprimante, de tiroir et de lecteur à tester en priorité (lot 3).
