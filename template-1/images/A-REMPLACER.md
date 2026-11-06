# Photos provisoires à remplacer

Les photos de la galerie marquées « provisoire » sont des réservations prises sur Pexels en attendant les photos de chantiers de Rap Énergies. Liste, titres, auteurs et licence : `docs/images.md` à la racine du projet. Elles ne montrent ni Castries ni des chantiers de l'entreprise, et la galerie le dit une fois sous son introduction.

Le plus simple pour les remplacer : l'administration en ligne (https://rap-energies.fr/admin/), qui redimensionne la photo, retire ses métadonnées, met à jour la fiche et la galerie du site ; `outils/recuperer.sh` rapatrie ensuite ces changements dans le projet.

Photos provisoires encore en place, dans l'ordre de la galerie :
1. Panneaux photovoltaïques · toit en tuiles canal · [À COMPLÉTER : commune] : Pose en cours, panneau présenté sur les tuiles. (fichier `pose-tuiles-canal`)
2. Pompe à chaleur air-eau · unité extérieure côté jardin · [À COMPLÉTER : commune] : Remplace une chaudière au fioul. (fichier `pompe-a-chaleur-gravier`)
3. Panneaux photovoltaïques · toits de tuiles et cheminées · [À COMPLÉTER : commune] : Deux pans équipés, onduleur dans le garage. (fichier `toits-cheminees`)
4. Pompe à chaleur air-eau · unité extérieure sur plots · [À COMPLÉTER : commune] : Remplace des convecteurs électriques. (fichier `pompe-a-chaleur-mur`)

Et pour les trois photos du triptyque du premier écran, reprises en couleur dans la section Services : un toit de tuiles avec panneaux en plein soleil (`tri-panneaux`), une pompe à chaleur extérieure (`tri-pompe`), un chauffe-eau thermodynamique (`chauffe-eau-salle-de-bain`). Pour la bande : un toit de tuiles en plein soleil (`ombre-midi`). Pour les étapes : des mains au travail sur un rail ou un tableau, sans visage (`mains-rail`).

Règles pour chaque photo : aucun visage reconnaissable de client, aucune plaque d'immatriculation, aucune adresse lisible ; la commune suffit dans la légende. Pour chacune, le client indique la commune, l'équipement et un détail (type de toit, ce que l'appareil remplace). Sans l'administration : déposer le JPEG dans `images/sources/`, mettre à jour `src/realisations.json`, lancer `node outils/images.mjs` puis `node outils/build.mjs`. Quand plus aucune photo n'est provisoire, retirer le paragraphe « photos provisoires » des mentions légales.
