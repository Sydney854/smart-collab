# Composants à coder une fois (package `packages/ui`)

Base technique (décision du 22/11/2026) : Ant Design v6 + Preline v4, comme la version React de DreamsERP, habillés avec les jetons de `DESIGN_TOKENS.md`. Les composants ci-dessous sont construits par-dessus.

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
