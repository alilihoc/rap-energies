# Photos d'illustration

Le client a choisi de garder les photos de banque d'images (Pexels) : la section de la galerie s'intitule « Les équipements en images » et annonce des photos d'illustration, les mentions légales le disent aussi. Liste, titres, auteurs et licence : `docs/images.md` à la racine du projet. Elles ne montrent ni Castries ni des chantiers de l'entreprise.

Photos d'illustration de la galerie, dans l'ordre :
1. Panneaux photovoltaïques · toit en tuiles canal (fichier `pose-tuiles-canal`)
2. Pompe à chaleur air-eau · unité extérieure côté jardin (fichier `pompe-a-chaleur-gravier`)
3. Panneaux photovoltaïques · toits de tuiles et cheminées (fichier `toits-cheminees`)
4. Pompe à chaleur air-eau · unité extérieure sur plots (fichier `pompe-a-chaleur-mur`)

Les trois photos du triptyque du premier écran, reprises en couleur dans la section Services (`tri-panneaux`, `tri-pompe`, `chauffe-eau-salle-de-bain`), la bande (`ombre-midi`) et la photo des étapes (`mains-rail`) sont aussi des photos d'illustration.

Si le client envoie un jour de vraies photos de chantiers : aucun visage reconnaissable, aucune plaque d'immatriculation, aucune adresse lisible ; déposer le JPEG dans `images/sources/`, mettre à jour `src/realisations.json` (commune, équipement, détail, `provisoire: false`), lancer `node outils/images.mjs` puis `node outils/build.mjs`. Quand plus aucune photo n'est d'illustration, remettre le titre « Nos chantiers, à Castries et autour » dans `src/contenu.mjs` et corriger le paragraphe des photographies dans les mentions légales.
