# Smart Collab — 5. Inventaire des écrans

> Extrait de `00_CAHIER_DES_CHARGES_COMPLET.md`. En cas d'écart, le cahier complet fait foi.

Les écrans existants du prototype sont repris tels quels comme maquette ; les écrans absents sont maquettés avant d'être codés, en prenant la page DreamsERP correspondante comme référence de structure (231 pages fournies dans l'archive Tailwind). Les écrans propres à Smart Collab sont à concevoir.

| Module | Repris du prototype | À maquetter (référence DreamsERP) |
| --- | --- | --- |
| Cadre général | Menu latéral, onglets ouverts, barre de période et calendrier, sélecteur de couleurs, personnalisation des graphiques et cartes au clic droit | Barre du haut (changement de société, langue, notifications, recherche globale), dispositions de menu, mode sombre |
| Connexion | — | Connexion, inscription, mot de passe oublié, réinitialisation, vérification e-mail, verrouillage d'écran, erreurs 404 / 500 |
| Tableaux de bord | Direction, Financier, Commercial, Opérations, comparaison de sites | Tableaux par module : RH, stock, CRM, caisse, finance, ventes, achats, projets, support |
| Point de vente | Caisse, session, panier, client, règlements, ticket | Commandes de caisse, impression codes-barres et QR, paramètres d'impression, modèle de ticket de caisse (80 mm et A4 — le prototype n'a qu'un aperçu vide, note 3 de `03_SOURCES_REFERENCE/prototype/CAPTURES.md`) |
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

