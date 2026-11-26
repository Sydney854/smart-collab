# core.profile — Mon profil

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `profile` |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | — |

## Captures de référence

- [DreamsERP mode-clair/11_Point-de-vente/04_profile.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/11_Point-de-vente/04_profile.png) — Profil
- [DreamsERP mode-clair/11_Point-de-vente/02_edit-profile.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/11_Point-de-vente/02_edit-profile.png) — Modifier le profil
- [DreamsERP mode-sombre/16_Systeme/12_security-settings_popup-change-password.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-sombre/16_Systeme/12_security-settings_popup-change-password.png) — Changer le mot de passe

Référence visuelle seulement : la maquette Smart Collab reprend la disposition, pas le logo, les couleurs ni les textes de DreamsERP.

## Zones de l'écran

- En-tête : avatar (initiales ou photo), nom, rôle, entreprise, dernier accès.
- **Identité** : nom, prénom, téléphone, photo (l'e-mail est affiché, modifiable seulement par l'administrateur).
- **Préférences** : langue (FR / EN, ENF-USA-02), mode d'affichage du menu (Liste / Mosaïque), lien vers Paramètres → Apparence.
- **Sécurité** : changer le mot de passe ; activer ou désactiver la double authentification (`core.two-factor`) ; sessions ouvertes (appareil, lieu approximatif, dernière activité) avec **Fermer cette session** et **Fermer toutes les autres**.

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Nom, prénom | texte | oui |  |
| Téléphone | téléphone | non | format international |
| Photo | fichier | non | PNG, JPEG ou WebP, ≤ 2 Mo, contrôlé par le serveur |
| Langue | liste | oui | français ou anglais |
| Mot de passe actuel | mot de passe | oui (pour changer) |  |
| Nouveau mot de passe | mot de passe | oui (pour changer) | règles de Paramètres → Sécurité |

## Actions (ce que fait chaque clic)

- **Enregistrer** (identité, préférences) : appliqué tout de suite ; journal d'audit.
- **Changer le mot de passe** : fenêtre ; exige le mot de passe actuel ; ferme les autres sessions ; e-mail d'alerte.
- **Double authentification** : ouvre l'activation (`core.two-factor`) ; désactivation impossible pour un administrateur.
- **Fermer une session** : déconnecte l'appareil concerné au serveur.

## États

- **Vide** : champs facultatifs vides.
- **Chargement** : squelette des sections.
- **Erreur** : message sous le champ ; mot de passe actuel incorrect compté dans le verrouillage du compte.
- **Hors ligne** : consultation seule ; « Connexion nécessaire » pour enregistrer.

## Droits nécessaires

- Chacun pour son propre profil (aucun droit particulier) ; l'e-mail et le rôle ne sont modifiables que par core.user.manage.

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

ENF-SEC-02, SEC-MO-04, ENF-USA-02, ENF-TRA-02.

## Version mobile (390 px)

- Sections en accordéon ; sessions en cartes.

## Textes fr / en

Principaux textes de l'écran (fichiers de traduction `packages/i18n`).

| Français | English |
|---|---|
| Mon profil | My profile |
| Identité | Identity |
| Préférences | Preferences |
| Sécurité | Security |
| Changer le mot de passe | Change password |
| Sessions ouvertes | Active sessions |
| Fermer toutes les autres | Sign out all other sessions |
| Enregistrer | Save |

## À ne pas reproduire

- Logo, couleurs (vert), textes et illustrations de DreamsERP : remplacés par l'identité Smart Collab (or, bleu marine, Inter) et des textes propres.
- Modification de son propre e-mail ou de son rôle depuis le profil.

## Propre à RUTHY'S → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
