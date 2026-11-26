# core.reset-password — Nouveau mot de passe

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `reset-password` |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | — |

## Captures de référence

- [DreamsERP mode-clair/17_Pages-authentification-erreurs/11_reset-password-illustration.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/17_Pages-authentification-erreurs/11_reset-password-illustration.png) — Réinitialisation avec illustration
- [DreamsERP mode-clair/17_Pages-authentification-erreurs/12_reset-password.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/17_Pages-authentification-erreurs/12_reset-password.png) — Réinitialisation en carte

Référence visuelle seulement : la maquette Smart Collab reprend la disposition, pas le logo, les couleurs ni les textes de DreamsERP.

## Zones de l'écran

- Même mise en page que `core.login`, deux champs, indicateur de force et règles du mot de passe affichées en clair.
- Variante **« Choisissez votre mot de passe »** : premier mot de passe d'un compte créé par l'administrateur (lien d'invitation), même écran avec un titre et un texte d'accueil différents.

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Nouveau mot de passe | mot de passe | oui | 10 caractères minimum (réglable par l'entreprise, ENF-SEC-02) ; refus des mots de passe connus comme compromis |
| Confirmation | mot de passe | oui | identique au premier |

## Actions (ce que fait chaque clic)

- **Enregistrer** : change le mot de passe, ferme toutes les autres sessions de l'utilisateur, inscrit l'événement au journal d'audit (`audit_log`), envoie l'e-mail « Votre mot de passe a été modifié » (avec le lien « Ce n'était pas moi »), puis ouvre `core.login` avec le message « Mot de passe modifié ». Lien de réinitialisation à usage unique, valable 1 heure.

## États

- **Vide** : deux champs vides, règles affichées en gris.
- **Chargement** : bouton désactivé.
- **Erreur** : lien expiré ou déjà utilisé : message et bouton « Demander un nouveau lien » ; règles non respectées : la règle manquante passe en rouge.
- **Hors ligne** : « Enregistrement impossible sans réseau. »

## Droits nécessaires

- Détenteur d'un lien valide (aucun droit métier).

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

ENF-SEC-02, ENF-TRA-02, SEC-MO-04.

## Version mobile (390 px)

- Panneau gauche masqué.

## Textes fr / en

Principaux textes de l'écran (fichiers de traduction `packages/i18n`).

| Français | English |
|---|---|
| Nouveau mot de passe | New password |
| Confirmez le mot de passe | Confirm password |
| Au moins {n} caractères | At least {n} characters |
| Enregistrer | Save |
| Ce lien a expiré. | This link has expired. |
| Demander un nouveau lien | Request a new link |
| Mot de passe modifié. | Password changed. |

## À ne pas reproduire

- Logo, couleurs (vert), textes et illustrations de DreamsERP : remplacés par l'identité Smart Collab (or, bleu marine, Inter) et des textes propres.

## Propre au client fondateur → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
