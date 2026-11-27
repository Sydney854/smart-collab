# core.field-masks — Masques de champs (données sensibles)

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `field-masks` (onglet de `core.roles`) |
| Lot | 1 |
| Prototype | — (réglage absent du prototype ; le prototype masquait les prix d'achat en dur pour la caisse) |
| Maquette Smart Collab | à publier dans la page de maquettes (lot 1, étape 3) |

## Principe (04_ROLES_DROITS.md, « Données sensibles »)

Prix d'achat, marges, salaires et taux internes sont **masquables par rôle, champ par champ**. Un champ masqué n'est **jamais envoyé** au navigateur pour ce rôle (filtré par la base ou le serveur), il ne suffit pas de le cacher à l'écran. Une personne qui cumule plusieurs rôles voit un champ si **au moins un** de ses rôles le voit.

## Zones de l'écran

- Dans `core.roles`, onglet **« Données sensibles »** à côté de « Droits ».
- Tableau : une ligne par champ sensible déclaré par les applications installées (ex. « Produit · Prix d'achat », « Vente · Marge », « Employé · Salaire »), regroupées par application ; une colonne par rôle ; dans chaque case un interrupteur **Visible / Masqué**.
- Au-dessus : rappel « Un champ masqué n'est jamais transmis aux personnes de ce rôle ».
- Rôle Administrateur : toujours « Visible », non modifiable (on ne peut pas se retirer l'accès).

## Champs

| Champ | Type | Obligatoire | Précisions |
|---|---|---|---|
| Visible / Masqué (par rôle et par champ) | interrupteur | oui | valeur par défaut fixée par le préréglage du métier (ex. Commerce de détail : prix d'achat et marge masqués pour Caissier) |

## Actions

- **Basculer un interrupteur** : la modification est en attente (compteur « N modifications ») ; **Enregistrer** l'envoie au serveur (permission `core.roles.manage`), tracée dans le journal d'audit ; **Annuler les modifications** revient à l'état enregistré (décision G4 du 27/11/2026).
- **Rétablir le préréglage du métier** : remet les valeurs d'origine pour ce rôle, après confirmation.

## États

- **Vide** : aucune application installée ne déclare de champ sensible → « Aucune donnée sensible pour les applications installées. »
- **Erreur** : refus du serveur → l'interrupteur revient à son état et un message s'affiche.

## Droits nécessaires

- Voir : `core.roles.view` ; modifier : `core.roles.manage` (administrateur par défaut).

## Exigences couvertes

04_ROLES_DROITS.md (données sensibles), ENF-SEC-03, SEC-MO-03, EF-GEN-03.

## Version mobile (390 px)

- Un rôle à la fois (liste déroulante du rôle), puis la liste des champs avec leur interrupteur.

## Textes fr / en

| Français | English |
|---|---|
| Données sensibles | Sensitive data |
| Visible | Visible |
| Masqué | Hidden |
| Un champ masqué n'est jamais transmis aux personnes de ce rôle. | A hidden field is never sent to people with this role. |
| Rétablir le préréglage du métier | Restore the business preset |
| Aucune donnée sensible pour les applications installées. | No sensitive data for the installed apps. |

## À ne pas reproduire

- Masquage fait seulement à l'écran (le champ resterait lisible dans les échanges avec le serveur).

## Propre au client fondateur → réglages du moteur de configuration

- Liste des champs masqués pour la caisse : devient le préréglage du métier Commerce de détail.
