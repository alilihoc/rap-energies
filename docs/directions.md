# Cadrage et directions artistiques

Étape 2 du projet, le 30 octobre 2026. Mode opératoire : `modop-design-abouti.md`. Brief : `PRODUCT.md`. Textes : `recherche-et-textes.md` § 5, repris tels quels dans `src/contenu.mjs`.

## 1. Cadrage

- **Ce que la page doit prouver** : qu'un électricien de Castries, qualifié RGE pour les trois équipements, pose réellement des panneaux, des pompes à chaleur et des chauffe-eau dans les villages voisins, et qu'on peut l'appeler sans se faire démarcher.
- **L'action qui compte** : appeler le 06 99 34 66 86 ; à défaut, envoyer le formulaire. Un seul libellé par intention sur toute la page : « Appeler le 06 99 34 66 86 » (bouton plein), « Décrire mon projet » (bouton au trait, vers le formulaire), « Envoyer ma demande » (formulaire).
- **Mode de la surface** : Persuade (page d'accueil d'un artisan). `mode-persuade.md`, `craft-floor.md` et les directives de design-taste-frontend ont été lus avant d'écrire.
- **Tirage impeccable (`concept-seed`) non lancé** : le mode opératoire du projet prévoit des directions écrites à la main, et le client doit choisir entre deux propositions nettement différentes ; l'absence de clé de tirage est voulue et notée dans les contrats.

### Les deux pages interdites

| La page que la catégorie livre toujours | La page que les générateurs livrent toujours |
|---|---|
| Dégradé bleu-vert « énergie », feuille et globe terrestre, éclair stylisé, maison-avec-soleil en icône | Crème + sérif à fort contraste + terracotta |
| Photo de banque de panneaux au coucher du soleil | Noir + néon + halos lumineux |
| Slogan sur le confort ou l'avenir durable (« Votre confort, notre expertise ») | Broadsheet à filets fins, petites étiquettes en capitales espacées, mono |
| Quatre cartes de services avec icône, « Pourquoi nous choisir » en trois ou quatre pictos | Kit de cartes SaaS, même rayon partout, ombre grise sous chaque bloc |
| Carrousel d'avis Google, badges RGE en rangée, « devis gratuit » clignotant | Kicker en capitales au-dessus de chaque titre, points médians, flèches en fin de bouton |
| Compteur d'économies, « facture divisée par deux », chiffres ronds | Hero centré sur maille de dégradé, trois cartes égales, Inter + gris ardoise |
| Zone en « Hérault et Gard » ou « 80 km autour de Montpellier » | Mode sombre gris-bleu + violet |

Les deux colonnes sont interdites dans les deux directions. Les trois couleurs saturées du logo (bleu, orange, jaune) et la feuille verte sont le seul matériau de marque imposé.

## 2. Direction 1 : « Plein midi »

