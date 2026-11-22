# crm.follow-ups — Relances et tâches

**Statut : proposée**

| | |
|---|---|
| Application | `crm` |
| Écran | `follow-ups` |
| Lot | 5 |
| Prototype | Clients & CRM › Relances & tâches (v105) |
| Fonction de rendu | `PAGES.crm → CSUBP.relance` |

## Captures de référence

- [11_Clients-CRM/05_relance.png](../../03_SOURCES_REFERENCE/prototype/captures/11_Clients-CRM/05_relance.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Bandeau ; cibles (à risque, dormants à fort potentiel, nouveaux à confirmer, portefeuille non utilisé, prospects sans achat).
- Tâches et relances (tâche, responsable, échéance, priorité, statut, Terminer) ; détail de la première cible ; Exporter, → Campagne.

## Champs et filtres

Aucun champ de saisie propre à l'écran (hors barre de période commune).

## Colonnes

- **TÂCHE · RESPONSABLE · ÉCHÉANCE · PRIORITÉ · STATUT**
- **CLIENT · SEGMENT · DERNIER ACHAT · RÉCENCE · CA CUMULÉ · TÉLÉPHONE · FAMILLE PRÉFÉRÉE**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| ↧ Exporter | **aucune action dans le prototype — à câbler** |
| Terminer | affiche / masque (`tacheTog`) |
| (20 noms, n° ou codes cliquables dans la liste) | ouvre la fiche client 360° (`cOpen`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (6 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- crm.task.manage
- crm.customer.export

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-CRM-02, EF-CRM-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Cibles en puces défilantes ; tâches en cartes.

## À ne pas reproduire

- « ↧ Exporter » sans effet ; « → Campagne » mène au module Marketing vide.
- Relevé automatique des éléments sans effet sur les captures : « ↧ Exporter ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Seuils de segmentation (visites, jours sans achat), score et niveaux de fidélité → règles configurables (EF-CRM-02).
- Clients : données de démonstration du prototype, à remplacer par des données fictives Smart Collab.
