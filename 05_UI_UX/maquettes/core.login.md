# core.login — Connexion

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `login` |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | — |

## Captures de référence

- [DreamsERP 17_Pages-authentification-erreurs/02_login-illustration.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/17_Pages-authentification-erreurs/02_login-illustration.png) — Connexion avec illustration
- [DreamsERP 17_Pages-authentification-erreurs/01_login-cover.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/17_Pages-authentification-erreurs/01_login-cover.png) — Connexion plein cadre

Référence visuelle seulement : la maquette Smart Collab reprend la disposition, pas le logo, les couleurs ni les textes de DreamsERP.

## Zones de l'écran

- Panneau gauche (≥ 1 024 px) : fond dégradé bleu marine (`--nav-1` → `--nav-2`), logo et nom de l'entreprise cliente si connus, phrase d'accueil courte. Masqué sur téléphone.
- Panneau droit : logo Smart Collab, titre « Connexion », formulaire, lien « Mot de passe oublié ? », choix de la langue FR / EN en haut à droite.
- Pied : mention de version et lien vers l'aide (lot 11).

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| E-mail | e-mail | oui | format vérifié avant envoi ; espaces retirés |
| Mot de passe | mot de passe | oui | bouton œil pour l'afficher ; majuscules verrouillées signalées |
| Rester connecté sur cet appareil | case à cocher | non | durée de session réglable par l'entreprise (ENF-SEC-02) |

## Actions (ce que fait chaque clic)

- **Se connecter** : vérifie l'e-mail et le mot de passe (Supabase Auth). Si la double authentification est active → `core.two-factor`. Sinon → dernier écran ouvert, ou l'assistant de première configuration si l'entreprise n'est pas encore configurée.
- **Mot de passe oublié ?** → `core.forgot-password`.
- **FR / EN** : change la langue de l'écran (cookie), sans recharger le formulaire.

## États

- **Vide** : formulaire vierge, focus sur l'e-mail.
- **Chargement** : bouton « Connexion… » désactivé avec indicateur ; champs verrouillés.
- **Erreur** : message unique « E-mail ou mot de passe incorrect » (ne dit jamais lequel des deux est faux) ; après N échecs (réglable, 5 par défaut) : « Compte verrouillé pendant 15 minutes » et e-mail d'alerte à l'utilisateur. Chaque échec est inscrit au journal des accès (ENF-TRA-02).
- **Hors ligne** : « Connexion impossible sans réseau. » Exception : sur un poste de caisse déjà connecté, la session locale reste ouverte jusqu'à la durée maximale hors ligne (EF-OFF-02).

## Droits nécessaires

- Aucun (écran public).

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

ENF-SEC-02, ENF-TRA-02, SEC-MO-04, SEC-MO-07 (limitation des tentatives).

## Version mobile (390 px)

- Panneau gauche masqué ; formulaire pleine largeur avec marges de 16 px ; clavier e-mail sur le premier champ.

## Textes fr / en

Principaux textes de l'écran (fichiers de traduction `packages/i18n`).

| Français | English |
|---|---|
| Connexion | Sign in |
| E-mail | Email |
| Mot de passe | Password |
| Mot de passe oublié ? | Forgot password? |
| Rester connecté sur cet appareil | Stay signed in on this device |
| Se connecter | Sign in |
| E-mail ou mot de passe incorrect. | Incorrect email or password. |
| Compte verrouillé pendant {minutes} minutes. | Account locked for {minutes} minutes. |
| Connexion impossible sans réseau. | Cannot sign in without a network connection. |

## À ne pas reproduire

- Lien « Sign up » (inscription libre) : les comptes sont créés par l'administrateur de l'entreprise ; l'essai en ligne relève du site commercial (lot 12).
- Logo, couleurs (vert), textes et illustrations de DreamsERP : remplacés par l'identité Smart Collab (or, bleu marine, Inter) et des textes propres.
- Message d'erreur qui indique si l'e-mail existe : fuite d'information.

## Propre à RUTHY'S → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
