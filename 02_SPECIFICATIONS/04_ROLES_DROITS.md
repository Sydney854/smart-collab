# Smart Collab — 4. Rôles et droits

> Extrait de `00_CAHIER_DES_CHARGES_COMPLET.md`. En cas d'écart, le cahier complet fait foi.

Chaque métier livre une liste de rôles préréglée ; l'administrateur peut ensuite créer, renommer, fusionner ou désactiver des rôles. Les fiches métier donnaient des listes différentes selon le document : la liste retenue ci-dessous est la plus complète.

| Métier | Nombre | Rôles préréglés |
| --- | --- | --- |
| Commerce de détail | 4 | Administrateur, Gérant, Caissier, Magasinier |
| Multi-sites / Distribution | 8 | Administrateur, Directeur réseau, Acheteur central, Responsable logistique, Préparateur, Gérant de boutique, Caissier, Magasinier |
| Audit / Conseil / Projet | 7 | Administrateur, Associé / Direction, Commercial, Chef de mission, Consultant, Finance, Assistant(e) |
| Génie électrique | 10 | Administrateur, Direction, Commercial, Projeteur (bureau d'études), Acheteur, Magasinier, Vendeur / caissier, Chef de chantier, Technicien, Finance |
| Mixte | 1 + modules | Administrateur, puis les rôles proposés par chaque module activé |

### Modèle de droits

Un droit = un rôle × un module × une action × un périmètre.

- **Actions** : voir, créer, modifier, valider, annuler, exporter, imprimer, configurer.
- **Périmètre** : toute l'entreprise, un ou plusieurs sites, son équipe, ses propres données (exemple : un consultant ne voit que ses missions, un caissier que son site).
- **Données sensibles** : prix d'achat, marges, salaires et taux internes sont masquables par rôle, champ par champ.
- **Seuils de validation** : un rôle peut valider jusqu'à un montant ou un pourcentage de remise, au-delà la demande remonte au niveau supérieur (circuits de validation, §7).

Les droits sont toujours vérifiés par le serveur, y compris quand un écran est ouvert directement par son adresse. Un utilisateur peut cumuler plusieurs rôles et plusieurs sites.

