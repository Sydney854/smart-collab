# Icônes des modules, mosaïque, App Store et assistant de première connexion

**Statut : validé par la cheffe de projet le 26/11/2026.**

Maquette de référence interactive : `references/icones-modules.html` (s'ouvre dans un navigateur ; boutons Style, Écran, Taille, Thème). Les dessins d'icônes de cette maquette sont des **premières versions** : la géométrie sera affinée, le principe ne change pas.

## 1. Deux familles d'icônes

| Usage | Icônes |
|---|---|
| Interface : boutons, menus, actions, onglets, champs | **Lucide**, inchangé |
| Tuiles des modules : mosaïque du menu, App Store, assistant de première connexion, récapitulatif de l'assistant | **Icônes illustrées Smart Collab** (ce document) |

Les icônes illustrées sont des SVG propres à Smart Collab, dessinés pour le projet. Aucune n'est reprise d'Odoo ni d'une autre suite. Elles n'ajoutent aucune bibliothèque.

## 2. Six styles au choix

Les six styles sont **tous disponibles** ; le choix se fait dans **Paramètres → Apparence**.

| Code | Style | Rendu |
|---|---|---|
| `trait` | Actuel (trait) | Contour à la couleur principale de l'interface (or par défaut), sans remplissage (style Lucide) — décision du 26/11/2026 |
| `bi` | A · Plat bicolore | Couleur du module + bleu marine, aplats |
| `multi` | B · Multicolore | Trois couleurs par icône, formes superposées |
| `grad` | C · Dégradé doux | Dégradé léger sur chaque forme |
| `duo` | D · Contour teinté | Contour de la couleur du module, intérieur teinté transparent |
| `pill` | E · Pastille couleur | Carré arrondi de la couleur du module, dessin blanc |

- **Un seul dessin par module, six rendus.** Chaque icône est décrite une fois (formes SVG sur une grille de 48 × 48) et chaque forme porte un **rôle** : `p` principal, `s` second, `t` troisième, `n` sombre, `w` blanc (trous, fenêtres). Le style choisi transforme les rôles en couleurs : on ne dessine jamais six fois la même icône.
- Chaque module a une **couleur propre** (A, D, E) et un **trio de couleurs** (B, C), choisis dans une palette tenue, cohérente avec l'or et le bleu marine. La palette fait partie des jetons (`DESIGN_TOKENS.md`), pas du code des écrans.
- Thème sombre : mêmes dessins ; le bleu marine des rôles `s`/`n` est éclairci pour rester lisible.
- Tout nouveau module livre son icône (géométrie + rôles + couleurs) avec son manifeste (`16_CONTRAT_APPLICATION.md`).

## 3. Taille réglable

Réglée dans **Paramètres → Apparence**, appliquée à la mosaïque, à l'App Store et à l'assistant.

| Réglage | Cadre | Dessin |
|---|---|---|
| Petite | 44 px | 30 px |
| Moyenne | 56 px | 40 px |
| **Grande (par défaut)** | 72 px | 52 px |
| Très grande | 88 px | 64 px |

Sur téléphone (moins de 560 px de large), la taille est ramenée à Moyenne pour garder deux tuiles par ligne.

## 4. Les trois écrans

### Mosaïque du menu principal (mode Mosaïque de la coquille)

- Un **cadre carré arrondi qui entoure uniquement l'icône** (fond blanc, bordure fine, ombre légère).
- **Le nom du module seul**, sous le cadre, hors du cadre. Pas de description.
- Survol : bordure or et léger soulèvement du cadre. Clic : ouvre la fenêtre du module (règles du mode Mosaïque inchangées).
- Seuls les modules installés apparaissent.

### App Store (écran Applications)

- Carte : icône dans son cadre, nom, description courte, famille du catalogue, statut.
- Statuts : **Installée** (vert), **Installer** (bouton contour or), **Toujours actif** (modules du socle, gris, non modifiable), **À venir** (module pas encore construit, gris, non cliquable — décision du 26/11/2026).

### Assistant de première connexion : choix des modules

Deux propositions validées, **toutes les deux disponibles** ; le choix se fait dans **Paramètres → Apparence**. À la toute première connexion (avant tout réglage), l'assistant utilise la **proposition 1**.

Dans les deux :
- modules regroupés par **famille du catalogue** (`01_DOCUMENTATION/catalogue/CATALOGUE_MODULES.md`), avec le titre de la famille ;
- **cadre net autour de l'icône** + **second cadre plus effacé** (contraste faible) autour de l'icône et du texte ;
- modules du socle (Tableau de bord, Applications, Paramètres) déjà choisis et marqués **Toujours actif** ;
- compteur « N modules choisis » ; texte : « Vous pourrez en ajouter ou en retirer plus tard depuis l'App Store » ;
- chaque tuile se coche au clic, à la touche Espace ou Entrée (rôle `checkbox` pour l'accessibilité).

| Proposition | Présentation |
|---|---|
| **1 · Coche verte sur l'icône** (par défaut) | Tuile horizontale : icône à gauche, nom + description à droite. Module choisi : **coche verte ronde posée sur le coin de l'icône**. Module non choisi : icône **grisée**. |
| **2 · Cartes + récapitulatif** | Cartes carrées (icône + nom), case ronde dorée en haut à droite, bordure or quand le module est choisi. Panneau **« Votre sélection »** à droite (nombre, liste des modules avec leur icône, bouton Continuer) ; passe sous la liste sur téléphone. |

La proposition 3 de la maquette (liste avec interrupteurs) est **écartée**.

## 5. Paramètres → Apparence

| Réglage | Valeurs | Par défaut | Portée |
|---|---|---|---|
| Style des icônes de modules | `trait`, `bi`, `multi`, `grad`, `duo`, `pill` | `multi` (B · Multicolore), modifiable par l'entreprise | Par utilisateur ; valeur par défaut fixée par l'entreprise |
| Taille des icônes de modules | Petite, Moyenne, Grande, Très grande | Grande | Par utilisateur |
| Présentation de l'assistant de choix des modules | Proposition 1, Proposition 2 | Proposition 1 | Par entreprise |

Comme pour le mode Liste / Mosaïque : le choix est d'abord retenu dans le navigateur (liste fermée de valeurs, toute autre valeur est ignorée), puis dans le profil quand la connexion existera (lot 1).
