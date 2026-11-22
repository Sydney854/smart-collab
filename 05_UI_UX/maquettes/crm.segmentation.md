# crm.segmentation — Segmentation

**Statut : proposée**

| | |
|---|---|
| Application | `crm` |
| Écran | `segmentation` |
| Lot | 5 |
| Prototype | Clients & CRM › Segmentation (v105) |
| Fonction de rendu | `PAGES.crm → CSUBP.seg` |

## Captures de référence

- [11_Clients-CRM/04_seg.png](../../03_SOURCES_REFERENCE/prototype/captures/11_Clients-CRM/04_seg.png) — Par défaut (v105)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Bandeau ; seuils de segmentation (5 champs numériques) ; répartition des segments ; segments détaillés (clic = clients du segment).

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 2 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| VISITES POUR ÊTRE VIP | nombre | non |  |
| VISITES POUR ÊTRE FIDÈLE | nombre | non |  |
| VISITES POUR ÊTRE RÉGULIER | nombre | non |  |
| JOURS SANS ACHAT = À RISQUE | nombre | non |  |
| JOURS SANS ACHAT = DORMANT | nombre | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **SEGMENT · DÉFINITION · CLIENTS · CA · PANIER MOYEN · RÉCENCE MOYENNE · ACTION RECOMMANDÉE** — tri au clic sur 5 en-tête(s) ; ligne cliquable → ouvre l'écran ou la fiche correspondante (`versCRM`)

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)


Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (6 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette des sections. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Enregistrement refusé : message à côté du réglage, valeur précédente conservée.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- crm.segment.configure

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-CRM-02 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Seuils en formulaire ; segments en cartes.

## À ne pas reproduire

- Seuils modifiables sans enregistrer ni tracer : passer par le Studio, versionné (EF-CFG-04, 05).
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Seuils de segmentation (visites, jours sans achat), score et niveaux de fidélité → règles configurables (EF-CRM-02).
- Clients : données de démonstration du prototype, à remplacer par des données fictives Smart Collab.
