# UI Preview — RUTHY’S Plus ERP
## Maquettes visuelles · MVP Retail

**Statut :** v1 — écrans prioritaires  
**Base :** PRD + Appflow + TRD Retail MVP  
**Style :** sidebar sombre, accent or, fond clair, labels en français, montants en XOF  

> Ces maquettes sont **originales** (RUTHY’S). Elles illustrent l’intention d’interface, pas une copie d’un template tiers.

---

## 1. Connexion

| Élément | Contenu |
|---------|---------|
| Objectif | Authentifier Admin / Gérant / Caissier / Magasinier |
| Champs | Email, mot de passe |
| Action | Se connecter → Dashboard ou Wizard (1re fois) |
| Notes UI | Logo RUTHY’S, fond sobre, bouton or/primary |

---

## 2. Wizard — première configuration

| Étape | Contenu |
|-------|---------|
| Entreprise | Nom, site, devise XOF (figée) |
| Modules | Cases Retail pré-cochées (POS, Ventes, Clients, Produits, Achats, Finance, Rapports) |
| Équipe | Création d’un caissier |
| Récap | Liste modules actifs → « Ouvrir la boutique » |

---

## 3. Shell (menu + topbar)

| Zone | Contenu |
|------|---------|
| Sidebar | Logo, modules activés uniquement, utilisateur en bas |
| Topbar | Titre page, site courant, période, notifications |
| Contenu | Zone centrale selon le module |

**Menu MVP typique :** Dashboard · Caisse · Ventes · Clients · Produits · Achats · Finance · Rapports · Apps · Paramètres

---

## 4. Dashboard

| KPI | Description |
|-----|-------------|
| CA du jour | Somme tickets payés aujourd’hui |
| CA du mois | Cumul mois en cours |
| Tickets | Nombre de ventes du jour |
| Panier moyen | CA jour / tickets |
| Alertes stock | Liste produits sous le seuil (cliquable) |

---

## 5. Caisse (Point de vente)

| Zone | Contenu |
|------|---------|
| Gauche | Recherche produit (code / nom), suggestions |
| Centre | Lignes panier (qté, prix, total ligne) |
| Droite / bas | Client (optionnel), mode de paiement, total, Encaisser |
| Session | Ouverture / clôture de caisse en en-tête |

**États :** session fermée → bouton Ouvrir · session ouverte → panier actif · après encaissement → ticket récap

---

## 6. Produits & stock

| Vue | Contenu |
|-----|---------|
| Liste | Code, nom, famille, stock, seuil, prix vente, badge alerte |
| Fiche | Code, désignation, famille, fournisseur, PA, PV, seuil, stock site |

---

## 7. Clients

| Vue | Contenu |
|-----|---------|
| Liste | Nom, téléphone, ville, segment, CA cumulé |
| Fiche | Coordonnées + historique d’achats (tickets) |

---

## 8. Suite prévue (même document, v2)

- Ventes (liste tickets)
- Achats (commande + réception BL)
- Finance (mouvements)
- Apps (activation modules)
- Paramètres (utilisateurs)

---

## Légende design

| Token | Usage |
|-------|--------|
| Navy / sidebar sombre | Navigation |
| Or / accent | Boutons primaires, sélection |
| Fond #F5F6F8 | Zone contenu |
| Badges vert / rouge / ambre | OK · alerte · urgent |
| Tableaux denses | Listes métier |

---

*Document de référence visuelle — RUTHY’S Plus · MVP Retail*  
*À compléter au fur et à mesure des maquettes générées*
