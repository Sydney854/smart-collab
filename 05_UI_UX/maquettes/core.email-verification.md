# core.email-verification — Vérification de l'e-mail

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `email-verification` |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | — |

## Captures de référence

- [DreamsERP mode-clair/17_Pages-authentification-erreurs/15_email-verification.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/17_Pages-authentification-erreurs/15_email-verification.png) — Code à 6 chiffres
- [DreamsERP mode-clair/17_Pages-authentification-erreurs/14_email-verification-illustration.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/17_Pages-authentification-erreurs/14_email-verification-illustration.png) — Avec illustration

Référence visuelle seulement : la maquette Smart Collab reprend la disposition, pas le logo, les couleurs ni les textes de DreamsERP.

## Zones de l'écran

- Carte centrée : logo, titre, adresse concernée (masquée en partie : a•••@example.com), 6 cases de code, bouton, lien de renvoi.

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Code | 6 chiffres | oui | reçu par e-mail ; valable 15 minutes |

## Actions (ce que fait chaque clic)

- **Vérifier** : confirme l'adresse ; succès → première connexion (choix du mot de passe si compte créé par l'administrateur, puis assistant si l'entreprise n'est pas configurée).
- **Renvoyer le code** : disponible après 60 secondes (compte à rebours affiché) ; le délai et le nombre de renvois (5 par heure) sont **appliqués par le serveur**, pas seulement par l'écran ; contrôle anti-robot (SEC-MO-04).
- Invitations envoyées par l'administrateur : lien valable 72 heures, à usage unique ; plafond d'invitations par heure et par entreprise appliqué par le serveur. *Valeurs : propositions à valider.*

## États

- **Vide** : cases vides.
- **Chargement** : bouton désactivé.
- **Erreur** : « Code incorrect ou expiré » ; après 5 essais, le code est annulé et un nouveau code est obligatoire.
- **Hors ligne** : « Vérification impossible sans réseau. »

## Droits nécessaires

- Utilisateur invité (aucun droit métier).

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

SEC-MO-04 (vérification de l'e-mail).

## Version mobile (390 px)

- Cases de 44 px minimum ; clavier numérique.

## Textes fr / en

Principaux textes de l'écran (fichiers de traduction `packages/i18n`).

| Français | English |
|---|---|
| Vérifiez votre adresse e-mail | Verify your email address |
| Saisissez le code à 6 chiffres reçu à l'adresse {email}. | Type the 6-digit code we emailed to {email}. |
| Vérifier | Verify |
| Renvoyer le code | Resend code |
| Renvoi possible dans {s} s | Resend available in {s}s |

## À ne pas reproduire

- Logo, couleurs (vert), textes et illustrations de DreamsERP : remplacés par l'identité Smart Collab (or, bleu marine, Inter) et des textes propres.

## Propre à RUTHY'S → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
