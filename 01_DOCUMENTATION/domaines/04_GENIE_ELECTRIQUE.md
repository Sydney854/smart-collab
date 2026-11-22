# Documentation métier approfondie  
## Domaine Génie électrique — Smart Collab

**Version :** 1.0  
**Périmètre :** entreprise de négoce de matériel électrique (industriel et domestique) **et** de prestations d’installation / chantier / SAV  
**Méthode :** Structure → Objets → Processus (BPM) → Règles → Événements → Optimisation → Automatisations → Modèle de données dérivé  
**Principe :** deux moteurs dans une même entreprise — **magasin** (stock + caisse) et **travaux** (projet + chantier + situations) — reliés par le matériel réservé, transféré et consommé.

---

# 1. Vision du domaine

Une entreprise de génie électrique vit sur **deux jambes** :

| Jambes | Ce qu’elle vend | Logique dominante |
|--------|-----------------|-------------------|
| **Négoce** | Câbles, tableaux, luminaires, appareillage, matériel industriel | Stock, prix d’achat / vente, caisse ou commande client |
| **Travaux** | Étude, installation, mise en conformité, maintenance, SAV | Devis, chantier, équipe, avancement, situation de travaux |

L’ERP doit empêcher que ces deux mondes se marchent dessus :

- le matériel **réservé pour un chantier** ne doit pas être vendu au comptoir par erreur  
- le coût d’un chantier doit inclure **matériel consommé + heures**  
- un devis accepté doit pouvoir **réserver** et **planifier** sans ressaisie  

Ce n’est ni un pure retail, ni un pure cabinet de conseil : c’est un **hybride négoce + project + chantier**.

---

# 2. Niveau A — Structure de l’entreprise

## 2.1 Types de sites

| Type | Rôle |
|------|------|
| **Magasin / showroom** | Vente comptoir, exposition, retrait client |
| **Entrepôt / centrale** | Stock principal, réception fournisseurs |
| **Atelier** | Préparation tableaux, pré-câblage, SAV |
| **Chantier** | Site temporaire client ; stock chantier, interventions |
| **Siège** | Direction, commercial, BE, finance |

Un **chantier** est un site à durée de vie limitée, rattaché à un projet, avec un stock local tracé.

## 2.2 Organigramme type

```
                         ┌─────────────────┐
                         │    Direction    │
                         └────────┬────────┘
            ┌─────────────────────┼─────────────────────┐
            ▼                     ▼                     ▼
     ┌────────────┐        ┌────────────┐        ┌────────────┐
     │ Commercial │        │   Bureau   │        │  Finance   │
     │            │        │ d'études   │        │            │
     └─────┬──────┘        └─────┬──────┘        └────────────┘
           │                     │
           │              ┌──────┴──────┐
           │              ▼             ▼
           │       ┌──────────┐  ┌────────────┐
           │       │  Achats  │  │   Stock    │
           │       └────┬─────┘  └─────┬──────┘
           │            │              │
           ▼            ▼              ▼
     ┌──────────────────────────────────────┐
     │         Direction travaux            │
     │     (Chefs de chantier)              │
     └──────────────────┬───────────────────┘
                        │
                        ▼
                 ┌──────────────┐
                 │ Techniciens  │
                 │  / Équipes   │
                 └──────────────┘
```

## 2.3 Départements

| Département | Mission |
|-------------|---------|
| **Direction** | Arbitrage marge chantiers, investissements, grand compte |
| **Commercial** | Prospects, devis, suivi client magasin et travaux |
| **Bureau d’études (BE)** | Dimensionnement, plans, nomenclatures matériel, chiffrage technique |
| **Achats** | Fournisseurs, commandes, délais, prix d’achat |
| **Stock / Magasin** | Réception, rangement, réservations, transferts chantier, inventaire |
| **Travaux** | Planning, chefs de chantier, techniciens, sécurité chantier |
| **SAV / Maintenance** | Interventions après livraison, contrats d’entretien |
| **Finance** | Situations de travaux, factures, encaissements, règlements fournisseurs |

## 2.4 Rôles et responsabilités

