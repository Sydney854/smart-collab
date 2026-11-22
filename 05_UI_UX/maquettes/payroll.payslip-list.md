# payroll.payslip-list — Paie — liste des bulletins et aperçu

**Statut : proposée**

| | |
|---|---|
| Application | `payroll` (application proposée, absente du contrat §7 de 16_CONTRAT_APPLICATION.md) |
| Écran | `payslip-list` |
| Lot | 8 |
| Prototype | RH & Paie › Paie (v107) (v107) |
| Fonction de rendu | `RHSUBP.paie (paieGenererMois)` ; `RHSUBP.paie → paieActMenu()` ; `RHSUBP.paie` ; `paieImprimer() → paieBulletinHtml() → fenetrePV()` |

## Captures de référence

- [12_RH-Paie/15_paie_v107-liste-vide.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/15_paie_v107-liste-vide.png) — Liste vide (au chargement) (v107)
- [12_RH-Paie/16_paie_v107-liste.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/16_paie_v107-liste.png) — Liste (paie du mois générée) (v107)
- [12_RH-Paie/18_paie_v107-menu-action.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/18_paie_v107-menu-action.png) — Menu ⋮ d'une ligne (v107)
- [12_RH-Paie/19_paie_v107-apercu-bulletin.png](../../03_SOURCES_REFERENCE/prototype/captures/12_RH-Paie/19_paie_v107-apercu-bulletin.png) — Fenêtre d'aperçu d'un bulletin (v107)

Les données visibles sur les captures sont celles de RUTHY'S : la maquette Smart Collab utilise des données fictives.

## Zones de l'écran

- Barre de période ; bandeau (barème, taux) ; recherche, filtre de statut, « Générer la paie de <mois> », « Imprimer tous les bulletins ».
- Tableau : identifiant, employé, désignation, département, période, brut, retenues, net, mode de règlement (liste éditable), statut, actes ⋮.
- État « liste vide » : « Aucun bulletin de paie pour l'instant ».
- État « menu ⋮ » : Modifier, Imprimer le bulletin, Supprimer.
- État « aperçu du bulletin » : fenêtre d'aperçu (studio.print-preview) avec le bulletin (en-tête société, période, emploi, rubriques gains / retenues / part patronale, cumuls, net à payer, coût employeur).

## Champs et filtres

Relevés dans le prototype (toutes captures de la fiche). Barre de période et sélecteurs de couleur exclus : composants communs (`PeriodBar`, `ThemePicker`).

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Rechercher un employé ou un n° de paie... | texte | non |  |
| (sans libellé) | liste | non | choix : Filtrer : Tous, Filtrer : Payé, Filtrer : En attente, Filtrer : Annulé |
| MODE DE RÈGLEMENT | liste | non | choix : Ordre de virement, Chèque, Espèces, Mobile Money — Wave, Mobile Money — Orange Money, Mobile Money — Djamo |
| (sans libellé) | texte | non |  |

Obligatoires à confirmer en maquette : le prototype ne marque presque aucun champ obligatoire (il bloque sans le dire).

## Colonnes

- **IDENTIFIANT · EMPLOYÉ · DÉSIGNATION · DÉPARTEMENT · PÉRIODE · BRUT · RETENUES · SALAIRE NET · MODE DE RÈGLEMENT · STATUT · ACTES**
- **N° · DÉSIGNATION · NOMBRE · BASE · TAUX · GAIN · RETENUE · TAUX PAT. · PART PATRONALE**

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
| ✎ Modifier | ajoute un élément (ligne, fiche ou fenêtre de création) (`paieOuvrirEdit`) |
| 🖨 Imprimer le bulletin | ouvre la fenêtre d'aperçu avant impression (`paieImprimer`) |
| 🗑 Supprimer | supprime ou désactive l'élément (voir « À ne pas reproduire ») (`paieSupprimer`) |
| ✕ | ferme la fenêtre d'aperçu (`fermerPV`) |
| 👁 Aperçu, 🖨 Imprimer, ↗ Exporter … (5 éléments) | change d'onglet de la fenêtre (Aperçu, Imprimer, Exporter…) (`pvTab`) |
| ▤ 100 %, Largeur, Page entière … (6 éléments) | change le zoom (`pvZoom`) |
| ✋ Déplacement, 🅃 Sélection, ⊕ Mire … (5 éléments) | change l'outil de pointeur (`pvMode`) |
| ⤢ Plein écran | passe en plein écran (`pvFull`) |
| ▥ Volet miniatures | affiche ou masque les miniatures (`pvMini`) |
| ⏫, 🔼, 🔽 … (5 éléments) | change de page (`pvPage`) |

Autres gestes : glisser-déposer : réordonner les sous-onglets ou les cartes (5 éléments déplaçables).

## États

- **Liste (paie du mois générée)** : voir capture `12_RH-Paie/16_paie_v107-liste.png` et la zone correspondante ci-dessus.
- **Menu ⋮ d'une ligne** : voir capture `12_RH-Paie/18_paie_v107-menu-action.png` et la zone correspondante ci-dessus.
- **Fenêtre d'aperçu d'un bulletin** : voir capture `12_RH-Paie/19_paie_v107-apercu-bulletin.png` et la zone correspondante ci-dessus.
- **Vide** : le prototype affiche « Aucun bulletin de paie pour l'instant. ». Smart Collab : `EmptyState` avec une phrase neutre et l'action utile (créer, changer de filtre).
- **Chargement** : Squelette de lignes (5 lignes grisées) dans la liste ; filtres utilisables. Le prototype n'a pas d'état de chargement (données en mémoire).
- **Erreur** : Bandeau d'erreur au-dessus de la liste avec « Réessayer » ; les filtres restent en place.
- **Hors ligne** : Écran non disponible hors ligne (§9) : il affiche le bandeau « Hors ligne » et un état « Connexion nécessaire » ; rien n'est saisi localement.

## Droits nécessaires

- payroll.payslip.view
- payroll.payslip.create
- payroll.payslip.print
- payroll.payslip.cancel
- Salaires masqués selon le rôle

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-RH-02, EF-RH-03, EF-GEN-04, EF-GEN-02 (02_SPECIFICATIONS/06_EXIGENCES_FONCTIONNELLES.md).

## Version mobile (390 px)

- Bulletins en cartes (employé, période, net, statut) ; mode de règlement dans le détail.
- Actions de masse (générer, imprimer tout) dans « ⋯ ».

## À ne pas reproduire

- Note 5 de CAPTURES.md — le tableau (11 colonnes) est plus large que l'écran à 1440 px ; il faut le faire défiler pour atteindre Statut et Actes. Smart Collab : colonnes Statut et Actes figées à droite, colonnes secondaires masquables (choix des colonnes).
- « Supprimer » un bulletin : un bulletin validé ou payé s'annule avec motif (EF-GEN-02).
- Mode de règlement modifiable directement dans la liste : le modifier depuis le bulletin, tracé.
- « Imprimer » et « Exporter » de la barre d'outils sans effet.
- Relevé automatique des éléments sans effet sur les captures : « 🖨 Imprimer », « ⇩ Exporter ».
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Signalé sans recopier les valeurs ; à traiter dans 02_SPECIFICATIONS/07_MOTEUR_CONFIGURATION.md.

- Barème ITS, taux CNPS, rubriques numérotées, transport non imposable, parts fiscales : barèmes légaux de Côte d'Ivoire datés → barèmes configurables par pays (EF-RH-02), pas codés en dur.
- Salaires et montants : données de démonstration v107.
