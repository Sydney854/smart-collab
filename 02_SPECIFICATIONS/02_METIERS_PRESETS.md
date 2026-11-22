# Smart Collab — 2. Métiers couverts et préréglages

> Extrait de `00_CAHIER_DES_CHARGES_COMPLET.md`. En cas d'écart, le cahier complet fait foi.

Smart Collab couvre quatre métiers et un profil Mixte. Le métier choisi à la première configuration pré-coche les modules et les rôles ; l'entreprise peut tout modifier ensuite. Les documents de référence sont les quatre fiches métier du dépôt, à renommer Smart Collab.

| Métier | Objet central | Lieux de stock | Facturation | Modules pré-cochés (hors Core) |
| --- | --- | --- | --- | --- |
| Commerce de détail | Ticket de caisse et stock | Une boutique | Immédiate en caisse | Point de vente, Ventes, CRM & Clients, Produits & Inventaire, Achats, Finance, Facturation, Rapports & BI |
| Multi-sites / Distribution | Bon de transfert | Centrale, boutiques, dépôts, stock en transit | Caisse par site, consolidation réseau | Ceux du commerce de détail + Transferts, Sites & Entrepôts, Paiements & Taxes, Centre de contrôle |
| Audit / Conseil / Projet | Mission et temps passé | Aucun | Forfait (jalons), régie (temps × taux) ou mixte | Projet, Feuilles de temps, Rendez-vous, Planification, Assistance, CRM & Clients, Ventes, Facturation, Finance, Rapports & BI, Documents, Connaissances |
| Génie électrique | Chantier et réservation de matériel | Magasin, entrepôt, chantiers temporaires | Caisse magasin + situations de travaux | Point de vente, Ventes, CRM & Clients, Produits & Inventaire, Achats, Sites & Entrepôts, Réparation, Projet, Services sur site, Planification, Chantier, Feuilles de temps, Rendez-vous, Finance, Facturation, Paiements & Taxes, RH & Paie, Présences, Rapports & BI, Centre de contrôle, Documents |
| Mixte | Composition libre | Selon les modules activés | Selon les modules activés | Aucun : l'entreprise compose |

Règle de composition (profil Mixte) : quand deux métiers partagent un objet, la règle la plus stricte s'applique. Exemple : une réservation chantier bloque la vente au comptoir de la quantité réservée.

Les règles décrites dans les fiches métier (« pas de vente sur du stock en transit », « alerte à 80 % du budget d'une mission », « une situation ne dépasse pas 100 % du contrat ») deviennent les réglages par défaut du métier, modifiables dans le moteur de configuration (§7).

