# Mode opératoire : trois designs aboutis, avec images

La méthode qui a produit les designs 16 à 18 de Catus Bonus, écrite pour être rejouée sur un autre site ou une autre application. Elle réunit ce qui a le mieux marché sur les quinze designs précédents : le contrat de direction et la relecture de finition d'impeccable, les règles anti-génériques de design-taste-frontend, les mesures de better-colors et de web-typography, le plan relu contre le brief de frontend-design, et de vraies photos.

Compter une journée pour trois pages d'accueil : cadrage et directions le matin, construction et vérification l'après-midi, relectures en parallèle. Les durées indiquées sont celles constatées.

## 0. Prérequis

**Côté projet**

- Un brief produit (format `PRODUCT.md` d'impeccable : public, objectif, positionnement, contraintes, engagements de marque, preuves disponibles, principes).
- Les textes définitifs, dans un fichier de contenu, repris tels quels. Pas de lorem ipsum, pas de texte inventé : ce que le brief ne fournit pas (prix, témoignages, chiffres) n'apparaît pas.
- Les contraintes techniques écrites noir sur blanc. Ici : aucune ressource chargée depuis un autre domaine, aucun cookie ni stockage, site statique, contact par `tel:` et `mailto:`.
- Une stack qui optimise les images au build (Astro et son composant `<Picture>` ici ; l'équivalent ailleurs).

**Côté outils (Claude Code)**

| Outil | Ce qu'il apporte | Quand |
|---|---|---|
| Skill `impeccable` | `reference/craft-floor.md` (le plancher de qualité et les interdits), `reference/new-work.md` et `reference/mode-persuade.md` (comment ouvrir une page), `surface-brief` (contrat de direction), `detect` (détecteur de tics), `embed-prompt` (provenance des images), `reference/degraded/finish-reviewer.md` (le rôle du relecteur) | Du cadrage à la relecture |
| Skill `design-taste-frontend` | Les règles anti-slop : pas d'eyebrow, pas de cartes partout, pas de zigzag, bouton sur une ligne, un libellé par intention, hero en 4 éléments au plus | Avant d'écrire, puis en autocontrôle |
| Skill `better-colors` | Palette par rôles, contrastes mesurés, jamais estimés | Avant d'écrire |
| Skill `web-typography` | Les dix points du diagnostic (corps ≥ 16 px, mesure < 75 ch, interligne, repli, zoom 200 %, polices < 200 Ko) | Avant d'écrire, puis en vérification |
| Plugin `frontend-design` | Plan en jetons (couleurs, type, mise en page, principes) relu contre le brief avant le code ; un seul moment animé | Au moment des directions |
| Scripts `.impeccable/outils/` | `captures.mjs`, `planche.mjs`, `montage.mjs`, `contraste.mjs` (Playwright, Edge ou Chrome) | Images et vérification |
| Agents `general-purpose` | Relecteurs de finition neufs, un par design, en parallèle | Relecture |

Non retenus : `ui-ux-pro-max` (ses systèmes de design proposés étaient hors sujet ici ; utile seulement pour une recherche ponctuelle), `design-shotgun` et `image-to-code` (demandent une clé OpenAI).

Installer Playwright dans le projet (`npm i -D playwright`) ; les scripts utilisent Edge ou Chrome déjà installés, sans télécharger de navigateur (`NAVIGATEUR=chromium` pour forcer celui de Playwright).

## 1. Cadrage (30 min)

1. Lire le brief, les contraintes et le contenu réel. Repérer ce que la page doit prouver et quelle action compte (ici : appeler ou écrire).
2. Choisir le mode de la surface : Persuade (page d'accueil, vitrine), Operate (application), Read (documentation), Experience (portfolio). Lire le fichier `mode-*.md` correspondant d'impeccable.
3. Lire `craft-floor.md` et la section « Design engineering directives » de design-taste-frontend. Ne pas écrire une ligne d'interface avant.
4. Écrire la liste des tics à éviter pour ce sujet, en deux colonnes : la page que la catégorie livre toujours (ici : pastel, pattes de chat, photos de chatons, cartes arrondies) et la page que les générateurs livrent toujours (crème + sérif à fort contraste + terracotta ; noir + néon ; broadsheet à filets et petites étiquettes mono ; kit de cartes SaaS ; kicker au-dessus de chaque titre). Les deux sont interdites par défaut.

## 2. Trois directions (1 h)

Une fiche par direction (modèle en annexe C). Les trois doivent différer sur la stratégie de couleur, la structure du premier écran et la typographie. Une triade qui marche : éditorial clair et calme / palette complète joyeuse / sombre et cinématographique.

Pour chaque direction :

- **Idée en une phrase**, tirée du monde du sujet (une visite à domicile, un terrain de jeu, le soir après une mauvaise journée), jamais de la catégorie.
- **Scène physique** : qui lit, où, sous quelle lumière. C'est elle qui décide clair ou sombre, pas la catégorie.
- **Stratégie de couleur** : retenue (neutres teintés + un accent), engagée (une couleur sur une grande part de la surface), palette complète (3 à 4 rôles), ou saturée (la surface est la couleur). Les surfaces Persuade ont droit aux stratégies audacieuses.
- **Typographie** : une ou deux familles, variables, hors de la liste des défauts d'impeccable (Fraunces, Playfair, Cormorant, Lora, Crimson, Newsreader, Syne, Space Grotesk, Space Mono, IBM Plex, Inter en titre, DM Sans, DM Serif, Outfit, Plus Jakarta, Instrument Sans). Vérifier qu'elles existent chez `@fontsource-variable` et quels axes porte chaque fichier (`opsz`, `wght`, italiques).
- **Premier écran** : ce qui est où, à quelle échelle, et où est l'action. Le mémoriser : si quelqu'un part après un écran, que décrit-il une heure plus tard ? Si la réponse est une ambiance, la direction n'est pas décidée.
- **Un seul moment animé**, à l'ouverture, qui raconte l'idée (la photo se découvre, l'arche s'ouvre, la lampe s'allume). Rien d'autre ne bouge seul.
- **Ce que la direction refuse**, nommé.
- **Images nécessaires** : un sujet par section, décrit précisément (« un chat sur un rebord de fenêtre en plein jour », pas « un chat »).

Autocontrôle de calibration : si l'esthétique se devine à partir de la catégorie seule, ou de la catégorie plus ce qu'on évite, retravailler.

## 3. Mesures avant d'écrire (15 min)

- **Contrastes** : chaque paire texte/fond, y compris le texte sur les boutons et sur les champs de couleur : `node .impeccable/outils/contraste.mjs '#texte' '#fond' …`. Texte courant ≥ 4,5:1, grand texte ≥ 3:1. Noter les paires interdites (ici : rouge sur kraft, blanc sur gingembre en texte courant).
- **Polices** : installer les paquets, déclarer le fournisseur local, préférer le fichier qui porte les axes utiles (le fichier `opsz` de Piazzolla, le fichier `casl` de Recursive). Budget : moins de 200 Ko de polices par page.
- **Échelle** : corps de 17 à 19 px, interligne 1,5 à 1,6, mesure de 60 à 65 caractères, titres fluides avec `clamp()`.
- **Mot le plus long du titre** : il doit tenir sur une ligne à 320 px. Règle : la colonne du titre est un conteneur (`container-type: inline-size`) et le titre est borné par `font-size: min(clamp(…), calc(100cqi / L))`, où L est la largeur du mot en em (mesurée : largeur du mot ÷ taille de police ; « Comportementaliste » fait 8,6 em en Piazzolla 500, 10,4 em en Rubik 800, 10 em en Schibsted 800). Le script de captures imprime le bord droit du h1 et de son texte pour vérifier.

## 4. Images (45 min)

**Règles**

- De vraies photos, servies par le site, optimisées au build. Jamais de lien vers un autre domaine, jamais de gradient ou de SVG bricolé à la place d'une photo.
- Une photo décisive par section, montrant le sujet dans son vrai cadre.
- Sans visage humain quand il pourrait être pris pour le propriétaire ou ses clients. Ce sont des réservations : le dire au client, prévoir le remplacement et, tant qu'elles sont en ligne, les citer dans les mentions légales.
- Source : Pexels (licence libre, usage commercial, sans attribution obligatoire) ou Unsplash. Pour des vecteurs : une planche du domaine public, cohérente (une seule source, un seul style), découpée en fichiers individuels.

**Étapes**

1. Chercher sur le web (`WebSearch`, domaine `pexels.com`), un sujet par requête ; relever les numéros de photos dans les adresses `pexels.com/photo/<slug>-<numero>/`.
2. Télécharger les candidates en petit avec l'adresse du CDN, qui ne demande rien : `https://images.pexels.com/photos/<numero>/pexels-photo-<numero>.jpeg?auto=compress&cs=tinysrgb&w=900`. Les mettre dans un dossier à part.
3. Faire des planches contact (`node .impeccable/outils/planche.mjs <dossier> <prefixe>`), les regarder, choisir.
4. Télécharger les retenues en HD (`w=1800` suffit pour un affichage à 1440 px), les nommer par leur contenu, les ranger dans `src/assets/photos/`.
5. Relever titre et auteur : les pages Pexels sont derrière Cloudflare pour `curl`, mais `WebFetch` passe. Les consigner dans `docs/images.md` : fichier, page utilisatrice, numéro, titre, auteur, licence.
6. Inscrire la provenance dans chaque fichier : `impeccable embed-prompt <fichier.jpg> --prompt "Photo Pexels n° …, par …, URL, licence, réservation à remplacer"`, puis `impeccable embed-prompt --scan src/assets/photos` doit répondre « 0 missing ».
7. Placer avec `<Picture src formats={['avif','webp']} widths={[480, 800, 1200, 1800]} sizes="…" alt="…" />`, `loading="eager"` et `fetchpriority="high"` sur la photo du premier écran seulement. Texte alternatif factuel et court.
8. Maîtriser le cadrage : `object-fit: cover` avec un `object-position` choisi par photo. Une photo en portrait dans une bande en paysage perd son sujet si on ne le vise pas : vérifier à 1440×900 et à 1440×1080.

## 5. Contrat de direction (15 min)

Un fichier par page, en six blocs d'environ 150 mots au total : THESIS (l'idée et ce qu'elle refuse), OWN-WORLD (palette, composants, reconnaissables sans le contenu), STORY (ce que le visiteur comprend et fait), FIRST VIEWPORT (la composition exacte et la place de l'action), FORM (la forme, la signature, les photos par section ; si le tirage impeccable n'a pas été lancé, l'écrire et dire pourquoi), FINISH (la ligne verbatim « unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance »).

Enregistrer : `impeccable surface-brief write <chemin-de-la-page> <fichier-du-contrat>`. Le relecteur jugera la page contre ce contrat, promesse par promesse : ne promettre que ce qu'on construira, et corriger le contrat quand la page a raison (ici, la proportion de champ coloré).

## 6. Construire (2 à 3 h pour trois pages)

**Squelette de page**

- Lien d'évitement, bandeau (logo, marque), navigation collante qui se réduit avec le petit logo, puis les sections dans l'ordre du contenu, puis le pied avec les coordonnées et les mentions légales.
- Action et coordonnées dès le premier écran. Un seul bouton plein par vue ; les autres au trait. Un libellé par intention sur toute la page. Libellés sur une ligne.
- Textes passés par la fonction de typographie française (espaces insécables), jamais réécrits.

**Règles de construction**

- Pas de kicker ni d'eyebrow, pas de numérotation sans séquence, pas de cartes comme structure, pas de filet latéral coloré, pas d'ombre dure, pas de dégradé sur le texte, pas de glyphe à la place d'une icône (icônes d'une bibliothèque, un seul style).
- Une seule famille de mise en page par section : le partage photo/texte au plus deux fois de suite, puis une autre famille (bande photo seule, bloc typographique, champ pleine largeur).
- Les champs de couleur et les photos « jusqu'au bord » partent d'une grille centrée : `padding-left: max(var(--marge), calc((100vw - var(--largeur)) / 2 + var(--marge)))` sur la colonne de texte, la colonne photo filant jusqu'au bord de la fenêtre.
- Surfaces du navigateur thémées : `::selection`, `scrollbar-color`, `accent-color`, `:focus-visible` (couleur différente sur les champs sombres), `text-underline-offset`.
- `font-variant-numeric: tabular-nums` sur les numéros seulement : dans certaines polices (Schibsted Grotesk), la fonction élargit aussi le point et la virgule.
- Mouvement : un moment à l'ouverture sous `html.motion` (posé par un script dans le `<head>` sauf `prefers-reduced-motion`), sortie exponentielle (`cubic-bezier(0.16, 1, 0.3, 1)`), tout visible d'emblée sans JavaScript. Les boutons répondent (`scale: 0.98` à l'appui). Rien ne réagit au survol d'un élément qui n'est pas un lien.
- Mode sombre décidé par la scène : automatique pour un design clair à fond neutre (prévoir les jetons et mesurer leurs contrastes), verrouillé pour une palette complète ou une page sombre.
- Mobile : tout en une colonne, navigation 2×2 sous 40rem, et sous 22,5rem la grille se cale à droite de la réserve du petit logo. Le titre tient à 320 px grâce à la règle du § 3.

## 7. Vérifier (30 min par tour, deux tours au plus)

1. Build, puis serveur de prévisualisation.
2. `node .impeccable/outils/captures.mjs <url> .impeccable/review/<design> --modes` : captures bureau et mobile en page entière, premiers écrans (1440, 390, 320), défilements, navigation réduite, mode sombre, sans JavaScript, mouvements réduits ; et les mesures : débordement horizontal à 320, 390, 720 (zoom 200 %) et 1440, bord droit du titre.
3. Regarder chaque capture une fois (planches avec `montage.mjs` pour comparer les trois designs), corriger tout en un lot, recapturer une fois, s'arrêter.
4. `impeccable detect --json <pages>` : corriger le mécanique, garder le reste pour le relecteur.
5. Vérifier les contraintes du projet : hook anti-tiers sur chaque fichier écrit hors des outils d'édition, grep des `http(s)://` dans le build, poids des polices par page, audit de confidentialité s'il existe.

## 8. Relecture de finition (1 h par design, en parallèle)

Lancer un agent neuf par design (jamais le fil qui a construit la page : il hériterait de son optimisme), avec le paquet de l'annexe A. L'agent lit le rôle dans `reference/degraded/finish-reviewer.md`, regarde les captures avant le code, et rend une disposition : `recapture` (les captures sont invalides), `rebuild` (la fidélité a échoué en bloc), `fix` (liste ordonnée de corrections, huit au plus) ou `ship`.

Sur `fix` : appliquer tout en un lot, rebâtir, recapturer aux mêmes chemins, renvoyer la passe de verdict à la même conversation d'agent (annexe B). L'agent note chaque correction resolved, partial ou unresolved, et au plus trois régressions. Deux tours au plus ; un `ship` obtenu ici ne couvre que les corrections notées, et se rapporte comme tel.

Ce que les relecteurs ont attrapé ici, que je n'avais pas vu : un chat hors cadre dans une bande (photo portrait, bande paysage), un titre sur quatre lignes qui coupait l'œil du chat, une photo d'appel qui s'arrêtait à 80 px du bord, une navigation à 320 px sous le petit logo, une proportion de champ promise par le contrat et non tenue, un encart dont l'icône faisait vignette, des bandes sans le voile promis.

## 9. Documenter et livrer (30 min)

- Une fiche de système par design (`docs/systemes/design-N.md`) : idée, ce qui a été repris, couleurs avec contrastes mesurés, typographie avec réglages, mise en page section par section, mouvement, images.
- `docs/images.md` à jour, la liste des informations manquantes complétée (photos à valider ou remplacer, citation dans les mentions légales).
- L'état de reprise (`REPRISE.md`) et les consignes du dépôt (`CLAUDE.md`, `SPEC.md`).
- Commit seulement sur demande.

## 10. Pièges rencontrés

- Le premier build avec des photos est long (génération AVIF), les suivants sont mis en cache.
- Les pages Pexels bloquent `curl` (Cloudflare) ; le CDN des images, lui, répond sans clé.
- Les chiffres tabulaires élargissent la ponctuation dans certaines polices : limiter la propriété aux numéros.
- Un mot long dans un titre déborde à 320 px avec un simple `clamp()` : borner par la largeur du conteneur (§ 3).
- Une frise ou un ornement qui doit traverser deux colonnes ne tient pas dans une colonne de grille : le positionner en absolu sur la section, avec une réserve sous le texte.
- `impeccable embed-prompt` écrit un commentaire JPEG ; les dérivés AVIF/WebP du build ne le reprennent pas, d'où `docs/images.md`.
- Un relecteur peut être interrompu (limite de session) : son travail est sauvegardé, le reprendre par message plutôt que relancer un agent neuf.
- Le hook anti-tiers ne voit pas les écritures faites par des scripts : lui soumettre les fichiers après coup.

## Annexe A : paquet du relecteur de finition

Prompt de l'agent (`general-purpose`, en arrière-plan), à adapter :

```
Tu es le relecteur de finition impeccable (« impeccable finish reviewer »), avec un regard neuf sur un
artefact terminé. Lis d'abord, avec l'outil Read, le fichier
<skills>/impeccable/reference/degraded/finish-reviewer.md et adopte exactement ce rôle et son contrat
de sortie. Tu ne modifies aucun fichier. Tu peux regarder les images avec Read. Lis les captures et le
contrat avant le code ; lis ensuite le fichier de l'artefact en entier.

Paquet d'entrée :
- Demande d'origine de l'utilisateur : « … ».
- Réponses confirmées : … (direction choisie sans tirage, à la demande de l'utilisateur : l'absence de clé
  de tirage est voulue ; photos en réservation, sans visage humain ; textes du client repris tels quels,
  ne jamais proposer de les réécrire).
- Artefact : <chemin de la page> (stack, scripts partagés, fichier de contenu).
- Captures, dans <dossier> (valides : polices chargées, animation d'ouverture terminée, depuis le haut
  du document) : desktop.png (1440, page entière), mobile.png (390, page entière), premier-ecran.png
  (1440×900), mobile-premier.png (390×844), premier-320.png, nav-reduite-320.png, defile-*.png,
  mobile-defile-*.png [, sombre.png, sans-js.png, reduit.png].
- Contrat de direction : <chemin du surface brief>.
- PRODUCT.md : <chemin>.
- Détecteur impeccable : <résultat>. Hook anti-tiers : <résultat>.
- Carte QUALITY BAR : aucune. Comp approuvé : aucun ; build code-led.
- Craft floor : <skills>/impeccable/reference/craft-floor.md.
- Mode de la surface : Persuade (l'action est …).

Contraintes du projet que toute correction proposée doit respecter : …

Rends ta relecture en français, dans le format du contrat : la ligne de disposition en premier
(recapture, rebuild, fix ou ship), puis exactement cinq sections : persistence, fidelity (matrice des
éléments saillants), ceiling, material_fixes (ordonnées, au plus huit, une ligne chacune, concrètes :
nomme l'élément, la capture et la correction attendue), keep. Pas d'éloges, pas de résumé.
```

## Annexe B : passe de verdict

Message envoyé à la même conversation d'agent après le lot de corrections :

```
Passe de verdict (Verdict Pass) : les N material_fixes ont été traitées, les captures ont été reprises
aux mêmes chemins. Tu notes, tu ne rechasses pas.

Ce qui a été fait, fix par fix :
1. <élément> : <changement précis, propriétés CSS ou structure>. Captures : <fichiers>.
2. …

Rends exactement deux sections, en français : verdict (pour chaque correction : resolved, partial ou
unresolved, rattachée à ce que les nouvelles captures montrent) et remaining (ce qui reste ouvert, ou
« clear »), puis la ligne de disposition recalculée, en précisant qu'un ship ne couvre que les
corrections notées. Au plus trois régressions introduites par le lot, rien d'autre.
```

## Annexe C : fiche de direction

```
Nom : …
Idée (une phrase) : …
Scène physique → clair ou sombre : …
Stratégie de couleur : retenue | engagée | palette complète | saturée
Palette (nom, valeur, rôle) : …
Contrastes mesurés (texte sur fond) : …
Typographie (familles, axes, rôles, échelle) : …
Premier écran (ce qui est où, l'action) : …
Moment animé unique : …
Ce que la direction refuse : …
Images nécessaires (un sujet par section) : …
Mode sombre : automatique | verrouillé clair | verrouillé sombre
```

## Annexe D : scripts

Dans `.impeccable/outils/` (Playwright requis, Edge ou Chrome installés) :

- `captures.mjs <url> <dossier> [--modes]` : le tour de captures et de mesures du § 7.
- `planche.mjs <dossier> <prefixe>` : planches contact des photos candidates.
- `montage.mjs <sortie> <x> <y> <l> <h> <captures…>` : la même zone de plusieurs captures, côte à côte.
- `contraste.mjs '#texte' '#fond' …` : rapports de contraste.
- `navigateur.mjs` : choix du navigateur, partagé par les trois premiers.

Copier le dossier dans un autre projet suffit.
