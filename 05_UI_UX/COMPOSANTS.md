# Composants à coder une fois (package `packages/ui`)

Base technique (décision du 25/11/2026) : **shadcn/ui** (composants copiés dans `packages/ui`, sur Radix et Tailwind), icônes **Lucide**, graphiques **ApexCharts**, tableaux **TanStack Table**, formulaires **react-hook-form + zod**, notifications **sonner**, habillés avec les jetons de `DESIGN_TOKENS.md` (Inter, or, bleu marine). Les composants ci-dessous partent de leurs équivalents DreamsERP (section « UI Interface » : `03_SOURCES_REFERENCE/DREAMSERP/captures/mode-*/18_Interface-utilisateur/`).

| Composant | Où on le voit dans le prototype | Exigences |
|-----------|--------------------------------|-----------|
| `AppShell` | Menu latéral, barre du haut, onglets ouverts | Menu = applications installées (EF-APP-04) |
| `PeriodBar` | Barre de période + calendrier en tête de module | Même composant partout |
| `KpiCard` | Cartes de chiffres clés, cliquables, personnalisables au clic droit | Indicateurs du moteur (EF-CFG) |
| `ChartCard` | Graphiques avec menu de personnalisation | Export image |
| `DataList` | Listes triables, ligne sélectionnable, panneau de détail | EF-GEN-04 |
| `EntityForm` | Fiches (produit en 7 onglets, employé, client) | Champs personnalisés, extensions d'écrans |
| `PrintPreview` | Fenêtre d'aperçu, impression, export des états | EF-BI-01 |
| `ThemePicker` | Sélecteur de couleur en haut à droite | Jetons de design |
| `StatusBadge` | Badges de statut | — |
| `OfflineBanner` | (nouveau) en ligne / hors ligne + opérations en attente | EF-OFF-01 |
| `AppCard` | (nouveau) carte d'application dans l'écran Apps | EF-APP-01 |
| `EmptyState`, `ConfirmDialog`, `Toast` | Messages vides, confirmations | Textes fr / en |
