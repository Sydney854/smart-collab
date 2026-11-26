# core.two-factor — Double authentification (code à 6 chiffres)

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `two-factor` |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | — |

## Captures de référence

- [DreamsERP mode-clair/17_Pages-authentification-erreurs/15_email-verification.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/17_Pages-authentification-erreurs/15_email-verification.png) — Saisie d'un code à 6 chiffres (même présentation)
- [DreamsERP mode-sombre/16_Systeme/13_security-settings_popup-select-auth.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-sombre/16_Systeme/13_security-settings_popup-select-auth.png) — Choix de la méthode (variante Activer)
- [DreamsERP mode-sombre/16_Systeme/18_security-settings_popup-email-code.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-sombre/16_Systeme/18_security-settings_popup-email-code.png) — Code par e-mail
- [DreamsERP mode-sombre/16_Systeme/20_security-settings_popup-sms-code.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-sombre/16_Systeme/20_security-settings_popup-sms-code.png) — Code par SMS

Référence visuelle seulement : la maquette Smart Collab reprend la disposition, pas le logo, les couleurs ni les textes de DreamsERP.

## Zones de l'écran

- Carte centrée : logo, titre, explication courte, 6 cases de code, bouton Valider.
- Variante « Activer la double authentification » : depuis le profil pour tous ; **imposée par le serveur** aux administrateurs et à l'éditeur, qui ne peuvent rien faire d'autre avant de l'avoir activée (SEC-MO-04). Code QR à scanner avec une application d'authentification, clé à saisir à la main, 6 cases de confirmation, puis 8 codes de secours à conserver.

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Code | 6 chiffres | oui | une case par chiffre ; collage d'un code complet accepté ; validation automatique au 6ᵉ chiffre |
| Code de secours | texte | non | lien « Utiliser un code de secours » qui remplace les 6 cases |

## Actions (ce que fait chaque clic)

- **Valider** : vérifie le code ; succès → écran demandé.
- **Utiliser un code de secours** : bascule vers un champ unique ; le code utilisé est invalidé.
- **Retour à la connexion** : annule et revient à `core.login`.
- Activation : **Télécharger les codes de secours** (fichier texte) puis **J'ai noté mes codes** (obligatoire pour terminer). Les codes de secours sont conservés **hachés**, à usage unique, contrôlés par le serveur.
- **Désactiver** (profil) : demande le mot de passe **et** un code du second facteur ; impossible pour un administrateur et pour les rôles où l'entreprise l'a rendue obligatoire (`core.settings-security`), que la connexion impose alors comme pour les administrateurs. Activation et désactivation inscrites au journal, avec e-mail d'alerte au titulaire.
- **Téléphone perdu** : un autre administrateur réinitialise le second facteur de l'utilisateur ; opération journalisée et e-mail d'alerte au titulaire ; l'utilisateur doit l'activer à nouveau à la connexion suivante. **Administrateur unique** : la réinitialisation passe par l'éditeur (console éditeur, lot 12) après vérification d'identité, avec journal et e-mail au titulaire.

## États

- **Vide** : cases vides, focus sur la première.
- **Chargement** : bouton désactivé « Vérification… ».
- **Erreur** : « Code incorrect ou expiré » ; cases vidées ; après 5 essais, la session à moitié ouverte est **fermée par le serveur**, retour à la connexion, échecs comptés dans le verrouillage du compte et inscrits au journal des accès.
- **Hors ligne** : « Vérification impossible sans réseau. »

## Droits nécessaires

- Utilisateur en cours de connexion (aucun droit métier).

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

ENF-SEC-02, SEC-MO-04, ENF-TRA-02.

## Version mobile (390 px)

- Cases de 44 px minimum ; clavier numérique ; variante Activer : toujours le code QR **et** la clé à copier (on ne peut pas savoir si l'application d'authentification est sur le même appareil).

## Textes fr / en

Principaux textes de l'écran (fichiers de traduction `packages/i18n`).

| Français | English |
|---|---|
| Vérification en deux étapes | Two-step verification |
| Saisissez le code à 6 chiffres de votre application d'authentification. | Enter the 6-digit code from your authenticator app. |
| Valider | Verify |
| Utiliser un code de secours | Use a backup code |
| Code incorrect ou expiré. | Incorrect or expired code. |
| Activer la double authentification | Turn on two-step verification |
| J'ai noté mes codes de secours | I have saved my backup codes |

## À trancher par la cheffe de projet

Rien : pas de SMS (décision du 26/11/2026) ; application d'authentification, e-mail en secours.

## À ne pas reproduire

- Logo, couleurs (vert), textes et illustrations de DreamsERP : remplacés par l'identité Smart Collab (or, bleu marine, Inter) et des textes propres.
- Code envoyé par e-mail comme seul second facteur : on privilégie une application d'authentification (TOTP), l'e-mail sert à la récupération.

## Propre au client fondateur → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
