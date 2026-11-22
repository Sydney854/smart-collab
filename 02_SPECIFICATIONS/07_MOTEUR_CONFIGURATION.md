# Smart Collab — 7. Moteur de configuration

> Extrait de `00_CAHIER_DES_CHARGES_COMPLET.md`. En cas d'écart, le cahier complet fait foi.

Tout ce qui varie d'une entreprise à l'autre se règle dans le Studio de configuration, sans toucher au code. Seules les garanties communes (EF-GEN) restent fixes.

| Élément configurable | Ce que l'administrateur règle | Exemples |
| --- | --- | --- |
| Règles de calcul | Formules sur les champs des documents, avec conditions | Marge, commission, répartition d'une vente entre comptes, prix de vente suggéré |
| Barèmes | Tables de taux, tranches, plafonds, datées par période de validité | Impôt sur salaires, cotisations sociales, taxes |
| Indicateurs | Source, mesure, agrégat, filtres, comparaison, seuils et couleurs d'alerte | Chiffre d'affaires du jour, taux de rupture, dépassement de budget |
| Tableaux de bord | Disposition des cartes et graphiques par rôle, glisser-déposer, filtres par défaut | Tableau Direction, tableau Gérant de boutique |
| Modèles de documents | En-tête, logo, colonnes, mentions, format (ticket 80 mm, A4, A5) | Ticket, facture, bon de livraison, bulletin de paie, bon de transfert |
| États et rapports | Source, critères, regroupements, colonnes, totaux, mise en forme, planification d'envoi | Journal des ventes, stock valorisé, écarts d'inventaire |
| Circuits de validation | Niveaux, seuils de montant, valideurs, délais et relances | Remise au-delà de 10 %, commande au-delà d'un montant |
| Seuils et alertes | Valeurs déclenchant une alerte ou une proposition automatique | Stock minimum, délai de transfert non reçu |
| Numérotation | Préfixe, compteur, remise à zéro par an ou par site | V-2026-0001 |
| Champs personnalisés | Champs ajoutés aux fiches et formulaires, listes de choix | Matière d'un tissu, puissance d'un câble |
| Menus et libellés | Ordre, noms et visibilité des menus et sous-menus | Renommer « Point de vente » en « Caisse » |
| Apparence | Couleurs, logo, disposition du menu, thème clair ou sombre | Couleurs de la marque du client |

### Exigences du moteur

- **EF-CFG-01** Les formules s'écrivent dans un langage d'expressions simple et sûr (champs, opérateurs, fonctions SI, MIN, MAX, ARRONDI, BARÈME), jamais en code libre.
- **EF-CFG-02** Le même moteur de calcul tourne sur le serveur et dans le navigateur, pour que le mode hors ligne donne les mêmes résultats.
- **EF-CFG-03** Toute règle se teste sur un exemple avant activation (« avec ces valeurs, le résultat serait… »).
- **EF-CFG-04** Chaque configuration est versionnée et datée ; un document garde la version de règle en vigueur le jour où il a été validé.
- **EF-CFG-05** Toute modification de configuration est tracée dans le journal des modifications et peut être annulée.
- **EF-CFG-06** Chaque métier livre un jeu de réglages par défaut, prêt à l'emploi à la première configuration.

