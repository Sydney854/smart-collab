# Smart Collab — 11. Sécurité, traçabilité et exigences non fonctionnelles

> Extrait de `00_CAHIER_DES_CHARGES_COMPLET.md`. En cas d'écart, le cahier complet fait foi.

Les données d'une entreprise cliente ne doivent jamais être visibles d'une autre, et toute opération sensible doit pouvoir être retrouvée : ce sont les deux exigences qui priment sur toutes les autres.

### Sécurité

- **ENF-SEC-01** Isolation des entreprises impôsée par la base (sécurité au niveau des lignes) et vérifiée par des tests automatiques à chaque livraison.
- **ENF-SEC-02** Connexion par e-mail et mot de passe (stocké haché), double authentification proposable, politique de mot de passe et durée de session réglables, verrouillage après échecs répétés.
- **ENF-SEC-03** Droits vérifiés par le serveur à chaque action ; le rôle est lu dans la session, jamais dans la requête.
- **ENF-SEC-04** HTTPS partout ; fichiers et sauvegardes chiffrés.
- **ENF-SEC-05** Demandes de suppression de données personnelles traitées par un circuit validé et tracé. Conformité à la loi ivoirienne 2013-450 (déclaration et autorisations ARTCI) et aux lois équivalentes des pays de l'UEMOA servis.

### Mise en œuvre avec Supabase et Vercel (à valider)

| N° | Mesure | Ce qu'elle protège |
| --- | --- | --- |
| SEC-MO-01 | Sécurité au niveau des lignes activée et **forcée** sur toutes les tables, entreprise lue dans le jeton de connexion ; aucune table sans règle ; test automatique « un utilisateur de l'entreprise A ne voit rien de B » à chaque livraison | Isolation des entreprises (ENF-SEC-01) |
| SEC-MO-02 | Clé d'administration Supabase (`service_role`) jamais dans le navigateur ni dans le code de l'écran : seulement dans les fonctions serveur et les variables secrètes de Vercel | Contournement total de la sécurité |
| SEC-MO-03 | Rôle et entreprise ajoutés au jeton par la base (« custom claims »), jamais choisis par l'écran ; chaque action sensible revérifiée par une fonction SQL ou serveur | Droits (ENF-SEC-03) |
| SEC-MO-04 | Supabase Auth : mots de passe longs, vérification de l'e-mail, double authentification obligatoire pour les administrateurs et l'éditeur, durée de session et verrouillage réglés, protection contre les robots sur la connexion | Comptes (ENF-SEC-02) |
| SEC-MO-05 | Fichiers dans des dossiers privés par entreprise, liens de téléchargement signés et à durée limitée | Justificatifs, bulletins, photos |
| SEC-MO-06 | Paiements : aucune donnée de carte chez nous (page de paiement Stripe) ; messages de retour Stripe et mobile money (webhooks) vérifiés par signature et traités une seule fois | Fraude, double encaissement |
| SEC-MO-07 | Vercel : HTTPS forcé, en-têtes de sécurité (CSP, HSTS, anti-iframe), limitation du nombre de requêtes sur la connexion et les API, préversions protégées par mot de passe, secrets séparés par environnement (test, démo, production) | Attaques web, fuite par une préversion |
| SEC-MO-08 | Sauvegardes Supabase avec restauration à un instant donné (offre payante), restauration testée chaque mois ; données en région Paris | Perte de données, localisation |
| SEC-MO-09 | Accès aux consoles Supabase, Vercel, Stripe et GitHub : comptes nominatifs, double authentification, droits minimum, revue trimestrielle | Prise de contrôle de l'infrastructure |
| SEC-MO-10 | Journal d'audit en ajout seul dans la base (aucune modification ni suppression possible, même par l'application) ; journal des connexions Supabase conservé | Traçabilité (ENF-TRA-01, 02) |
| SEC-MO-11 | Base locale hors ligne (IndexedDB) limitée aux données du site et vidée à la déconnexion ; durée maximale hors ligne (EF-OFF-02) | Vol ou perte d'un appareil de caisse |
| SEC-MO-12 | Dépendances surveillées (alertes GitHub), revue de sécurité avant chaque lot, test d'intrusion externe avant la commercialisation | Failles connues |

### Traçabilité

- **ENF-TRA-01** Journal des opérations non modifiable : utilisateur, date, heure, appareil, ancienne et nouvelle valeur, motif, validation.
- **ENF-TRA-02** Journal des accès : connexions, échecs, changements de rôle.
- **ENF-TRA-03** Toute modification sensible est réversible par une opération inverse tracée.

### Performance et disponibilité

| Mesure | Cible |
| --- | --- |
| Ajout d'une ligne au panier de caisse | Moins de 300 ms perçus |
| Validation d'un ticket | Moins de 1,5 s, écritures comprises |
| Ouverture d'un tableau de bord | Moins de 2 s |
| Recherche dans le catalogue | Moins de 500 ms sur 50 000 références |
| Disponibilité du service | 99,5 % par mois (proposé) |
| Sauvegarde | Quotidienne, conservée 30 jours, restauration testée chaque mois |
| Perte de données maximale en cas d'incident | 24 heures en ligne ; aucune pour les opérations en file hors ligne |

### Usage

- **ENF-USA-01** Navigateurs Chrome, Edge, Firefox et Safari récents ; caisse optimisée à partir de 1 280 px, autres écrans utilisables dès 390 px (téléphone).
- **ENF-USA-02** Interface, documents imprimés et site commercial en français et en anglais dès le lancement, langue choisie par utilisateur, prêts pour d'autres langues ; montants, dates et fuseau horaire selon l'entreprise.
- **ENF-USA-03** Contrastes et navigation au clavier conformes au niveau AA des règles d'accessibilité web.
- **ENF-USA-04** Une entreprise cliente peut exporter toutes ses données à tout moment.

