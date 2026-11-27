# core.invitation — Création de compte par invitation

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `invitation` (envoi : dans `core.users` ; acceptation : écran public) |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | à publier dans la page de maquettes (lot 1, étape 2) |

## Principe (décisions L1 et L4 du 26/11/2026)

Pas d'inscription libre : une personne n'entre dans une entreprise que **sur invitation d'un administrateur** de cette entreprise. Une personne = un seul compte de connexion ; elle peut être invitée dans plusieurs entreprises (comptable externe, par exemple).

## Captures de référence

- [DreamsERP mode-clair/17_Pages-authentification-erreurs/02_login-illustration.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/17_Pages-authentification-erreurs/02_login-illustration.png) — même disposition que la connexion (panneau bleu marine + formulaire)

Référence visuelle seulement.

## Zones de l'écran

**1. Inviter (dans `core.users`, bouton « Inviter une personne », administrateur seulement)** : fenêtre avec e-mail, nom complet, rôle (liste des rôles de l'entreprise), langue ; récapitulatif « Une invitation valable 7 jours sera envoyée à … ».

**2. Accepter (écran public ouvert depuis le lien de l'e-mail)** : même disposition que `core.login`. Panneau gauche : nom de l'entreprise qui invite. Panneau droit :
- **personne sans compte** : « Vous êtes invité(e) à rejoindre {entreprise} », e-mail affiché (non modifiable), nom complet (prérempli, modifiable), mot de passe et confirmation (règles de `core.settings-security` : 10 caractères au moins par défaut), case « J'accepte les conditions d'utilisation » ;
- **personne qui a déjà un compte** : « Connectez-vous pour rejoindre {entreprise} » → connexion habituelle, puis l'entreprise s'ajoute à ses entreprises.

## Champs

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| E-mail (invitation) | e-mail | oui | une invitation en cours par e-mail et par entreprise ; refus si la personne est déjà membre active |
| Nom complet | texte | oui | 2 à 120 caractères |
| Rôle | liste | oui | rôles actifs de l'entreprise ; le rôle « administrateur » demande la double authentification à la première connexion (SEC-MO-04) |
| Langue | liste | oui | fr / en, par défaut celle de l'entreprise |
| Mot de passe (acceptation) | mot de passe | oui | règles de l'entreprise ; jauge de solidité ; bouton œil |
| Confirmation | mot de passe | oui | identique au mot de passe |

## Actions

- **Envoyer l'invitation** : vérifié par le serveur (administrateur de l'entreprise courante, rôle lu dans la session) ; crée l'invitation (lien à usage unique, valable 7 jours, seul un **condensé** du lien est gardé en base), envoie l'e-mail, écrit dans le journal d'audit.
- **Renvoyer / Annuler** (liste des invitations en cours dans `core.users`) : renvoyer crée un nouveau lien et invalide l'ancien ; annuler rend le lien inutilisable ; les deux sont tracés.
- **Créer mon compte et rejoindre** : crée le compte de connexion, la fiche personne, l'appartenance à l'entreprise et le rôle **dans une seule opération** (tout ou rien) ; invitation marquée « acceptée » ; connexion ouverte sur l'entreprise ; écrit dans le journal d'audit et le journal des accès.
- **Rejoindre** (compte existant, après connexion avec le même e-mail) : ajoute l'appartenance et le rôle ; si la personne a désormais plusieurs entreprises, l'écran de choix (`core.select-company`) apparaît aux connexions suivantes.

## États

- **Lien expiré, déjà utilisé ou annulé** : « Cette invitation n'est plus valable. Demandez une nouvelle invitation à l'administrateur de votre entreprise. » (même message dans les trois cas).
- **Connecté avec un autre e-mail** : « Cette invitation est destinée à une autre adresse. Déconnectez-vous puis ouvrez de nouveau le lien. »
- **Entreprise suspendue** : même message que le lien expiré (aucune information sur l'état de l'entreprise).
- **Chargement / erreur réseau** : comme `core.login`.

## Droits nécessaires

- Inviter, renvoyer, annuler : permission `core.users.invite` (administrateur par défaut).
- Accepter : aucun (écran public) ; le lien seul ne donne aucun accès tant que le compte n'est pas créé ou la connexion faite.

## Exigences couvertes

ENF-SEC-02, ENF-TRA-01, ENF-TRA-02, SEC-MO-03, SEC-MO-04, EF-GEN-01 (tout ou rien), EF-GEN-03 (audit).

## Version mobile (390 px)

- Comme `core.login` : panneau gauche masqué, formulaire pleine largeur.

## Textes fr / en

| Français | English |
|---|---|
| Inviter une personne | Invite someone |
| Une invitation valable 7 jours sera envoyée à {email}. | An invitation valid for 7 days will be sent to {email}. |
| Vous êtes invité(e) à rejoindre {entreprise} | You are invited to join {company} |
| Créer mon compte et rejoindre | Create my account and join |
| Connectez-vous pour rejoindre {entreprise} | Sign in to join {company} |
| Cette invitation n'est plus valable. Demandez une nouvelle invitation à l'administrateur de votre entreprise. | This invitation is no longer valid. Ask your company administrator for a new invitation. |
| Cette invitation est destinée à une autre adresse. | This invitation is meant for another address. |

## À ne pas reproduire

- Inscription libre (« Sign up ») : interdite dans l'application ; l'essai en ligne relève du site commercial (lot 12).
- Lien d'invitation gardé en clair en base, ou réutilisable.
- Message qui révèle si un e-mail a déjà un compte.

## Propre au client fondateur → réglages du moteur de configuration

Rien : écran générique. Durée de validité (7 jours) proposée comme réglage de sécurité de l'entreprise.
