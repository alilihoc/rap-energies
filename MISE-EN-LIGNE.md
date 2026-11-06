# Mise en ligne de Rap Énergies sur Hostinger

Même solution que maf-menuiserie.fr : **le compte Hostinger de Mon Petit Site** (celui de mon-petit-site.fr, LiteSpeed, hPanel, PHP, SSH sur le port 65002), le site du client ajouté comme site supplémentaire dans `~/domains/<domaine>/public_html`, publication par `outils/deployer.sh`, formulaire `envoyer.php` qui envoie la demande par e-mail avec la fonction `mail()` de l'hébergeur, sans service tiers, sans cookie, sans copie sur le serveur.

**État au 3 novembre 2026 : le site « Plein midi » est en ligne sur https://rap-energies.fr/ avec son administration sur https://rap-energies.fr/admin/**, déployés avec `bash outils/deployer.sh rap-energies.fr --oui` (première mise en ligne le 2 novembre, redéploiements le 3 après la passe d'amélioration issue de la critique UX puis avec l'administration), avec encore les photos provisoires et les crochets `[À CONFIRMER]`. L'aperçu `/design2/` du second template a été supprimé du serveur le 3 novembre (sauvegarde `~/backups/rap-energies.fr-design2-20261103-103941.tar.gz`), le template étant archivé dans `archives/template-2/`. Le compte Hostinger a changé de serveur : l'adresse SSH est `u570076504@195.179.238.218` (port 65002, serveur us-imm-web1280, CloudLinux, PHP 8.2 avec GD, WebP, AVIF, exif et Imagick) ; l'ancienne adresse 46.202.156.246 répond `/sbin/nologin`. Le formulaire envoie à rapenergies@gmail.com (aucun `config.php` d'essai posé) ; l'essai réel du formulaire depuis le site reste à faire.

## Ce que le déploiement envoie

