# Documentation métier approfondie  
## Domaine Audit / Conseil / Projet — Smart Collab

**Version :** 1.0  
**Périmètre :** cabinets de conseil, audit, expertise, missions intellectuelles à forte composante temps / livrables  
**Méthode :** Structure → Objets → Processus (BPM) → Règles → Événements → Optimisation → Automatisations → Modèle de données dérivé  
**Principe :** le système enregistre la réalité du cabinet, en force les règles contractuelles, et transforme le temps et les livrables en pilotage et en facturation.

---

# 1. Vision du domaine

Un cabinet de conseil / audit ne « vend » pas un stock de produits.  
Il vend de la **capacité intellectuelle** transformée en :

- missions cadrées par un contrat  
- temps passé (régie) et/ou forfaits (jalons)  
- livrables  
- factures et encaissements  

L’ERP de ce domaine doit donc répondre à cinq questions permanentes :

1. **Qui travaille sur quoi, pour quel client ?**  
2. **Combien de temps a été consommé vs budget ?**  
3. **Qu’est-ce qui a été livré et validé ?**  
4. **Que peut-on facturer, selon le contrat ?**  
5. **La mission est-elle rentable ?**

Ce n’est pas un POS. Ce n’est pas un WMS. C’est un **système de pilotage de la production intellectuelle**.

---

# 2. Niveau A — Structure de l’entreprise

## 2.1 Types de sites

| Type | Rôle |
|------|------|
| **Siège / bureau principal** | Direction, commercial, administration, finance |
| **Antenne / bureau secondaire** | Équipes locales, parfois facturation locale |
| **Site client (virtuel)** | Lieu d’intervention ; pas un stock, mais un contexte de mission |
| **Remote / domicile** | Travail déporté ; rattaché au siège pour le temps et les coûts |

Il n’y a en général **pas d’entrepôt de marchandises**. Les « stocks » du cabinet sont : le **temps disponible**, les **compétences**, et parfois une petite bibliothèque de livrables types.

## 2.2 Organigramme type

```
                    ┌──────────────┐
                    │  Direction   │
                    │ (Associés)   │
                    └──────┬───────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │ Commercial │  │  Delivery  │  │  Finance   │
    │  / BD      │  │ Production │  │  / Admin   │
    └─────┬──────┘  └─────┬──────┘  └────────────┘
          │               │
          │        ┌──────┴──────┐
          │        ▼             ▼
          │  ┌──────────┐  ┌──────────┐
          │  │Chef de   │  │ Pool     │
          │  │mission   │  │consultants│
          │  └────┬─────┘  └────┬─────┘
          │       │             │
          └───────┴─────────────┘
                    │
                    ▼
             ┌────────────┐
             │ Consultant │
             │ / Auditeur │
             └────────────┘
```

## 2.3 Départements et missions

| Département | Mission principale |
|-------------|-------------------|
| **Direction / Associés** | Stratégie, signature des gros contrats, arbitrage rentabilité |
| **Commercial / Business Development** | Prospects, opportunités, propositions, relances |
| **Delivery / Production** | Exécution des missions, qualité des livrables, respect des délais |
| **Finance / Admin** | Contrats, facturation, encaissements, notes de frais |
| **RH (léger)** | Affectation des consultants, charge, compétences |

## 2.4 Rôles et responsabilités

| Rôle | Responsabilités clés | Ce qu’il ne fait pas |
|------|----------------------|----------------------|
| **Associé / Direction** | Valide gros devis, clôture stratégique, voit toutes les marges | Saisir le détail des temps au quotidien |
| **Commercial** | Qualifie le prospect, porte l’opportunité, rédige la proposition | Valider les feuilles de temps des missions livrées |
| **Chef de mission** | Cadre le scope, planifie, valide les temps, livre, alerte les dépassements | Modifier seul les conditions de facturation du contrat |
| **Consultant / Auditeur** | Exécute, saisit son temps, dépose des livrables | Facturer le client, modifier le budget mission |
| **Finance** | Émet les factures, suit les règlements, relance | Modifier le contenu métier d’un livrable |
| **Admin système** | Users, droits, paramétrage | Décider du type de facturation d’un contrat |

