# Questions pour Rap Énergies : réponses reçues

Mise à jour le 6 novembre 2026. Le client a répondu aux six questions (réponses transmises par Hocine). Plus aucune note `[À CONFIRMER]` n'est affichée sur le site. Il reste une chose à faire avec lui : l'essai du formulaire.

## Les six réponses

| Question | Réponse du client | Ce qui a changé sur le site |
|---|---|---|
| 1. Qualifications RGE pompe à chaleur et chauffe-eau, échues le 6 novembre 2026 : renouvelées ? | Oui, reportées au 6 novembre 2027 | « Qualifié RGE Qualifelec pour chacun des trois » est maintenu partout. Le numéro de qualification n'a pas été donné : il n'est pas affiché. |
| 2. Qui est le président aujourd'hui ? | Raphaël Madeddu | Mentions légales : « Président et directeur de la publication : Raphaël Madeddu. » |
| 3. Des photos de chantiers ? | Non : on garde les photos génériques, et on supprime l'administration | La galerie s'intitule « Les équipements en images » et annonce des « Photos d'illustration » ; l'ancre du menu s'appelle « Photos » ; les mentions légales disent que les photos viennent de Pexels et ne montrent pas des chantiers de l'entreprise. L'espace `/admin/` est retiré (archivé dans `archives/admin-php/`). |
| 4. Le devis est gratuit ? | Oui | Étape 3 : « Vous recevez un devis gratuit et détaillé ». |
| 5. Quelles démarches faites-vous pour le client ? | Toutes | Étape 4 : « Nous nous occupons des démarches : déclaration préalable en mairie, demande de raccordement Enedis, attestation Consuel, dossiers d'aides. » Questions fréquentes : « Nous préparons le dossier pour vous. » (autorisation) et « nous nous occupons des dossiers » (aides). |
| 6. Essai du formulaire | À faire à la fin | Rien pour l'instant. |
| Logo (message du client, capture du 6 novembre) | Le logo rond | Logo rond entier, avec « RAP ÉNERGIES » au centre, dans le bandeau, l'icône du site et le pied de page (`outils/logo.mjs`). Une première version ne mettait que l'anneau dans le bandeau : sans le nom, le logo paraissait vide. |
| Adresse (même message) | 320 rue de la Garriguette, 34130 Saint-Aunès | Accroche, contact, pied, mentions légales, données structurées ; « Rap Énergies est installée à Saint-Aunès » dans « Où nous intervenons », Saint-Aunès en tête des communes. |
| Autres services (cartes de visite) et entretien | La carte de l'entreprise liste : solaire, chauffage, photovoltaïque, climatisation, pompe à chaleur, SAV, plomberie, électricité. Ils entretiennent les installations qu'ils posent. | Nouvelle section « Nos autres services » (chauffage, climatisation, plomberie, électricité) avec le bloc « Entretien et service après-vente » ; entretien ajouté à l'étape 6, à la question « Et l'entretien ? » et comme sixième point de « Pourquoi ». |

Le nom du président est écrit avec l'orthographe de l'annonce légale de janvier 2025, « Raphaël Madeddu ». À corriger s'il s'écrit autrement.

## Reste à faire avec lui

- **Essai du formulaire** : envoyer une demande depuis le site et lui faire confirmer qu'elle arrive sur rapenergies@gmail.com, indésirables compris. C'est par là qu'arrivent les demandes des visiteurs.

## Points à trancher depuis le changement d'adresse

- **« Électricien de Castries » ou de Saint-Aunès ?** Le titre de la page, le titre de l'onglet, « Pourquoi un électricien de Castries », le graphique « à Castries » et une question fréquente disent tous Castries, alors que l'adresse est maintenant à Saint-Aunès, à cinq kilomètres. Soit Castries reste l'ancrage commercial (et la page le dit en connaissance de cause), soit tout passe à Saint-Aunès. Rien n'a été changé sur ce point.
- **Le registre ne dit pas la même chose que le client.** L'annuaire des entreprises, mis à jour le 6 novembre 2026, donne encore le siège au 570 avenue de la Royale à Castries et Kevin Hainaut président. Les mentions légales suivent le client (Raphaël Madeddu, adresse de Saint-Aunès, sans les mots « siège social »). À lui de dire si le registre est en retard.
- **« Solaire »** figure sur sa carte à côté de « Photovoltaïque » : s'agit-il de solaire thermique ? Le mot n'est pas repris dans la nouvelle section en attendant.
- **Vedrines Plombier** : la seconde carte annonce que ce plombier de Saint-Clément-de-Rivière « s'associe », avec « dépannage rapide » et « contrat d'entretien ». Rien de cette carte n'est sur le site. À ajouter s'il le souhaite.

