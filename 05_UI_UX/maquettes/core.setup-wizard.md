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
- **3 Modules** : proposition 1 (coche verte sur l'icône, par défaut) ou 2 (cartes + « Votre sélection »), réglée dans Paramètres → Apparence (pas de sélecteur dans l'assistant). Modules regroupés par famille du catalogue avec son titre ; socle (Tableau de bord, Applications, Paramètres) déjà choisi et marqué « Toujours actif » ; modules pas encore construits marqués « À venir », grisés et non cochables (décision du 26/11/2026) ; compteur « N modules choisis » ; tuiles cochables au clic, à Espace ou Entrée ; seuls les modules **de la formule d'abonnement** sont proposés (EF-APP-06) ; dépendances ajoutées automatiquement et signalées (EF-APP-02).
- **4 Utilisateurs** : invitations (e-mail, rôle) ; préréglages de rôles par métier.
- **5 Récapitulatif** : résumé de tout, bouton **Terminer** ; liens « Modifier » vers chaque étape.

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Raison sociale | texte | oui |  |
| Pays | liste | oui | Côte d'Ivoire ou pays de l'UEMOA |
| Devise | liste | oui | XOF par défaut ; affichage « F » |
| Langue | liste | oui | français ou anglais |
| Identifiants légaux | texte | non | selon le pays choisi (Côte d'Ivoire : RCCM et NCC ; autres pays de l'UEMOA : leurs identifiants) |
| Logo | fichier | non | PNG, JPEG ou WebP seulement (pas de SVG), ≤ 2 Mo, contrôlé par le serveur, rangé dans le dossier privé de l'entreprise (SEC-MO-05) |
| Métier | choix | oui | un métier |
| Modules | cases | oui | socle toujours actif |
| Utilisateurs à inviter | e-mail + rôle | non | plusieurs lignes |

## Actions (ce que fait chaque clic)

- **Continuer** : valide l'étape (zod) et passe à la suivante ; la progression est enregistrée (reprise possible).
- **Terminer** : crée la configuration en une seule opération (tout ou rien) : entreprise, sites par défaut, applications et dépendances, rôles, invitations ; inscription au journal ; ouverture du tableau de bord. Le serveur **refait toute la validation** (zod), fixe lui-même l'entreprise (jamais lue dans le formulaire, SEC-MO-03) et n'accepte pour les invités **que les rôles de cette entreprise, jamais un rôle d'éditeur** et **refuse l'assistant si l'entreprise est déjà configurée**. La saisie en cours n'est gardée que le temps de la session, chiffrée, et effacée à « Terminer » et à la déconnexion.
- **Plus tard** (étape 4) : passe sans inviter.

## États

- **Vide** : étape 1 vierge, pays et langue proposés selon le navigateur.
- **Chargement** : « Préparation de votre espace… » à la fin.
- **Erreur** : champ invalide sous le champ ; échec à la fin : rien n'est créé, message et bouton Réessayer.
- **Hors ligne** : « Connexion nécessaire pour terminer » ; la saisie déjà faite reste dans la session (chiffrée).

## Droits nécessaires

- Administrateur de l'entreprise (premier compte) ; core.company.configure.

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

Lot 1 point 7, EF-APP-02, EF-APP-06, EF-GEN-01 (tout ou rien), EF-GEN-03, ENF-USA-02, ICONES_MODULES.md § 4.

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

## À trancher par la cheffe de projet

Rien : à la fin de l'assistant, accueil simple (bienvenue, raccourcis vers les modules installés, « Pas encore de données » à la place des chiffres), décision du 26/11/2026 ; les tableaux de bord arrivent au lot 6.

## À ne pas reproduire

- Proposition 3 (liste avec interrupteurs) : écartée le 26/11/2026.
- Données du client fondateur comme exemples (raison sociale, sites) : exemples fictifs uniquement.

## Propre au client fondateur → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