## 2.5 Ressources

- **Humaines :** consultants senior / junior, managers, freelances ponctuels  
- **Immatérielles :** méthodes, templates de livrables, bases de connaissance  
- **Matérielles :** postes, licences logiciels, salles de réunion  
- **Financières :** trésorerie, lignes de crédit, provisions sur missions à risque  

## 2.6 Clients, fournisseurs, partenaires

| Catégorie | Exemples |
|-----------|----------|
| **Clients** | PME, ETI, grands comptes, administrations, ONG |
| **Fournisseurs / sous-traitants** | Freelances, cabinets partenaires, traducteurs, data rooms |
| **Partenaires** | Éditeur logiciel, assureur RC pro, experts sectoriels |

## 2.7 Produits / services vendus

| Nature | Description |
|--------|-------------|
| **Mission forfait** | Prix global, jalons de livraison / paiement |
| **Mission régie** | Facturation au temps passé (TJM / taux horaire) |
| **Mixte** | Forfait sur une partie, régie sur une autre |
| **Audit** | Souvent forfait + calendrier d’interventions + rapport final |
| **Formation / atelier** | Session datée, parfois forfait journée |
| **Retainer / abonnement conseil** | Forfait mensuel de disponibilité |

---

# 3. Niveau B — Objets métier

## 3.1 Chaîne principale

```
Prospect
   │
   ▼
Opportunité
   │
   ▼
Proposition / Devis
   │
   ▼
Contrat ──────────────┐
   │                  │ type de facturation
   ▼                  │ (forfait | régie | mixte)
Mission / Projet      │
   │                  │
   ├── Équipe         │
   ├── Jalons ────────┤
   ├── Feuilles de temps
   ├── Livrables
   │                  │
   ▼                  ▼
Situation / Facture ◄─┘
   │
   ▼
Encaissement
   │
   ▼
Clôture mission
```

## 3.2 Dictionnaire des objets

| Objet | Définition métier | Attributs essentiels |
|-------|-------------------|----------------------|
| **Prospect** | Organisation contactée, pas encore cliente | Nom, secteur, contact, source |
| **Opportunité** | Affaire potentielle chiffrée | Montant estimé, proba, échéance, commercial |
| **Proposition / Devis** | Offre formelle | Lignes, total, validité, conditions |
| **Contrat** | Accord signé | Type facturation, TJM, budget j/h, échéancier |
| **Mission** | Conteneur d’exécution | Client, chef, dates, budget, statut |
| **Membre mission** | Affectation d’une personne | Rôle, TJM interne, dates d’affectation |
| **Jalon** | Point d’avancement / facturation | %, date cible, facturable oui/non |
| **Feuille de temps** | Temps déclaré sur une mission | Date, heures, activité, statut validation |
| **Livrable** | Production attendue | Type, version, statut validation client |
| **Facture** | Demande de paiement | Type (acompte, situation, solde, régie), montant |
| **Paiement** | Encaissement réel | Montant, mode, date, facture liée |
| **Note de frais** | Dépense refacturable ou non | Mission, montant, justificatif |

## 3.3 Carte des relations

```
┌──────────┐     1:N     ┌──────────────┐
│  Client  │────────────▶│ Opportunité  │
└────┬─────┘             └──────┬───────┘
     │                          │ 1:1 / 1:N
     │                          ▼
     │                   ┌──────────────┐
     │                   │ Proposition  │
     │                   └──────┬───────┘
     │                          │ 0..1
     │                          ▼
     │     1:N           ┌──────────────┐
     └──────────────────▶│   Contrat    │
                         └──────┬───────┘
                                │ 1:N
                                ▼
                         ┌──────────────┐
                         │   Mission    │
                         └──┬───┬───┬───┘
                   ┌────────┘   │   └────────┐
                   ▼            ▼            ▼
            ┌──────────┐ ┌──────────┐ ┌──────────┐
            │  Équipe  │ │  Jalons  │ │  Temps   │
            └──────────┘ └────┬─────┘ └────┬─────┘
                              │            │
                              ▼            ▼
                         ┌─────────────────────┐
                         │      Facture        │
                         └──────────┬──────────┘
                                    ▼
                             ┌──────────┐
                             │ Paiement │
                             └──────────┘
```

