# core.shell — Cadre général (menu à 2 modes, onglets ou fenêtres, en-tête)

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `shell` |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | M-01 à M-16 (page de maquettes du lot 0, adresse dans 00_GOUVERNANCE/PASSATION.md) ; code de démonstration : `src/packages/ui/src/components/AppShell.tsx` |

## Captures de référence

- [DreamsERP mode-sombre/00_Interface-commune-en-tete-et-menu/01_recherche.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-sombre/00_Interface-commune-en-tete-et-menu/01_recherche.png) — Recherche
- [DreamsERP mode-sombre/00_Interface-commune-en-tete-et-menu/02_societe-menu.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-sombre/00_Interface-commune-en-tete-et-menu/02_societe-menu.png) — Changement de société
- [DreamsERP mode-sombre/00_Interface-commune-en-tete-et-menu/05_notifications.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-sombre/00_Interface-commune-en-tete-et-menu/05_notifications.png) — Notifications
- [DreamsERP mode-sombre/00_Interface-commune-en-tete-et-menu/06_profil.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-sombre/00_Interface-commune-en-tete-et-menu/06_profil.png) — Menu du profil
- [DreamsERP mode-sombre/00_Interface-commune-en-tete-et-menu/07_menu-reduit.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-sombre/00_Interface-commune-en-tete-et-menu/07_menu-reduit.png) — Menu réduit

Référence visuelle seulement : la maquette Smart Collab reprend la disposition, pas le logo, les couleurs ni les textes de DreamsERP.

## Zones de l'écran

- **En-tête** : en mode Liste, bouton du menu et fil d'Ariane ; en mode Mosaïque, logo et nom de l'entreprise. Puis recherche globale, bouton Liste / Mosaïque, FR / EN, clair / sombre, palette de couleur, notifications, menu utilisateur (en Mosaïque).
- **Mode Liste** : menu latéral bleu marine (240 px, réductible en icônes), applications installées seulement (EF-APP-04), écran actif en or ; utilisateur en bas du menu.
- **Mode Mosaïque** : tuiles des applications installées (icônes illustrées, `ICONES_MODULES.md`) ; chaque écran s'ouvre dans une fenêtre déplaçable, redimensionnable, agrandissable et réductible ; plein écran sur téléphone ; 6 écrans ouverts au maximum. Comportement des fenêtres (décision du 26/11/2026) : ouverture en grande fenêtre (70 % × 80 % du bureau) en haut à gauche, les suivantes en cascade vers le bas à droite, la dernière ouverte devant ; chevauchement libre, un clic met la fenêtre devant ; une fenêtre peut dépasser les bords du bureau, sa barre de titre reste toujours attrapable (déplacement et redimensionnement) ; déplacement par un contour qui suit la souris, la fenêtre saute à sa place au relâchement ; le contenu s'adapte à la taille de la fenêtre ; taille minimale 640 × 440 px ; agrandissement en plein écran.
- **Barre d'onglets** : écrans ouverts, en mode Liste seulement (aucune barre d'onglets en Mosaïque).
- **Barre des fenêtres réduites** (Mosaïque, en bas à gauche) : un bouton icône + titre par fenêtre réduite ; un clic la restaure, la croix la ferme ; la barre n'apparaît que s'il y a au moins une fenêtre réduite (décision du 26/11/2026).
- **Barre de période** (`PeriodBar`, commune à tous les écrans qui en ont besoin, pas aux autres) : en tête de l'écran, sous les onglets (Liste) ; périodes prédéfinies (aujourd'hui, semaine, mois, trimestre, année, personnalisée), puis **date de début** et **date de fin**, chacune avec un seul mois de calendrier qui se referme après le choix (décision du 25/11/2026). En mode Mosaïque, chaque fenêtre a sa propre barre.
- **Bandeau hors ligne** (`OfflineBanner`) sous les onglets (Liste) ou sous l'en-tête (Mosaïque) : en ligne / hors ligne + nombre d'opérations en attente (EF-OFF-01).
- **Panneau des notifications** (cloche) : vide au lot 1 (« Aucune notification »), alimenté par les lots suivants.

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Recherche globale | texte | non | cherche dans les applications installées seulement (EF-APP-04) ; résultats **filtrés par le serveur selon les droits et le périmètre** de l'utilisateur (sites, champs masqués comme les prix d'achat), en plus de la sécurité par ligne de la base ; résultats groupés par application ; Entrée ouvre le premier résultat |

## Actions (ce que fait chaque clic)

