# Préférences de la cheffe de projet

Mémoire des préférences et des choix habituels de la cheffe de projet, tirée de ses échanges avec Claude (prototype RUTHY'S, puis Smart Collab). Sert à l'agent `conseil-validation` (`.claude/agents/conseil-validation.md`) pour proposer des réponses aux questions de validation.

Ce fichier **ne remplace pas** `JOURNAL_DECISIONS.md` : une décision du journal l'emporte toujours. Il est mis à jour par la session de pilotage (documentation) à chaque nouvelle préférence exprimée ; la session de code peut y ajouter une ligne quand la cheffe de projet tranche une question qui révèle une préférence générale.

Dernière mise à jour : 26/11/2026.

## 1. Façon de travailler

| Préférence | Conséquence pour les propositions |
|---|---|
| N'est pas développeuse ; pilote à l'usage (elle regarde, clique, compare) | Questions en français simple, sans code ni jargon ; toujours dire ce qu'elle verra à l'écran |
| Veut une explication **avant** chaque étape et les **ajustements possibles après** (règle d'`AGENTS.md`) | Chaque question porte sur un choix visible, avec « facile maintenant / coûteux plus tard » |
| Choisit mieux **sur pièce** : captures, page de comparaison, maquette cliquable | Pour un choix visuel, proposer de lui montrer les options (captures ou maquette) plutôt que de les décrire |
| Aime qu'on **reformule** sa demande avant de lancer un gros travail | Reformuler les demandes ambiguës ou structurantes avant de coder |
| Valide le plus souvent la **recommandation** quand elle est argumentée | Toujours donner une recommandation claire, avec la raison, pas seulement une liste d'options |
| Préfère des **étapes courtes** avec jalons | Découper ; ne pas livrer un gros lot d'un coup |
| Veut savoir ce qui est **fait et testé** et ce qui ne l'est pas | Synthèse honnête : fait / pas fait / non vérifiable |

## 2. Goûts et choix récurrents sur l'interface

| Préférence | Exemples |
|---|---|
| **Personnalisation dans Paramètres** plutôt qu'un choix imposé : quand plusieurs propositions lui plaisent, elle les garde toutes au choix | 6 styles d'icônes, 4 tailles, 2 présentations d'assistant (26/11) ; couleur de sélection et couleur par écran dans le prototype |
| Rendu **vivant et reconnaissable**, proche d'Odoo / DreamsERP, avec l'identité or et bleu marine | Icônes illustrées pour les modules ; or plein pour l'élément actif |
| **Sobriété** : pas d'éléments inutiles, pas de doublon de cadre, libellés courts | Mosaïque : cadre autour de l'icône seule, nom du module seul, sans description |
| **Pas de bouton qui ne fait rien** : masquer ce qui n'est pas prêt | Exports « bientôt » masqués jusqu'au centre d'états |
| Actions discrètes : le clic droit plutôt que des icônes ajoutées partout | Prototype : personnalisation des cartes au clic droit |
| Fidélité au **prototype RUTHY'S** pour les écrans qui y existent ; DreamsERP pour les autres | Fiches de `05_UI_UX/maquettes/`, captures |
| Grands éléments lisibles | Icônes agrandies (72 px par défaut) |
| Plusieurs fenêtres et modes d'affichage | Modes Liste / Mosaïque, fenêtres déplaçables (6 au maximum) |

## 3. Données, sécurité, outils

- **Sécurité** : des valeurs par défaut prudentes, toujours réglables par l'entreprise ; pas de SMS pour la double authentification (26/11).
- **Écran vide** : « Pas encore de données » plutôt que des zéros (26/11).
- **Pages partageables** (maquettes, artefacts) : on ne cite pas le nom d'un client ; on écrit « client fondateur » (26/11).

- **Honnêteté sur les données** : jamais de chiffre inventé ; une limite de donnée est affichée, pas cachée.
- **Aucune donnée RUTHY'S** dans Smart Collab ; données de démonstration fictives.
- Ne jamais coller de clé ou de mot de passe dans une conversation ; secrets uniquement dans les variables protégées de Vercel / Supabase.
- Dépôt privé ; code DreamsERP jamais publié seul.
- Pas de nouvel outil sans son accord ; elle accepte un petit outil gratuit et entretenu quand il évite beaucoup de code maison (react-rnd, react-day-picker).
- Travail du lot sur sa branche (`lot-00`…), jamais directement sur `main` ; envoyer souvent pour ne rien perdre.

## 4. Recommandations déjà acceptées (repères)

| Date | Sujet | Choix retenu |
|---|---|---|
| 25/11 | Élément actif | Or plein |
| 25/11 | Menu | 240 px |
| 25/11 | Onglets des écrans ouverts | Gardés |
| 25/11 | Glisser-déposer des lignes | Écarté |
| 25/11 | Menu principal | 2 modes : Liste et Mosaïque (fenêtres) |
| 25/11 | Montants | Décimales selon la devise (0 pour le franc CFA), entiers en plus petite unité |
| 25/11 | Annuler une facture | Rouge pâle pour ouvrir, rouge plein pour confirmer |
| 25/11 | Calendrier | Début puis fin ; un seul mois de calendrier pour chacune, qui se referme après le choix (journal du 25/11) |
| 25/11 | Prototype dans le dépôt | Captures + fiches + jetons, pas le code |
| 25/11 | Organisation | Session principale + agents de contrôle en lecture seule |
| 26/11 | Icônes et assistant | `05_UI_UX/ICONES_MODULES.md` |
| 26/11 | Fenêtres Mosaïque | Comme sa vidéo : grande fenêtre en cascade, contour au déplacement, barre des fenêtres réduites en bas seulement si besoin, pas d'onglets, taille minimale |

## 2 bis. Préférences ajoutées le 26/11/2026

| Préférence | Exemples |
|---|---|
| Un élément de démonstration ou une option pas encore prête ne se mélange pas aux vrais écrans : il reste dans la page de maquettes ou s'affiche comme inactif | Tuile « Assistant (démo) » retirée de la mosaïque ; modules « À venir » non cliquables ; pas de sélecteur de présentation dans l'assistant |
| Les fenêtres s'ouvrent toujours de la même façon, sans mémoire de position | Ouverture en cascade à chaque fois |
| Les modes d'affichage ont les mêmes limites : changer de mode ne crée jamais de cas particulier | 6 écrans au maximum en Liste comme en Mosaïque |
| Les pages de démonstration technique (composants, assistant) ne figurent dans aucun menu, ni en Liste ni en Mosaïque : on les ouvre depuis la page de maquettes | Décision Q1–Q2 du 26/11 |
| Montrer le comportement voulu par une **vidéo ou une capture** d'un logiciel qu'elle utilise, puis demander de le copier | Vidéo du 26/11 pour les fenêtres |

## 5. Ce qui la fait revenir en arrière

- Un écran qui ne ressemble pas à ce qu'elle a validé (placement, taille, cadre) : elle corrige au détail près.
- Un choix fait à sa place sans le signaler.
- Un élément affiché mais non fonctionnel.