| Rôle | Responsabilités | Limites |
|------|-----------------|---------|
| **Direction** | Valide gros devis, ouverture chantiers stratégiques | Ne gère pas le détail stock quotidien |
| **Commercial** | Devis client, négociation, suivi opportunité | Ne sort pas le stock sans circuit magasin |
| **Projeteur / BE** | Nomenclature, quantitatifs, plans | Ne commande pas seul sans circuit achats (sauf seuil) |
| **Acheteur** | Commandes fournisseurs, relances délai | Ne facture pas le client |
| **Magasinier** | Réception BL, préparation, transfert, inventaire | N’encaisse pas au comptoir (sauf double casquette) |
| **Caissier / vendeur magasin** | Vente comptoir, retrait | Ne consomme pas le stock chantier |
| **Chef de chantier** | Planning équipe, demandes matériel, avancement, situations | Ne modifie pas les prix catalogue seuls |
| **Technicien** | Exécution, pointage, compte-rendu intervention | Ne valide pas une situation de facturation |
| **Finance** | Factures, situations, paiements | Ne décide pas du % d’avancement technique |

## 2.5 Ressources

- **Humaines :** commerciaux, projeteurs, magasiniers, chefs de chantier, électriciens, apprentis  
- **Matérielles :** stock, véhicules, outillage, engins légers, EPI  
- **Immatérielles :** bibliothèques de prix, schémas types, historiques de chantiers  
- **Financières :** stock immobilisé, acomptes clients, retards de paiement BTP  

## 2.6 Clients, fournisseurs, partenaires

| Type | Exemples |
|------|----------|
| **Clients** | Particuliers, entreprises industrielles, promoteurs, administrations, syndics |
| **Fournisseurs** | Grossistes électriques, fabricants (Schneider, Legrand, ABB… selon marché), importateurs |
| **Partenaires** | Sous-traitants (génie civil léger, courants faibles), bureaux de contrôle, transporteurs |

## 2.7 Offre (produits / services)

| Famille | Contenu |
|---------|---------|
| **Matériel** | Appareillage, câblerie, éclairage, tableaux, automatismes, matériel industriel |
| **Étude** | Diagnostic, dimensionnement, plans d’exécution |
| **Installation** | Pose, câblage, mise en service |
| **Forfait travaux** | Lot complet (matériel + main-d’œuvre) |
| **Régie travaux** | Heures techniciens ± matériel réel |
| **SAV / maintenance** | Dépannage, contrat d’entretien, réparation |

---

# 3. Niveau B — Objets métier

## 3.1 Double chaîne (négoce + travaux)

```
                    NÉGOCE                              TRAVAUX
                 ────────────                        ────────────
Fournisseur ──▶ Commande ──▶ BL ──▶ Stock
                                      │
                                      ├──────────────────────────────┐
                                      ▼                              ▼
                               Vente magasin                  Réservation
                               Ticket / Client                Projet / Chantier
                                      │                              │
                                      ▼                              ▼
                                  Paiement                    Transfert chantier
                                                                     │
                                                                     ▼
                                                              Consommation
                                                                     │
                                                                     ▼
                                                            Situation travaux
                                                                     │
                                                                     ▼
                                                                  Facture
                                                                     │
                                                                     ▼
                                                                Paiement
```

## 3.2 Chaîne commerciale travaux (détail)

```
Prospect / Client
      │
      ▼
Opportunité
      │
      ▼
Devis (lignes matériel + lignes main-d’œuvre + options)
      │
      ├─ Refusé
      │
      ▼
Acceptation / Contrat
      │
      ▼
Projet
      │
      ▼
Chantier (site temporaire)
      │
      ├── Besoins matériel (nomenclature)
      ├── Réservations stock
      ├── Achats complémentaires
      ├── Transferts vers chantier
      ├── Équipe + planning
      ├── Interventions
      ├── Feuilles de temps
      ├── Consommations matériel
      │
      ▼
Situations de travaux (avancement %)
      │
      ▼
Factures (acompte, situation, solde)
      │
      ▼
Paiements · Clôture chantier · Retours matériel
```

## 3.3 Dictionnaire des objets

