# payroll.reports — États RH — bulletin et journal de paie

**Statut : proposée**

| | |
|---|---|
| Application | `payroll` (application proposée, absente du contrat §7 de 16_CONTRAT_APPLICATION.md) |
| Écran | `reports` |
| Lot | 8 |
| Prototype | Rapports & Analyses › Centre d'impression › États RH (v107) (v107) |
| Fonction de rendu | `RSUBP.etats → paieEtatPanel() (bulletin)` ; `RSUBP.etats → paieEtatPanel() (journal)` ; `paieEtatPanel() → fenetrePV()` |

## Captures de référence

- [14_Rapports-Analyses/15_etats_v107-etats-rh-bulletin.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/15_etats_v107-etats-rh-bulletin.png) — États RH : Bulletin de paie (v107)
- [14_Rapports-Analyses/16_etats_v107-etats-rh-bulletin-apercu.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/16_etats_v107-etats-rh-bulletin-apercu.png) — États RH : Bulletin de paie, aperçu (v107)
- [14_Rapports-Analyses/17_etats_v107-etats-rh-journal.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/17_etats_v107-etats-rh-journal.png) — États RH : Journal de paie (v107)
- [14_Rapports-Analyses/18_etats_v107-etats-rh-journal-apercu.png](../../03_SOURCES_REFERENCE/prototype/captures/14_Rapports-Analyses/18_etats_v107-etats-rh-journal-apercu.png) — États RH : Journal de paie, aperçu (v107)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Centre d'impression, domaine ÉTATS RH : états Bulletin de paie et Journal de paie.
- Critères : 1 période, 2 employés (tous / un seul), 3 statut des bulletins, 4 département, 5 tri ; bouton « Imprimer l'état sélectionné ».
- Aperçus : bulletins groupés (un par page) ; journal (employé, période, brut, brut imposable, ITS, CNPS salarié, net, charges patronales, coût employeur).

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Rechercher un état… | texte | non |  |
| (sans libellé) | liste | non | choix : 2022, 2023, 2024, 2025, 2026 |
| Tous les employés | choix | non |  |
| Tous les employés | liste | non | valeurs du référentiel (9 entrées dans le prototype, données RUTHY'S non reprises) |
| Tous sauf annulés | choix | non |  |
| Payés | choix | non |  |
| En attente | choix | non |  |
| Tous | choix | non |  |
| Ordre alphabétique | choix | non |  |
| Par matricule | choix | non |  |
| (sans libellé) | texte | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **N° · DÉSIGNATION · NOMBRE · BASE · TAUX · GAIN · RETENUE · TAUX PAT. · PART PATRONALE**
- **EMPLOYÉ · PÉRIODE · BRUT · BRUT IMPOSABLE · ITS · CNPS SALARIÉ · NET À PAYER · CHARGES PATRONALES · COÛT EMPLOYEUR**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| (7 noms, n° ou codes cliquables dans la liste) | affiche les états du domaine (`setDomEt`) |
| 1 Bulletin de paie | choisit l'état à imprimer et affiche ses critères (`paieEtatEtat`) |
| 2 Journal de paie | choisit l'état à imprimer et affiche ses critères (`paieEtatEtat`) |
| 🖨 Imprimer l'état sélectionné suivant les critères ci-dessus | ouvre la fenêtre d'aperçu avant impression (`paieEtatImprimer`) |
| ✕ | ferme la fenêtre d'aperçu (`fermerPV`) |
| 👁 Aperçu, 🖨 Imprimer, ↗ Exporter … (5 éléments) | change d'onglet de la fenêtre (Aperçu, Imprimer, Exporter…) (`pvTab`) |
| ▤ 100 %, Largeur, Page entière … (6 éléments) | change le zoom (`pvZoom`) |
| ✋ Déplacement, 🅃 Sélection, ⊕ Mire … (5 éléments) | change l'outil de pointeur (`pvMode`) |
| ⤢ Plein écran | passe en plein écran (`pvFull`) |
| ▥ Volet miniatures | affiche ou masque les miniatures (`pvMini`) |
| ⏫, 🔼, 🔽 … (12 éléments) | change de page (`pvPage`) |
| ⏫, 🔼, 🔽 … (5 éléments) | change de page (`pvPage`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (4 éléments déplaçables).

## États

- **États RH : Bulletin de paie, aperçu** : voir capture `14_Rapports-Analyses/16_etats_v107-etats-rh-bulletin-apercu.png` et la zone correspondante ci-dessus.
- **États RH : Journal de paie** : voir capture `14_Rapports-Analyses/17_etats_v107-etats-rh-journal.png` et la zone correspondante ci-dessus.
- **États RH : Journal de paie, aperçu** : voir capture `14_Rapports-Analyses/18_etats_v107-etats-rh-journal-apercu.png` et la zone correspondante ci-dessus.
- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Squelette des sections. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Enregistrement refusé : message à côté du réglage, valeur précédente conservée.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- payroll.report.view
- payroll.report.print

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-RH-03, EF-BI-01 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Critères en accordéon ; bouton Imprimer en barre fixe ; aperçu plein écran.

## À ne pas reproduire

- Note 1 de CAPTURES.md — un `#` égaré dans la feuille de style du prototype fait ignorer la couleur du thème au chargement : le domaine sélectionné et l'en-tête de l'état s'affichent blanc sur blanc tant qu'on n'a pas changé de thème. Smart Collab charge le thème (jetons) avant le premier affichage.
- Note 6 de CAPTURES.md — après un clic sur un domaine, la barre des domaines revient au début et le domaine actif sort du champ. Smart Collab garde le domaine actif visible (défilement conservé ou liste verticale).
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Barème ITS, taux CNPS, rubriques numérotées, transport non imposable, parts fiscales : barèmes légaux de Côte d'Ivoire datés → barèmes configurables par pays (EF-RH-02), pas codés en dur.
- Salaires et montants : données de démonstration v107.
