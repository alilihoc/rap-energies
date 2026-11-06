# Rap Énergies : site d'une page

Site vitrine de Rap Énergies (électricien RGE Qualifelec, Castries) : une page avec ancres, deux pages légales et un formulaire de contact. Le design retenu est « Plein midi » (clair, les trois couleurs du logo données chacune à un équipement, Bricolage Grotesque et Hanken Grotesk). Deux choses ont été construites puis archivées, et peuvent être remontées : la seconde proposition de design, « Le soir, la maison chauffe » (`archives/template-2/`), et l'administration en ligne des photos (`archives/admin-php/`, retirée à la demande du client ; l'ancienne administration Node locale est dans `archives/admin-node/`).

**Ouvrir en local** : double-clic sur `template-1/index.html`. Aucun serveur, aucune connexion nécessaire. **En ligne** : https://rap-energies.fr/.

## Ce que fait la page

- Premier écran : titre, bouton d'appel, triptyque de trois photos teintées aux couleurs du logo avec le nom de chaque équipement ; le titre et le triptyque se lèvent à l'ouverture.
- Galerie « Les équipements en images » en mosaïque, légendes, agrandissement au clic, navigable au clavier et au doigt. Le client a choisi de garder des photos de banque d'images : la galerie annonce des « Photos d'illustration » et les mentions légales précisent qu'elles ne montrent pas des chantiers de l'entreprise (provenance dans `docs/images.md`, marche à suivre pour de vraies photos dans `template-1/images/A-REMPLACER.md`).
- Services avec la photo de chaque équipement, graphique de production PVGIS pour Castries (le total en grand, douze barres qui poussent à l'entrée dans l'écran), six étapes (devis gratuit, démarches prises en charge), communes, arguments, questions fréquentes, contact dans un champ Encre.
- Plus aucune note `[À CONFIRMER]` : le client a répondu (`QUESTIONS-CLIENT.md`, qui liste aussi les choix par défaut du studio).
- Aucune ressource externe, aucun cookie, aucun traceur ; polices auto-hébergées ; images AVIF et WebP en quatre largeurs ; données structurées LocalBusiness, `robots.txt`, `sitemap.xml` ; tout lisible sans JavaScript et sans mouvement.

## Mise en ligne (Hostinger)

Même procédure que maf-menuiserie.fr, détaillée dans `MISE-EN-LIGNE.md` :

```
bash outils/deployer.sh rap-energies.fr --oui
```

construit la copie de production dans `dist/template-1/` (formulaire branché sur `envoyer.php`, pages `merci.html` et `404.html`, `.htaccess` avec HTTPS et en-têtes de sécurité), l'envoie par SSH, sauvegarde l'ancien contenu et vérifie les pages en ligne. Le formulaire envoie la demande par e-mail à rapenergies@gmail.com avec `mail()` de l'hébergeur.

## Reconstruire après une modification

```
node outils/images.mjs      # dérivés d'images (après ajout de photos dans images/sources/)
node outils/build.mjs       # pages HTML, CSS, scripts, polices, dans template-1/
```

Textes : `src/contenu.mjs` (les fiches de la galerie : `src/realisations.json`). Mise en page : `src/template-1/`, `src/commun/`. Production : `src/prod/`. Méthode et décisions : `docs/directions.md`, `docs/systemes/design-1.md`, `DESIGN.md`, `REPRISE.md`.
