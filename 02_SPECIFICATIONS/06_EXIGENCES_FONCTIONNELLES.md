# Smart Collab — 6. Exigences fonctionnelles par module

> Extrait de `00_CAHIER_DES_CHARGES_COMPLET.md`. En cas d'écart, le cahier complet fait foi.

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

