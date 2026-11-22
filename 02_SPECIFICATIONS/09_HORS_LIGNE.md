# Smart Collab — 9. Mode hors ligne

> Extrait de `00_CAHIER_DES_CHARGES_COMPLET.md`. En cas d'écart, le cahier complet fait foi.

Cinq familles d'écrans continuent de fonctionner pendant une coupure internet, puis envoient leurs opérations au serveur au retour de la connexion. Le reste de l'application (configuration, rapports, administration) demande une connexion.

| Écrans hors ligne | Métiers | Données gardées sur l'appareil |
| --- | --- | --- |
| Caisse | Commerce, multi-sites, génie électrique | Catalogue et prix du site, stock du site, clients, modes de règlement, session en cours |
| Inventaire (comptage) | Commerce, multi-sites, génie électrique | Produits et stock théorique du site, lots de comptage |
| Réception de marchandises et de transferts | Commerce, multi-sites, génie électrique | Commandes et bons de transfert attendus sur le site |
| Terrain chantier (compte-rendu, heures, matériel utilisé) | Génie électrique | Interventions du jour, besoins et stock du chantier |
| Saisie des temps | Conseil, génie électrique | Missions et tâches affectées à l'utilisateur |

### Fonctionnement

1. L'application s'installe sur le poste comme une application web installée ; ses écrans restent disponibles sans réseau.
2. Les données nécessaires au site et à l'utilisateur sont copiées dans le navigateur et rafraîchies dès que la connexion est là.
3. Chaque opération faite hors ligne reçoit un identifiant unique et un numéro provisoire propre à l'appareil, puis entre dans une file d'attente.
4. Au retour de la connexion, la file est envoyée dans l'ordre ; le serveur revérifie chaque opération et attribue le numéro définitif.
5. Une opération envoyée deux fois n'est enregistrée qu'une fois (clé d'idempotence).

### Règles en cas de conflit

- **Stock insuffisant découvert à la synchronisation** : la vente est conservée (le client est parti avec la marchandise) et une alerte part au gérant. Réglage possible : bloquer la vente hors ligne au-delà du stock local connu.
- **Prix modifié pendant la coupure** : le prix appliqué au moment de la vente est conservé.
- **Comptage d'inventaire sur un produit vendu entre-temps** : l'écart est recalculé à la date et l'heure du comptage.
- **Conflit non résolu automatiquement** : il entre dans une file de conflits à traiter par un responsable ; rien n'est perdu.

### Exigences

- **EF-OFF-01** Un bandeau indique en permanence en ligne ou hors ligne, et le nombre d'opérations en attente.
- **EF-OFF-02** Durée maximale de travail hors ligne réglable par entreprise (exemple : 72 heures), au-delà de laquelle la caisse demande une synchronisation.
- **EF-OFF-03** Les données locales sont chiffrées et effacées à la déconnexion de l'utilisateur, sauf la file non encore envoyée.
- **EF-OFF-04** Les calculs faits hors ligne utilisent le même moteur de règles que le serveur (EF-CFG-02).

