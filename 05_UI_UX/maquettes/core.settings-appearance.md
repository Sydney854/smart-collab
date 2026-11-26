# core.settings-appearance — Paramètres — Apparence

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `settings-appearance` |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | M-22 (page de maquettes) ; code de démonstration : `src/apps/web/screens/SettingsScreen.tsx` ; règles : `05_UI_UX/ICONES_MODULES.md` § 5 |

## Captures de référence

- [DreamsERP mode-clair/16_Systeme/10_general-settings.png](../../03_SOURCES_REFERENCE/DREAMSERP/captures/mode-clair/16_Systeme/10_general-settings.png) — Paramètres généraux (mise en page des réglages)

Référence visuelle seulement : la maquette Smart Collab reprend la disposition, pas le logo, les couleurs ni les textes de DreamsERP.

## Zones de l'écran

- Carte « Apparence » dans les Paramètres (les autres rubriques : Société `core.company`, Utilisateurs `core.users`, Profils `core.roles`, Sécurité…).
- **Mes réglages** : style des icônes de modules (6 choix avec aperçu de 3 icônes), taille (4 choix avec aperçu), thème et couleur principale (repris de la palette de l'en-tête ; ajout par rapport à `ICONES_MODULES.md` § 5).
- **Valeurs de l'entreprise** (bloc visible seulement avec core.company.configure) : style d'icône par défaut pour les nouveaux utilisateurs, présentation de l'assistant (proposition 1 ou 2).

## Champs et filtres

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Style des icônes | choix | oui | trait, A à E ; par défaut B · Multicolore (valeur par défaut fixée par l'entreprise) |
| Taille des icônes | choix | oui | Petite 44, Moyenne 56, Grande 72 (par défaut), Très grande 88 px |
| Présentation de l'assistant | choix | oui | Proposition 1 (par défaut) ou 2 ; réglage de l'entreprise |

## Actions (ce que fait chaque clic)

- Clic sur un choix : appliqué tout de suite, retenu pour l'utilisateur (profil) ; pour les réglages d'entreprise, réservé à l'administrateur.

## États

- **Vide** : sans objet (valeurs par défaut).
- **Chargement** : squelette de la carte.
- **Erreur** : enregistrement refusé : valeur précédente rétablie, message.
- **Hors ligne** : réglages personnels appliqués localement puis envoyés au retour du réseau.

## Droits nécessaires

- Chacun pour ses réglages personnels ; core.company.configure pour les valeurs de l'entreprise (style par défaut, présentation de l'assistant).

Modèle : rôle × module × action × périmètre (02_SPECIFICATIONS/04_ROLES_DROITS.md). Une action non autorisée est masquée, pas grisée.

## Exigences couvertes

Décision du 26/11/2026 (`ICONES_MODULES.md` § 5), ENF-USA-02.

## Version mobile (390 px)

- Choix en 2 colonnes ; sous 560 px de large, la taille des icônes est ramenée à Moyenne (l'aperçu l'indique).

## Textes fr / en

Principaux textes de l'écran (fichiers de traduction `packages/i18n`).

| Français | English |
|---|---|
| Apparence | Appearance |
| Style des icônes de modules | Module icon style |
| Taille des icônes de modules | Module icon size |
| Présentation de l'assistant de choix des modules | Module selection wizard layout |

## À ne pas reproduire

- Logo, couleurs (vert), textes et illustrations de DreamsERP : remplacés par l'identité Smart Collab (or, bleu marine, Inter) et des textes propres.

## Propre à RUTHY'S → réglages du moteur de configuration

Rien : écran générique, données de démonstration fictives.
