# Documentation des domaines métier — Smart Collab

**Méthode :** Structure → Objets → Processus → Règles → Optimisation → Automatisations → Événements → Modèle de données dérivé  
**Domaines couverts :** Retail · Multi-sites / Distribution · Audit / Conseil / Projet · Génie électrique  
**Principe :** le modèle de données est une conséquence du métier, pas un point de départ.

---

# Domaine 1 — Commerce de détail / Retail / Boutique

## A. Structure de l’entreprise

| Élément | Contenu typique |
|---------|-----------------|
| **Types de sites** | Boutique (vente), éventuellement réserve attenante |
| **Départements** | Direction · Commercial / Caisse · Magasin / Stock · Achats · Finance légère |
| **Équipes** | Caissiers, magasinier(s), responsable de boutique |
| **Rôles** | Admin · Gérant · Caissier · Magasinier |
| **Responsabilités** | Gérant : pilotage, commandes, prix · Caissier : encaissement · Magasinier : réception, inventaire |
| **Ressources** | Caisse, terminal, rayons, réserve, étiqueteuse |
| **Clients** | Particuliers, petits professionnels, fidèles / occasionnels |
| **Fournisseurs** | Grossistes textile / accessoires / multi-produits |
| **Partenaires** | Mobile money, banque, transporteur occasionnel |
| **Actifs** | Stock marchandise, caisse, mobilier commercial |
| **Produits / services** | Articles physiques (SKU), parfois dépôt-vente |

**Chaîne de commandement type**  
Direction → Gérant boutique → (Caissiers ‖ Magasinier) → Finance (gérant ou comptable externe)

---

## B. Objets métier

```
Fournisseur → Commande fournisseur → Réception (BL)
    → Contrôle → Stock site → Produit
        → Ticket / Vente → Client → Paiement
            → Marge · Session caisse · Mouvement de trésorerie
```

Objets centraux : **Produit**, **Stock site**, **Fournisseur**, **Commande**, **BL**, **Client**, **Ticket**, **Session caisse**, **Mouvement trésorerie**.

---

## C. Processus métier (cycles de vie)

### C1. Réapprovisionnement → Vente

```
Besoin (rupture / seuil)
  → Demande ou suggestion d’achat
  → Commande fournisseur (gérant)
  → Réception BL (magasinier)
  → Contrôle qté / écart
  → Entrée stock (après validation réception)
  → Mise en rayon
  → Vente caisse (caissier)
  → Encaissement
  → Sortie stock
  → Analyse marge (gérant)
```

| Question | Réponse retail |
|----------|----------------|
| Qui déclenche ? | Gérant (manuel) ou alerte seuil |
| Qui valide ? | Gérant commande ; magasinier réception |
| Données nécessaires | SKU, qté, PA, fournisseur, site, client?, mode paiement |
| Exceptions | Écart BL, stock insuffisant à la vente, annulation ticket (hors MVP strict) |
| Écritures | stock_moves, tickets, cash_movements |
| Notifications | Alerte seuil, écart réception |
| Historisé | Tous mouvements stock + tickets + sessions |

### C2. Session de caisse

Ouverture (fond) → Ventes → Clôture (comptage) → Écart théorique / réel (affiché).

---

## D. Règles métier

1. Le stock disponible n’augmente **qu’après validation** de la réception.  
2. Une vente exige une **session de caisse ouverte** sur le site.  
3. Une ligne de vente est refusée si **stock insuffisant** (pas de stock négatif).  
4. Ticket + lignes + mouvement stock + encaissement = **une seule transaction**.  
5. Un caissier ne réceptionne pas de BL ; un magasinier n’encaisse pas.  
6. Le prix de vente est figé sur la ligne au moment de l’encaissement.  
7. Une seule session `open` par site.

---

## E. Optimisation ERP

| Situation actuelle | Apport ERP |
|--------------------|------------|
| Commandes « à l’œil » | Suggestion = ventes hist. + stock + seuil + commandes en cours + délai frn |
| CA dispersé (cahier / Excel) | Dashboard jour / mois, panier moyen, top produits |
| Stock douteux | Mouvements tracés, alertes seuil, inventaire ciblé |
| Clients anonymes | Fiche + historique d’achats |

---

## F. Automatisations

```
Stock < seuil
  → Alerte gérant
  → Proposition de réappro (lignes préremplies)
  → Validation
  → Commande fournisseur (brouillon ou confirmée selon paramètre)
```

```
Clôture caisse
  → Calcul théorique espèces
  → Saisie compté
  → Affichage écart (pas de blocage MVP)
```

---

## Événements (ex. Produit / Stock)

Produit créé · acheté (commande) · réceptionné · stocké · vendu · ajusté · inventorié  
Session ouverte · ticket encaissé · session clôturée  
Client créé · rattaché à une vente  

