# payroll.payslip-form — Paie — formulaire Ajouter la paie

**Statut : proposée**

| | |
|---|---|
| Application | `payroll` (application proposée, absente du contrat §7 de 16_CONTRAT_APPLICATION.md) |
| Écran | `payslip-form` |
| Lot | 8 |
| Prototype | RH & Paie › Paie › Ajouter (v107) (v107) |
| Fonction de rendu | `paieModalHtml() (paieOuvrirAjout)` |

## Captures de référence

- [12_RH-Paie/17_paie_v107-formulaire-ajout.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/17_paie_v107-formulaire-ajout.png) — Formulaire Ajouter la paie (v107)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Fenêtre « Ajouter la paie » : détails (employé*, période*, statut, parts fiscales, mode de règlement), gains (salaire de base*, sursalaire, primes, transport), déductions et ajustement, « net visé → Calculer la base », salaire net calculé en direct ; Annuler / Ajouter la paie.

Textes d'aide affichés par le prototype (à réécrire, pas à recopier) : 1 note(s) de bas de bloc.

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Rechercher un employé ou un n° de paie... | texte | non |  |
| (sans libellé) | liste | non | choix : Filtrer : Tous, Filtrer : Payé, Filtrer : En attente, Filtrer : Annulé |
| MODE DE RÈGLEMENT | liste | non | choix : Ordre de virement, Chèque, Espèces, Mobile Money — Wave, Mobile Money — Orange Money, Mobile Money — Djamo |
| EMPLOYÉ * | liste | oui | valeurs du référentiel (9 entrées dans le prototype, données RUTHY'S non reprises) |
| PÉRIODE * | mois | oui |  |
| STATUT | liste | non | choix : Payé, En attente, Annulé |
| PARTS FISCALES | liste | non | valeurs du référentiel (9 entrées dans le prototype, données RUTHY'S non reprises) |
| SALAIRE DE BASE * | nombre | oui |  |
| SURSALAIRE | nombre | non |  |
| PRIMES IMPOSABLES | nombre | non |  |
| TRANSPORT (NON IMPOSABLE) | nombre | non |  |
| AUTRES RETENUES (AVANCE, PRÊT…) | nombre | non |  |
| APPOINT DU MOIS | nombre | non |  |
| Partir d'un net visé | nombre | non | exemple « ex. 250000 » |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **IDENTIFIANT · EMPLOYÉ · DÉSIGNATION · DÉPARTEMENT · PÉRIODE · BRUT · RETENUES · SALAIRE NET · MODE DE RÈGLEMENT · STATUT · ACTES**

En Smart Collab, chaque liste utilise `DataList` (tri, choix des colonnes, export selon les droits).

## Actions (ce que fait chaque clic)

| Élément | Effet dans le prototype |
|---|---|
| 🖨 Imprimer | **aucune action dans le prototype — à câbler** |
| ⇩ Exporter | **aucune action dans le prototype — à câbler** |
| ＋ Ajouter un nouveau | ajoute un élément (ligne, fiche ou fenêtre de création) (`paieOuvrirAjout`) |
| ⚙ Générer la paie de novembre 2026 | génère les bulletins du mois pour tous les employés actifs (`paieGenererMois`) |
| 🖨 Imprimer tous les bulletins | ouvre la fenêtre d'aperçu avant impression (`paieImprimerListe`) |
| ⋮ | ouvre un menu (`paieActMenu`) |
| ✕ | ferme (`paieModalClose`) |
| Annuler | ferme (`paieModalClose`) |
| Calculer la base | recalcule le salaire de base à partir du net visé (`paieNetVise`) |
| Ajouter la paie | enregistre (`paieSauver`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (5 éléments déplaçables).

## États

- **Vide** : non montré par le prototype. Smart Collab : `EmptyState` (« Aucune donnée sur la période » + action utile).
- **Chargement** : Champs désactivés et indicateur sur le bouton de validation pendant l'enregistrement (double clic impossible). Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Message sous le champ fautif ; erreur serveur : `Toast` rouge, saisie conservée, bouton Réessayer.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- payroll.payslip.create

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-RH-02, EF-GEN-03 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Fenêtre plein écran, sections en accordéon ; net calculé toujours visible en bas.

## À ne pas reproduire

- Boutons sans effet dans le prototype : « 🖨 Imprimer », « ⇩ Exporter ». Tout bouton affiché fait quelque chose, sinon il n'est pas affiché.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Barème ITS, taux CNPS, rubriques numérotées, transport non imposable, parts fiscales : barèmes légaux de Côte d'Ivoire datés → barèmes configurables par pays (EF-RH-02), pas codés en dur.
- Salaires et montants : données de démonstration v107.
