# Prompt : site de Rap Energies (Castries)

À coller dans une nouvelle session Claude Code ouverte sur ce projet (`C:\Users\hali\dev\prospection-mps`). Il ne reste
qu'une chose à compléter : la ligne « Hébergement et formulaire ».

---

Tu prépares le vrai site internet de Rap Energies, en **deux versions** que je présente au client lundi 2 novembre 2026 :
il choisira l'une des deux et c'est celle-là qui sera mise en ligne sur **rap-energies.fr**. Je suis Mon Petit Site
(mon-petit-site.fr), studio de sites pour artisans, seul, à Montpellier. Prix convenu : 149 €, une seule page, sans
abonnement. Le client m'a appelé après avoir vu la maquette ci-dessous ; il m'envoie ses photos de chantiers.

## Point de départ : la maquette

`02-mockups/mockups/rap-energies-castries-cadran-2125ca/index.html` (monde « cadran » : cadran solaire vertical calculé
pour Castries, production PVGIS mois par mois en arcades, simulateur orientation/puissance). Lis-la en entier avant de
commencer. C'est elle qui a donné envie au client d'appeler.

Travaille uniquement dans `clients/rap-energies/` ; ne modifie rien dans `02-mockups/`, `03-emails/` ou `04-suivi/`.

## Ce qu'on sait du client (vérifié)

- RAP ENERGIES, SAS, SIRET 834 807 810 00041, président : Kevin Hainaut.
- 570 avenue de la Royale, 34160 Castries.
- Téléphone : 06 99 34 66 86 (mobile). E-mail : rapenergies@gmail.com (reçoit aussi les demandes du formulaire).
- Métier : installation électrique (NAF 43.21A), qualifié RGE par Qualifelec pour trois domaines : panneaux solaires
  photovoltaïques, pompe à chaleur (chauffage), chauffe-eau thermodynamique.
- Pas de fiche Google, pas d'avis : n'en affiche aucun.
- Zone d'intervention (provisoire, il la corrigera) : Castries, Vendargues, Baillargues, Saint-Brès, Saint-Aunès,
  Le Crès, Jacou, Teyran, Clapiers, Assas, Guzargues, Saint-Drézéry, Sussargues, Beaulieu, Restinclières, Montaud,
  Montpellier.
- Nom de domaine : rap-energies.fr. Logo : il l'enverra plus tard ; en attendant, le nom en texte, et un emplacement
  prévu pour le logo (en-tête et favicon) facile à remplacer.

## Les deux versions

- `clients/rap-energies/site-a/` : **le cadran**. Copie de la maquette passée en site de production (voir plus bas).
  On garde son design, ses textes et ses manipulations ; ses photos de chantiers remplacent la photo d'illustration et
  alimentent une section « Réalisations ».
- `clients/rap-energies/site-b/` : **une version plus directe**, où ses réalisations passent en premier : ses photos
  de toits posés, de pompes à chaleur et de ballons, puis les trois services, la zone, l'appel et le formulaire.
  Elle a son propre monde visuel, physique et ancré à Castries (une matière, un lieu, un objet du métier, jamais un
  plan, un schéma ou une feuille de papier), différent du cadran. Garde au plus une manipulation simple, si elle sert
  le visiteur (par exemple l'estimation de production PVGIS de la maquette, réutilisée telle quelle).

Les deux versions partagent les mêmes informations, le même formulaire et les mêmes pages légales.

## Photos

Elles sont (ou arriveront) dans `clients/rap-energies/photos/`. Regarde-les toutes avant de choisir. Redimensionne-les
et passe-les en WebP dans `images/` de chaque version (un petit script Node sans dépendance ou une commande documentée),
avec des `alt` qui décrivent ce qu'on voit. Pas de photo floue, de visage reconnaissable de client, de plaque
d'immatriculation ni d'adresse lisible. S'il en manque, mets des images provisoires d'Unsplash vérifiées dans
`images/provisoires/` avec `A-REMPLACER.md` qui décrit la photo attendue. Aucune image marquée « Contenu généré par IA »,
jamais recadrée pour cacher la mention.

## Ce qu'il faut changer pour passer de maquette à site

1. Retirer tout ce qui est propre à la maquette : le bandeau « Maquette réalisée par… sera supprimé sous 30 jours »,
   la balise `robots noindex`, le bloc `<!-- mesure-audience -->` (Matomo de Mon Petit Site), toute note « formulaire
   de démonstration ».
2. Pied de page : « Site réalisé par Mon Petit Site » avec le lien. Les sources (PVGIS de la Commission européenne,
   Qualifelec, INSEE) et les crédits photo restent.
3. Formulaire réel vers rapenergies@gmail.com, avec message de confirmation et le téléphone en secours en cas d'erreur.
4. Pages obligatoires : mentions légales (éditeur RAP ENERGIES SAS, président et directeur de la publication Kevin
   Hainaut, hébergeur, réalisation Mon Petit Site) et confidentialité (données du formulaire : lesquelles, pourquoi,
   durée, droits). Lien dans le pied de page.
5. Référencement de base : `title` et `meta description` du type « Panneaux solaires et pompes à chaleur à Castries |
   Rap Energies », données structurées `LocalBusiness` avec seulement les informations ci-dessus, `sitemap.xml`,
   `robots.txt`, URL canonique sur https://rap-energies.fr/.

## Ce qu'il ne faut jamais écrire

Pas d'avis, de note, d'années d'expérience, de nombre d'installations, de garantie, de délai, de marque de panneaux ou
de pompe à chaleur, de montant d'aide ou de « devis gratuit » qu'il n'a pas confirmés. Les chiffres de production
restent des estimations PVGIS présentées comme telles. Une information manquante devient une question pour lui, pas une
invention.

## Hébergement et formulaire

[À REMPLIR : la même solution que pour maf-menuiserie.fr.]
Aucun traceur ni cookie tiers : pas de bandeau cookies.

## Contrôles et livraison

1. Captures desktop et mobile des deux versions (`node 02-mockups/outils/capture.mjs`) : aucun débordement, aucune
   erreur JavaScript ; les liens `tel:` et e-mail marchent.
2. `clients/rap-energies/PRESENTATION.md` : deux ou trois phrases par version, que je peux lui envoyer lundi avec les
   deux liens ou captures.
3. `clients/rap-energies/QUESTIONS-CLIENT.md` : ce qu'il faut encore lui demander, en phrases courtes pour WhatsApp
   (logo, zone, numéro de certificat Qualifelec s'il veut l'afficher, ce que montre chaque photo si ce n'est pas clair).
4. `clients/rap-energies/MISE-EN-LIGNE.md` : les étapes pour publier la version choisie et brancher rap-energies.fr.
5. Ne commite rien et ne publie rien sans mon accord.