Le stock à date = somme des événements quantitatifs sur le produit × site.

---

## Modèle de données dérivé (extrait)

`sites`, `products`, `stock_levels`, `stock_moves`, `suppliers`, `purchase_orders`, `purchase_receipts`, `customers`, `cash_sessions`, `tickets`, `ticket_lines`, `cash_movements`, `users`, `roles`, `enabled_modules`

---

# Domaine 2 — Multi-sites / Distribution

## A. Structure

| Élément | Contenu |
|---------|---------|
| **Sites** | Centrale / entrepôt · Boutiques · Éventuellement dépôt secondaire |
| **Départements** | Direction · Achats centraux · Logistique · Boutiques · Finance · Contrôle |
| **Équipes** | Magasiniers centrale, responsables boutique, transporteur interne / prestataire |
| **Rôles** | + Responsable logistique · Responsable multi-sites |
| **Clients** | Clients finaux en boutique (+ éventuellement clients pro livrés depuis centrale) |
| **Fournisseurs** | Négociés au niveau centrale |
| **Actifs** | Stocks multi-emplacements, véhicules / tournées |

**Chaîne**  
Direction → Achats / Logistique centrale → Sites de vente → Caisses locales

---

## B. Objets métier

```
Fournisseur → Commande → Réception centrale
  → Stock centrale
  → Bon de transfert → Transit → Réception boutique
  → Stock boutique → Vente → Client → Paiement
```

Objets spécifiques : **Bon de transfert**, **Ligne transfert**, **Écart de réception**, **Stock par site**, **Transit**.

---

## C. Processus — Transfert inter-sites

```
Besoin boutique / suggestion
  → Saisie bon de transfert (expéditeur → destinataire)
  → Validation / expédition  → stock expéditeur ↓  · statut EXPÉDIÉ
  → Transit
  → Réception destinataire (qté reçue vs expédiée)
  → Écart ? → signalement
  → Stock destinataire ↑  · statut RÉCEPTIONNÉ / CLÔTURÉ
```

| Point | Détail |
|-------|--------|
| Déclencheur | Rupture boutique, réassort planifié, demande manuelle |
| Validateurs | Magasinier centrale (expédition), responsable boutique (réception) |
| Données | Sites, produits, qté expédiée, qté reçue, magasin (rayon/réserve) |
| Exceptions | Manquant, surplus, refus partiel, annulation avant expédition |
| Écritures | 2 mouvements stock (sortie A, entrée B) + éventuel écart |
| Historisé | Chaque changement de statut du bon |

---

## D. Règles métier

1. Expédition : sortie immédiate du stock expéditeur.  
2. Tant que non réceptionné : quantité en **transit** (pas vendable au destinataire).  
3. Seule la **qté reçue** entre en stock destinataire.  
4. Un écart (reçu ≠ expédié) doit être journalisé ; le stock suit le réel.  
5. Interdiction de vendre du stock en transit.  
6. Transfert et vente concurrente : verrouillage optimiste ou contrôle de disponibilité à l’expédition.

---

## E. Optimisation

| Aujourd’hui | ERP |
|-------------|-----|
| WhatsApp / Excel entre sites | Workflow d’états unique |
| Surstock A / rupture B | Suggestions de transfert (rotation, seuil boutique) |
| CA multi-boutiques opaque | Comparaison sites, consolidation |

---

## F. Automatisations

```
Stock boutique < seuil
  ET stock centrale suffisant
  → Proposition de transfert
  → Validation logistique
  → Création bon (brouillon ou expédiable)
```

```
Bon non réceptionné > N jours
  → Alerte logistique + destinataire
```

---

## Événements

Transfert créé · validé · expédié · en transit · réceptionné partiel · clôturé · écart déclaré  
Stock site A diminué · stock transit · stock site B augmenté  

---

## Modèle dérivé (en plus du retail)

`stock_transfers`, `stock_transfer_lines` (qty_shipped, qty_received), statut workflow, `stock_moves.reason = transfer_out | transfer_in | transfer_variance`

---

# Domaine 3 — Audit / Conseil / Projet

## A. Structure

| Élément | Contenu |
|---------|---------|
| **Sites** | Siège, parfois bureaux clients (pas de stock marchandise) |
| **Départements** | Direction · Commercial · Delivery / Production · Finance · RH léger |
| **Équipes** | Chefs de mission, consultants, business developers |
| **Rôles** | Associé · Chef de mission · Consultant · Assistante · Admin |
| **Clients** | Entreprises, administrations, ONG |
| **Fournisseurs** | Sous-traitants, freelances, outils SaaS |
| **Actifs** | Temps facturable, propriété intellectuelle, contrats |
| **Offre** | Missions, forfaits, régie (temps passé), formations |

**Chaîne**  
Direction → Commercial → Chef de mission → Consultants → Finance

