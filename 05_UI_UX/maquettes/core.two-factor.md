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

- [DreamsERP 17_Pages-authentification-erreurs/15_email-verification.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/17_Pages-authentification-erreurs/15_email-verification.png) — Saisie d'un code à 6 chiffres (même présentation)

Référence visuelle seulement : la maquette Smart Collab reprend la disposition, pas le logo, les couleurs ni les textes de DreamsERP.

## Zones de l'écran

- Carte centrée : logo, titre, explication courte, 6 cases de code, bouton Valider.
- Variante « Activer la double authentification » (depuis le profil, obligatoire pour les administrateurs, SEC-MO-04) : code QR à scanner avec une application d'authentification, clé à saisir à la main, puis 6 cases de confirmation, puis 8 codes de secours à conserver.

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Code | 6 chiffres | oui | une case par chiffre ; collage d'un code complet accepté ; validation automatique au 6ᵉ chiffre |
| Code de secours | texte | non | lien « Utiliser un code de secours » qui remplace les 6 cases |

## Actions (ce que fait chaque clic)

- **Valider** : vérifie le code ; succès → écran demandé.
- **Utiliser un code de secours** : bascule vers un champ unique ; le code utilisé est invalidé.
- **Retour à la connexion** : annule et revient à `core.login`.
- Activation : **Télécharger les codes de secours** (fichier texte) puis **J'ai noté mes codes** (obligatoire pour terminer).

## États

- **Vide** : cases vides, focus sur la première.
- **Chargement** : bouton désactivé « Vérification… ».
- **Erreur** : « Code incorrect ou expiré » ; cases vidées ; après 5 essais, retour à la connexion et inscription au journal des accès.
- **Hors ligne** : « Vérification impossible sans réseau. »

## Droits nécessaires

- Utilisateur en cours de connexion (aucun droit métier).

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

ENF-SEC-02, SEC-MO-04, ENF-TRA-02.

## Version mobile (390 px)

- Cases de 44 px minimum ; clavier numérique ; code QR remplacé par la clé à copier si l'écran est le même appareil que l'application d'authentification.

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

## À ne pas reproduire

- Logo, couleurs (vert), textes et illustrations de DreamsERP : remplacés par l'identité Smart Collab (or, bleu marine, Inter) et des textes propres.
- Code envoyé par e-mail comme seul second facteur : on privilégie une application d'authentification (TOTP), l'e-mail sert à la récupération.

## Propre à RUTHY'S → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