| Objet | Définition | Attributs clés |
|-------|------------|----------------|
| **Produit / Article** | Référence catalogue | Code, famille, PA, PV, stock mini, fournisseur principal |
| **Stock site** | Quantité par emplacement | Magasin, entrepôt, chantier |
| **Réservation** | Quantité bloquée pour un projet/chantier | Article, qté, projet, statut |
| **Fournisseur** | Source d’approvisionnement | Délai, conditions |
| **Commande fournisseur** | Engagement d’achat | Lignes, statut |
| **BL / Réception** | Entrée physique | Qté reçue vs commandée |
| **Client** | Acheteur magasin ou maître d’ouvrage | Type, contacts |
| **Devis** | Offre chiffrée | Versions, validité, total HT |
| **Ligne de devis** | Matériel **ou** main-d’œuvre **ou** forfait | Type de ligne, qté, prix |
| **Contrat / Commande client** | Acceptation engageante | Lien devis, acomptes prévus |
| **Projet** | Conteneur administratif et financier | Client, budget, dates, marge cible |
| **Chantier** | Lieu d’exécution | Adresse, dates, chef, statut |
| **Besoin matériel** | Nomenclature chantier | Article, qté nécessaire, qté réservée, qté consommée |
| **Bon de transfert** | Mouvement entre sites | Expéditeur, destinataire, lignes |
| **Intervention** | Visite / tâche planifiée | Date, techniciens, compte-rendu |
| **Feuille de temps** | Heures sur projet/chantier | Tech, heures, activité |
| **Situation de travaux** | Constat d’avancement facturable | % global ou par lot, montant |
| **Facture** | Acompte / situation / solde / vente magasin | Origine (POS ou travaux) |
| **Ticket caisse** | Vente comptoir | Session, lignes, paiement |

## 3.4 Carte des relations (travaux + stock)

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│  Devis   │────▶│ Contrat  │
└──────────┘     └──────────┘     └────┬─────┘
                                       │
                                       ▼
                                 ┌──────────┐
                                 │  Projet  │
                                 └────┬─────┘
                                      │
                         ┌────────────┼────────────┐
                         ▼            ▼            ▼
                  ┌──────────┐ ┌──────────┐ ┌────────────┐
                  │ Chantier │ │  Besoins │ │   Équipe   │
                  └────┬─────┘ │ matériel │ └────────────┘
                       │       └────┬─────┘
                       │            │
                       │            ├──────────▶ Réservations ──▶ Stock magasin
                       │            │
                       │            └──────────▶ Achats / Transferts
                       │
                       ├──── Interventions
                       ├──── Temps
                       ├──── Consommations stock chantier
                       │
                       ▼
                Situations ──▶ Factures ──▶ Paiements
```

---

# 4. Niveau C — Processus métier (BPM)

## 4.1 Vue d’ensemble des flux

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   NÉGOCE     │     │   TRAVAUX    │     │   SUPPORT    │
│ Magasin/POS  │     │ Devis→Chantier│    │ Achats/Stock │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                      │
       │                    └──────────┬───────────┘
       │                               │
       └───────────────┬───────────────┘
                       ▼
                 FINANCE COMMUNE
              (factures, paiements,
               règlements fournisseurs)
```

---

## 4.2 Processus N1 — Vente magasin (négoce)

Identique dans l’esprit au retail :

```
Ouverture session caisse
  → Recherche article
  → Contrôle stock disponible (non réservé)
  → Panier + client optionnel
  → Encaissement
  → Sortie stock magasin
  → Ticket
```

**Point spécifique génie électrique :**  
Le stock **disponible à la vente** = stock physique − quantités **réservées** chantiers.

---

## 4.3 Processus N2 — Approvisionnement

```
Besoin (seuil magasin OU besoin chantier non couvert)
  → Demande / suggestion d’achat
  → Commande fournisseur
  → Réception BL
  → Contrôle écart
  → Entrée stock (site destinataire)
  → Si commande liée chantier → affectation / réservation possible
```

---

## 4.4 Processus T1 — Du prospect au devis accepté

