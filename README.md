# Rap Énergies : site d'une page et administration des réalisations

Site vitrine de Rap Énergies (électricien RGE Qualifelec, Castries) : une page avec ancres, deux pages légales, un formulaire de contact et une galerie de chantiers que le client gère lui-même en ligne. Le design retenu est « Plein midi » (clair, les trois couleurs du logo données chacune à un équipement, Bricolage Grotesque et Hanken Grotesk) ; la seconde proposition, « Le soir, la maison chauffe », est archivée dans `archives/template-2/` avec ses sources, sa fiche et son contrat, et peut être reconstruite si le client la préfère.

**Ouvrir en local** : double-clic sur `template-1/index.html`. Aucun serveur, aucune connexion nécessaire. **En ligne** : https://rap-energies.fr/ ; administration : https://rap-energies.fr/admin/.

## Ce que fait la page

- Premier écran : titre, bouton d'appel, triptyque de trois photos teintées aux couleurs du logo avec le nom de chaque équipement ; le titre et le triptyque se lèvent à l'ouverture.
- Galerie « Nos chantiers » en mosaïque, légendes (équipement, type de toit, commune, détail), agrandissement au clic, navigable au clavier et au doigt. Les quatre photos actuelles sont **provisoires** (Pexels, marques de fabricant effacées) et la galerie le dit une fois sous son introduction ; elles seront remplacées par les photos du client via l'administration (provenance dans `docs/images.md`, attentes dans `template-1/images/A-REMPLACER.md`).
- Services avec la photo de chaque équipement, graphique de production PVGIS pour Castries (le total en grand, douze barres qui poussent à l'entrée dans l'écran), étapes, communes, arguments, questions fréquentes, contact dans un champ Encre.
- Les crochets `[À CONFIRMER]` et `[À COMPLÉTER]` restent visibles, encadrés en pointillé, jusqu'aux réponses du client (`QUESTIONS-CLIENT.md`).
- Aucune ressource externe, aucun cookie, aucun traceur ; polices auto-hébergées ; images AVIF et WebP en quatre largeurs ; données structurées LocalBusiness, `robots.txt`, `sitemap.xml` ; tout lisible sans JavaScript et sans mouvement.

## Administration des réalisations (en ligne, PHP)

`src/prod/admin/` est déployé dans `/admin/` du site : une page PHP sans base de données, protégée par un mot de passe haché (`admin/config.php`, généré par `php outils/mot-de-passe.php`), session sécurisée, jeton anti-CSRF, cinq essais de connexion puis un quart d'heure de blocage. Le client y ajoute, modifie, réordonne et retire ses photos depuis son téléphone (`MODE-EMPLOI-CLIENT.md`).

- Les fiches sont dans `admin/realisations.json` (fichier, équipement, titre, lieu, commune, détail, texte alternatif, cadrage, provisoire) ; les photos envoyées sont redressées, ramenées à 1 800 px, débarrassées de leurs métadonnées et gardées dans `admin/sources/` ; les dérivés AVIF, WebP et JPEG sont écrits dans `images/` ; la section « Nos chantiers » de `index.html` est réécrite entre deux repères, avec exactement le balisage de la construction Node (vérifié octet pour octet par `.impeccable/outils/test-admin.sh`).
- Le design est celui du site (même feuille de tokens, mêmes polices, un carré de couleur par équipement).
- Avant chaque déploiement, `outils/recuperer.sh` rapatrie `admin/realisations.json` et `admin/sources/` du serveur dans `src/realisations.json` et `images/sources/` : un redéploiement n'écrase jamais ce que le client a ajouté. Le serveur garde en propre `admin/config.php`, `admin/sources/`, `admin/corbeille/` et `admin/tentatives.json`.
- Essai local complet : `node outils/build.mjs --prod --domaine rap-energies.fr && bash .impeccable/outils/test-admin.sh` (PHP installé sur le poste).

L'ancienne administration Node, locale, est archivée dans `archives/admin-node/`.

## Mise en ligne (Hostinger)

Même procédure que maf-menuiserie.fr, détaillée dans `MISE-EN-LIGNE.md` :

```
bash outils/deployer.sh rap-energies.fr --oui
```

rapatrie les données de l'administration, construit la copie de production dans `dist/template-1/` (formulaire branché sur `envoyer.php`, pages `merci.html` et `404.html`, `.htaccess` avec HTTPS et en-têtes de sécurité, administration dans `admin/`), l'envoie par SSH, sauvegarde l'ancien contenu, installe le mot de passe de l'administration et vérifie les pages en ligne. Le formulaire envoie la demande par e-mail à rapenergies@gmail.com avec `mail()` de l'hébergeur.

## Reconstruire après une modification

```
node outils/images.mjs      # dérivés d'images (après ajout de photos dans images/sources/)
node outils/build.mjs       # pages HTML, CSS, scripts, polices, dans template-1/
```

Textes : `src/contenu.mjs` (les fiches de la galerie : `src/realisations.json`). Mise en page : `src/template-1/`, `src/commun/`. Production : `src/prod/`. Méthode et décisions : `docs/directions.md`, `docs/systemes/design-1.md`, `DESIGN.md`, `REPRISE.md`.
