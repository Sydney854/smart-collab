# core.setup-wizard — Assistant de première configuration

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `setup-wizard` |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | M-24, M-25, M-28 (étape Modules) ; code de démonstration : `src/apps/web/screens/SetupWizardScreen.tsx` ; règles : `05_UI_UX/ICONES_MODULES.md` § 4 |

## Captures de référence

Aucune capture (écran propre à Smart Collab) : voir la maquette Smart Collab ci-dessus.

## Zones de l'écran

- Écran plein, sans menu ; en haut : logo, étapes numérotées (1 Entreprise, 2 Métier, 3 Modules, 4 Utilisateurs, 5 Récapitulatif) avec l'étape courante en or ; en bas : Précédent / Continuer.
- **1 Entreprise** : identité et paramètres régionaux.
- **2 Métier** : cartes des métiers (Commerce de détail, Multi-sites…) ; le métier pré-coche les modules et les règles par défaut.
- **3 Modules** : proposition 1 (coche verte sur l'icône, par défaut) ou 2 (cartes + « Votre sélection »), réglée dans Paramètres → Apparence.
- **4 Utilisateurs** : invitations (e-mail, rôle) ; préréglages de rôles par métier.
- **5 Récapitulatif** : résumé de tout, bouton **Terminer** ; liens « Modifier » vers chaque étape.

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Raison sociale | texte | oui |  |
| Pays | liste | oui | Côte d'Ivoire ou pays de l'UEMOA |
| Devise | liste | oui | XOF par défaut ; affichage « F » |
| Langue | liste | oui | français ou anglais |
| RCCM, NCC | texte | non | identifiants légaux |
| Logo | fichier | non | image ≤ 2 Mo |
| Métier | choix | oui | un métier |
| Modules | cases | oui | socle toujours actif |
| Utilisateurs à inviter | e-mail + rôle | non | plusieurs lignes |

## Actions (ce que fait chaque clic)

- **Continuer** : valide l'étape (zod) et passe à la suivante ; la progression est enregistrée (reprise possible).
- **Terminer** : crée la configuration en une seule opération (tout ou rien) : entreprise, sites par défaut, applications et dépendances, rôles, invitations ; inscription au journal ; ouverture du tableau de bord.
- **Plus tard** (étape 4) : passe sans inviter.

## États

- **Vide** : étape 1 vierge, pays et langue proposés selon le navigateur.
- **Chargement** : « Préparation de votre espace… » à la fin.
- **Erreur** : champ invalide sous le champ ; échec à la fin : rien n'est créé, message et bouton Réessayer.
- **Hors ligne** : « Connexion nécessaire pour terminer » ; la saisie déjà faite reste dans le navigateur.

## Droits nécessaires

- Administrateur de l'entreprise (premier compte) ; core.company.configure.

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

Lot 1 point 7, EF-APP-02, EF-GEN-01 (tout ou rien), EF-GEN-03, ENF-USA-02.

## Version mobile (390 px)

- Étapes en barre de progression compacte ; une colonne ; « Votre sélection » sous la liste (proposition 2).

## Textes fr / en

Principaux textes de l'écran (fichiers de traduction `packages/i18n`).

| Français | English |
|---|---|
| Configurons votre espace | Let's set up your workspace |
| Entreprise | Company |
| Métier | Business type |
| Modules | Modules |
| Utilisateurs | Users |
| Récapitulatif | Summary |
| Précédent | Back |
| Continuer | Continue |
| Terminer | Finish |
| Plus tard | Later |
| Vous pourrez en ajouter ou en retirer plus tard depuis l'App Store. | You can add or remove modules later from the App Store. |

## À ne pas reproduire

- Proposition 3 (liste avec interrupteurs) : écartée le 26/11/2026.
- Données de RUTHY'S comme exemples (raison sociale, sites) : exemples fictifs uniquement.

## Propre à RUTHY'S → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
