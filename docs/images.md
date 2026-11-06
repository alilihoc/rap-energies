# Images des deux templates

Toutes les images sont servies par le site, depuis `template-N/images/`, et générées au build par `outils/images.mjs` (AVIF et WebP en 480, 800, 1200 et 1800 px, JPEG de secours en 1200 et 1800 px). Aucune n'est chargée depuis un autre domaine.

**Ce sont des réservations.** Le client n'a pas encore envoyé ses photos de chantiers. Les photos ci-dessous ont été choisies sans visage reconnaissable, sans plaque d'immatriculation ni adresse lisible, sans marque lisible, et aucune ne porte de mention « contenu généré par IA ». Elles doivent être remplacées par les photos de Rap Énergies avant la mise en ligne (voir `template-N/images/A-REMPLACER.md`). Tant qu'elles sont en ligne, la page des mentions légales les cite (paragraphe « Photographies »).

## Photos (`images/sources/`)

Source : [Pexels](https://www.pexels.com/), sous [licence Pexels](https://www.pexels.com/license/) : usage libre, y compris commercial, sans attribution obligatoire, modification autorisée. Interdits : revendre une copie non modifiée, laisser entendre que les personnes ou marques visibles soutiennent le site. Chaque fichier source porte sa provenance dans ses métadonnées (segment de commentaire JPEG posé par `impeccable embed-prompt`, contrôlé par `impeccable embed-prompt --scan images/sources`) ; les dérivés AVIF, WebP et JPEG reprennent la provenance dans leur champ EXIF `ImageDescription` quand le format le permet.

| Fichier | Templates et section | Pexels | Titre d'origine | Auteur ou autrice |
|---|---|---|---|---|
| `pose-tuiles-canal.jpg` | 1 et 2, réalisations | [9875413](https://www.pexels.com/photo/9875413/) | Black Solar Panel on Brown Roof Tiles | Kindel Media |
| `toit-tuiles-pignon.jpg` | écartée de la galerie le 2 novembre 2026 (toit à forte pente, hors Languedoc), conservée en source | [35726122](https://www.pexels.com/photo/35726122/) | Modern Rooftop Solar Panels and Tiled Roof | Budget Bizar |
| `toits-cheminees.jpg` | 1 et 2, réalisations | [38021376](https://www.pexels.com/photo/38021376/) | Solar Panels on Tiled Roofs in Residential Area | Lena Netkach |
| `toit-tuiles-sombres.jpg` | écartée de la galerie le 2 novembre 2026 (couverture sombre type ardoise, hors Languedoc), conservée en source | [27863809](https://www.pexels.com/photo/27863809/) | A roof with solar panels on it | Budget Bizar |
| `toit-tuiles-rouges.jpg` | écartée après la relecture de finition (dominante violette hors palette), conservée en source | [17762230](https://www.pexels.com/photo/17762230/) | Solar Panels on House Roof | Budget Bizar |
| `pompe-a-chaleur-gravier.jpg` | 1 et 2, réalisations ; marque du fabricant effacée le 2 novembre 2026 (`outils/retoucher-marque.mjs`, original dans `images/corbeille/avant-retouche/`) | [20046693](https://www.pexels.com/photo/20046693/) | Plants near Air Conditioner and Building Wall | alpha innotec |
| `pompe-a-chaleur-mur.jpg` | 1 et 2, réalisations ; marque du fabricant effacée le 2 novembre 2026 (idem) | [38067323](https://www.pexels.com/photo/38067323/) | Modern Heat Pump Outside New Building | alpha innotec |
| `chauffe-eau-buanderie.jpg` | écartée de la galerie le 2 novembre 2026 (cumulus électrique mural, pas un chauffe-eau thermodynamique), conservée en source | [28479466](https://www.pexels.com/photo/28479466/) | Modern laundry room with washer and dryer | Pușcaș Adryan |
| `chauffe-eau-salle-de-bain.jpg` | 1, triptyque (bichromie Eau) | [8142983](https://www.pexels.com/photo/8142983/) | White Washing Machine in the Bathroom | Max Vakhtbovych |
| `micro-onduleur-rail.jpg` | écartée de la galerie le 2 novembre 2026 (régulateur de charge sur toit métallique, légende approximative), conservée en source | [8853468](https://www.pexels.com/photo/8853468/) | Solar Charge Controller Installed on Purlins | Los Muertos Crew |
| `tri-panneaux.jpg` | 1, triptyque | [17965455](https://www.pexels.com/photo/17965455/) | Close-up of Solar Panels on a Roof of a House | Vladimir Srajber |
| `tri-pompe.jpg` | 1, triptyque | [20046694](https://www.pexels.com/photo/20046694/) | Trees and Air Conditioner by Building Wall | alpha innotec |
| `ombre-midi.jpg` | 1, bande | [37992074](https://www.pexels.com/photo/37992074/) | Rustic Terracotta Roof with Shadows and Blue Sky | Jan van der Wolf |
| `mains-rail.jpg` | 1, comment ça se passe | [8853500](https://www.pexels.com/photo/8853500/) | Person's Hand on Solar Panel | Los Muertos Crew |
| `maison-soir.jpg` | 2, variante d'accroche non retenue (conservée en source) | [20081378](https://www.pexels.com/photo/20081378/) | Lights in a Bungalow House | Aneesh Prodduturu |
| `rue-soir.jpg` | 2, accroche | [33033173](https://www.pexels.com/photo/33033173/) | Colorful Mediterranean Townhouses at Dusk | Zeze |
| `tuiles-rasantes.jpg` | 2, bande | [35450667](https://www.pexels.com/photo/35450667/) | Textured Terracotta Roof Tiles in Sunlight | Jan van der Wolf |
| `mains-chaudiere.jpg` | 2, comment ça se passe | [7859953](https://www.pexels.com/photo/7859953/) | Plumber Repairing Power Source | Heiko Ruth |

Remarques d'honnêteté : la photo « chauffe-eau » du triptyque du template 1 (salle de bains) montre un ballon électrique classique, pas un chauffe-eau thermodynamique (celle de la buanderie, même défaut, a été écartée de la galerie le 2 novembre 2026) ; la photo « boîtier de raccordement » montre un régulateur de charge sur un toit métallique (écartée elle aussi) ; les pompes à chaleur sont des photos de fabricant (alpha innotec) dont la marque, lisible dans la visionneuse, a été effacée par retouche locale le 2 novembre 2026 (`outils/retoucher-marque.mjs`, originaux dans `images/corbeille/avant-retouche/`, licence Pexels permettant la modification). La galerie ne garde que les quatre photos provisoires crédibles (tuiles canal, toits et cheminées, deux pompes à chaleur) et dit une seule fois, sous son introduction, que les photos sont provisoires.

## Logos (`images/logo/`)

Détourés par `outils/logo.mjs` à partir de `images/6817aee43100005fc5761b66.png` (fourni par le client, fond crème opaque) : `logo.png` (symbole et nom, fond transparent), `logo-clair.png` (nom en crème pour les fonds sombres), `symbole.png` et `symbole-64/180/512.png` (favicon, navigation réduite). La variante ronde `images/68225512310000ec387824ff.png` n'est pas utilisée ; le client choisira.

## Photos candidates écartées

Planches contact dans le dossier de travail de la session (`planches/lot1-*.png`, `lot2-*.png`, `lot3-*.png`). Écartées : visages reconnaissables (9875405, 9875414, 9875415, 9875418, 9875419, 9875422, 27928762, 30285845, 32497161, 34938439, 4254164), tenues de marque lisible (toutes les photos Elite Power Group), toits industriels (11644973, 14613939, 137602), styles trop nord-américains pour une accroche (4933643, 13558357, 12284244).
