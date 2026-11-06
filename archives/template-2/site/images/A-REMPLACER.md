# Photos provisoires à remplacer

Les photos de la galerie marquées « provisoire » sont des réservations prises sur Pexels en attendant les photos de chantiers de Rap Énergies. Liste, titres, auteurs et licence : `docs/images.md` à la racine du projet. Elles ne montrent ni Castries ni des chantiers de l'entreprise, et la galerie le dit (« photo provisoire »).

Le plus simple pour les remplacer : l'administration (`node admin/serveur.mjs`, puis http://127.0.0.1:8080/admin), qui redimensionne la photo, retire ses métadonnées, met à jour la fiche et reconstruit les deux templates.

Photos provisoires encore en place, dans l'ordre de la galerie :
1. Panneaux photovoltaïques · toit en tuiles canal · [À COMPLÉTER : commune] : Pose en cours, panneau présenté sur les tuiles. (fichier `pose-tuiles-canal`)
2. Pompe à chaleur air-eau · unité extérieure côté jardin · [À COMPLÉTER : commune] : Remplace une chaudière au fioul. (fichier `pompe-a-chaleur-gravier`)
3. Panneaux photovoltaïques · toits de tuiles et cheminées · [À COMPLÉTER : commune] : Deux pans équipés, onduleur dans le garage. (fichier `toits-cheminees`)
4. Pompe à chaleur air-eau · unité extérieure sur plots · [À COMPLÉTER : commune] : Remplace des convecteurs électriques. (fichier `pompe-a-chaleur-mur`)

Et pour l'accroche : une maison de la zone au crépuscule, fenêtres allumées, sans personne ni plaque (`rue-soir`). Pour la bande : des tuiles canal en gros plan (`tuiles-rasantes`). Pour les étapes : des mains au travail sur une pompe à chaleur ou un chauffe-eau, sans visage (`mains-chaudiere`).

Règles pour chaque photo : aucun visage reconnaissable de client, aucune plaque d'immatriculation, aucune adresse lisible ; la commune suffit dans la légende. Pour chacune, le client indique la commune, l'équipement et un détail (type de toit, ce que l'appareil remplace). Sans l'administration : déposer le JPEG dans `images/sources/`, mettre à jour `src/realisations.json`, lancer `node outils/images.mjs` puis `node outils/build.mjs`. Quand plus aucune photo n'est provisoire, retirer le paragraphe « photos provisoires » des mentions légales.
