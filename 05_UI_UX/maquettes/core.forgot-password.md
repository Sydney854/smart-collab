# core.forgot-password — Mot de passe oublié

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `forgot-password` |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | — |

## Captures de référence

- [DreamsERP mode-clair/17_Pages-authentification-erreurs/08_forgot-password-illustration.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/17_Pages-authentification-erreurs/08_forgot-password-illustration.png) — Mot de passe oublié avec illustration
- [DreamsERP mode-clair/17_Pages-authentification-erreurs/09_forgot-password.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/17_Pages-authentification-erreurs/09_forgot-password.png) — Mot de passe oublié en carte

Référence visuelle seulement : la maquette Smart Collab reprend la disposition, pas le logo, les couleurs ni les textes de DreamsERP.

## Zones de l'écran

- Même mise en page que `core.login` (panneau dégradé + formulaire), titre « Mot de passe oublié », un champ, un bouton, lien de retour.

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| E-mail | e-mail | oui | format vérifié |

## Actions (ce que fait chaque clic)

- **Recevoir le lien** : envoie un lien de réinitialisation valable 1 heure (Supabase Auth). Le message de confirmation est **le même que l'adresse existe ou non**.
- **Retour à la connexion** → `core.login`.
- Protection contre les robots : contrôle anti-robot et limitation des demandes par adresse réseau et par adresse e-mail, appliqués par le serveur (SEC-MO-04, SEC-MO-07).

## États

- **Vide** : champ vide.
- **Chargement** : bouton désactivé « Envoi… ».
- **Erreur** : e-mail mal formé : message sous le champ ; trop de demandes : « Réessayez dans quelques minutes » (limitation, SEC-MO-07).
- **Hors ligne** : « Envoi impossible sans réseau. »

## Droits nécessaires

- Aucun (écran public).

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

ENF-SEC-02, SEC-MO-04, SEC-MO-07.

## Version mobile (390 px)

- Panneau gauche masqué.

## Textes fr / en

Principaux textes de l'écran (fichiers de traduction `packages/i18n`).

| Français | English |
|---|---|
| Mot de passe oublié | Forgot password |
| Saisissez votre e-mail : nous vous enverrons un lien pour choisir un nouveau mot de passe. | Enter your email: we will send you a link to choose a new password. |
| Recevoir le lien | Send the link |
| Si un compte existe pour cette adresse, un e-mail vient de lui être envoyé. | If an account exists for this address, an email has just been sent. |
| Retour à la connexion | Back to sign in |

## À ne pas reproduire

- Logo, couleurs (vert), textes et illustrations de DreamsERP : remplacés par l'identité Smart Collab (or, bleu marine, Inter) et des textes propres.
- Message différent selon que l'adresse existe ou non.

## Propre à RUTHY'S → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