```
Nom : Plein midi
Idée (une phrase) : À midi sur un toit de tuiles de Castries, les panneaux sont à pleine
  puissance et le chauffe-eau vient de s'allumer ; la page est cette heure-là, blanche et
  franche, et chaque équipement porte une couleur prise dans le logo : le jaune du soleil
  pour les panneaux, l'orange de la chaleur pour la pompe à chaleur, le bleu de l'eau pour
  le chauffe-eau.
Scène physique → clair : le propriétaire compare des installateurs sur son téléphone,
  dehors, à midi, en plein soleil. Page claire, contrastes forts, grands caractères, aucun
  gris moyen.
Stratégie de couleur : palette complète (trois rôles colorés, une encre, un fond blanc chaud).
Palette (nom, valeur, rôle) :
  Blanc de midi  #FCFBF7  fond de page
  Encre          #14171C  texte, bouton plein, champ de contact et pied de page
  Second plan    #4B5361  texte secondaire, légendes
  Filet          #E4E1D9  filets de 1 px, bords de champs
  Soleil         #F2B41A  panneaux photovoltaïques (champ du triptyque, repère de légende, barres PVGIS)
  Chaleur        #EF6B1C  pompe à chaleur (champ, repère)
  Eau            #1F66CC  chauffe-eau thermodynamique (champ, repère)
  Feuille        logo seulement
  Sur encre      #FCFBF7 / #B8B2A6  texte sur le champ encre
Contrastes mesurés (texte sur fond, contraste.mjs) :
  Encre sur Blanc de midi 17,35:1 · Second plan sur Blanc de midi 7,49:1
  Encre sur Soleil 9,68:1 · Encre sur Chaleur 5,81:1 · Blanc sur Eau 5,48:1
  Blanc sur Chaleur 3,09:1 (interdit en texte courant : sur l'orange, on écrit en encre)
  Encre sur Eau 3,28:1 (interdit : sur le bleu, on écrit en blanc)
  Blanc de midi sur Encre 17,35:1 · #B8B2A6 sur Encre 8,52:1 · Soleil sur Encre 9,68:1
Typographie :
  Bricolage Grotesque (fichier opsz, axes opsz + wght) : titres 800, h1 borné par la largeur
    du conteneur (mot le plus long « thermodynamique, » mesuré, voir § 4), h2 700,
    noms des équipements du triptyque 800 ; font-optical-sizing: auto.
  Hanken Grotesk (fichier wght) : texte 400, boutons, navigation et légendes 600.
  Échelle : corps 1,125 rem (18 px), interligne 1,55, mesure 62 ch ; h1 clamp(2,5 rem,
    1,5 rem + 3,6 vw, 5 rem) ; h2 clamp(1,9 rem, 1,4 rem + 1,8 vw, 3 rem) ; légendes 0,95 rem.
Premier écran (1440 × 900) : navigation (logo, cinq ancres, téléphone) ; à gauche sur sept
  colonnes, le titre en Bricolage 800 sur deux ou trois lignes, le texte, les deux boutons
  (plein encre « Appeler le 06 99 34 66 86 », au trait « Décrire mon projet ») et la ligne
  d'adresse ; en dessous, sur toute la largeur et jusqu'aux bords de la fenêtre, le triptyque
  des trois équipements : trois champs Soleil, Chaleur, Eau de largeurs inégales (5/4/3
  colonnes), chacun portant une photo passée en bichromie dans sa couleur (image en niveaux
  de gris multipliée par le champ) et, sous la photo, le nom de l'équipement en Bricolage
  800 avec un lien vers sa section. Le triptyque est l'image du premier écran. Souvenir
  attendu une heure plus tard : « une page très blanche, un grand titre noir, trois bandes
  jaune, orange, bleue avec des photos teintées, et un bouton noir pour appeler ».
Moment animé unique : à l'ouverture, les trois champs du triptyque se lèvent comme des stores,
  clip-path inset(100% 0 0 0) → inset(0), 700 ms, décalés de 90 ms, cubic-bezier(0.16, 1, 0.3, 1),
  sous html.motion seulement. Rien d'autre ne bouge seul ; les boutons répondent à l'appui.
Ce que la direction refuse : les dégradés, le coucher de soleil, la feuille et le globe hors
  du logo, les cartes et les pictos, les kickers, les ombres dures, le texte sur photo, le
  crème + terracotta, les avis et les compteurs, un gris entre l'encre et le second plan.
Images nécessaires (un sujet par section) :
  Triptyque : panneaux sur tuiles rouges en plein soleil (bichromie Soleil) ; pompe à chaleur
    extérieure près d'un mur de maison (bichromie Chaleur) ; chauffe-eau mural dans une
    buanderie ou un garage (bichromie Eau).
  Réalisations : huit photos de chantiers (quatre toits avec panneaux dont une pose sur tuiles
    canal, deux pompes à chaleur, un chauffe-eau, un onduleur ou tableau), légendées.
  Bande : un toit de tuiles qui porte son ombre sur un mur blanc à midi (photo seule, respiration
    avant la production PVGIS).
  Comment ça se passe : des mains gantées qui fixent un rail de panneau (sans visage).
  Zone, production, questions, contact : pas de photo.
Mode sombre : verrouillé clair.
```

Ordre des sections : accroche + triptyque · réalisations (mosaïque 6 colonnes, légendes sous les photos, agrandissement dans un `<dialog>`) · services (trois blocs de texte, chacun ouvert par une barre de sa couleur sur toute la largeur du titre, puis « Les trois ensemble ») · bande photo · ce qu'un toit produit ici (douze colonnes Soleil, tableau accessible) · comment ça se passe (six étapes numérotées, deux colonnes) · où nous intervenons (les dix-sept communes en grand) · pourquoi un électricien de Castries (liste à filets) · questions fréquentes (`<details>`, deux colonnes) · contact (champ Encre pleine largeur, formulaire à champs blancs) · pied de page (sur le champ Encre).