---

## B. Objets métier

```
Prospect → Opportunité → Proposition / Devis
  → Contrat → Mission / Projet
  → Équipe · Jalons · Feuilles de temps · Livrables
  → Situation / Facture → Encaissement
```

Objets centraux : **Prospect**, **Opportunité**, **Contrat**, **Mission**, **Jalon**, **Feuille de temps**, **Livrable**, **Facture**.

---

## C. Processus — Mission type

```
Lead / prospect
  → Qualification
  → Proposition
  → Signature contrat (forfait | régie | mixte)
  → Kick-off mission
  → Planification (équipe, jalons)
  → Exécution (temps + livrables)
  → Revue budget / avancement
  → Facturation (selon type de contrat)
  → Encaissement
  → Clôture mission
```

| Point | Détail |
|-------|--------|
| Déclencheur facture forfait | Jalons atteints ou échéancier contractuel |
| Déclencheur facture régie | Temps validé sur période |
| Données | Taux journalier, budget j/h, % avancement, temps consommé |
| Exceptions | Dépassement budget, scope creep, avenant |
| Historisé | Toutes saisies de temps, versions de livrables, factures |

---

## D. Règles métier

1. Une facture **au temps** n’est calculable que si le contrat est en **régie** (ou ligne régie).  
2. Une facture **forfait** s’appuie sur jalons / échéancier, pas sur la somme brute des temps (les temps servent au pilotage interne).  
3. Feuille de temps : validée par le consultant puis par le chef de mission avant facturation régie.  
4. Temps consommé > 80 % du budget → alerte (ne bloque pas seul).  
5. Pas de facture sur mission non démarrée / sans contrat actif.  
6. Un consultant ne voit que ses missions assignées.

---

## E. Optimisation

| Aujourd’hui | ERP |
|-------------|-----|
| Excel temps + Word devis | Chaîne unique prospect → encaissement |
| Dépassements découverts trop tard | Alertes 80 % budget / échéance |
| Marge mission floue | Coût temps interne vs facturé |

---

## F. Automatisations

```
Mission proche échéance
  ET temps > 80 % budget
  → Alerte chef de mission
  → Revue (avenant / réduction scope / acceptation dépassement)
```

```
Jalon « facturable » atteint
  → Proposition de facture
  → Validation finance
  → Émission
```

---

## Événements

Prospect créé · opportunité gagnée/perdue · contrat signé · mission ouverte · temps saisi · temps validé · jalon atteint · livrable déposé · facture émise · paiement reçu · mission clôturée  

---

## Modèle dérivé

`parties` (prospect/client), `opportunities`, `contracts` (type billing), `missions`, `mission_members`, `milestones`, `time_entries`, `deliverables`, `invoices`, `invoice_lines`, `payments`

---

# Domaine 4 — Génie électrique  
*(Négoce matériel + prestations installation / chantier)*

## A. Structure

| Élément | Contenu |
|---------|---------|
| **Sites** | Magasin / showroom · Entrepôt · Chantiers (sites temporaires) |
| **Départements** | Direction · Commercial · Bureau d’études · Achats · Stock · Travaux / Chantier · Finance |
| **Équipes** | Commerciaux, projeteurs, magasiniers, chefs de chantier, techniciens |
| **Rôles** | Direction · Commercial · BE · Acheteur · Magasinier · Chef de chantier · Technicien · Finance |
| **Clients** | Particuliers, entreprises, promoteurs, administrations |
| **Fournisseurs** | Fabricants / grossistes matériel électrique industriel & domestique |
| **Partenaires** | Sous-traitants, bureaux de contrôle, transporteurs |
| **Actifs** | Stock matériel, outillage, véhicules, équipements de chantier |
| **Offre** | Vente matériel · Étude · Installation · SAV / réparation |

**Chaîne**  
Direction → Commercial → Bureau d’études → Achats / Stock → Chef de chantier → Techniciens → Finance

---

## B. Objets métier

```
Prospect → Opportunité → Devis (matériel ± main-d’œuvre)
  → Contrat → Projet
  → Chantier
  → Besoins matériel · Réservations · Transferts chantier · Achats
  → Équipe · Interventions · Feuilles de temps
  → Situation de travaux → Facture → Paiement
  (+ vente comptoir magasin sur le volet négoce)
```

Objets spécifiques : **Devis mixte**, **Projet**, **Chantier**, **Besoin matériel**, **Réservation stock**, **Intervention**, **Situation de travaux**.

---

## C. Processus

### C1. Cycle chantier (prestations)

```
Opportunité
  → Devis (lignes matériel + main-d’œuvre)
  → Acceptation client / contrat
  → Ouverture projet + chantier
  → Planification équipe + planning
  → Explosion besoins matériel
  → Réservation stock central / magasin
  → Si manque : transfert ou achat
  → Interventions terrain
  → Pointage temps + consommation matériel
  → Situation de travaux (avancement %)
  → Facturation situation / solde
  → Réception client · clôture chantier
```