---

# 4. Niveau C — Processus métier (BPM détaillé)

## 4.1 Vue d’ensemble du cycle de vie

```
┌─────────┐   ┌────────────┐   ┌────────────┐   ┌─────────┐
│ ACQUÉRIR│──▶│ CONTRACTUAL│──▶│  EXÉCUTER  │──▶│FACTURER │
│         │   │   ISER     │   │            │   │& ENCAIS.│
└─────────┘   └────────────┘   └────────────┘   └─────────┘
 Prospect       Devis/Contrat    Temps/Livrables   Facture
 Opportunité    Mission ouverte  Jalons            Paiement
```

---

## 4.2 Processus P1 — Acquisition (Prospect → Opportunité → Proposition)

```
[Lead entrant]
      │
      ▼
 Qualification
 (budget ? besoin ? décideur ? timing ?)
      │
      ├─ Non qualifié ──▶ Archivage / nurturing
      │
      ▼
 Création Opportunité
 (montant estimé, proba, commercial owner)
      │
      ▼
 Construction Proposition
 (scope, délais, prix, type forfait/régie)
      │
      ▼
 Validation interne (associé si > seuil)
      │
      ▼
 Envoi client
      │
      ├─ Refus / sans suite ──▶ Opportunité perdue (motif)
      ├─ Négociation ──▶ Nouvelle version proposition
      │
      ▼
 Acceptation ──▶ Passage au contractualisation
```

**Qui déclenche :** Commercial (ou associé).  
**Qui valide la proposition :** Commercial + Associé au-delà d’un montant.  
**Données nécessaires :** client/prospect, besoin, estimation charge, TJM, marge cible.  
**Exceptions :** appel d’offres formel (réponse structurée, deadline), multi-propositions concurrentes.  
**Historisé :** versions de proposition, motifs de perte.

---

## 4.3 Processus P2 — Contractualisation

```
[Proposition acceptée]
      │
      ▼
 Rédaction / finalisation Contrat
  - Type de facturation : FORFAIT | RÉGIE | MIXTE
  - Budget j/h ou montant forfait
  - TJM par grade (si régie)
  - Échéancier / jalons facturables
  - Conditions de paiement
      │
      ▼
 Signature (électronique ou manuelle)
      │
      ▼
 Ouverture Mission
  - Chef de mission
  - Équipe prévisionnelle
  - Jalons reportés depuis le contrat
  - Budget initial figé (baseline)
      │
      ▼
 Kick-off (interne ± client)
```

**Règle critique :** le **type de facturation** est une propriété du contrat (ou de lignes de contrat), pas un choix libre au moment de facturer.

---

## 4.4 Processus P3 — Exécution de la mission

```
[Mission ouverte]
      │
      ▼
 Planification
  - Affectation consultants
  - Charge prévisionnelle par semaine
  - Jalons datés
      │
      ▼
 ┌─────────────────────────────────┐
 │ Boucle d’exécution hebdomadaire │
 │                                 │
 │  Saisie temps (consultant)      │
 │       │                         │
 │       ▼                         │
 │  Validation chef de mission     │
 │       │                         │
 │       ▼                         │
 │  Avancement jalons / livrables  │
 │       │                         │
 │       ▼                         │
 │  Contrôle budget (temps vs j/h) │
 │       │                         │
 │       ├─ OK ────────────────────┤
 │       └─ Alerte si > 80 % ──────┤
 └─────────────────────────────────┘
      │
      ▼
 Livraison jalons / livrables
      │
      ▼
 Validation client (si requise)
```