- Clic sur un module (menu ou tuile) : ouvre l'écran (onglet ou fenêtre) ; l'adresse suit l'écran courant.
- Fenêtre (Mosaïque) : **Réduire** (→ barre du bas), **Agrandir / Restaurer** (ou double-clic sur la barre de titre), **Fermer** ; glisser la barre de titre déplace la fenêtre par contour, **Échap** annule (déplacement et redimensionnement au clavier : avant la fin du lot 1, décision du 26/11/2026) ; clic sur un bouton de la barre du bas : restaure la fenêtre ; sa croix : ferme la fenêtre réduite.
- Bouton **Liste / Mosaïque** : change de mode ; choix retenu par utilisateur (navigateur, puis profil au lot 1).
- Menu utilisateur : **Mon profil** (→ `core.profile`), **Paramètres** (si droit), **Verrouiller** (→ `core.lock-screen`), **Se déconnecter** (ferme la session au serveur et **efface les données locales**, sauf la file non encore envoyée : EF-OFF-03, SEC-MO-11).
- Cloche : ouvre le panneau des notifications.

## États

- **Vide** : entreprise sans application installée : seuls Tableau de bord, Applications et Paramètres apparaissent.
- **Chargement** : squelette du menu et de l'en-tête pendant la lecture de la session.
- **Erreur** : session expirée : `core.lock-screen` ; droits retirés pendant la session : chaque action sensible **relit les droits dans la base** (pas seulement dans le jeton, SEC-MO-03), donc refus immédiat ; l'écran concerné affiche la 403 au prochain chargement.
- **Hors ligne** : bandeau « Hors ligne » ; écrans non disponibles hors ligne marqués d'un pictogramme dans le menu (§9).

## Droits nécessaires

- Menu filtré par les droits de l'utilisateur ET par les applications installées : un écran sans droit n'apparaît pas (et sa page renvoie 403 côté serveur, ENF-SEC-03).

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

EF-APP-04, EF-OFF-01, ENF-USA-01, ENF-USA-02, décisions du 25/11/2026 (2 modes) et du 26/11/2026 (icônes).

## Version mobile (390 px)

- Menu ouvert par-dessus la page ; logo seul dans l'en-tête de la Mosaïque ; bouton clair / sombre dans la palette ; recherche globale derrière une icône loupe qui ouvre le champ en plein écran ; barre de période défilante.

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
| Fenêtres réduites | Minimised windows |

## Barre du haut (maquette validée le 28/11/2026)

Maquettes : [tailles et ordre](../references/barre-du-haut/tailles-et-ordre.png) (taille **B** retenue), [calendrier](../references/barre-du-haut/calendrier.png), [notifications](../references/barre-du-haut/notifications.png), [profil](../references/barre-du-haut/profil.png), [recherche](../references/barre-du-haut/recherche.png). Données fictives uniquement.

- Carte blanche arrondie, en mode Liste comme en Mosaïque.
- À gauche — Liste : bouton du menu latéral, puis Liste / Mosaïque. Mosaïque : Liste / Mosaïque, puis l'entreprise et « ··· » (détail ; « Changer d'entreprise » seulement si la personne en a plusieurs). Plus de fil « entreprise › écran ».
- À droite, dans cet ordre : réseau, recherche, langue (menu Français / English), nuit / jour, cloche ; trait ; profil (avatar).
- Taille B : boutons de 32 px, dessin de 16 px, avatar de 34 px.
- Profil : nom et e-mail, Mon profil, Paramètres (ouvre l'écran), Couleur principale (déplacée de la barre), Se déconnecter (rouge). Ni messagerie, ni tickets, ni écran de verrouillage.
- Notifications : seulement des faits réels (application installée / désinstallée, invitation acceptée, fin d'essai) ; « Uniquement non lu », « Marquer tout comme lu », « Afficher toutes les notifications » ; sinon « Aucune notification ».
- Recherche (loupe ou Ctrl + K) : fenêtre centrée ; « Je recherche » = modules installés ; actions rapides selon les droits ; recherches récentes retenues sur l'appareil ; flèches + Entrée. La recherche dans les données arrive avec les modules.
- Tableau de bord : calendrier global à droite du titre (raccourcis, deux mois, Annuler / Appliquer), période retenue ; pas de bouton Exporter.

## À trancher par la cheffe de projet

- Changement de société dans l'en-tête : **pas au lot 1** (décision du 26/11/2026). Reste à trancher avant la base du lot 1 : une même personne peut-elle appartenir à plusieurs entreprises ?

## À ne pas reproduire

- Menu qui montre des modules non installés ou non autorisés.
- Icônes en émoji, interface en français seulement, pas de thème sombre, données perdues au rechargement : défauts communs à tout le prototype (voir INDEX.md).

## Propre au client fondateur → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
