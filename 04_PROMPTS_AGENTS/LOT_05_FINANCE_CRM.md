# Prompt — Lot 5 : Finance et CRM

```text
Smart Collab — LOT 5 uniquement (Finance et CRM).
Les lots précédents sont validés (voir 06_LOTS/).
Respecte AGENTS.md et 02_SPECIFICATIONS/16_CONTRAT_APPLICATION.md.

À lire avant de coder :
- 02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md (EF-FIN, EF-VEN, EF-CRM)
- 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md

Objectif :
1. Application `finance` : comptes de trésorerie (caisses, banques, mobile money, comptes virtuels), encaissements automatiques, dépenses avec justificatif, budgets et enveloppes (EF-FIN-01 à 04).
2. Répartition automatique d'une vente entre comptes virtuels selon une règle du moteur (EF-FIN-03) — moteur de règles minimal dans `packages/rules`.
3. Application `sales` : devis → commande → bon de livraison → facture → encaissement, avoirs, acomptes, factures récurrentes, relances, dépôt-vente (EF-VEN-01 à 03).
4. Application `crm` : fiche client unique, segmentation par règles, pistes, affaires, pipeline (EF-CRM-01 à 03) ; pont `pos_crm`.

Interdit dans ce lot :
- Pas d'écritures comptables (lot 7). Aucune règle de répartition codée en dur.
- Tout ce qui appartient à un autre lot (02_SPECIFICATIONS/13_PLAN_LOTS.md).

Livrable obligatoire :
- Code dans src/, sur la branche lot-05.
- Tests automatiques du lot (dont l'isolation des entreprises à partir du lot 1).
- Commandes exactes pour installer, migrer, lancer et tester, mises à jour dans src/README.md.
- Comptes de démonstration et données fictives.

Démo de fin de lot :
Configurer une règle de répartition, vendre, constater les mouvements sur les comptes virtuels ; faire un devis jusqu'à la facture et l'encaissement ; consulter l'historique du client.
```

Liste de contrôle : `06_LOTS/lot_05/CHECKLIST.md`