### Détail de la feuille de temps

| Étape | Acteur | Statut |
|-------|--------|--------|
| Saisie | Consultant | `draft` |
| Soumission | Consultant | `submitted` |
| Validation | Chef de mission | `approved` |
| Rejet | Chef de mission | `rejected` → retour saisie |
| Gel facturation | Finance | `locked` (si déjà facturé en régie) |

Un temps `approved` peut entrer dans une facture régie.  
Un temps `locked` n’est plus modifiable.

---

## 4.5 Processus P4 — Facturation

La facturation **dépend du type de contrat**.

### 4.5.1 Facturation FORFAIT

```
Jalon facturable atteint
   OU
Échéance calendaire contractuelle
      │
      ▼
 Proposition de facture (montant jalon / échéance)
      │
      ▼
 Validation chef de mission + finance
      │
      ▼
 Émission facture
      │
      ▼
 Envoi client
```

Les feuilles de temps servent au **pilotage interne**, pas au calcul du montant (sauf clause particulière).

### 4.5.2 Facturation RÉGIE

```
Période de facturation (ex. mois M)
      │
      ▼
 Sélection des temps `approved` non encore facturés
      │
      ▼
 Calcul : heures × TJM (selon grade / contrat)
      │
      ▼
 Ajout frais refacturables validés
      │
      ▼
 Validation chef de mission + finance
      │
      ▼
 Émission facture · verrouillage des temps inclus
```

### 4.5.3 Facturation MIXTE

- Lignes / lots forfait → logique jalons  
- Lignes régie → logique temps  
- Une même facture peut combiner les deux, mais chaque ligne connaît son origine.

### 4.5.4 Encaissement

```
Facture émise
      │
      ▼
 Échéance de paiement
      │
      ├─ Payée ──▶ Imputation · statut facture = settled
      ├─ Partielle ──▶ Reste dû
      └─ Retard ──▶ Relance (J+7, J+15…)
```

---

## 4.6 Processus P5 — Clôture de mission

```
Travaux terminés + livrables validés
      │
      ▼
 Factures solde émises
      │
      ▼
 Paiements reçus (ou provision / litige identifié)
      │
      ▼
 Revue de rentabilité
  - Temps réel vs budget
  - Marge
  - Leçons apprises
      │
      ▼
 Mission statut = closed
  (lecture seule sur temps et livrables)
```

---

## 4.7 Matrice RACI synthétique

| Activité | Commercial | Chef mission | Consultant | Finance | Associé |
|----------|:----------:|:------------:|:----------:|:-------:|:-------:|
| Qualifier opportunité | R | C | — | — | I |
| Valider proposition > seuil | C | C | — | C | A/R |
| Ouvrir mission | I | R | I | C | A |
| Saisir temps | — | C | R | — | — |
| Valider temps | — | R | C | — | — |
| Valider livrable interne | — | R | C | — | — |
| Émettre facture | — | C | — | R | I |
| Clôturer mission | I | R | I | C | A |

R = Responsible · A = Accountable · C = Consulted · I = Informed

---

# 5. Niveau D — Règles métier

## 5.1 Règles de contractualisation

| ID | Règle |
|----|-------|
| R01 | Toute mission active **doit** être rattachée à un contrat signé (ou avenant). |
| R02 | Le type de facturation est défini au contrat ; la facture ne peut pas inventer un autre mode. |
| R03 | Un avenant peut modifier budget, délais, type de ligne ; il est versionné. |

## 5.2 Règles de temps

| ID | Règle |
|----|-------|
| R10 | Un consultant ne saisit du temps que sur les missions où il est **affecté**. |
| R11 | Une feuille de temps facturable en régie doit être `approved`. |
| R12 | Les temps inclus dans une facture passent à `locked` et ne sont plus éditables. |
| R13 | Saisie rétroactive au-delà de N jours (paramétrable, ex. 15) : réservée au chef de mission / admin. |

