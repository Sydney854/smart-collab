# core.select-company — Choix de l'entreprise à la connexion

**Statut : proposée**

| | |
|---|---|
| Application | `core` |
| Écran | `select-company` |
| Lot | 1 |
| Prototype | — (écran absent du prototype) |
| Maquette Smart Collab | à publier dans la page de maquettes (lot 1, étape 2) |

## Principe (décision L1 du 26/11/2026)

N'apparaît **que si la personne appartient à plusieurs entreprises actives** et n'en a pas encore choisi une pour cette session. Une personne d'une seule entreprise ne le voit jamais. Pas de bouton « changer de société » dans l'en-tête au lot 1 : pour changer, se déconnecter puis se reconnecter.

## Zones de l'écran

- Même disposition que `core.login`.
- Titre « Choisissez l'entreprise », puis une carte par entreprise : nom, métier (Commerce de détail, Multi-sites…), ville si connue. La dernière entreprise utilisée est en tête, marquée « Dernière utilisée ».
- Lien « Se déconnecter ».

## Actions

- **Clic sur une entreprise** : le serveur vérifie l'appartenance active (`select_tenant`), puis la session est renouvelée avec la nouvelle entreprise (jeton signé) ; ouverture du dernier écran de cette entreprise. Le choix est retenu pour les connexions suivantes ; inscrit au journal des accès.
- **Se déconnecter** : ferme la session.

## États

- **Aucune entreprise active** (toutes suspendues ou appartenances retirées) : « Votre compte n'a accès à aucune entreprise pour le moment. » + Se déconnecter.
- **Chargement** : la carte choisie affiche un indicateur, les autres sont désactivées.

## Droits nécessaires

- Personne connectée ; seules ses entreprises actives sont listées (la base ne lui montre rien d'autre).

## Textes fr / en

| Français | English |
|---|---|
| Choisissez l'entreprise | Choose a company |
| Dernière utilisée | Last used |
| Votre compte n'a accès à aucune entreprise pour le moment. | Your account does not have access to any company at the moment. |
| Se déconnecter | Sign out |

## À ne pas reproduire

- Liste qui montrerait des entreprises dont la personne n'est pas membre.

## Propre au client fondateur → réglages du moteur de configuration

Rien.
