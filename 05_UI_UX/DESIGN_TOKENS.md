# Jetons de design — thème par défaut Smart Collab

> Valeurs relevées dans le prototype (feuille de style `:root`). Elles forment le **thème par défaut** ; chaque entreprise peut changer couleurs et logo (moteur de configuration). En code : variables CSS dans le bloc `@theme` de Tailwind v4.

## Couleurs

| Jeton | Valeur | Usage |
|-------|--------|-------|
| `--nav-1` | `#0c1e37` | Menu latéral (haut du dégradé) |
| `--nav-2` | `#132a4b` | Menu latéral (bas du dégradé) |
| `--nav-text` | `#a7b6cc` | Texte du menu |
| `--accent` | `#d9a441` | Or : élément actif, bouton principal |
| `--accent-strong` | `#c08d2e` | Or appuyé (survol) |
| `--ink` | `#16233a` | Texte principal |
| `--ink-2` | `#3d4d66` | Texte secondaire |
| `--muted` | `#7b8aa1` | Libellés discrets |
| `--faint` | `#a8b4c5` | Texte très discret |
| `--bg` | `#f4f7fb` | Fond de page |
| `--card` | `#ffffff` | Cartes |
| `--line` | `#e6ecf4` | Bordures |
| `--blue` / `--blue-l` | `#2563eb` / `#e8f0fe` | Information |
| `--green` / `--green-l` | `#10b981` / `#e6f8f1` | Succès, stock correct |
| `--amber` / `--amber-l` | `#f59e0b` / `#fef4e2` | Alerte, seuil |
| `--red` / `--red-l` | `#ef4444` / `#fdeaea` | Erreur, rupture |
| `--purple` / `--purple-l` | `#7c3aed` / `#f1ecfe` | Catégorie |
| `--teal` / `--teal-l` | `#0d9488` / `#e3f5f3` | Catégorie |
| Thème du centre d'impression | `#1e4d8f` (bleu, défaut) | États et rapports |

Le mode sombre redéfinit ces jetons ; aucune couleur n'est écrite en dur dans un composant.

**En code :** `src/packages/ui/src/tokens.ts` est la seule source des couleurs (variables CSS `--sc-…` et noms attendus par shadcn/ui en sont générés). Un test automatique refuse toute couleur écrite ailleurs.

### Correspondance avec shadcn/ui (lot 0)

shadcn/ui utilise ses propres noms ; ils pointent vers nos jetons :

| Nom shadcn (classe Tailwind) | Notre jeton | Usage |
|------------------------------|-------------|-------|
| `primary` (`bg-primary`) | `--accent` (or) | Bouton principal, élément actif |
| `primary-foreground` | `--on-accent` | Texte sur l'or |
| `background` / `foreground` | `--bg` / `--ink` | Fond de page / texte principal |
| `card`, `popover` | `--card` | Cartes, menus, fenêtres |
| `muted` / `muted-foreground` | `--bg` / `--muted` | Fond discret / texte discret |
| `accent`, `secondary` | `--hover` | Fond de survol (attention : ce n'est pas l'or) |
| `border`, `input` | `--line` | Bordures |
| `ring` | `--accent` | Contour de focus |
| `destructive` | `--red` | Actions dangereuses |
| `sidebar` / `sidebar-foreground` | `--nav-1` / `--nav-text` | Menu latéral (dégradé `--nav-1` → `--nav-2`) |
| `sidebar-primary` | `--accent` | Écran actif du menu |
| `sidebar-accent` / `sidebar-border` | `--nav-hover` / `--nav-line` | Survol et séparateurs du menu |
| `chart-1` … `chart-5` | or, bleu, vert, violet, sarcelle | Graphiques |

### Jetons ajoutés au lot 0 (proposés, à valider)

| Jeton | Clair | Sombre | Usage |
|-------|-------|--------|-------|
| `--on-accent` | `#16233a` | `#16233a` | Texte posé sur l'or (le blanc sur or est illisible : contraste 2,1 / 1) |
| `--nav-text-active` | `#ffffff` | `#ffffff` | Texte du menu au survol |
| `--overlay` | noir bleuté 45 % | noir 60 % | Fond derrière les fenêtres |
| `--hover` | `#eef2f8` | `#1b2639` | Fond de survol (menus, lignes) |
| `--on-strong` | `#ffffff` | `#ffffff` | Texte sur une couleur franche (rouge, bleu…) |
| `--nav-hover` / `--nav-line` | blanc 8 % / blanc 10 % | blanc 8 % / blanc 8 % | Survol et séparateurs du menu latéral |

### Thème sombre (proposé au lot 0, à valider)

| Jeton | Valeur sombre |
|-------|---------------|
| `--nav-1` / `--nav-2` | `#08152a` / `#0d1d36` |
| `--accent` / `--accent-strong` | `#d9a441` / `#e6b65a` |
| `--ink` / `--ink-2` | `#e6edf7` / `#b8c4d6` |
| `--muted` / `--faint` | `#8a99b0` / `#5f6f87` |
| `--bg` / `--card` / `--line` | `#0b1220` / `#131c2e` / `#24324a` |
| `--blue` / `--blue-l` | `#60a5fa` / `#13233f` |
| `--green` / `--green-l` | `#34d399` / `#0f2e26` |
| `--amber` / `--amber-l` | `#fbbf24` / `#33270f` |
| `--red` / `--red-l` | `#f87171` / `#3a1717` |
| `--purple` / `--purple-l` | `#a78bfa` / `#241a3d` |
| `--teal` / `--teal-l` | `#2dd4bf` / `#0e2b2a` |

### Couleurs principales du sélecteur (proposées)

Or (défaut) `#d9a441`, Bleu `#2563eb`, Vert `#0d9488`, Violet `#7c3aed`, Rouge `#dc2626`.

## Forme et typographie

| Jeton | Valeur |
|-------|--------|
| Police | Inter, puis police système |
| Rayon des cartes | 12 px |
| Rayon des champs et boutons | 8 px |
| Ombre des cartes | `0 1px 2px rgba(16,35,64,.04), 0 1px 3px rgba(16,35,64,.06)` |
| Largeur du menu latéral | 240 px (réductible en icônes ; 222 px dans le prototype, élargi le 25/11/2026 pour le nom de l'entreprise) |
| Écran actif du menu | Fond or plein (`--accent`), texte `--on-accent` |
| Montants | Francs entiers à l'affichage (`12 500 F`), séparateur d'espace, devise de l'entreprise |
