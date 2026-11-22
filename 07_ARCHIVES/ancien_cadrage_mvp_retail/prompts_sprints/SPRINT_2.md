# Prompt — Sprint 2 Caisse & ventes

```text
RUTHY’S Plus — SPRINT 2 uniquement.

Références : PRD, TRD §4 (transaction vente), Appflow parcours A, SQL tickets/sessions.

Objectif :
- Session caisse open/close (une open max par site)
- Panier : recherche produit, qté, refus si stock insuffisant
- Client optionnel (création rapide)
- Modes de paiement
- checkout atomique : ticket + lignes + stock_moves + cash_movements
- Double-clic encaisser protégé
- Liste Ventes (filtre jour)
- Messages d’erreur FR (NO_OPEN_SESSION, INSUFFICIENT_STOCK, FORBIDDEN)

Interdit : avoir, remise complexe, multi-sites, impression thermique native.

Démo : ouvrir caisse → vendre 2 lignes → stock ↓ → ticket dans Ventes → CA dashboard ↑ → fermer caisse.
```
