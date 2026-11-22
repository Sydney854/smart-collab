# Prompt — Lot 3 : Caisse et ventes (hors ligne compris)

```text
Smart Collab — LOT 3 uniquement (Caisse et ventes (hors ligne compris)).
Les lots précédents sont validés (voir 06_LOTS/).
Respecte AGENTS.md et 02_SPECIFICATIONS/16_CONTRAT_APPLICATION.md.

À lire avant de coder :
- 02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md (EF-POS)
- 02_SPECIFICATIONS/09_HORS_LIGNE.md
- 02_SPECIFICATIONS/16_CONTRAT_APPLICATION.md §4 et §8
- 05_UI_UX/maquettes/pos.*

Objectif :
1. Application `pos` : sessions par caisse (fond, comptage par mode, écart), panier par scan / code / recherche, remises dans la limite du rôle (EF-POS-01, 02).
2. Règlements multiples : espèces, carte, Wave, Orange Money, MTN, Moov, chèque, virement, avoir, crédit client (EF-POS-03).
3. Ticket 80 mm et A4 depuis un modèle configurable, envoi par e-mail ou messagerie (EF-POS-04) ; retours liés au ticket (EF-POS-05).
4. Matériel : imprimante de tickets, tiroir-caisse ouvert au règlement espèces, lecteur de codes-barres (EF-POS-07).
5. Hors ligne : application installable, base locale, file d'opérations, numéros provisoires, synchronisation idempotente, conflits (EF-OFF-01 à 04, `09_HORS_LIGNE.md`).
6. Événements `pos.sale.validated` et `pos.sale.refunded` : sortie de stock et encaissement dans la même transaction (EF-GEN-01).

Interdit dans ce lot :
- Pas de devis ni de factures (lot 5), pas de comptabilité (lot 7).
- Tout ce qui appartient à un autre lot (02_SPECIFICATIONS/13_PLAN_LOTS.md).

Livrable obligatoire :
- Code dans src/, sur la branche lot-03.
- Tests automatiques du lot (dont l'isolation des entreprises à partir du lot 1).
- Commandes exactes pour installer, migrer, lancer et tester, mises à jour dans src/README.md.
- Comptes de démonstration et données fictives.

Démo de fin de lot :
Ouvrir une caisse, vendre avec deux modes de règlement, couper le réseau, faire 10 ventes, rétablir le réseau, constater stock, encaissements et chiffre d'affaires du jour ; fermer la caisse avec comptage.
```

Liste de contrôle : `06_LOTS/lot_03/CHECKLIST.md`