```
[Lead / demande client]
      │
      ▼
 Qualification (budget, type site, urgence, conformité)
      │
      ▼
 Visite / relevé (si installation)
      │
      ▼
 Bureau d’études
  - Plans / schémas
  - Nomenclature matériel
  - Estimation heures
      │
      ▼
 Chiffrage devis
  - Lignes matériel (PA → PV ou prix de vente chantier)
  - Lignes main-d’œuvre (TJM / forfait pose)
  - Divers, déplacements, aléas
      │
      ▼
 Validation interne (marge minimale, direction si > seuil)
      │
      ▼
 Envoi client · négociation · versions
      │
      ├─ Refus ──▶ Motif · archivage
      │
      ▼
 Acceptation ──▶ Contrat / bon de commande client
```

**Qui valide le devis :** Commercial + BE (technique) + Direction au-delà du seuil de marge ou de montant.

---

## 4.5 Processus T2 — Ouverture projet / chantier

```
[Contrat signé / devis accepté]
      │
      ▼
 Création Projet
  - Budget matériel
  - Budget main-d’œuvre
  - Acomptes prévus
      │
      ▼
 Création Chantier (adresse, dates, chef)
      │
      ▼
 Explosion des besoins matériel (depuis devis / BE)
      │
      ▼
 Pour chaque article nécessaire :
      │
      ├─ Stock disponible non réservé suffisant ?
      │     OUI ──▶ Réservation
      │     NON ──▶ Vérifier autres sites
      │              OUI ──▶ Transfert + réservation
      │              NON ──▶ Demande d’achat liée projet
      │
      ▼
 Planning équipe (interventions)
      │
      ▼
 Acompte client (si contractuel) ──▶ Facture d’acompte
```

---

## 4.6 Processus T3 — Exécution chantier

```
┌─────────────────────────────────────────────┐
│              BOUCLE CHANTIER                │
│                                             │
│  Planning semaine                           │
│       │                                     │
│       ▼                                     │
│  Préparation matériel (picking magasin)     │
│       │                                     │
│       ▼                                     │
│  Transfert / livraison chantier             │
│       │                                     │
│       ▼                                     │
│  Interventions techniciens                  │
│       │                                     │
│       ├─ Pointage temps                     │
│       ├─ Consommation articles              │
│       └─ Compte-rendu / photos              │
│                                             │
│  Demande complémentaire matériel ?          │
│       │                                     │
│       └─ Oui ──▶ réservation / achat / xfer │
└─────────────────────────────────────────────┘
      │
      ▼
 Situations d’avancement périodiques
      │
      ▼
 Réception client / levée de réserves
      │
      ▼
 Retour matériel non consommé ──▶ stock magasin
      │
      ▼
 Facture de solde · clôture chantier
```

### Consommation matériel

| Étape | Effet stock |
|-------|-------------|
| Réservation | Disponible vente ↓ (physique inchangé) |
| Transfert vers chantier | Stock magasin ↓ · Stock chantier ↑ · Réservation soldée sur la qté transférée |
| Consommation sur chantier | Stock chantier ↓ · Coût projet ↑ |
| Retour fin de chantier | Stock chantier ↓ · Stock magasin ↑ |

---

## 4.7 Processus T4 — Situations de travaux et facturation

```
Période de situation (mensuelle ou jalons)
      │
      ▼
 Chef de chantier saisit l’avancement
  - % global ou % par lot
  - Quantités posées (option)
      │
      ▼
 Validation direction travaux / commercial
      │
      ▼
 Calcul montant situation
  = f(contrat, % avancement, acomptes déjà facturés)
      │
      ▼
 Facture de situation
      │
      ▼
 Envoi client · suivi paiement
```

**Différence avec le conseil :**  
ici l’avancement est souvent **physique** (lots posés, % chantier), pas seulement des jours consommés.  
Les heures servent à la **marge interne** ; le contrat peut être forfait travaux, bordereau de prix, ou régie.

### Modes de facturation travaux

| Mode | Base de calcul |
|------|----------------|
| **Forfait** | % d’avancement × montant contrat − déjà facturé |
| **Bordereau / métrés** | Quantités réalisées × prix unitaires |
| **Régie** | Heures validées × taux + matériel consommé (si prévu) |
| **Magasin** | Ticket caisse classique |

---

## 4.8 Processus T5 — SAV / dépannage

