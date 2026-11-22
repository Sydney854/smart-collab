# Prompt — Lot 4 : Achats, réceptions, transferts, inventaire

```text
Smart Collab — LOT 4 uniquement (Achats, réceptions, transferts, inventaire).
Les lots précédents sont validés (voir 06_LOTS/).
Respecte AGENTS.md et 02_SPECIFICATIONS/16_CONTRAT_APPLICATION.md.

À lire avant de coder :
- 02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md (EF-ACH, EF-TRF, EF-STK-04, 05)
- 01_DOCUMENTATION/domaines/02_MULTI_SITES_DISTRIBUTION.md
- 05_UI_UX/maquettes/purchase.*, transfers.*, inventory.count*

Objectif :
1. Application `purchase` : commandes, réceptions avec quantité reçue ≠ commandée, réclamations, retours, suggestions de réapprovisionnement, échéances fournisseurs (EF-ACH-01 à 04).
2. Application `transfers` : bon de transfert brouillon → validé → en préparation → expédié → reçu → clôturé, site de transit, écarts, relances (EF-TRF-01 à 03).
3. Inventaire par lots et zones, scan, import, revue des écarts, validation qui génère les ajustements (EF-STK-04) ; interface lot par lot reprise du prototype.
4. Hors ligne : réception de marchandises et de transferts, comptage d'inventaire.

Interdit dans ce lot :
- Pas de comptabilité, pas de règlements bancaires automatisés.
- Tout ce qui appartient à un autre lot (02_SPECIFICATIONS/13_PLAN_LOTS.md).

Livrable obligatoire :
- Code dans src/, sur la branche lot-04.
- Tests automatiques du lot (dont l'isolation des entreprises à partir du lot 1).
- Commandes exactes pour installer, migrer, lancer et tester, mises à jour dans src/README.md.
- Comptes de démonstration et données fictives.

Démo de fin de lot :
Commander, réceptionner partiellement, transférer de la centrale vers une boutique avec un écart, compter une zone hors ligne puis valider l'inventaire.
```

Liste de contrôle : `06_LOTS/lot_04/CHECKLIST.md`