### C2. Cycle négoce (magasin)

Identique au retail (caisse / commande / stock), éventuellement **réservations** pour chantiers prioritaires.

| Point | Détail |
|-------|--------|
| Déclencheur réservation | Validation devis ou lancement chantier |
| Qui valide sortie chantier | Chef de chantier / magasinier |
| Exceptions | Vol / casse chantier, retour matériel non posé, avenant quantités |
| Écritures | Réservation · transfert chantier · consommation · situation · facture |

---

## D. Règles métier

1. Matériel **réservé** pour un chantier n’est plus disponible à la vente magasin.  
2. Sortie vers chantier = mouvement stock (centrale → chantier) tracé.  
3. Consommation chantier diminue le stock chantier et alimente le coût projet.  
4. Une situation de travaux facturable s’appuie sur % d’avancement validé (ou jalons).  
5. Un devis accepté peut générer réservations automatiques des lignes matériel.  
6. Stock chantier insuffisant → vérifier centrale → transfert ou demande d’achat.  
7. Technicien : interventions et temps ; pas de modification des prix de vente catalogue.

---

## E. Optimisation

| Aujourd’hui | ERP |
|-------------|-----|
| Matériel chantier « disparu » | Réservations + stock chantier |
| Devis Word / Excel | Devis lié stock + temps + facturation |
| Rentabilité chantier inconnue | Coût matériel + heures vs situations facturées |
| File d’attente SAV opaque | Ordres de réparation liés client / équipement |

---

## F. Automatisations

```
Besoin matériel chantier
  → Stock chantier ?
      Non → Stock centrale ?
           Oui → Proposition transfert + réservation
           Non → Demande d’achat (fournisseur habituel du SKU)
```

```
Situation mensuelle due (contrat)
  → Rappel chef de chantier
  → Saisie avancement
  → Proposition facture situation
```

```
Intervention SAV planifiée
  → Vérification pièces détachées
  → Réservation ou achat
```

---

## Événements

Devis créé · envoyé · accepté · refusé  
Projet ouvert · chantier démarré  
Matériel réservé · transféré · consommé · retourné  
Intervention planifiée · démarrée · terminée  
Situation émise · facture émise · paiement reçu · chantier clôturé  

---

## Modèle dérivé (en plus retail + projet)

`projects`, `sites` (kind = chantier), `project_material_needs`, `stock_reservations`, `interventions`, `work_progress_certificates` (situations), liens facture ↔ situation / devis  
Réutilise `time_entries`, `stock_moves`, `purchase_*`, `tickets` (négoce)

---

# Synthèse transversale

## Logique commune des 4 domaines

```
PROCESSUS
  → OBJETS MÉTIER
  → ÉVÉNEMENTS (historique rejouable)
  → RÈGLES (garde-fous)
  → OPTIMISATION (aide à la décision)
  → AUTOMATISATIONS (flux proposés, souvent avec validation humaine)
  → DONNÉES NÉCESSAIRES
  → MODÈLE DE DONNÉES
```

## Ce qui change vraiment d’un domaine à l’autre

| Dimension | Retail | Multi-sites | Conseil | Génie électrique |
|-----------|--------|-------------|---------|------------------|
| Unité de stock | Boutique | Multi-emplacements + transit | Quasi nulle | Magasin + chantier |
| Unité de vente | Ticket | Ticket | Mission / jalon / temps | Devis mixte + ticket |
| Objet pivot | Ticket / stock | Transfert | Mission / temps | Chantier / réservation |
| Facturation | Immédiate caisse | Idem + consolidé | Forfait / régie | Situation de travaux + caisse |
| Rôle critique | Caissier | Logistique | Chef de mission | Chef de chantier |

## Domaine « Mixte »

Ce n’est pas un 5ᵉ métier : c’est une **composition**.  
Exemple : génie électrique = Retail (magasin) + Projet/Chantier + Achats multi-sites.  
À la configuration, on active les modules des domaines concernés ; les règles les plus strictes s’appliquent aux objets partagés (ex. réservation vs vente libre).

---

## Suite

L'ordre de construction est fixé par `02_SPECIFICATIONS/13_PLAN_LOTS.md` : Commerce de détail et Multi-sites d'abord (lots 1 à 7), puis Conseil (lot 9) et Génie électrique (lot 10).
Les règles décrites ici sont les **réglages par défaut** de chaque métier ; chaque entreprise cliente peut les modifier dans le moteur de configuration (`02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md`), sauf les garanties communes EF-GEN.

---

*Document de référence métier — Smart Collab*  
*Méthode : profondeurs A→F · événements · données dérivées des processus*
