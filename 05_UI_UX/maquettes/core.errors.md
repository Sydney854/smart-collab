# core.errors — Pages d'erreur (403, 404, 500)

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `errors` |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | — |

## Captures de référence

- [DreamsERP 17_Pages-authentification-erreurs/16_error-404.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/17_Pages-authentification-erreurs/16_error-404.png) — Page introuvable
- [DreamsERP 17_Pages-authentification-erreurs/17_error-500.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/17_Pages-authentification-erreurs/17_error-500.png) — Erreur du serveur

Référence visuelle seulement : la maquette Smart Collab reprend la disposition, pas le logo, les couleurs ni les textes de DreamsERP.

## Zones de l'écran

- Dans le cadre de l'application si l'utilisateur est connecté (menu et en-tête visibles), sinon page seule : grand numéro d'erreur discret, titre, explication en une phrase, bouton principal, référence technique à communiquer au support (500).

## Champs et filtres

Aucun champ de saisie.

## Actions (ce que fait chaque clic)

- **403 — Accès refusé** (ex. un caissier ouvre l'adresse de Paramètres, démo du lot 1) : « Vous n'avez pas accès à cet écran » ; bouton **Retour au tableau de bord**. L'écran ne révèle rien de son contenu ; la tentative est inscrite au journal des accès.
- **404 — Page introuvable** : bouton **Retour au tableau de bord**.
- **500 — Erreur** : bouton **Réessayer** ; référence de l'erreur copiable (l'erreur est envoyée au suivi, sans données personnelles).

## États

- **Vide** : sans objet.
- **Chargement** : sans objet.
- **Erreur** : c'est l'écran lui-même.
- **Hors ligne** : le bandeau « Hors ligne » remplace la 500 si la cause est le réseau.

## Droits nécessaires

- Aucun.

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

ENF-SEC-03 (accès refusé côté serveur), ENF-TRA-02, démo du lot 1 (caissier et Paramètres).

## Version mobile (390 px)

- Mêmes contenus, illustration réduite.

## Textes fr / en

Principaux textes de l'écran (fichiers de traduction `packages/i18n`).

| Français | English |
|---|---|
| Vous n'avez pas accès à cet écran. | You don't have access to this screen. |
| Cette page n'existe pas ou a été déplacée. | This page doesn't exist or has moved. |
| Un problème est survenu. Réessayez dans un instant. | Something went wrong. Please try again in a moment. |
| Retour au tableau de bord | Back to the dashboard |
| Réessayer | Try again |
| Référence : {ref} | Reference: {ref} |

## À ne pas reproduire

- Logo, couleurs (vert), textes et illustrations de DreamsERP : remplacés par l'identité Smart Collab (or, bleu marine, Inter) et des textes propres.
- Écran d'erreur technique qui affiche une pile d'appels ou un message brut du serveur.

## Propre à RUTHY'S → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
