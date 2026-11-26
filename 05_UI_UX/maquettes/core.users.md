# core.users — Comptes collaborateurs (utilisateurs et droits)

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `users` |
| Lot | 1 |
| Prototype | Paramètres › Comptes collaborateurs (v105) |
| Fonction de rendu | `PAGES.param → GSUBP.comptes` |

## Captures de référence

- [16_Parametres/01_comptes.png](../../03_SOURCES_REFERENCE/prototype/captures/16_Parametres/01_comptes.png) — Par défaut (v105)

Les données visibles sur les captures sont celles du client fondateur : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Liste des comptes à gauche (filtre tous, en activité, non actifs) : matricule, initiales, nom, fonction, profil ; clic = compte.
- Attributs du compte : première fenêtre, profil, multi-session, consultation seule, multi-site, super-opérateur, en activité.
- Droits d'accès : cases par domaine et action (caisse, produits, stocks, transferts, achats, clients, trésorerie, états, contrôle, administration), Cocher / Décocher tout.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| 1ÈRE FENÊTRE | liste | non | valeurs du référentiel (12 entrées dans le prototype, données du client fondateur non reprises) |
| PROFIL | liste | non | choix : Caissière, Responsable boutique, Gestionnaire de stock, Responsable logistique, Comptable, Responsable Opérations et Performance … |
| Multi-session peut ouvrir plusieurs sessions | case à cocher | non |  |
| Compte consultation lecture seule, aucune écriture | case à cocher | non |  |
| Multi-site accède à Prima et à Aéroport | case à cocher | non |  |
| Super-opérateur contourne les validations à deux niveaux | case à cocher | non |  |
| En activité un compte se désactive, il ne se supprime pas | case à cocher | non |  |
| Accès | case à cocher | non |  |
| Remise | case à cocher | non |  |
| Annuler une vente | case à cocher | non |  |
| Vente à crédit | case à cocher | non |  |
| Décaissement | case à cocher | non |  |
| Forcer le stock | case à cocher | non |  |
| Vente ratée | case à cocher | non |  |
| Consulter | case à cocher | non |  |
| Voir prix d'achat | case à cocher | non |  |
| Créer | case à cocher | non |  |
| Modifier | case à cocher | non |  |
| Supprimer | case à cocher | non |  |
| Étiquettes | case à cocher | non |  |
| Correction | case à cocher | non |  |
| Valider correction | case à cocher | non |  |
| Inventaire | case à cocher | non |  |
| Valider inventaire | case à cocher | non |  |
| Valider le départ | case à cocher | non |  |
| Valider la réception | case à cocher | non |  |
| Créer BL | case à cocher | non |  |
| Valider BL | case à cocher | non |  |
| Réclamation | case à cocher | non |  |
| Réactiver réclamation | case à cocher | non |  |
| Intégrer BL | case à cocher | non |  |
| Portefeuille | case à cocher | non |  |
| Carte cadeau | case à cocher | non |  |
| Accorder crédit | case à cocher | non |  |
| Encaissement | case à cocher | non |  |
| Versement journée antérieure | case à cocher | non |  |
| Règlements fournisseurs | case à cocher | non |  |
| Exporter | case à cocher | non |  |
| Imprimer | case à cocher | non |  |
| États confidentiels | case à cocher | non |  |
| … | | | 8 autres champs du même type (lignes de tableau) |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

Pas de tableau de données (cartes, graphiques ou formulaire).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| Tous | filtre la liste (`eFilt`) |
| En activité | filtre la liste (`eFilt`) |
| Non actifs | filtre la liste (`eFilt`) |
| (nom ou n° cliquable dans la ligne) | sélectionne (`eSel`) |
| Cocher tout | coche ou décoche tous les droits (`allDroits`) |
| Décocher tout | coche ou décoche tous les droits (`allDroits`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (5 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette des sections. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Enregistrement refusé : message à côté du réglage, valeur précédente conservée.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- core.user.manage
- core.role.assign

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

§4 Rôles et droits, EF-GEN-03, EF-APP-04 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Liste des comptes en plein écran ; compte choisi en plein écran avec droits en accordéon par domaine.

## À ne pas reproduire

- Libellé « Multi-site » écrit avec des noms de sites : choisir les sites du périmètre dans une liste.
- Droits édités case par case sans notion de périmètre (site, équipe, ses données) ni de seuil : appliquer le modèle rôle × module × action × périmètre (§4).
- Pas de bouton Enregistrer : chaque clic modifie immédiatement les droits.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Profils (Caissière, Responsable boutique…) et première fenêtre par profil : rôles du client fondateur → rôles préréglés par métier (§4).
- Collaborateurs : données du client fondateur.
