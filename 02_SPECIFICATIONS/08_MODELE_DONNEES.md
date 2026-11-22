# Smart Collab — 8. Modèle de données

> Extrait de `00_CAHIER_DES_CHARGES_COMPLET.md`. En cas d'écart, le cahier complet fait foi.

Une seule base pour tous les métiers : un socle commun et des extensions qui ne servent que lorsque leur module est actif. Le schéma SQL du dépôt (MVP Retail) est repris comme point de départ puis étendu.

### Principes

- Chaque table porte l'identifiant de l'entreprise cliente ; l'isolation est imposée par la base elle-même (sécurité au niveau des lignes de PostgreSQL), pas seulement par le code.
- Montants en décimal exact (numeric), jamais en nombre à virgule flottante ; devise et fuseau horaire par entreprise.
- Le stock n'est jamais saisi : il est la somme des mouvements. Une table de niveaux de stock sert de cache recalculable.
- Identifiants générés côté client possibles (UUID) pour le mode hors ligne, avec une clé d'idempotence par opération.
- Colonnes de traçabilité partout : créé par, créé le, modifié par, modifié le, statut ; pas de suppression physique.
- Journal d'événements métier unique (type, objet, données avant et après, auteur, date, motif).

| Domaine de données | Tables principales | Utilisé par |
| --- | --- | --- |
| Plateforme | entreprises, abonnements, modules activés, utilisateurs, rôles, permissions, sessions | Tous |
| Configuration | règles, barèmes, indicateurs, tableaux de bord, modèles de documents, modèles d'états, circuits de validation, numérotations, champs personnalisés, versions | Tous |
| Tiers | tiers (client, fournisseur, prospect, déposant), contacts, adresses | Tous |
| Lieux | sites (boutique, centrale, dépôt, transit, chantier, bureau), emplacements | Tous |
| Catalogue | produits, variantes, catégories, marques, unités, tarifs, codes-barres, photos | Commerce, multi-sites, génie électrique |
| Stock | mouvements de stock, niveaux, réservations, inventaires et lignes de comptage, ajustements | Commerce, multi-sites, génie électrique |
| Caisse et ventes | sessions de caisse, tickets, lignes, règlements, devis, commandes, bons de livraison, factures, avoirs | Commerce, multi-sites, génie électrique, conseil (factures) |
| Achats | commandes fournisseurs, réceptions, réclamations, retours, échéances | Commerce, multi-sites, génie électrique |
| Transferts | bons de transfert, lignes (demandé, expédié, reçu), demandes de réassort | Multi-sites, génie électrique |
| Finance | comptes de trésorerie, mouvements, dépenses, budgets, enveloppes, taxes, immobilisations | Tous |
| RH et paie | employés, contrats, présences, congés, périodes de paie, bulletins, rubriques | Tous (optionnel) |
| Projets et conseil | contrats, missions, membres, jalons, feuilles de temps, livrables, notes de frais | Conseil, génie électrique |
| Chantiers | chantiers, besoins matériel, interventions, situations de travaux | Génie électrique |
| Collaboration | messages, événements de calendrier, tâches, notes, fichiers, documents, tickets d'assistance | Tous (optionnel) |
| Contrôle | journal d'événements, journal des accès, alertes, demandes de suppression | Tous |
| Synchronisation | appareils, file des opérations reçues hors ligne, conflits | Modules hors ligne |

Le schéma complet (colonnes, contraintes, index) est livré module par module, en migrations versionnées, au fil des lots (§13).

