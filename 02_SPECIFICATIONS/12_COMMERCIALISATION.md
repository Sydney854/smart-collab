# Smart Collab — 12. Site commercial, démo en ligne et abonnements

> Extrait de `00_CAHIER_DES_CHARGES_COMPLET.md`. En cas d'écart, le cahier complet fait foi.

Smart Collab se vend comme DreamsERP se présente : un site qui montre le produit, une démo où l'on clique pour de vrai, une documentation publique. La différence : derrière la démo il y a un vrai logiciel, et le client s'abonne au lieu d'acheter des fichiers.

### Mode de vente retenu : les deux

Smart Collab se vend de deux façons. En abonnement en ligne, le client crée un compte et utilise le logiciel hébergé par l'éditeur, comme Odoo en ligne. En installation chez le client, le même logiciel est installé sur son serveur, avec une licence et un contrat de maintenance. Dans les deux cas, la facturation est au minimum annuelle.

### Le site commercial

| Page | Contenu |
| --- | --- |
| Accueil | Promesse, métiers couverts, captures, appel à l'essai et à la démo |
| Une page par métier | Problèmes résolus, modules pré-cochés, écrans clés, bouton vers la démo de ce métier |
| Modules | Catalogue des modules avec aperçu de chaque écran |
| Tarifs | Formules, prix, comparatif, modules complémentaires |
| Démo en ligne | Accès direct, sans inscription, à une entreprise fictive par métier |
| Documentation et historique des versions | Guides utilisateur et administrateur, nouveautés par version |
| Contact, essai gratuit, connexion | Formulaire, création de compte, accès client |

### Démo en ligne

- Une entreprise de démonstration par métier, avec des données fictives cohérentes (ventes, stocks, clients, missions, chantiers sur 12 mois).
- Un rôle choisissable à l'entrée (gérant, caissier, chef de mission…) pour voir l'application avec ses droits.
- Remise à zéro automatique chaque nuit.

### Essai, abonnement et console éditeur

- Essai gratuit de 14 jours (proposé) qui mène directement à l'assistant de première configuration.
- Formules par métier, puis prix selon le nombre d'utilisateurs, de sites et les applications complémentaires ; facturation annuelle au minimum, pluriannuelle possible.
- Installation chez le client : licence annuelle par clé, mises à jour incluses, prestation d'installation et de formation facturée à part.
- Paiement en ligne de l'abonnement par carte via **Stripe** (décision du 22/11/2026) et par mobile money **Wave et Orange Money** (puis MTN, Moov), par leurs API marchandes ou un agrégateur de la zone UEMOA ; accès de la société à Stripe à vérifier (voir `10_ARCHITECTURE_STACK.md`). Candidats à comparer : CinetPay et PayDunya ([comparatif août 2026](https://kolonell.com/fr/blog/agregateur-paiement-afrique-francophone-comparatif-cinetpay-paydunya-2026)). Le comparatif ne garantit pas leur prise en charge des abonnements récurrents : Smart Collab émet donc lui-même la facture annuelle et un lien de paiement, puis relance avant l'échéance.
- Console éditeur, séparée de l'application client : entreprises clientes, formules, applications complémentaires, licences d'installation, transactions, suspension en cas d'impayé, support. Les pages « Membership » de DreamsERP servent d'inspiration pour la maquette.

