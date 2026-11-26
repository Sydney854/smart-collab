# core.settings-security — Paramètres — Sécurité

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `settings-security` |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | — |

## Captures de référence

- [DreamsERP mode-clair/16_Systeme/11_security-settings.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/16_Systeme/11_security-settings.png) — Paramètres de sécurité

Référence visuelle seulement : la maquette Smart Collab reprend la disposition, pas le logo, les couleurs ni les textes de DreamsERP.

## Zones de l'écran

- Carte « Mots de passe » : longueur minimale, refus des mots de passe compromis, durée de validité éventuelle.
- Carte « Connexion » : nombre d'échecs avant verrouillage, durée du verrouillage, durée de session, verrouillage d'écran après inactivité.
- Carte « Double authentification » : obligatoire pour les administrateurs (toujours, non modifiable, SEC-MO-04), proposée ou obligatoire pour les autres rôles.
- Carte « Hors ligne » (si Point de vente installé) : durée maximale de travail hors ligne (EF-OFF-02), code de caisse obligatoire.

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Longueur minimale du mot de passe | nombre | oui | 10 par défaut ; bornes 10 à 64 |
| Refus des mots de passe compromis | oui / non | oui | oui par défaut |
| Durée de validité du mot de passe | jours | non | vide = sans expiration ; 30 à 365 |
| Échecs avant verrouillage | nombre | oui | 5 par défaut ; 3 à 10 |
| Durée du verrouillage | minutes | oui | 15 par défaut ; 5 à 1 440 |
| Durée de session | heures | oui | 8 par défaut ; 1 à 24 |
| Verrouillage après inactivité | minutes | oui | 15 par défaut ; 1 à 60 |
| Double authentification des autres rôles | choix par rôle | oui | proposée / obligatoire |
| Durée maximale hors ligne | heures | oui | 72 par défaut ; 1 à 168 (EF-OFF-02) |
| Code de caisse obligatoire hors ligne | oui / non | oui | oui par défaut ; 8 chiffres minimum |

## Actions (ce que fait chaque clic)

- **Enregistrer** : vérifié et appliqué par le serveur (bornes min / max), journal d'audit avec ancienne et nouvelle valeur (ENF-TRA-01) ; s'applique aux prochaines connexions. Un réglage **plus faible** que le précédent redemande le second facteur avant d'être enregistré.
- Stockage : ces réglages sont **propres à chaque entreprise**, rangés dans sa configuration et appliqués par notre serveur (crochets d'authentification) ; on ne modifie jamais la configuration commune de Supabase Auth, qui toucherait toutes les entreprises.

## États

- **Vide** : valeurs par défaut affichées.
- **Chargement** : squelette.
- **Erreur** : valeur hors bornes : message sous le champ, rien n'est enregistré.
- **Hors ligne** : consultation seule.

## Droits nécessaires

- core.company.configure (administrateur).

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

ENF-SEC-02, SEC-MO-04, EF-OFF-02, ENF-TRA-01.

## Version mobile (390 px)

- Cartes empilées.

## Textes fr / en

Principaux textes de l'écran (fichiers de traduction `packages/i18n`).

| Français | English |
|---|---|
| Sécurité | Security |
| Mots de passe | Passwords |
| Échecs avant verrouillage | Failed attempts before lockout |
| Durée de session | Session length |
| Verrouillage après inactivité | Lock after inactivity |
| Double authentification | Two-step verification |
| Durée maximale hors ligne | Maximum offline time |
| Connexion | Sign-in |
| Hors ligne | Offline |
| Code de caisse obligatoire | Till code required |

## À trancher par la cheffe de projet

Rien : valeurs par défaut validées le 26/11/2026 (10 caractères, 5 échecs, 15 min, 8 h de session, 15 min d'inactivité, 72 h hors ligne), toutes réglables par l'entreprise.

## À ne pas reproduire

- Logo, couleurs (vert), textes et illustrations de DreamsERP : remplacés par l'identité Smart Collab (or, bleu marine, Inter) et des textes propres.
- Possibilité de désactiver la double authentification des administrateurs.

## Propre au client fondateur → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
