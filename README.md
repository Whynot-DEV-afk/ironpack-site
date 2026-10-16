# IRONPACK Website

Site officiel statique, HTML/CSS/JS, hébergé sur Vercel à **ironpack.app**.
Pas de compilation : un push sur main déclenche le déploiement Vercel.

## Structure

- parrainage.html, parrainage.css, parrainage.js : invitation personnelle via `/parrainage?code=…`. Code opaque validé localement, copie au geste, lien vers l’app déjà installée. Aucun suivi publicitaire ni cookie. Pas de téléchargement public tant que les stores ne sont pas disponibles ; lien vers les informations bêta et saisie manuelle après installation. Le serveur de l’app vérifie le code lors de son association, jamais la page publique. Conditions de points visibles ; aucun gain pour l’installation seule.

- index.html : présentation et inscription aux nouvelles de la bêta.
- cinema.*, refinement.css, features.* : scènes et présentation.
- phone-fit.* : projection de la capture dans les deux téléphones.
- assets/app-navigation-mapbox.jpg : capture fournie par le porteur du projet,
  reprise pour remplacer l'ancienne interface. Elle montre la navigation Mapbox
  avant les dernières finitions de flou natif ; ce n'est pas une capture d'une
  nouvelle exécution de l'application. Remplacer par une nouvelle capture réelle
  après une nouvelle livraison mobile. Ne pas recréer une fausse capture par IA.
- fonts.css, assets/fonts/ : Antonio et Inter servis localement, licences OFL.
- mentions-legales.html, confidentialite.html, cookies.html,
  conditions-utilisation.html, legal.css : informations légales du site.
- privacy-consent.js : autorisation facultative du formulaire externe.
- app.js, inscription.html, signup-frame.js : chargement isolé du formulaire.
- vercel.json : URLs sans extension, par exemple /cookies.

## Consentement et inscription

Le site ne charge pas les polices Google à distance et n'intègre pas de mesure
d'audience ni de publicité. Le bouton « Je rejoins la meute » demande l'autorisation
du formulaire MailerLite (compte 2303043, formulaire 32ntZJ). Refuser et autoriser
sont présentés avec la même importance. Une préférence en localStorage,
ironpack.privacy.v1, dure 180 jours dans les deux cas. Si le stockage est bloqué,
elle ne vaut que dans la page ouverte. Fermer la fenêtre ne vaut pas consentement.

Après autorisation ET demande d'ouverture, une iframe du même site reçoit le
signal de chargement du fournisseur. Ouvrir /inscription directement ne charge
pas MailerLite. Le refus retire l'iframe immédiatement et nettoie les éléments du
prestataire accessibles sur notre domaine, sans promettre la suppression de cookies
sur des domaines tiers. Les autres onglets et l'expiration du choix sont pris en compte.

Le formulaire demande un accord distinct, non précoché, pour les nouvelles et
invitations de la bêta. Le bouton reste désactivé avant cet accord. MailerLite
réceptionne l'inscription et affiche son propre résultat. Les erreurs/temps d'attente
sont affichés ; le site ne simule jamais une inscription réussie.

Le contrôle ajouté dans le navigateur ne prouve pas, à lui seul, l'archivage du
consentement côté prestataire. Conserver les versions du formulaire et configurer
dans MailerLite la preuve de consentement, le double opt-in si retenu, la durée de
conservation et la suppression des contacts devenus inutiles. Les paramètres du
compte et l'envoi réel n'ont pas été vérifiés lors de cette modification. Aucun
abonné réel ni aucune adresse de test n'a été soumis.

## Informations confirmées par l'éditeur le 11 octobre 2026

Youssef Sbai, particulier en France ; site actuellement non professionnel,
coordonnées personnelles complètes fournies à Vercel ; marque IRONPACK déposée.
Le numéro, le titulaire et le territoire du dépôt n'ont pas été vérifiés : aucun
numéro ni territoire n'est inventé sur le site. Le contact est contact@ironpack.app.
Le régime d'édition non professionnelle doit être réexaminé si l'activité change.
Les pages concernent le site vitrine et la liste bêta, pas les traitements de l'app.

## Vérification

Commande : node --test tests/privacy.test.cjs

Vérifie les choix, leur durée, les refus, la synchronisation entre onglets et les
liens/ressources des pages. Contrôler aussi dans un navigateur : premier affichage
sans iframe externe, refus, accord puis ouverture du vrai formulaire, case newsletter
et retrait de l'accord. Ne pas envoyer d'adresse sans autorisation. Vérifier le
pied de page et le dialogue à 390 px de large, puis les deux scènes de téléphone.
