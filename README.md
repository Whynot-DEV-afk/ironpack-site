# IRONPACK Website

Site officiel d'IRONPACK — Entre dans la meute.

Site statique HTML/CSS/JS, sans outil de compilation : ce qui est dans le dépôt est
exactement ce qui est servi. Déployé sur Vercel à l'adresse **ironpack.app**.

## Structure

- `index.html` — la page, en un seul fichier
- `cinema.css` / `cinema.js` — la mise en scène animée du haut de page
- `features.css` / `features.js` — les sections de présentation
- `phone-fit.css` / `phone-fit.js` — l'ajustement sur téléphone
- `refinement.css` — les finitions
- `app.js` — le chargement du formulaire d'inscription à la bêta
- `assets/` — images et logos
- `vercel.json` — configuration Vercel

## L'inscription à la bêta

Le bouton « Je rejoins la meute » charge **à la demande** le formulaire MailerLite
(compte `2303043`, formulaire `32ntZJ`), puis c'est MailerLite qui reçoit l'adresse,
répond et déclenche le mail de bienvenue.

Ce chargement à la demande n'est pas qu'une question de vitesse : tant que personne
ne clique, aucun script tiers ne se charge et rien n'est déposé dans le navigateur du
visiteur.

Si le script ne se charge pas — les bloqueurs de publicité coupent souvent
`assets.mailerlite.com` — la page le dit et affiche `contact@ironpack.app`. Elle ne
prétend jamais que l'inscription a eu lieu : c'est MailerLite lui-même qui confirme,
dans son propre formulaire.

## Déploiement

Push sur `main` → Vercel redéploie automatiquement, en quelques secondes.

🏍️ Made in Europe, for European riders.