## 3. Direction 2 : « Le soir, la maison chauffe »

```
Nom : Le soir, la maison chauffe
Idée (une phrase) : Un soir de janvier à Vendargues, la pompe à chaleur tourne dans le noir du
  jardin, la maison est chaude et l'eau du bain a été chauffée à midi par le toit ; la page est
  cette nuit-là, sombre et calme, où la lumière vient des photos et d'une seule couleur, l'ambre
  des fenêtres allumées.
Scène physique → sombre : le couple sur le canapé à 21 h, la facture d'électricité arrivée dans
  la journée, un ordinateur portable sur les genoux, une lampe. Luminance basse, grands
  caractères à empattements, photos lumineuses.
Stratégie de couleur : retenue, sombre : un fond nuit, un texte crème, un accent ambre qui occupe
  un seul champ entier (la section contact, « la fenêtre allumée ») et le bouton plein.
Palette (nom, valeur, rôle) :
  Nuit           #15130E  fond de page, navigation, pied
  Nuit relevée   #1F1B15  fond des cadres de la galerie et des champs de formulaire
  Crème          #F1EAD9  texte, titres, bouton au trait
  Crème éteinte  #BFB49C  texte secondaire, légendes
  Filet          #2A2620  filets de 1 px, cadres
  Ambre          #F0A43C  champ de contact, bouton plein, barres PVGIS, repères de légende
  Encre          #15130E  texte sur l'ambre
Contrastes mesurés :
  Crème sur Nuit 15,48:1 · Crème éteinte sur Nuit 9,04:1 · Ambre sur Nuit 8,91:1
  Encre sur Ambre 8,91:1 · Crème sur Nuit relevée 14,28:1 · Crème sur Filet 12,54:1
  Texte d'aide des champs #8F8674 sur Nuit 5,15:1
  #5C4A1E sur Ambre 4,11:1 (interdit : sur l'ambre, tout le texte est en Encre)
Typographie :
  Literata (fichier opsz, axes opsz + wght, romain seulement) : titres 500 avec taille optique
    automatique, h1 borné par le conteneur (« thermodynamique, » mesuré, § 4), texte courant 400,
    questions 500.
  Schibsted Grotesk (fichier wght) : navigation, boutons, légendes, formulaire, numéros ;
    tabular-nums sur les numéros seulement.
  Échelle : corps 1,125 rem (18 px), interligne 1,6, mesure 60 ch ; h1 clamp(2,6 rem,
    1,4 rem + 4 vw, 5,6 rem) ; h2 clamp(2 rem, 1,5 rem + 2 vw, 3,4 rem) ; légendes 0,95 rem.
Premier écran (1440 × 900) : navigation Nuit (logo clair, cinq ancres, téléphone) ; puis une
  photo du soir (pompe à chaleur ou maison au crépuscule, fenêtres allumées) sur toute la largeur
  et toute la hauteur restante ; posé sur elle, dans le coin inférieur gauche, un panneau plein
  Nuit (sept colonnes, 60 % de la hauteur) qui porte le titre en Literata, le texte, les deux
  boutons (plein Ambre « Appeler le 06 99 34 66 86 », au trait Crème « Décrire mon projet ») et
  la ligne d'adresse. Aucun texte directement sur la photo. Souvenir attendu : « une grande photo
  du soir qui remplit l'écran, un bloc noir avec un titre à empattements et un bouton ambre, puis
  une rangée de photos de chantiers encadrées et légendées comme une exposition ».
Moment animé unique : à l'ouverture, la photo s'allume : opacity 0 → 1 et filter brightness(0.3)
  → brightness(1), 1 200 ms, cubic-bezier(0.16, 1, 0.3, 1), sous html.motion. Le panneau est
  visible d'emblée. Rien d'autre ne bouge seul.
Ce que la direction refuse : le néon, les halos et le verre dépoli, les dégradés et les voiles
  sur les photos, les lignes de grille décoratives, les étiquettes en capitales espacées, les
  icônes, le gris-bleu ardoise, les cartes, l'italique décorative dans les titres.
Images nécessaires (un sujet par section) :
  Accroche : maison individuelle au crépuscule, fenêtres allumées, sans personne ; à défaut, une
    pompe à chaleur extérieure contre un mur de maison en lumière du soir. Retenu après planches
    contact : une rue de maisons aux façades ocre et crème, toits de tuiles, lampadaire et fenêtres
    allumés (rue-soir), plus crédible pour l'Hérault que les pavillons isolés disponibles (américains).
  Réalisations : les huit mêmes photos de chantiers que la direction 1 (ce sont les chantiers du
    client, communs aux deux), en cadres uniformes 4:3, légendes sous chaque cadre.
  Bande : des tuiles canal en gros plan, texture et lumière rasante (photo seule).
  Comment ça se passe : des mains qui règlent un appareil de chauffage (sans visage).
  Services, production, zone, questions, contact : pas de photo.
Mode sombre : verrouillé sombre.
```

