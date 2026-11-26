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

Aucune capture : écran à concevoir selon cette fiche.

## Zones de l'écran

- Voile flouté sur l'application en cours (le contenu reste en place mais illisible) ; carte centrée : avatar et nom de l'utilisateur, champ mot de passe, bouton Déverrouiller, lien « Ce n'est pas moi » .

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Mot de passe | mot de passe | oui |  |

## Actions (ce que fait chaque clic)

- **Déverrouiller** : vérifie le mot de passe et rend l'écran tel qu'il était (fenêtres, onglets, saisies en cours conservés).
- **Ce n'est pas moi** : déconnexion complète, retour à `core.login` ; les données locales hors ligne sont effacées sauf la file non envoyée (EF-OFF-03).
- Déclenchement : après une inactivité réglable par l'entreprise (15 minutes par défaut), ou par le menu utilisateur « Verrouiller ».

## États

- **Vide** : champ vide, focus.
- **Chargement** : bouton désactivé.
- **Erreur** : mot de passe incorrect : message ; après N échecs, déconnexion complète et inscription au journal des accès.
- **Hors ligne** : sur un poste de caisse : déverrouillage par mot de passe vérifié localement tant que la durée maximale hors ligne n'est pas atteinte (EF-OFF-02) ; ailleurs : « Déverrouillage impossible sans réseau ».

## Droits nécessaires

- Utilisateur dont la session est verrouillée.

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

ENF-SEC-02 (durée de session), EF-OFF-02, EF-OFF-03, ENF-TRA-02.

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

## À ne pas reproduire

- Pas de capture de référence (absent du prototype et de DreamsERP) : écran à concevoir selon cette fiche.

## Propre à RUTHY'S → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
