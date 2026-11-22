# PRD — RUTHY’S Plus ERP  
## Domaine : Commerce de détail / Retail / Boutique  
**Version :** 1.0 (court)  
**Statut :** Cadrage MVP  
**Date :** novembre 2026

---

## 1. Vision produit

RUTHY’S Plus est un **ERP retail modulaire** pour boutiques et réseaux de points de vente (Afrique de l’Ouest, FCFA).

L’utilisateur active uniquement les modules dont il a besoin (modèle type Odoo).  
La v1 cible le **commerce de détail** : vendre en caisse, gérer le stock, suivre les clients et encaisser — sans lourdeur d’un ERP complet.

**Promesse MVP :**  
> En moins d’une journée de prise en main, un gérant de boutique peut ouvrir la caisse, vendre, voir son stock et son CA du jour.

---

## 2. Problème à résoudre

| Aujourd’hui | Conséquence |
|-------------|-------------|
| Excel / cahier pour les ventes | Erreurs, pas de suivi temps réel |
| Stock « à l’œil » | Ruptures ou surstock |
| Pas de lien vente → client | Pas de fidélisation ni de relance |
| Outils séparés (caisse, stock, compta) | Double saisie, pertes d’info |
| ERP lourds (Odoo, SAP…) | Trop chers / trop complexes pour une PME retail |

---

## 3. Utilisateurs cibles (MVP)

| Persona | Besoin principal |
|---------|------------------|
| **Gérant / Propriétaire** | Voir CA, marge, alertes stock, piloter 1 ou 2 boutiques |
| **Caissier** | Encaisser vite, rattacher un client, imprimer / afficher le ticket |
| **Magasinier** (si présent) | Réceptionner, ajuster stock, préparer inventaire |
| **Admin** | Créer les users, activer les modules, paramétrer l’entreprise |

Hors MVP : multi-sociétés complexes, e-commerce, marketplace, paie complète.

---

## 4. Objectifs MVP

| # | Objectif | Mesure de succès |
|---|----------|------------------|
| O1 | Vendre en caisse de bout en bout | Ticket créé, stock décrémenté, CA à jour |
| O2 | Connaître le stock réel | Stock par produit / site visible et cohérent |
| O3 | Suivre les clients | Fiche client + historique d’achats |
| O4 | Approvisionner simplement | Commande fournisseur + réception BL |
| O5 | Piloter le quotidien | Dashboard : CA jour/mois, tickets, alertes stock |
| O6 | Modularité réelle | Menu = uniquement modules activés à la config |

---

## 5. Périmètre fonctionnel MVP

### 5.1 Modules inclus (pré-cochés domaine Retail)

| Module | Inclus MVP | Périmètre strict |
|--------|:----------:|------------------|
| **Dashboard** | Oui | KPIs : CA jour, CA mois, nb tickets, panier moyen, alertes stock |
| **Apps** | Oui | Activer / désactiver modules (hors Core) |
| **Paramètres** | Oui | Entreprise, users, rôles de base, sites |
| **Point de Vente** | Oui | Panier, modes de paiement, session caisse, ticket |
| **Ventes** | Oui | Historique tickets, filtres période / site |
| **CRM & Clients** | Oui | Fiche client, segment simple, historique |
| **Produits & Inventaire** | Oui | Catalogue, stock par site, alertes seuil |
| **Achats** | Oui | Commande fournisseur, réception BL, écart simple |
| **Finance** | Oui (léger) | Encaissements caisse, décaissements manuels simples |
| **Rapports & BI** | Oui (léger) | 3–5 états : CA, stock, top produits, clients |

### 5.2 Modules exclus du MVP (prévus plus tard)

- Transferts inter-sites avancés  
- Marketing / campagnes  
- RH & Paie  
- Fabrication, Qualité, Maintenance, Réparation  
- Comptabilité complète (grand livre, bilan)  
- Apps transversales (Chat, Video, etc.) — optionnelles, hors MVP  
- Centre de contrôle complet  
- Studio no-code avancé  

---

## 6. User stories prioritaires (MVP)

### Caisse
1. En tant que **caissier**, je peux ajouter des produits au panier (recherche / code) pour enregistrer une vente rapidement.  
2. En tant que **caissier**, je peux choisir le mode de paiement (espèces, mobile money, autre) et valider l’encaissement.  
3. En tant que **caissier**, je peux rattacher un client existant (ou le créer) à la vente.  
4. En tant que **gérant**, je peux ouvrir / clôturer une session de caisse.