## Ce qui est en ligne par défaut

Choix du studio, que le client peut contester en regardant le site.

| Sujet | Choix par défaut | S'il veut autre chose |
|---|---|---|
| Proposition | La claire (jaune, orange, bleu) | La sombre est archivée, remontrable |
| Titre | « Panneaux solaires, pompe à chaleur, chauffe-eau thermodynamique : posés par un électricien de Castries. » | Variante courte prête : « Le soleil de Castries, installé chez vous. » |
| Nom | « Rap Énergies » avec l'accent, comme sur son logo rond | « RAP ENERGIES » |
| Communes | Les 17 communes listées, de Castries à Montpellier | Ajouter ou retirer |
| Démarchage | « Pas de démarchage. Nous ne faisons ni porte-à-porte ni appels » : affirmé | Retirer si ce n'est pas exact |
| Personnes | Aucun prénom, aucune photo d'équipe, rien sur l'ancienneté ni sur A+ Énergies | Ajouter un prénom, une photo, une date |
| Pompe à chaleur | Le service pompe à chaleur parle du chauffage seulement, sans eau chaude sanitaire ; la climatisation est citée parmi les autres services | Ajouter une phrase |
| Sous-traitance | Le point « Une seule entreprise, du devis à la mise en service » est retiré | Le remettre s'il ne sous-traite rien |
| Horaires d'appel | Aucun affiché | Les ajouter au bloc de contact |
| Coordonnées reçues par le formulaire | Gardées douze mois après le dernier échange, puis supprimées | Autre durée |
| Numéro de TVA | Non affiché (exigé seulement des sites qui vendent en ligne) | L'ajouter aux mentions légales |
| Services | Lignes « Ce que nous faisons » raccourcies (détail ci-dessous) | Reprendre une ligne |

Réglé par Mon Petit Site, sans le client : hébergeur dans les mentions légales (Hostinger International Ltd, Larnaca, Chypre), page Confidentialité (envoi par l'hébergeur, sans prestataire tiers).

## Pour mémoire

Les douze lignes « Ce que nous faisons », avant et après (les phrases longues validées restent dans `recherche-et-textes.md` § 5) :

- Panneaux : « Étude de votre toit et de votre consommation » (était : étude de votre toiture (orientation, pente, ombres portées) et de votre consommation) ; « Estimation PVGIS pour votre adresse » (estimation de production à partir des données PVGIS de la Commission européenne pour votre adresse) ; « Pose, onduleur, raccordement au tableau » (pose des panneaux et de l'onduleur, raccordement à votre tableau électrique) ; « Démarches : mairie, Enedis, Consuel » (démarches : déclaration préalable en mairie, demande de raccordement à Enedis, attestation Consuel) ; « Mise en service et suivi de production » (mise en service et prise en main du suivi de production).
- Pompe à chaleur : « Visite et calcul de la puissance nécessaire » (… selon votre maison : surface, isolation, radiateurs ou plancher existants) ; « Emplacement de l'unité extérieure : bruit, voisinage, accès » (choix de l'emplacement de l'unité extérieure, en pensant au bruit, au voisinage et à l'accès pour l'entretien) ; « Pose, raccordements, mise en service, réglages » (pose, raccordements hydraulique et électrique, mise en service et réglages) ; « Explication du fonctionnement et de la programmation » (inchangée).
- Chauffe-eau : « Capacité choisie selon vos habitudes » (choix de la capacité selon le nombre de personnes et vos habitudes) ; « Dépose de l'ancien ballon, pose, raccordements » (… évacuation des condensats) ; « Mise en service et programmation » (mise en service et réglage de la programmation).

Autres textes ajoutés par le studio, sans fait nouveau sur l'entreprise : la définition de kWc et le total « 1 500 kWh par an pour 1 kWc plein sud, à Castries » au-dessus du graphique, les ancres « Photos », « Communes » et « Étapes », l'aide du champ téléphone, l'état « Envoi en cours… », les boutons d'appel sous le texte de production, le titre de la galerie « Les équipements en images » et son introduction.
