# core.lock-screen — Verrouillage d'écran

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `lock-screen` |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | — |

## Captures de référence

- [DreamsERP mode-clair/11_Point-de-vente/03_lock-screen.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/11_Point-de-vente/03_lock-screen.png) — Verrouillage d'écran (caisse)

Référence visuelle seulement : la maquette Smart Collab reprend la disposition, pas le logo, les couleurs ni les textes de DreamsERP.

## Zones de l'écran

- **Voile opaque** (pas un simple flou) sur toute l'application ; carte centrée : avatar et nom de l'utilisateur, champ mot de passe, bouton Déverrouiller, lien « Ce n'est pas moi ».
- À **chaque** verrouillage (inactivité ou session expirée), les données affichées sont retirées de la page et la session est **suspendue côté serveur** jusqu'au déverrouillage ; seules les saisies en cours sont gardées sur l'appareil (chiffrées), puis restituées.
- Lien « Mot de passe oublié ? » sous le bouton ; sur un poste de caisse hors ligne, le champ mot de passe est remplacé par le **code de caisse**.

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Mot de passe | mot de passe | oui |  |
| Code de caisse | code chiffré | oui (caisse hors ligne) | 8 chiffres minimum ; créé et réinitialisé dans `core.profile` ; ne sert pas seul de clé de chiffrement des données locales |

## Actions (ce que fait chaque clic)

- **Déverrouiller** : c'est une **vraie reconnexion vérifiée par le serveur** (mot de passe, puis second facteur si le compte l'a) ; l'écran revient tel qu'il était (fenêtres, onglets, saisies en cours).
- **Mot de passe oublié ?** : déconnexion complète puis `core.forgot-password`.
- **Ce n'est pas moi** : déconnexion complète, retour à `core.login` ; les données locales hors ligne sont effacées sauf la file non envoyée (EF-OFF-03).
- Déclenchement : après une inactivité réglable par l'entreprise (15 minutes par défaut), ou par le menu utilisateur « Verrouiller ».

## États

- **Vide** : champ vide, focus.
- **Chargement** : bouton désactivé.
- **Erreur** : mot de passe incorrect : message ; après 5 échecs (limite appliquée par le serveur, comptée avec celle de la connexion), déconnexion complète et inscription au journal des accès.
- **Hors ligne** : sur un poste de caisse : déverrouillage par un **code de caisse distinct du mot de passe** (jamais le mot de passe), conservé haché par une fonction lente ; 5 essais, puis effacement des données locales sauf la file non envoyée ; uniquement tant que la durée maximale hors ligne n'est pas atteinte (EF-OFF-02). Les données locales restent chiffrées (EF-OFF-03, SEC-MO-11). Ailleurs : « Déverrouillage impossible sans réseau ».

## Droits nécessaires

- Utilisateur dont la session est verrouillée.

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

ENF-SEC-02 (durée de session), SEC-MO-04, SEC-MO-11, EF-OFF-02, EF-OFF-03, ENF-TRA-02.

## Version mobile (390 px)

- Carte pleine largeur ; même comportement.

## Textes fr / en

Principaux textes de l'écran (fichiers de traduction `packages/i18n`).

| Français | English |
|---|---|
| Session verrouillée | Session locked |
| Saisissez votre mot de passe pour reprendre. | Enter your password to continue. |
| Déverrouiller | Unlock |
| Ce n'est pas moi | Not me |
| Verrouiller | Lock |
| Mot de passe oublié ? | Forgot password? |
| Code de caisse | Till code |

## À ne pas reproduire

- Logo, couleurs (vert), textes et illustrations de DreamsERP : remplacés par l'identité Smart Collab (or, bleu marine, Inter) et des textes propres.
- Contenu simplement flouté derrière la carte : voile opaque (contrôle de sécurité du 26/11/2026).

## Propre à RUTHY'S → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