`node outils/build.mjs --prod --domaine <domaine>` écrit dans `dist/template-1/` une copie de production du site : `index.html` avec le formulaire branché sur `envoyer.php` et la galerie entre ses repères, `mentions-legales.html`, `confidentialite.html`, `merci.html` (confirmation sans JavaScript), `404.html`, `envoyer.php`, `.htaccess` (HTTPS, sans www, en-têtes de sécurité, cache, protections de l'administration), `robots.txt` (`Disallow: /admin/`), `sitemap.xml`, `style.css`, `script.js`, `fonts/`, `images/`, et `admin/` (page PHP, bibliothèque, feuille de style, `.htaccess`, `gabarit.json`, `realisations.json` initial, `config.php` si `src/prod/admin-config.php` existe). Les adresses canoniques, le sitemap et les données structurées portent le domaine donné. Le dossier `dist/` est ignoré par git.

## Administration en ligne

`https://<domaine>/admin/` : le client ajoute, modifie, réordonne et retire ses photos de chantiers ; chaque enregistrement réécrit la galerie de `index.html` sur le serveur (même balisage que la construction Node). Mot de passe : `php outils/mot-de-passe.php` écrit `src/prod/admin-config.php` (haché) et `src/prod/admin-mot-de-passe.txt` (clair, à envoyer au client à part), ignorés par git ; le déploiement installe `admin/config.php` en 600. Ce que le serveur garde en propre et que le déploiement ne touche jamais : `admin/config.php`, `admin/sources/` (photos envoyées, 1 800 px), `admin/corbeille/` (photos retirées), `admin/tentatives.json` (blocage des essais). Avant chaque construction, `outils/recuperer.sh <domaine>` rapatrie `admin/realisations.json` dans `src/realisations.json` et `admin/sources/*.jpg` dans `images/sources/` : la copie locale repart toujours de l'état du serveur, et `images.mjs` produit les dérivés manquants. Règle au quotidien : modifier la galerie en ligne, jamais dans `src/realisations.json` à la main sans avoir rapatrié d'abord.

Essais : `bash .impeccable/outils/test-admin.sh` en local (sur `dist/template-1`, PHP du poste, 23 contrôles dont l'identité octet pour octet de la galerie régénérée) ; `bash .impeccable/outils/test-admin-en-ligne.sh https://<domaine>` après déploiement (20 contrôles : protections 403, connexion, régénération sans changement, ajout d'une photo d'essai visible sur la page publique, retrait, page revenue à l'identique). Mode d'emploi à envoyer au client : `MODE-EMPLOI-CLIENT.md`. Pour remettre une photo retirée : la reprendre dans `admin/corbeille/` sur le serveur (ou dans `images/sources/` en local si elle y était) et la réenvoyer par l'administration.

## Avant de publier

1. **Choix du template** par le client, et réponses aux questions de `QUESTIONS-CLIENT.md` reportées dans `src/contenu.mjs` (le script de déploiement avertit si des crochets `[À CONFIRMER]` restent visibles).
2. **Nom de domaine** : rap-energies.fr. Vérifier dans hPanel à qui il appartient et où sont ses DNS ; si le client le possède ailleurs, faire pointer le domaine vers Hostinger (ou le transférer). Puis **Sites web, Ajouter un site web** sur l'hébergement existant : hPanel crée `~/domains/rap-energies.fr/public_html` et le certificat HTTPS. Le script refuse de déployer tant que ce dossier n'existe pas.
3. **Photos** : remplacer les photos provisoires par celles du client avec l'administration locale (`node admin/serveur.mjs`), décocher « photo provisoire » ; quand il n'en reste plus, retirer le paragraphe « photos provisoires » des mentions légales (`src/contenu.mjs`, `legal.mentions`). Le script avertit tant que la galerie contient des photos provisoires.
4. **Mentions légales** : hébergeur à renseigner (Hostinger International Ltd, 61 Lordou Vironos Street, 6023 Larnaca, Chypre, comme sur maf-menuiserie.fr) et président confirmé.
5. **Adresse d'expédition** du formulaire : `envoyer.php` envoie depuis `site@<domaine>`. Pour que Gmail accepte les messages, le domaine doit avoir un SPF qui autorise Hostinger : automatique si les DNS du domaine sont chez Hostinger (`v=spf1 include:_spf.mail.hostinger.com ~all`). Si les premiers essais arrivent dans les indésirables, créer la boîte `site@<domaine>` dans hPanel et passer `envoyer.php` en SMTP, seulement si nécessaire.
6. **Essai local du formulaire** (PHP installé sur le poste) :
   ```bash
   node outils/build.mjs --prod --domaine rap-energies.fr template-1
   bash .impeccable/outils/test-formulaire.sh template-1      # validations, pot de miel, JSON, sans script, navigateur
   ```

## Publier

```bash
bash outils/deployer.sh rap-energies.fr            # --oui pour ne rien demander ; --sans-recuperer à éviter
```

Depuis Git Bash (PowerShell ajoute un BOM aux scripts passés par ssh). Le script rapatrie les données de l'administration en ligne, construit `dist/template-1/`, l'archive, l'envoie par scp, sauvegarde l'ancien contenu du serveur dans `~/backups/<domaine>[-<sous-dossier>]-<date>.tar.gz`, extrait dans un dossier temporaire et `rsync --delete` dans `public_html` (ou dans son sous-dossier) avec les droits 755/644 en préservant ce que le serveur garde en propre, installe `admin/config.php`, puis vérifie les codes HTTP de l'accueil, des pages légales, du sitemap, du robots, de la page merci, de la page 404, de l'administration (200) et de ses fichiers protégés (403). Variables `HOSTINGER_SSH` et `HOSTINGER_PORT` si le compte change. Il ne touche à aucun autre dossier de `~/domains/`. L'option `--sous-dossier <nom>` publie une copie d'aperçu en `noindex` dans un sous-dossier (c'est ainsi que `/design2/` a servi à comparer les deux templates).

**Sous-dossier d'aperçu** (`--sous-dossier <nom>`) : `build.mjs --chemin <nom>` produit une copie dont les adresses canoniques et les données structurées pointent vers le sous-dossier, dont toutes les pages portent `<meta name="robots" content="noindex, follow">`, dont le `.htaccess` a `RewriteBase`, `ErrorDocument` et un en-tête `X-Robots-Tag: noindex` adaptés, et qui n'a ni `robots.txt` ni `sitemap.xml`. Le robots.txt de la racine n'interdit pas ces dossiers : un `Disallow` empêcherait les robots de lire le `noindex`. Un déploiement à la racine préserve toujours les dossiers `design*/` ; un déploiement de sous-dossier ne remplace que ce sous-dossier. L'aperçu `/design2/` a été retiré le 3 novembre 2026 (`rm -rf ~/domains/rap-energies.fr/public_html/design2`, sauvegarde dans `~/backups/`).

Le CDN de Hostinger (`Server: hcdn`) garde les redirections 301 en cache quelques minutes : après un changement de `.htaccess`, vérifier avec un paramètre (`?v=2`) ou attendre.

Aucun déploiement ne se fait depuis une session Claude sans accord explicite : la connexion SSH au serveur de production est une action à autoriser.

## Après le déploiement

1. **Essai du formulaire vers ton adresse** : créer `src/prod/config.php` avec `<?php define('DESTINATAIRE', 'ton@adresse');` (ignoré par git, copié dans `dist/` à la construction), déployer, envoyer une demande depuis le site, vérifier la réception et les indésirables, supprimer `config.php`, redéployer. Puis un second essai dont le client confirme la réception sur rapenergies@gmail.com.
2. Contrôles en ligne : `https://<domaine>/` en HTTPS, `http://www.<domaine>/` redirige vers l'apex en HTTPS, `/mentions-legales.html`, `/confidentialite.html`, `/robots.txt`, `/sitemap.xml` répondent, `/nimporte` affiche la page 404, `curl -I https://<domaine>/` montre les en-têtes de sécurité, aucune erreur dans la console du navigateur, le lien `tel:` ouvre le téléphone sur mobile, la visionneuse s'ouvre. Dans un vrai navigateur (polices chargées, images, débordement, erreurs de console, canonique, robots) : `node .impeccable/mesures/controle-en-ligne.mjs https://rap-energies.fr/design2/ design2` (sans arguments : la racine).
3. Référencement : déclarer le site dans Google Search Console (validation DNS dans hPanel), soumettre `sitemap.xml`, créer ou compléter la fiche Google de l'entreprise avec l'adresse du site, tester la page sur https://validator.schema.org.
4. Envoyer au client le lien, lui dire où arrivent les demandes et lui demander de surveiller les indésirables la première semaine.
5. Coûts récurrents : le domaine seulement ; l'hébergement est celui de Mon Petit Site.

## Retour en arrière

La sauvegarde faite par le script est sur le serveur dans `~/backups/`. Pour la remettre :
```bash
ssh -p 65002 u570076504@195.179.238.218 'D=~/domains/rap-energies.fr/public_html; T=$(mktemp -d); tar -xzf ~/backups/<archive>.tar.gz -C "$T"; rsync -a --delete --no-perms --chmod=D755,F644 "$T"/ "$D"/; rm -rf "$T"; ls "$D"'
```