### Stock & produits
5. En tant que **gérant**, je peux créer / modifier un produit (code, nom, famille, PA, PV, seuil).  
6. En tant que **magasinier**, je vois le stock par produit et par site.  
7. En tant que **gérant**, je suis alerté quand un stock passe sous le seuil.

### Clients
8. En tant que **gérant**, je consulte la fiche client (CA, nb visites, dernier achat).  
9. En tant que **caissier**, je retrouve un client par nom ou téléphone.

### Achats
10. En tant que **gérant**, je crée une commande fournisseur.  
11. En tant que **magasinier**, je réceptionne un BL et mets à jour le stock (avec écart éventuel).

### Pilotage
12. En tant que **gérant**, je vois sur le dashboard le CA du jour, du mois et les alertes stock.  
13. En tant que **admin**, je choisis les modules actifs à la première connexion (ou dans Apps).

---

## 7. Parcours critiques (Appflow résumé)

### Parcours A — Vente comptoir
```
Ouvrir session caisse
  → Rechercher / scanner produit
  → Ajuster qté
  → (Option) Rattacher client
  → Choisir mode de paiement
  → Encaisser
  → Ticket + stock ↓ + CA ↑ + fiche client MAJ
```

### Parcours B — Réception marchandise
```
Créer / ouvrir commande fournisseur
  → Réceptionner BL
  → Saisir qté reçue
  → Écart ? → signaler
  → Valider → stock ↑
```

### Parcours C — Première configuration
```
Créer compte Admin
  → Saisir entreprise (nom, devise, site)
  → Choisir domaine « Retail »
  → Modules pré-cochés (modifiables)
  → Créer 1er caissier
  → Entrer dans l’app (menu = modules actifs)
```

---

## 8. Exigences non fonctionnelles (minimales)

| Thème | Exigence MVP |
|-------|----------------|
| **Performance** | Caisse : ajout ligne < 300 ms perçus ; dashboard < 2 s |
| **Disponibilité** | Usage boutique : journée continue, pas de perte de panier en cours |
| **Sécurité** | Auth obligatoire ; rôles Admin / Gérant / Caissier / Magasinier |
| **Données** | Devise par défaut XOF (FCFA) ; dates locales |
| **Langue** | Français (UI) |
| **Déploiement** | Web (navigateur) ; usage desktop prioritaire en caisse |
| **Modularité** | Modules non activés absents du menu et des droits |

---

## 9. Hors périmètre (explicite)

- Application mobile native  
- E-commerce / click & collect  
- Comptabilité légale complète  
- Multi-pays / multi-devises avancé  
- IA / recommandations produits  
- Intégration bancaire temps réel  
- Mode 100 % offline (hors proto ultérieur)

---

## 10. Critères de succès MVP

Le MVP est **validé** si :

1. Un gérant configure l’entreprise et active les modules Retail en < 15 min.  
2. Un caissier réalise 10 ventes test sans formation longue.  
3. Le stock d’un produit évolue correctement après vente et après réception BL.  
4. Le dashboard affiche un CA cohérent avec les tickets du jour.  
5. Un module désactivé dans Apps n’apparaît plus dans le menu.

---

## 11. Hypothèses & risques

| Hypothèse | Risque si faux |
|-----------|----------------|
| 1 site suffit pour le MVP (multi-sites en v1.1) | Sous-estimer les besoins réseau |
| Modes de paiement simples (espèces + mobile money) | Besoin chèque / virement dès le jour 1 |
| Catalogue < 5 000 SKU au démarrage | Perf / UX catalogue à revoir |
| Utilisateurs à l’aise navigateur desktop | Besoin tablette caisse plus tôt |

---

## 12. Livrables liés à ce PRD

| Document | Statut par rapport au PRD |
|----------|---------------------------|
| Catalogue modules unifié | Déjà figé (Partie 4 doc) |
| BPM + modèle de données Retail | Déjà figé (Partie 3) |
| Backend schema SQL | À produire ensuite |
| Appflow détaillé (écrans) | À produire pour les 3 parcours critiques |
| Implementation plan (sprints) | À produire après validation de ce PRD |
| UI/UX | Après Appflow MVP |

---

## 13. Décision demandée

**Valider ce PRD Retail MVP** pour :
1. Figer le périmètre des 2–3 prochaines semaines  
2. Enchaîner sur le **schéma SQL** + **plan d’implémentation**  
3. Ne plus élargir le scope tant que les critères § 10 ne sont pas atteints  

---

*PRD court — RUTHY’S Plus · Domaine Retail*  
*Référence : catalogue unifié RUTHY’S × DreamsERP · BPM v105*
