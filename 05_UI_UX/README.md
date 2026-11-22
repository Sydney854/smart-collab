# UI/UX — Smart Collab

| Fichier | Contenu |
|---------|---------|
| `DESIGN_TOKENS.md` | Couleurs, typographie, rayons, ombres, tirés du prototype |
| `INVENTAIRE_ECRANS.md` | Écrans repris du prototype, à maquetter, à concevoir (copie de la section 5 du cahier) |
| `COMPOSANTS.md` | Composants à coder une fois et réutiliser partout |
| `maquettes/` | Une maquette validée par écran (lot 0) |

## Règles

1. **Écran présent dans le prototype** → on le reproduit (disposition, comportements), avec les données de démonstration fictives.
2. **Écran absent** → maquette d'abord, inspirée de la page DreamsERP listée dans `03_SOURCES_REFERENCE/DREAMSERP_INDEX.md`, validée par la cheffe de projet, puis codée.
3. **Écran propre à Smart Collab** (assistant, Apps, Studio, chantiers, console éditeur) → maquette d'abord.
4. Tout écran est disponible en **français et en anglais**, en **thème clair et sombre**, et utilisable dès **390 px** de large (caisse : à partir de 1 280 px).
5. Les couleurs, logo et disposition du menu sont **personnalisables par entreprise** (moteur de configuration) : aucun écran ne code une couleur en dur, tout passe par les jetons.

## Nommage des maquettes

`maquettes/<application>.<écran>.md` (ex. `pos.cart.md`), avec : capture de référence, zones, champs, actions, états (vide, chargement, erreur, hors ligne), droits nécessaires, exigences couvertes (EF-…).