## 5.3 Règles de facturation

| ID | Règle |
|----|-------|
| R20 | **Régie :** montant = Σ (temps approved non facturés × TJM applicable). |
| R21 | **Forfait :** montant issu du jalon / échéancier, **pas** de la somme des temps. |
| R22 | Impossible d’émettre une facture sur mission `draft` ou `closed` sans avenant de réouverture. |
| R23 | Acompte : plafonné au % ou montant prévu au contrat. |
| R24 | Avoir : lié à une facture d’origine ; ne crée pas de temps négatif. |

## 5.4 Règles de pilotage

| ID | Règle |
|----|-------|
| R30 | Si temps consommé ≥ 80 % du budget j/h → alerte chef de mission + associé (si paramétré). |
| R31 | Si date de fin contractuelle – aujourd’hui ≤ 14 jours et avancement < 90 % → alerte délai. |
| R32 | Marge prévisionnelle = facturable restant – coût interne restant estimé (taux internes). |

## 5.5 Règles de droits

| ID | Règle |
|----|-------|
| R40 | Le consultant ne voit que ses temps et missions. |
| R41 | Le commercial voit opportunités et propositions ; pas les taux internes confidentiels sauf droit explicite. |
| R42 | Finance émet les factures ; ne modifie pas les livrables métier. |

---

# 6. Niveau — Événements métier

Ne pas stocker seulement des **états**. Historiser les **événements** qui les produisent.

## 6.1 Cycle Prospect / Opportunité

```
prospect.created
opportunity.created
opportunity.qualified
opportunity.proposal_sent
opportunity.proposal_revised
opportunity.won
opportunity.lost
```

## 6.2 Cycle Contrat / Mission

```
contract.drafted
contract.signed
contract.amendment_signed
mission.opened
mission.team_assigned
mission.milestone_reached
mission.deliverable_submitted
mission.deliverable_accepted
mission.deliverable_rejected
mission.budget_alert_80
mission.closed
```

## 6.3 Cycle Temps

```
time.drafted
time.submitted
time.approved
time.rejected
time.locked_in_invoice
```

## 6.4 Cycle Facture / Paiement

```
invoice.proposed
invoice.issued
invoice.sent
invoice.partially_paid
invoice.paid
invoice.overdue
invoice.cancelled_or_credited
payment.received
payment.allocated
```

## 6.5 Intérêt de l’approche événementielle

À partir du journal d’événements on reconstruit :

| Besoin | Source |
|--------|--------|
| Charge réelle d’un consultant | `time.approved` |
| Avancement mission | jalons + livrables |
| CA facturé vs encaissé | `invoice.issued` vs `payment.received` |
| Audit « qui a validé quoi » | acteur + timestamp sur chaque événement |
| Anomalies | temps rejetés répétés, factures en retard, missions sans temps |

---

# 7. Niveau E — Optimisation

| Situation sans ERP mature | Avec ERP conseil |
|---------------------------|------------------|
| Temps dans Excel par personne | Saisie unique, validation, consolidation mission |
| Dépassement découvert à la facture | Alerte 80 % budget en cours de mission |
| « On ne sait pas si on gagne de l’argent sur ce client » | Marge par mission, par client, par associé |
| Relances de paiement irrégulières | Échéancier + workflow de relance |
| Staffing au feeling | Vue charge vs capacité par consultant |
| Devis déconnectés de la réalité du delivery | Opportunité → contrat → mission liés |

### Exemple d’aide à la décision — staffing

```
Demande de mission (charge estimée 40 j/h, profil senior)
      │
      ▼
 Capacité disponible 6 semaines (congés, autres missions)
      │
      ▼
 Liste consultants éligibles (compétence + charge < seuil)
      │
      ▼
 Proposition d’équipe au chef de mission
```

### Exemple — rentabilité

