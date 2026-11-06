# Product

<!-- impeccable:product-schema 1 -->

Rédigé le 30 octobre 2026 à partir de `recherche-et-textes.md` (recherche validée) et de `spec.md`, sans entretien : l'utilisateur a demandé d'avancer et de garder les questions pour la fin. Les faits déduits plutôt que confirmés sont marqués *(déduit)*.

## Platform

web

## Stack

delegated : HTML, CSS et JavaScript statiques, sans framework ni dépendance à l'exécution, parce que le site doit être un dossier autonome ouvrable directement depuis le disque (`template-1/` ; le second template est archivé dans `archives/template-2/`). L'administration des réalisations est une page PHP sans base de données (`src/prod/admin/`), déployée dans `/admin/` chez l'hébergeur, qui réécrit la galerie de la page statique. Un petit outillage Node (`outils/`) génère les dérivés d'images (AVIF, WebP, plusieurs largeurs) et applique la typographie française aux textes au moment de la construction ; il n'est pas nécessaire pour consulter le résultat. Polices variables auto-hébergées. Aucune ressource chargée depuis un autre domaine, aucun cookie ni stockage, aucun traceur.

## Users

Propriétaires de maisons individuelles à Castries et dans les communes de l'est de Montpellier (Vendargues, Baillargues, Saint-Brès, Saint-Aunès, Le Crès, Jacou, Teyran, Clapiers, Assas, Guzargues, Saint-Drézéry, Sussargues, Beaulieu, Restinclières, Montaud, Montpellier). Ils veulent faire baisser leur facture d'énergie ou remplacer un chauffage vieillissant, comparent deux ou trois installateurs, et cherchent quelqu'un de sérieux et proche à qui téléphoner. Ils arrivent sur le site depuis une recherche locale, un bouche-à-oreille ou un devis déjà reçu ailleurs, souvent sur téléphone *(déduit)*.

Audience secondaire : le dirigeant de Rap Énergies lui-même, qui doit choisir entre deux templates le 2 novembre 2026 et se reconnaître dans la page.

## Product Purpose

Site vitrine d'une page pour Rap Énergies (RAP ENERGIES SAS, Castries), électricien qualifié RGE par Qualifelec qui installe trois équipements : panneaux solaires photovoltaïques, pompes à chaleur de chauffage, chauffe-eau thermodynamiques. Le site est la première et seule présence en ligne de l'entreprise (pas de fiche Google, aucun avis, aucun site auparavant). Succès : le visiteur comprend en quelques secondes qui est l'entreprise, ce qu'elle pose et où, voit de vrais chantiers, puis appelle le 06 99 34 66 86 ou envoie le formulaire. Deux templates aux directions nettement différentes ont été produits pour que le client choisisse ; le studio a mis « Plein midi » en ligne sur rap-energies.fr le 2 novembre 2026 et archivé le second le 3 novembre, le client tranchant sur cette base.

## Positioning

Un électricien de métier, de Castries, qualifié RGE Qualifelec pour les trois équipements à la fois. Les concurrents locaux sont soit des climaticiens (QualiPAC), soit des « solaristes » (QualiPV), soit de gros acteurs régionaux qui démarchent à domicile. Rap Énergies intervient dans un rayon d'une quinzaine de kilomètres, et présente ses estimations de production comme des estimations PVGIS pour l'adresse du client, pas comme des promesses d'économies.

## Operating Context

- Le visiteur compare des devis et vérifie la qualification RGE (condition des aides publiques).
- Le contact se fait par téléphone (lien `tel:`) ou par un formulaire court qui aboutit à rapenergies@gmail.com ; la solution d'envoi sera celle de maf-menuiserie.fr (à renseigner à la mise en ligne).
- Le client enverra ses photos de chantiers ; en attendant, des photos provisoires signalées, à remplacer, tiennent la place.
- Mon Petit Site (mon-petit-site.fr) réalise le site ; prix convenu 149 €, une page, sans abonnement.

## Capabilities and Constraints

