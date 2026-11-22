# TRD — RUTHY'S Plus ERP
## Exigences techniques · MVP Retail

**Statut :** cadrage v1  
**S'appuie sur :** PRD Retail MVP · schéma SQL MVP · plan 4 sprints

---

## 1. Décision technique

| Couche | Choix MVP | Pourquoi |
|--------|-----------|----------|
| Client | React 19 + TypeScript | UI caisse et listes, typage des montants |
| Routing / data | TanStack (routes + requêtes) | Déjà le socle du projet web |
| Style | Tailwind, tokens navy / or du prototype v105 | Continuité visuelle, pas un nouveau design system |
| API | Fonctions serveur du même dépôt | Pas de second service à déployer |
| Base | PostgreSQL | Schéma déjà écrit, transactions vente / BL |
| Auth | Comptes email + 4 rôles | Admin, gérant, caissier, magasinier |
| Hébergement | Web (Vercel + Postgres managé) | Pas d'install locale en boutique pour le MVP |

Hors MVP : application native, mode hors-ligne, file d'impression thermique, sync multi-caisse temps réel.

---

## 2. Contraintes non fonctionnelles

| Sujet | Seuil MVP |
|-------|-----------|
| Ajout d'une ligne au panier | Réponse perçue < 300 ms (données déjà en mémoire côté client après recherche) |
| Validation d'un ticket | < 1,5 s de bout en bout, y compris l'écriture stock |
| Dashboard du jour | < 2 s |
| Catalogue | Conçu pour 5 000 références actives ; recherche par code exact et par début de nom |
| Disponibilité | Usage journée boutique ; pas de SLA 99,9 % au MVP |
| Navigateurs | Chrome / Edge récents, écran ≥ 1280 px pour la caisse ; le reste utilisable à 390 px |
| Langue / devise / fuseau | `fr` · XOF, 0 décimale à l'affichage · `Africa/Abidjan` |
| Sauvegarde | Backup quotidien de la base (responsabilité hébergeur) |

Montants stockés en `numeric(14,2)`. L'affichage arrondit au franc. Jamais de `float`.

---

## 3. Sécurité

- Toute action métier passe par le serveur. Le client n'écrit jamais le stock ni le total d'un ticket.
- Session authentifiée obligatoire. Pas de mode démo anonyme en production.
- Rôle lu depuis la session, jamais depuis le corps de la requête.
- Mots de passe : hash côté auth (pas de stockage en clair).
- HTTPS uniquement.
- Un caissier ne peut pas : éditer un prix d'achat, réceptionner un BL, gérer les utilisateurs, désactiver un module.
- Un magasinier ne peut pas encaisser.
- Suppression physique interdite sur ticket, produit et client. Statuts `void` / `is_active = false`.
- Journal minimal dès le MVP : qui a ouvert/fermé la caisse, qui a validé un ticket, qui a réceptionné un BL (colonnes `created_by` / `cashier_id` / `received_by`). Le centre de contrôle complet est hors MVP.

---

## 4. Règles métier techniques

### Vente (une transaction)

1. Session de caisse `open` pour le site, sinon refus.
2. Chaque ligne : produit actif, qté > 0, prix = prix de vente courant (figé sur la ligne).
3. Stock du site suffisant, sinon refus de la ligne. Pas de stock négatif.
4. Insert ticket + lignes.
5. Insert `stock_moves` (qté négative, reason `sale`) et `UPDATE stock_levels`.
6. Insert `cash_movements` direction `in`, catégorie `encaissement_vente`.
7. Commit. En cas d'échec : rien n'est écrit.

### Réception BL (une transaction)

1. Commande `confirmed` ou `partial`.
2. `qty_received` ≥ 0. Seule cette quantité entre en stock (l'écart reste visible : commandé vs reçu).
3. `stock_moves` reason `purchase_receipt`, qté positive.
4. Statut commande : `received` si tout est reçu, sinon `partial`.

### Session de caisse

- Au plus une session `open` par site (index unique partiel déjà dans le schéma).
- Fermeture : horodatage + montant compté saisi. Pas de calcul d'écart automatique au MVP (affiché seulement : théorique espèces vs compté, si le mode est espèces).

### Numéros

- Tickets `V-0001`, commandes `BC-0001`, BL `BL-0001`.
- Séquence par préfixe, sans trou obligatoire. Unicité garantie par contrainte `UNIQUE`.

---

## 5. API (formes, pas le code)

Toutes exigent un utilisateur connecté.

| Action | Entrée | Effet |
|--------|--------|-------|
| `listProducts` | `q`, famille | Produits actifs + stock du site courant |
| `upsertProduct` | fiche | Réservé gérant / admin |
| `openSession` / `closeSession` | site, fond de caisse / comptage | Caissier, gérant, admin |
| `checkout` | lignes, client?, mode de paiement | Transaction §4 |
| `listTickets` | jour, site | Lecture |
| `upsertCustomer` | nom, tél, ville | Caissier inclus |
| `createPurchaseOrder` | fournisseur, lignes | Gérant / magasinier / admin |
| `receivePurchase` | commande, qtés reçues | Transaction §4 |
| `dashboardToday` | site | CA, tickets, panier, alertes |
| `setModules` | ids cochés | Admin seulement. Les modules `core` restent forcés |

Erreurs renvoyées en français, code stable : `NO_OPEN_SESSION`, `INSUFFICIENT_STOCK`, `FORBIDDEN`, `NOT_FOUND`.

---

## 6. Données de démo

Seed minimal pour la recette de démo, pas pour la production :

- 1 site « Boutique Principale »
- 4 utilisateurs, un par rôle
- 3 familles, 2 fournisseurs, 20 produits dont 3 sous le seuil
- 5 clients
- 0 ticket (les ventes de démo se font dans l'UI)

---

## 7. Hors périmètre technique

- Impression ESC/POS, tiroir-caisse, douchette autre que la saisie clavier du code
- Multi-devise, TVA détaillée, grand livre
- Sync offline / conflict resolution
- Webhooks et API publique tierce
- i18n autre que le français
- Tests de charge au-delà de 2 caisses simultanées sur le même site

---

## 8. Critères techniques de « prêt à montrer »

1. `checkout` est atomique : une panne au milieu ne laisse ni ticket sans mouvement, ni mouvement sans ticket.
2. Deux clics rapides sur Encaisser ne créent pas deux tickets (bouton désactivé + contrainte côté serveur).
3. Un rôle insuffisant reçoit `FORBIDDEN`, y compris si l'écran a été ouvert par l'URL.
4. Les montants affichés sont des francs entiers ; la base garde les centimes.