```
Demande client (panne, malfaçon, entretien)
  → Ticket / ordre d’intervention
  → Diagnostic
  → Pièces nécessaires ?
       OUI ──▶ stock ou achat
  → Intervention
  → Temps + pièces
  → Facturable ? (garantie / hors garantie / contrat maintenance)
  → Facture éventuelle
  → Clôture
```

---

## 4.9 Matrice RACI (extrait travaux)

| Activité | Commercial | BE | Achats | Magasin | Chef chantier | Technicien | Finance |
|----------|:----------:|:--:|:------:|:-------:|:-------------:|:----------:|:-------:|
| Chiffrer devis | R | C | C | — | — | — | I |
| Valider marge devis | A | C | — | — | — | — | C |
| Réserver matériel | C | C | — | R | C | — | — |
| Transfert chantier | — | — | — | R | C | — | — |
| Pointer temps | — | — | — | — | C | R | — |
| Saisir situation | C | — | — | — | R | — | C |
| Émettre facture | C | — | — | — | C | — | R |
| Clôturer chantier | I | — | — | C | R | I | C |

---

# 5. Niveau D — Règles métier

## 5.1 Stock et disponibilité

| ID | Règle |
|----|-------|
| G01 | **Disponible vente** = stock physique site − réservations actives sur ce site. |
| G02 | Une réservation chantier **bloque** la vente magasin sur la quantité réservée. |
| G03 | Seule une réception **validée** augmente le stock physique. |
| G04 | Un transfert chantier : sortie site source + entrée site chantier (pas de disparition). |
| G05 | La consommation chantier diminue le stock chantier et **impute le coût** au projet. |

## 5.2 Devis et contrats

| ID | Règle |
|----|-------|
| G10 | Un devis accepté peut déclencher la création projet + explosion des besoins. |
| G11 | Les prix des lignes devis sont figés à l’acceptation (avenant pour modifier). |
| G12 | Marge devis < seuil paramétré → validation direction obligatoire. |
| G13 | Avenant quantitatif : met à jour besoins + éventuelles réservations. |

## 5.3 Chantier et facturation

| ID | Règle |
|----|-------|
| G20 | Une situation ne peut dépasser 100 % du contrat (hors avenants). |
| G21 | Montant cumulé facturé ≤ montant contrat + avenants. |
| G22 | En forfait travaux, les heures **ne calculent pas** seules la facture client (elles calculent la marge). |
| G23 | En régie, heures `approved` + matériel consommé facturable selon contrat. |
| G24 | Clôture chantier : stock chantier à zéro ou retour explicite ; réservations soldées. |

## 5.4 Droits

| ID | Règle |
|----|-------|
| G30 | Technicien : interventions et temps ; pas de modification du % de situation final. |
| G31 | Magasinier : mouvements stock ; pas d’émission de facture client travaux. |
| G32 | Commercial : devis et suivi client ; pas de validation seule d’un BL fournisseur (sauf rôle mixte). |

---

# 6. Événements métier

## 6.1 Catalogue / stock

```
product.created
stock.received
stock.reserved
stock.reservation_released
stock.transfer_shipped
stock.transfer_received
stock.consumed_on_site
stock.returned_from_site
stock.adjusted
```

## 6.2 Commercial travaux

```
opportunity.created
quote.created
quote.sent
quote.revised
quote.accepted
quote.rejected
contract.signed
contract.amended
```

## 6.3 Projet / chantier

```
project.opened
site_works.opened
material_need.created
material_need.covered
intervention.planned
intervention.started
intervention.completed
time.approved
progress_certificate.drafted
progress_certificate.validated
project.closed
site_works.closed
```

## 6.4 Finance

```
invoice.issued          -- magasin ou travaux
invoice.paid
purchase_order.placed
supplier_invoice.booked
supplier_payment.done
```

Le stock et le coût projet se **reconstruisent** en rejouant ces événements dans l’ordre.

---

# 7. Niveau E — Optimisation

| Douleur terrain | Apport ERP |
|-----------------|------------|
| Matériel acheté pour un chantier et revendu au comptoir | Réservations + disponible vente |
| « On ne sait pas ce qu’il reste sur le chantier » | Stock chantier + consommations |
| Devis sous-estimé découvert trop tard | Nomenclature BE + historique coûts réels |
| Chantier rentable sur le papier, déficit réel | Marge = facturé − (matériel consommé + heures × coût) |
| Relances fournisseurs et clients dispersées | Commandes + situations + échéances dans un seul pilotage |
| SAV sans historique | Fiche client + interventions passées + matériel posé |

