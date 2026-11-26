# core.shell — Cadre général (menu à 2 modes, onglets, en-tête)

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `shell` |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | M-01 à M-16 (page de maquettes) ; code de démonstration : `src/packages/ui/src/components/AppShell.tsx` |

## Captures de référence

Aucune capture (écran propre à Smart Collab) : voir la maquette Smart Collab ci-dessus.

## Zones de l'écran

- **En-tête** : en mode Liste, bouton du menu et fil d'Ariane ; en mode Mosaïque, logo et nom de l'entreprise. Puis recherche globale, bouton Liste / Mosaïque, FR / EN, clair / sombre, palette de couleur, notifications, menu utilisateur (en Mosaïque).
- **Mode Liste** : menu latéral bleu marine (240 px, réductible en icônes), applications installées seulement (EF-APP-04), écran actif en or ; utilisateur en bas du menu.
- **Mode Mosaïque** : tuiles des applications installées (icônes illustrées, `ICONES_MODULES.md`) ; chaque écran s'ouvre dans une fenêtre déplaçable, redimensionnable, agrandissable et réductible ; plein écran sur téléphone ; 6 écrans ouverts au maximum.
- **Barre d'onglets** : écrans ouverts (Liste) ou fenêtres (Mosaïque), fenêtres réduites en italique.
- **Bandeau hors ligne** (`OfflineBanner`) sous les onglets : en ligne / hors ligne + nombre d'opérations en attente (EF-OFF-01).
- **Panneau des notifications** (cloche) : vide au lot 1 (« Aucune notification »), alimenté par les lots suivants.

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Recherche globale | texte | non | cherche dans les applications installées seulement (EF-APP-04) ; résultats groupés par application ; Entrée ouvre le premier résultat |

## Actions (ce que fait chaque clic)

- Clic sur un module (menu ou tuile) : ouvre l'écran (onglet ou fenêtre) ; l'adresse suit l'écran courant.
- Bouton **Liste / Mosaïque** : change de mode ; choix retenu par utilisateur (navigateur, puis profil au lot 1).
- Menu utilisateur : **Mon profil**, **Paramètres** (si droit), **Verrouiller** (→ `core.lock-screen`), **Se déconnecter**.
- Cloche : ouvre le panneau des notifications.

## États

- **Vide** : entreprise sans application installée : seuls Tableau de bord, Applications et Paramètres apparaissent.
- **Chargement** : squelette du menu et de l'en-tête pendant la lecture de la session.
- **Erreur** : session expirée : `core.lock-screen` ; droits retirés pendant la session : l'écran concerné affiche la 403 au prochain chargement.
- **Hors ligne** : bandeau « Hors ligne » ; écrans non disponibles hors ligne marqués d'un pictogramme dans le menu (§9).

## Droits nécessaires

- Menu filtré par les droits de l'utilisateur ET par les applications installées : un écran sans droit n'apparaît pas (et sa page renvoie 403 côté serveur, ENF-SEC-03).

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-APP-04, EF-OFF-01, ENF-USA-01, ENF-USA-02, décisions du 25/11/2026 (2 modes) et du 26/11/2026 (icônes).

## Version mobile (390 px)

- Menu ouvert par-dessus la page ; logo seul dans l'en-tête de la Mosaïque ; bouton clair / sombre dans la palette.

## Textes fr / en

Principaux textes de l'écran (fichiers de traduction `packages/i18n`).

| Français | English |
|---|---|
| Rechercher dans Smart Collab… | Search Smart Collab… |
| Mode Liste | List mode |
| Mode Mosaïque | Mosaic mode |
| Applications | Apps |
| Aucune notification | No notifications |
| Verrouiller | Lock |
| Se déconnecter | Sign out |
| En ligne — tout est synchronisé | Online — everything is synced |

## À ne pas reproduire

- Menu qui montre des modules non installés ou non autorisés.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre à RUTHY'S → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
