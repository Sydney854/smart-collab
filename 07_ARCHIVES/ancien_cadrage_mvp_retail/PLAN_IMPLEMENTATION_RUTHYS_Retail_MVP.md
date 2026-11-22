# Plan d'implémentation — RUTHY'S Plus ERP
## MVP Retail · 4 sprints de 2 semaines

**Références :** [PRD_RUTHYS_Retail_MVP.md](PRD_RUTHYS_Retail_MVP.md) · [SCHEMA_SQL_RUTHYS_Retail_MVP.sql](SCHEMA_SQL_RUTHYS_Retail_MVP.sql)

**Règle de scope :** rien hors PRD §5.1 tant que les 5 critères de succès (§10) ne passent pas.

**Stack retenue pour ce plan**
- Web : React + TypeScript
- API : serveur Node (routes serveur)
- Base : PostgreSQL, schéma du fichier SQL
- Auth : comptes email, 4 rôles (`admin`, `gerant`, `caissier`, `magasinier`)
- Devise / locale : XOF · `fr` · `Africa/Abidjan`

---

## Sprint 0 — Fondations (semaine 1–2)

**But :** on se connecte, on configure, le menu ne montre que les modules allumés.

| Livrable | Fait quand |
|----------|------------|
| Schéma SQL appliqué + seed (1 site, 4 rôles, admin) | Migration passe, données de démo chargées |
| Auth + rôles | Un caissier ne voit pas Paramètres |
| Paramètres : entreprise, users, site | Admin crée un caissier |
| Catalogue de modules + table `enabled_modules` | Case à cocher persiste |
| Wizard 1ère config (domaine Retail pré-coche le MVP) | Menu = modules actifs seulement |
| Shell : sidebar, topbar, page vide par module | Navigation stable |

**Hors sprint :** design system complet DreamsERP, apps transversales.

**Démo fin de sprint :** créer l'entreprise, activer POS + Stock, se connecter en caissier, constater que Paramètres a disparu.

---

## Sprint 1 — Catalogue & stock (semaine 3–4)

**But :** le magasin existe avant la caisse.

| Livrable | Fait quand |
|----------|------------|
| Familles, fournisseurs | CRUD simple |
| Produits (code, nom, PA, PV, seuil) | Recherche par nom et code |
| Stock par site (`stock_levels`) | Quantité visible |
| Mouvement d'ouverture | Stock initial saisi une fois |
| Alerte seuil (`v_stock_alerts`) | Badge sur les produits sous seuil |

**Règle :** pas de modification directe de `stock_levels` hors mouvement.

**Démo :** 20 produits de démo, 3 en alerte, filtre famille.

---

## Sprint 2 — Caisse & clients (semaine 5–6)

**But :** le parcours A du PRD, de bout en bout.

| Livrable | Fait quand |
|----------|------------|
| Session caisse : ouvrir / clôturer (1 ouverte / site) | Refus d'une 2e session |
| Panier : recherche, qté, total | Ajout < sensation d'attente |
| Client : recherche nom/tél, création rapide | Ticket rattaché |
| Paiement : espèces, mobile money, carte, autre | Ticket `paid` |
| Écritures atomiques | `tickets` + `ticket_lines` + `stock_moves` + `stock_levels` + `cash_movements` dans **une** transaction |
| Refus si stock insuffisant | Message clair, pas de stock négatif |
| Historique ventes (filtres jour / site) | Le ticket du jour est listé |
| Fiche client : CA, visites, dernier achat | Recalcul depuis les tickets, pas un total saisi |

**Numérotation :** `V-0001` séquence par site.

**Démo :** 10 ventes test, stock qui baisse, CA du jour = somme des tickets.

---

## Sprint 3 — Achats, dashboard, clôture MVP (semaine 7–8)

**But :** parcours B + critères de succès §10.

| Livrable | Fait quand |
|----------|------------|
| Commande fournisseur (brouillon → confirmée) | Lignes qté + coût |
| Réception BL | `qty_received` peut différer de `qty_ordered` |
| Entrée stock | Seule la qté reçue bouge le stock |
| Finance légère | Encaissement auto à la vente ; décaissement manuel (loyer, divers) |
| Dashboard | CA jour, CA mois, nb tickets, panier moyen, liste alertes |
| 4 états | CA période, stock valorisé, top produits, clients |
| Rôles vérifiés sur chaque action | Caissier : vente oui, réception non |

**Critères de sortie (tous requis)**
1. Config entreprise + modules Retail en moins de 15 min.
2. 10 ventes sans formation.
3. Stock cohérent après vente **et** après BL.
4. CA dashboard = somme des tickets du jour.
5. Module désactivé absent du menu.

---

## Après le MVP (ne pas démarrer avant)

| Version | Contenu |
|---------|---------|
| v1.1 | Multi-sites réel + transferts + écarts de réception |
| v1.2 | Centre de contrôle (journal des opérations sensibles) |
| v1.3 | Apps transversales cochables : Calendrier, To Do, Fichiers |
| v1.4 | Domaine Génie électrique : Projet, Chantier, devis travaux |

---

## Ordre de construction technique (dans chaque sprint)

1. Migration / tables
2. Règle métier côté serveur (pas seulement dans l'écran)
3. Écran minimum utilisable
4. Jeu de données de démo
5. Contrôle du critère de démo du sprint

Pas de refactor du prototype HTML v105. Il reste la référence métier, pas le code de production.