- Une seule page avec ancres : accroche, réalisations (galerie en grille responsive, agrandissement au clic, légendes), services, production PVGIS à Castries, comment ça se passe, zone, réassurance, questions fréquentes, contact et formulaire, pied de page ; plus deux pages légales (mentions légales, confidentialité).
- Textes définitifs dans `recherche-et-textes.md` § 5, repris tels quels ; les crochets **[À CONFIRMER]** et **[À COMPLÉTER]** restent visibles dans les templates jusqu'à validation par le client.
- Interdits éditoriaux : aucun avis, note, nombre d'années d'expérience, nombre d'installations, garantie, délai, marque de matériel, montant d'aide, « devis gratuit » tant que le client ne les a pas confirmés. Les chiffres de production restent des estimations PVGIS présentées comme telles.
- Technique : statique, autonome, responsive (320 px à 1440 px et plus), aucune ressource externe, aucun cookie, polices sous 200 Ko par page, images optimisées au build, tout visible sans JavaScript.
- Référencement : `title` « Panneaux solaires et pompes à chaleur à Castries | Rap Énergies », meta description, données structurées LocalBusiness limitées aux informations vérifiées, URL canonique https://rap-energies.fr/.
- Décisions ouvertes (questions pour le client, § 6 de la recherche) : identité du président pour les mentions légales, renouvellement de la qualification RGE pompe à chaleur au 6 novembre 2026, devis gratuit ou non, démarches prises en charge, démarchage, climatisation réversible, liste des communes, logo retenu, horaires, SAV, hébergeur.

## Brand Commitments

- Nom : « Rap Énergies » dans les textes (avec accent, comme sur le logo), « RAP ENERGIES SAS » dans les mentions légales.
- Logos fournis dans `images/` : variante carrée (carré arrondi bleu, orange, jaune, feuille verte, nom en capitales grasses dessous ; 800 × 800 à fond crème opaque, et 143 × 143 à fond transparent) et variante ronde (anneau de vagues vert, orange, jaune, bleu, nom au centre). Les deux templates utilisent la variante carrée, le petit fichier transparent sert de favicon et de logo réduit. Le fond crème des grands fichiers doit être retiré ou assorti.
- Ton : engageant, concret, orienté bénéfices client, sans formules creuses ; vouvoiement ; un électricien qui parle.
- Coordonnées : 570 avenue de la Royale, 34160 Castries ; 06 99 34 66 86 ; rapenergies@gmail.com.

## Evidence on Hand

- Registre national des entreprises (SIREN 834 807 810, SAS au capital de 10 000 €, NAF 43.21A, 3 à 5 salariés, président Kevin Hainaut au 30/10/2026).
- Qualifications RGE Qualifelec 43SPVRGE (photovoltaïque, valide jusqu'au 24 avril 2027), 48PACRGE et 48PACRGEc (pompe à chaleur chauffage et chauffe-eau thermodynamique, validité affichée jusqu'au 6 novembre 2026).
- Estimation PVGIS 5.3 pour Castries : 1 kWc plein sud à 30° produit environ 1 500 kWh par an, détail mensuel dans `recherche-et-textes.md` § 2.1.
- Logos : `images/6817aee43100005fc5761b66.png`, `images/6817af042d000027939a8592.png`, `images/68225512310000ec387824ff.png`.
- Absences à ne pas fabriquer : aucune photo de chantier reçue, aucun avis client, aucun témoignage, aucune marque, aucun chiffre d'activité, aucun numéro de certificat.

## Product Principles

1. Prouver par les chantiers : les photos de réalisations légendées sont la preuve que les concurrents n'ont pas, elles passent avant les discours.
2. Appeler est l'action : téléphone et formulaire dès le premier écran, un seul libellé par intention sur toute la page.
3. Dire vrai, dire local : des communes nommées plutôt qu'un département, des estimations PVGIS plutôt que des promesses, des crochets visibles plutôt que des inventions.
4. Un électricien, trois équipements : la page explique comment panneaux, pompe à chaleur et chauffe-eau se complètent, par la voix du métier.
5. Deux mondes nettement différents ont été proposés (textes, logo et structure communs ; couleur, premier écran et typographie distincts) ; un seul vit désormais, « Plein midi », et l'administration en ligne parle sa langue visuelle.

## Accessibility & Inclusion

Public large, souvent de plus de cinquante ans, sur téléphone en plein jour *(déduit)* : corps de texte de 17 à 19 px, contrastes mesurés (texte courant au moins 4,5:1), cibles tactiles généreuses, tout lisible sans JavaScript, mouvements réduits respectés, lien d'évitement, focus visible, galerie utilisable au clavier.