### Aide à la décision — couverture matériel

```
Besoin chantier (qté)
  – Déjà réservé
  – Déjà sur stock chantier
  – Déjà en commande fournisseur ouverte
  ────────────────────────
  Reste à couvrir
      │
      ▼
  Proposition : transfert interne OU achat
```

### Aide à la décision — marge chantier à date

```
Facturé à date (acomptes + situations)
+ Reste à facturer estimé
– Coût matériel consommé
– Coût matériel réservé restant (au PA)
– Heures approved × coût interne
– Frais directs
────────────────────────
Marge à terminaison estimée
```

---

# 8. Niveau F — Automatisations

## 8.1 Couverture matériel à l’acceptation du devis

```
quote.accepted
  → Création projet + chantier (si paramétré)
  → Explosion besoins
  → Pour chaque ligne matériel :
        si disponible ≥ besoin → réservation auto (ou proposition)
        sinon → ligne « à couvrir » dans file achats / transferts
```

## 8.2 Rupture chantier

```
Stock chantier < besoin restant pour 5 jours de planning
  → Alerte chef de chantier + magasin
  → Si stock centrale OK → proposition de transfert
  → Sinon → proposition d’achat urgent
```

## 8.3 Situation mensuelle

```
Jour J (paramétré) chaque mois
  → Liste chantiers actifs avec facturation par situation
  → Tâche « saisir avancement » pour chaque chef de chantier
  → Après validation → brouillon de facture pour finance
```

## 8.4 Retour de fin de chantier

```
site_works.closing_requested
  → Liste stock chantier > 0
  → Proposition de bon de retour vers magasin
  → Après validation → transfert retour + libération réservations résiduelles
```

---

# 9. Modèle de données dérivé

## 9.1 Réutilisation

| Déjà utile (retail / conseil) | Usage ici |
|-------------------------------|-----------|
| `products`, `stock_levels`, `stock_moves` | Négoce + chantier |
| `partners` / `customers` / `suppliers` | Clients & frns |
| `purchase_*` | Approvisionnement |
| `tickets` / `cash_sessions` | Magasin |
| `projects`, `time_entries` | Travaux |
| `invoices`, `payments` | Finance unique |
| `domain_events` | Traçabilité |

## 9.2 Entités spécifiques

| Table | Rôle |
|-------|------|
| `quotes` + `quote_lines` | Devis versionnés (`line_type`: material, labor, flat) |
| `contracts` / `customer_orders` | Acceptation client |
| `projects` | Enveloppe financière et marge |
| `work_sites` | Chantiers (site temporaire, adresse, chef) |
| `material_requirements` | Besoins par projet/chantier |
| `stock_reservations` | Blocages disponibilité |
| `stock_transfers` + lines | Magasin ↔ chantier |
| `interventions` | Planning et CR terrain |
| `progress_certificates` | Situations de travaux |
| `progress_certificate_lines` | Lots / % / montants |

## 9.3 Schéma relationnel synthétique

```
customers ── quotes ── contracts ── projects ── work_sites
                              │           │
                              │           ├── material_requirements
                              │           ├── stock_reservations ── products
                              │           ├── interventions
                              │           ├── time_entries
                              │           └── progress_certificates ── invoices
                              │
products ── stock_levels (magasin | entrepot | chantier)
        └── stock_moves (sale, receipt, transfer, consumption, return)
```

## 9.4 Exemples de champs critiques

**stock_reservations**
- `product_id`, `site_id`, `project_id`  
- `qty_reserved`, `qty_issued`, `status` (`active`, `closed`, `cancelled`)  

**material_requirements**
- `qty_required`, `qty_reserved`, `qty_on_site`, `qty_consumed`  

**progress_certificates**
- `project_id`, `period`, `percent_complete`, `amount`, `status`  

**quote_lines**
- `line_type`, `product_id` nullable, `labor_hours` nullable, `unit_price`, `cost_price`