Ordre des sections : accroche (photo plein écran + panneau) · réalisations (grille 3 colonnes de cadres légendés) · services (liste à filets : nom de l'équipement à gauche en Literata, texte à droite, trois rangées, puis « Les trois ensemble » en grand) · bande photo · ce qu'un toit produit ici (douze barres horizontales Ambre, une par mois) · comment ça se passe (photo à gauche, six étapes à droite) · où nous intervenons (texte) · pourquoi un électricien de Castries (liste) · questions fréquentes (`<details>`, une colonne, questions en Literata 500) · contact (champ Ambre pleine largeur, texte Encre, champs de formulaire Nuit relevée à texte Crème) · pied de page (Nuit).

## 4. Mesures avant d'écrire

- **Polices** (paquets `@fontsource-variable`, fichiers copiés dans `template-N/fonts/`, fournisseur local) : direction 1, Bricolage Grotesque opsz 77 Ko + Hanken Grotesk wght 35 Ko = 112 Ko ; direction 2, Literata opsz 110 Ko + Schibsted Grotesk wght 47 Ko = 157 Ko. Les deux pages restent sous 200 Ko ; aucune italique n'est chargée (l'italique de Literata ferait dépasser le budget), donc aucune italique n'est utilisée.
- **Mot le plus long du h1** : « thermodynamique, » (avec la virgule). Largeurs mesurées en em dans le navigateur, voir `.impeccable/mesures/mots.txt`. Règle appliquée : la colonne du titre est un conteneur (`container-type: inline-size`) et `font-size: min(clamp(…), calc(100cqi / L))`.
- **Échelle** : corps 18 px, interligne 1,55 à 1,6, mesure 60 à 62 ch, titres fluides.
- **Contrastes** : toutes les paires utilisées sont listées ci-dessus avec leur valeur ; les paires interdites sont nommées et ne sont pas employées.

## 5. Contraintes communes

- Statique, autonome, ouvrable depuis le disque : chemins relatifs, aucune ressource externe, aucun cookie ni stockage, aucun traceur. Les liens sortants (Mon Petit Site, PVGIS) sont de simples `href`.
- Tout visible sans JavaScript : la galerie ouvre les images en pleine page sans script, le formulaire reste un formulaire, le menu reste une liste d'ancres.
- Formulaire : envoi par le service choisi à la mise en ligne (`data-endpoint` à renseigner, confirmation affichée seulement sur réponse de ce service) ; en attendant, le script compose un courriel `mailto:` vers rapenergies@gmail.com avec les champs saisis, laisse le formulaire visible et affiche un message d'interface qui dit que la messagerie s'ouvre ; sans script, le formulaire poste vers `mailto:` après validation native.
- Bandeau sous 40 rem : collant avec un `top` négatif de la hauteur réelle de la rangée des ancres (ancres à la ligne, hauteur reportée dans `--nav-h` par le script), si bien que la rangée marque + téléphone reste visible au défilement ; adaptation du mode opératoire (navigation 2 × 2 prévue pour quatre liens) à cinq liens et à l'action « appeler ».
- Images : dérivés AVIF et WebP en 480, 800, 1200 et 1800 px générés par `outils/images.mjs` (sharp), JPEG de secours, `<picture>` avec `sizes`, `loading="eager"` et `fetchpriority="high"` pour la photo du premier écran seulement, `object-position` choisi par photo.
- Logos : `images/logo/logo.png` (symbole et nom, fond transparent) et `logo-clair.png` (nom en crème pour la direction 2), `symbole-*.png` pour le favicon et la navigation réduite.
- Les crochets [À CONFIRMER] et [À COMPLÉTER] restent visibles, en surbrillance discrète, jusqu'à validation par le client.
