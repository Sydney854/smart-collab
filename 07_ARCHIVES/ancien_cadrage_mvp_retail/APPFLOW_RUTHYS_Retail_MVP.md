# Appflow — RUTHY'S Plus ERP
## Parcours écrans · MVP Retail

Trois parcours seulement. Chaque écran a un nom stable pour le plan de sprints.

Acteurs : **Admin**, **Gérant**, **Caissier**, **Magasinier**.

---

## 0. Carte des écrans

```
Connexion
  → Wizard (1ère fois, admin)
  → Shell
       Dashboard
       Caisse          Session | Panier | Ticket
       Ventes          Liste
       Clients         Liste | Fiche
       Produits        Liste | Fiche
       Achats          Commandes | Réception
       Finance         Mouvements
       Rapports        4 états
       Apps            Cases modules
       Paramètres      Entreprise | Utilisateurs
```

Le menu n'affiche que les modules activés, plus Dashboard, Apps et Paramètres.

---

## 1. Parcours C — Première configuration

**Acteur :** Admin, base vide.

| Étape | Écran | Action | Sinon |
|-------|--------|--------|-------|
| C1 | Connexion | Email + mot de passe du compte créé au seed | Message « identifiants incorrects » |
| C2 | Wizard / Entreprise | Nom, devise figée XOF, nom du site | Champ nom obligatoire |
| C3 | Wizard / Modules | Domaine « Retail » pré-coche POS, Ventes, Clients, Produits, Achats, Finance, Rapports. Cases modifiables. Core verrouillé | — |
| C4 | Wizard / Équipe | Créer au moins un caissier (nom, email, mot de passe) | On peut passer et le faire plus tard dans Paramètres |
| C5 | Récap | Liste des modules allumés. Bouton « Ouvrir la boutique » | — |
| C6 | Dashboard | Menu filtré | — |

Retour : le wizard ne se réaffiche plus. On le rouvre depuis Paramètres → réinitialiser n'existe pas au MVP ; on édite les modules dans Apps.

---

## 2. Parcours A — Vente comptoir

**Acteur :** Caissier (ou gérant).

| Étape | Écran | Action | Garde |
|-------|--------|--------|-------|
| A1 | Caisse | Si aucune session ouverte : montant du fond de caisse, « Ouvrir » | Une seule session ouverte par site |
| A2 | Panier | Recherche nom ou code. Entrée = ajout qté 1. + / − sur la ligne | Produit inactif ou qté > stock : ligne refusée, message sous la recherche |
| A3 | Panier | Optionnel : chercher un client (nom ou téléphone) ou « Nouveau » (nom + tél) | Client non obligatoire |
| A4 | Panier | Choisir espèces, mobile money, carte ou autre | Total affiché en francs |
| A5 | Panier | « Encaisser » une seule fois | Pas de session → bloqué. Stock changé entre-temps → erreur, panier conservé |
| A6 | Ticket | N°, lignes, total, mode, client. « Nouvelle vente » revient au panier vide | — |
| A7 | Clôture | « Fermer la caisse » : saisie du compté. Session `closed` | Le panier non encaissé est perdu : confirmation exigée |

Effets visibles juste après A5 : stock du produit diminué dans Produits, ticket dans Ventes, CA du jour augmenté sur le Dashboard, fiche client mise à jour si un client était rattaché.

---

## 3. Parcours B — Réception marchandise

**Acteur :** Magasinier ou gérant. Pas le caissier.

| Étape | Écran | Action | Garde |
|-------|--------|--------|-------|
| B1 | Achats / Nouvelle commande | Fournisseur, lignes produit + qté + coût | Au moins une ligne |
| B2 | Commande | « Confirmer ». Statut `confirmed`. Plus éditable | — |
| B3 | Réception | Qté reçue pré-remplie avec le reste à recevoir. Modifiable, y compris 0 | Qté < 0 refusée |
| B4 | Réception | « Valider la réception » | Écart (reçu ≠ attendu) affiché avant validation, pas de blocage |
| B5 | Produits | Stock augmenté de la qté reçue seulement | Commande `received` ou `partial` |

---

## 4. Parcours secondaires (écrans, pas de nouveau métier)

| Besoin | Écran | Règle |
|--------|--------|-------|
| Voir la journée | Dashboard | 4 chiffres : CA jour, CA mois, tickets du jour, panier moyen. Liste des produits sous le seuil, clic → fiche produit |
| Chercher un ticket | Ventes | Filtre date. Ligne → détail lecture seule. Pas d'annulation au MVP |
| Corriger un client | Clients / Fiche | Nom, tél, ville. Segment affiché, non éditable (calculé plus tard) |
| Créer un produit | Produits / Fiche | Code unique, nom, famille, fournisseur, PA, PV, seuil, stock d'ouverture |
| Sortie d'argent | Finance | Formulaire : compte, catégorie, libellé, montant. Les encaissements de vente sont déjà là, non éditables |
| Couper un module | Apps | Admin. Décocher retire l'entrée de menu au prochain affichage |
| Droits | Paramètres / Utilisateurs | Admin crée, désactive. Pas de suppression |

---

## 5. Erreurs que l'écran doit dire en français

| Code | Phrase |
|------|--------|
| `NO_OPEN_SESSION` | Ouvrez la caisse avant d'encaisser. |
| `INSUFFICIENT_STOCK` | Stock insuffisant pour {produit}. Disponible : {n}. |
| `FORBIDDEN` | Votre rôle ne permet pas cette action. |
| `NOT_FOUND` | Élément introuvable. |
| Double encaissement | Le bouton reste inactif tant que la requête n'est pas finie. |

---

## 6. Ce que ces parcours ne couvrent pas

Transfert entre boutiques, avoir, remise ligne à ligne, retour marchandise, inventaire tournant, impression ticket, douchette autre que le clavier, fidélité et avoirs client. Ils restent dans le catalogue unifié, pas dans cet Appflow.