```
Budget j/h contrat
  – Temps approved (coût interne)
  – Frais non refacturés
  + Facturé
  + Reste à facturer (jalons ou régie estimée)
  ────────────────
  Marge à terminaison estimée
```

---

# 8. Niveau F — Automatisations

Les automatisations **proposent** ; les validations humaines restent sur les actes engageants (facture, avenant, clôture).

## 8.1 Alerte budget

```
Chaque nuit / à chaque validation de temps
      │
      ▼
 Temps approved / budget j/h ≥ 0,80
      │
      ▼
 Notification chef de mission (+ associé si ≥ 0,90)
      │
      ▼
 Tâche : « Revue budget mission X »
```

## 8.2 Proposition de facture régie

```
1er jour ouvré du mois
      │
      ▼
 Pour chaque mission régie active
      │
      ▼
 Agrégation temps approved non facturés du mois M-1
      │
      ▼
 Brouillon de facture
      │
      ▼
 File d’attente validation finance / chef de mission
```

## 8.3 Relance paiement

```
Facture.due_date + 7 jours et statut ≠ paid
      │
      ▼
 Relance 1 (email modèle)
      │
      ▼
 + 15 jours → Relance 2 + notification associé
```

## 8.4 Fin de mission proche

```
mission.end_date – 14 jours
  ET avancement jalons < 90 %
      │
      ▼
 Alerte délai + proposition de point client
```

---

# 9. Modèle de données dérivé

Construit **après** processus, objets, règles et événements — pas avant.

## 9.1 Entités principales

| Table | Rôle |
|-------|------|
| `parties` | Prospects et clients (type, contacts) |
| `opportunities` | Pipeline commercial |
| `proposals` + `proposal_lines` | Devis versionnés |
| `contracts` + `contract_lines` | Type billing, TJM, budget |
| `missions` | Exécution |
| `mission_members` | Affectations |
| `milestones` | Jalons (facturables ou non) |
| `time_entries` | Temps + workflow de validation |
| `deliverables` | Livrables + versions |
| `invoices` + `invoice_lines` | Facturation |
| `payments` + `payment_allocations` | Encaissements |
| `expenses` | Notes de frais |
| `domain_events` | Journal d’événements métier |

## 9.2 Schéma relationnel simplifié

```
parties 1───N opportunities 1───N proposals
                │
                └── N contracts 1───N missions
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              ▼                       ▼                       ▼
      mission_members           milestones              time_entries
                                      │                       │
                                      └───────────┬───────────┘
                                                  ▼
                                            invoice_lines
                                                  │
                                                  ▼
                                              invoices 1───N payments
```

## 9.3 Champs critiques (exemples)

**contracts**
- `billing_type` : `fixed` | `time_and_materials` | `mixed`  
- `budget_days` numeric  
- `default_daily_rate` numeric  

**time_entries**
- `mission_id`, `user_id`, `work_date`, `hours`  
- `status` : `draft` | `submitted` | `approved` | `rejected` | `locked`  
- `invoice_line_id` nullable  

**milestones**
- `is_billable` boolean  
- `amount` numeric nullable  
- `target_date`, `reached_at`  

**invoices**
- `kind` : `deposit` | `progress` | `final` | `tm` | `credit`  
- `status` : `draft` | `issued` | `partially_paid` | `paid` | `cancelled`  

## 9.4 Journal d’événements (pattern)

```text
domain_events
  id
  aggregate_type   -- mission | invoice | time_entry | ...
  aggregate_id
  event_type       -- mission.budget_alert_80
  payload jsonb
  actor_id
  occurred_at
```

Le stock de « vérité » opérationnelle (temps facturables, reste à facturer) peut être une **projection** à jour, reconstruisible depuis les événements.

---

# 10. Indicateurs de pilotage (KPI)