## 9.5 Formule de stock disponible (implémentation)

```
available(product, site) =
    qty_on_hand(product, site)
  − sum(reservations active on product, site)
```

Les ventes magasin et les nouvelles réservations testent **available**, pas seulement `qty_on_hand`.

---

# 10. Indicateurs de pilotage

| KPI | Lecture |
|-----|---------|
| **Taux de couverture matériel** | Réservé+commandé+sur site / besoin |
| **Rotation stock magasin** | Sorties / stock moyen |
| **Marge chantier à terminaison** | Voir §7 |
| **Écart devis vs réel** | Coût réel matériel+MO / coût devis |
| **Délai moyen situation → paiement** | Trésorerie BTP |
| **Charge équipes** | Heures planifiées vs capacité |
| **Taux de retours fin de chantier** | Matériel revenu / matériel envoyé (surachat ou sur-réservation) |
| **CA magasin vs CA travaux** | Mix d’activité |

---

# 11. Parcours utilisateurs prioritaires

## 11.1 Commercial
1. Créer opportunité / devis  
2. S’appuyer sur BE pour nomenclature  
3. Envoyer, versionner, faire accepter  
4. Suivre acomptes et situations avec finance  

## 11.2 Magasinier
1. Réceptionner BL  
2. Voir file des réservations à préparer  
3. Transférer vers chantiers  
4. Réintégrer les retours  

## 11.3 Chef de chantier
1. Consulter besoins et stock chantier  
2. Demander complément matériel  
3. Planifier interventions  
4. Valider temps techniciens  
5. Saisir la situation d’avancement  

## 11.4 Technicien
1. Voir planning du jour  
2. Compte-rendu d’intervention  
3. Pointer les heures  
4. Déclarer matériel utilisé (si saisie terrain)  

## 11.5 Finance
1. Factures magasin (flux caisse)  
2. Acomptes et situations travaux  
3. Encaissements clients  
4. Règlements fournisseurs  

---

# 12. Composition des modules Smart Collab

| Besoin | Module |
|--------|--------|
| Caisse magasin | Point de Vente |
| Catalogue / stock multi-sites | Produits & Inventaire · Sites & Entrepôts |
| Transferts | Transferts |
| Achats | Achats |
| Devis / clients | Ventes · CRM |
| Projet / chantier | Projet · Chantier · Planification |
| Temps | Feuilles de temps |
| Situations / factures | Facturation · Finance |
| SAV | Interventions / Réparation (selon catalogue) |
| Pilotage | Dashboard · Rapports · Centre de contrôle |

Le domaine **Génie électrique** active typiquement un **preset** qui coche négoce + travaux + stock multi-emplacements.

---

# 13. Critères de réussite d’un MVP « Génie électrique »

1. Vente magasin refuse un article **entièrement réservé** chantier.  
2. Acceptation d’un devis crée (ou propose) réservations / liste à couvrir.  
3. Transfert magasin → chantier trace les deux stocks.  
4. Consommation chantier alimente le coût projet.  
5. Une situation forfait calcule le bon montant restant à facturer.  
6. Clôture chantier : retours de stock possibles, réservations soldées.  
7. Dashboard sépare **CA magasin** et **CA travaux**.

---

# 14. Synthèse — des deux jambes vers un système unique

```
                    CLIENT
                   /      \
                  /        \
           MAGASIN          TRAVAUX
          (ticket)         (devis→chantier)
               \              /
                \            /
                 STOCK & ACHATS
                 (réservation,
                  transfert,
                  consommation)
                      │
                      ▼
                   FINANCE
              (une vérité trésorerie)
                      │
                      ▼
                  PILOTAGE
            marge magasin · marge chantier
```

```
PROCESSUS RÉELS
  → OBJETS (devis, réservation, chantier, situation…)
  → ÉVÉNEMENTS (reserved, transferred, consumed, certified…)
  → RÈGLES (disponible = physique − réservé, etc.)
  → DONNÉES
  → AUTOMATISATIONS (couverture, situations, retours)
```

---

*Document domaine Génie électrique — Smart Collab*  
*Complète Retail (BPM stock/caisse) et Audit/Conseil (missions/temps) par la jonction réservation–chantier–situation.*
