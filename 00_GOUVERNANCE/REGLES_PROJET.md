# Règles de gouvernance — Smart Collab

## 1. Qui fait quoi

| Rôle | Personne / outil | Responsabilité |
|------|------------------|----------------|
| Cheffe de projet métier | Fabiola | Valider les maquettes et les démos, trancher le périmètre, cocher les listes de contrôle |
| Agent de code | Antigravity | Écrire le code dans `src/` selon le cahier des charges et le prompt du lot |
| Conseil et revue | Claude | Rédiger et tenir à jour le cahier des charges, les prompts, relire les livraisons |
| Source de vérité | `02_SPECIFICATIONS/00_CAHIER_DES_CHARGES_COMPLET.md` | Ce qui n'y est pas n'est pas construit |

## 2. Interdits

- Demander « un ERP complet » en une fois.
- Commencer un lot avant que la liste de contrôle du lot précédent soit cochée à 100 %.
- Copier un fichier du prototype ou de l'archive DreamsERP dans `src/` (références visuelles seulement).
- Reprendre une donnée ou une règle de calcul de RUTHY'S.
- Coder en dur une règle déclarée configurable.
- Changer de stack sans mettre à jour `10_ARCHITECTURE_STACK.md` et le journal des décisions.
- Supprimer physiquement un document validé, un produit, un tiers ou un utilisateur.
- Laisser une application écrire dans les tables d'une autre application.

## 3. Passer au lot suivant

1. La démo du lot fonctionne devant la cheffe de projet.
2. `06_LOTS/lot_XX/CHECKLIST.md` est cochée à 100 %, datée et signée.
3. Les tests automatiques du lot passent (isolation des entreprises comprise).
4. La branche Git du lot est fusionnée dans `main`.
5. Le journal des décisions indique le nouveau lot en cours.

## 4. Décisions figées (ne plus rediscuter à chaque prompt)

Voir `02_SPECIFICATIONS/01_VISION_DECISIONS.md` (D1 à D14) et `15_DECISIONS.md`.

## 5. Branches Git

- `main` : toujours livrable.
- `lot-XX-nom` : une branche par lot, fusionnée après validation.
- Message de commit : `lot XX — ce qui a été fait`.