| KPI | Formule simplifiée | Usage |
|-----|-------------------|--------|
| **Taux de charge** | Heures facturables / heures disponibles | Staffing |
| **TJM moyen facturé** | CA régie / jours régie | Pricing |
| **Marge mission** | Facturé (+ reste) – coût interne temps – frais | Rentabilité |
| **Time to cash** | Date encaissement – date facture | Trésorerie |
| **Win rate** | Opportunités gagnées / perdues+gagnées | Commercial |
| **Dépassement budget** | Temps réel / budget j/h | Delivery |
| **Backlog facturable** | Temps approved non facturés + jalons dus | CA à venir |

---

# 11. Parcours utilisateurs prioritaires (Appflow métier)

## 11.1 Consultant — semaine type

1. Voir mes missions  
2. Saisir mes temps (par jour / mission / activité)  
3. Soumettre pour validation  
4. Déposer un livrable si demandé  
5. Corriger si rejet  

## 11.2 Chef de mission — pilotage

1. Tableau de bord mission (budget, temps, jalons)  
2. Valider / rejeter les temps de l’équipe  
3. Marquer un jalon atteint  
4. Préparer avec finance la facture de période  
5. Traiter les alertes 80 %  

## 11.3 Finance — facturation

1. File des brouillons auto (régie mensuelle / jalons dus)  
2. Contrôler, ajuster libellés, émettre  
3. Enregistrer paiements  
4. Relances  

## 11.4 Commercial — pipeline

1. Créer opportunité  
2. Versionner proposition  
3. Passer en gagné → déclencher contractualisation  

---

# 12. Ce que ce domaine n’est pas

| Hors sujet conseil | Raison |
|--------------------|--------|
| Gestion de stock magasin | Pas le cœur ; éventuellement frais matériels mineurs |
| Caisse POS | La vente est contractuelle, pas ticket unitaire |
| Paie complète | Les temps servent à la facturation et au pilotage, pas au bulletin de salaire (lien possible plus tard) |
| Fabrication / OF | Pas d’atelier |

Si le cabinet a aussi une boutique de formations avec places limitées, on compose avec un module « événement / session » — ce n’est plus le cœur Audit/Conseil pur.

---

# 13. Lien avec le catalogue modules Smart Collab

| Besoin métier | Module catalogue |
|---------------|------------------|
| Pipeline | CRM & Clients (+ opportunité) |
| Contrats / missions | Projet |
| Temps | Feuilles de temps |
| Facturation | Facturation / Finance |
| Pilotage | Rapports & BI · Dashboard |
| Fichiers livrables | File Manager (transversal, cochable) |
| Validation | Workflow & Approvals |
| Planning charge | Planification |

Core toujours là : Dashboard, Apps, Paramètres.

---

# 14. Critères de réussite d’un MVP « Conseil »

1. Une mission forfait : jalon atteint → facture du bon montant.  
2. Une mission régie : temps validés du mois → facture = Σ heures × TJM.  
3. Impossible de facturer en régie des temps non approuvés.  
4. Alerte visible à 80 % du budget temps.  
5. Un consultant ne voit pas les missions des autres.  
6. Journal : qui a approuvé tel temps, qui a émis telle facture.

---

# 15. Synthèse visuelle — de la réalité au système

```
RÉALITÉ CABINET
  Prospects, missions, temps, livrables, factures
        │
        ▼
OBJETS MÉTIER + ÉVÉNEMENTS
        │
        ▼
RÈGLES (contrat pilote la facture, validation du temps, etc.)
        │
        ▼
PROCESSUS IMPLÉMENTÉS (BPM → écrans + API)
        │
        ▼
DONNÉES PERSISTÉES (tables + journal)
        │
        ▼
OPTIMISATION & AUTOMATISATION
  (alertes, brouillons de facture, relances, staffing)
        │
        ▼
PILOTAGE
  Charge · Marge · Time-to-cash · Win rate
```

---

*Document domaine Audit / Conseil / Projet — Smart Collab*  
*Complément du BPM Retail : même exigence de profondeur, autre logique métier (temps, contrats, missions).*
