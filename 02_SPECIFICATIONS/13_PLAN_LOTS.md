# Smart Collab — 13. Plan de livraison par lots

> Extrait de `00_CAHIER_DES_CHARGES_COMPLET.md`. En cas d'écart, le cahier complet fait foi.

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

