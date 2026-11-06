---
target: template-1/index.html (critique des deux templates)
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\hali\\dev\\sites-client\\rap-enerigie\\template-1\\index.html"
target_fingerprint: "sha256:67f1bb90bed13f8acdc82bb1ecc647a9126a8ee605737430104051597ed47ecf"
target_path: "C:\\Users\\hali\\dev\\sites-client\\rap-enerigie\\template-1\\index.html"
timestamp: 2026-11-02T16-32-08Z
slug: template-1-index-html
---
Méthode : deux relecteurs design indépendants (un par template) et un passage détecteur + navigateur isolé, synthétisés ensuite. Captures et JSON dans `.impeccable/critique/captures/` et `.impeccable/critique/detect-template-N.json`.

## Score de santé (heuristiques de Nielsen, 0-4)

| # | Heuristique | T1 | T2 | Constat clé |
|---|---|---|---|---|
| 1 | Visibilité de l'état | 3 | 3 | Bandeau réduit, compteur, `role="status"` ; pas de section courante dans la nav, pas d'état « envoi en cours » (T2 : à-coup de 16 px du bandeau) |
| 2 | Correspondance monde réel | 3 | 3 | Langue d'artisan ; « kWc » 7 fois jamais défini ; crochets adressés au client lus par le visiteur |
| 3 | Contrôle et liberté | 3 | 3 | Visionneuse complète ; saut de 8 500 px sans retour, pas de haut de page sur 18 écrans mobiles |
| 4 | Cohérence et standards | 3 | 3 | Un libellé par intention ; ancres ≠ titres de section ; triptyque T1 sans affordance de lien |
| 5 | Prévention des erreurs | 3 | 3 | `required`, `autocomplete`, pot de miel ; `tel` sans `pattern`, commune en texte libre malgré 17 communes connues |
| 6 | Reconnaissance plutôt que rappel | 3 | 3 | Numéro répété, code couleur T1 porté ; 9 nombres avant le graphique, unité `production.unite` jamais rendue |
| 7 | Flexibilité et efficacité | n/a | n/a | Page Persuade à parcours unique |
| 8 | Esthétique et minimalisme | 2 | 2 | 1 700 mots, 24 à 32 avis de chantier, services 436 mots ; T1 rythme uniforme, T2 tiers droit vide |
| 9 | Récupération des erreurs | 3 | 2 | Repli téléphone + e-mail ; validation native fugace seule (`:user-invalid` non stylé) |
| 10 | Aide et documentation | n/a | n/a | La FAQ tient ce rôle |
| **Total** | | **23/32** | **22/32** | **Acceptable (72 % et 69 %)** |

## Verdict de spécificité

Spécifique dans les mots, à moitié dans la forme, interchangeable dans les images. Appartiennent à cet artisan : « posés par un électricien de Castries », les 17 communes avec Castries en couleur, le graphique PVGIS pour Castries avec sa source, la FAQ qui cite le château et l'aqueduc, « Pas de démarchage », le triptyque tiré du logo (T1), la rue au crépuscule et la règle de la fenêtre allumée (T2). Interchangeables : la galerie (3 toits nordiques, 1 cumulus électrique légendé « thermodynamique », 1 marque « alpha innotec » lisible), et 65 à 82 % de la hauteur après le premier écran, où seuls les mots travaillent.

Détecteur : 8 constats statiques par template, dont 7 faux positifs (retraits portés par `main > section`, `.colonne`, `.visionneuse-contenu`) et 1 non localisable ; 13 (T1) et 17 (T2) constats en navigateur, dont 24 surlignages `mark.pl` sans objet, 3 `line-length` vrais en T2 (87 à 90 caractères, `.service-intro p` sans `max-width`), 3 `tight-leading` à 1,30 exact (artefact), 1 `ol.barres` mineur ; 3 avis T1 de jetons manquants (`#fff`, `--surligne`). Hors détecteur : débordement horizontal de 9 px en T1 à 1280 px (dernier volet du triptyque). Aucune erreur console, aucune requête échouée. Pas d'onglet d'overlay ouvert ; captures `overlay-template-N-page.png`.

## Impression d'ensemble

Deux pages solides, honnêtes et robustes, dont la vie s'arrête après le premier écran. Le ressenti « triste » est fondé aux deux tiers et localisable : premier écran mobile sans image ni appel, bloc Services, galerie qui lit « en travaux », aucune réponse à l'approche, rythme à plat sur bureau. La plus grande occasion : faire redescendre la signature du premier écran (couleur T1, lumière T2) dans le reste de la page.

## Ce qui marche

- Le premier écran bureau des deux templates : triptyque bichromie qui se lève (T1), rue au crépuscule qui s'allume sous un panneau sans texte sur la photo (T2).
- Typographie et lisibilité : corps 18 px, mesure 60 ch, contrastes 17,35:1 et 15,48:1, titres bornés par `100cqi`, zoom 200 % sans débordement, polices 112 Ko.
- Robustesse : tout sans script, `<dialog>` natif avec focus rendu, `prefers-reduced-motion`, aucune ressource externe, aucune erreur console.

## Problèmes prioritaires

Aucun P0.

1. **[P1] Le premier écran mobile n'appelle pas et ne montre rien.** T1 à 390 : 129 px de bandeau puis 577 px de texte, triptyque à y = 754, hors écran à 320 ; la seule animation n'est jamais vue sur téléphone. T2 : bouton ambre à y = 905 sur 844, seul appel visible = lien du bandeau de 136 × 24 px. Correction : T2 boutons sous le titre (`order`), photo à 30 vh ; T1 masquer `.ligne`, réduire les volets à 6,5 rem, étendre `lever` aux lignes du h1 ; nav sur une rangée ; `.tel` à 44 px. Commandes : adapt, layout, animate.
2. **[P1] La section-preuve porte l'échafaudage.** 17 avis dans Réalisations (8 × « [À COMPLÉTER : commune] », 8 × « Photo provisoire… », 1 intro), 24 à 32 sur la page ; marque lisible (`tri-pompe`, `pompe-a-chaleur-gravier`), cumulus électrique légendé thermodynamique (`chauffe-eau-buanderie`), 3 toits nordiques. Correction : mention « provisoire » une seule fois sous l'intro dans `galerie()`, crochet commune conservé par photo ; recadrer ou remplacer 2 photos. Commandes : distill, harden.
3. **[P1] Services, le bloc le plus dense.** 436 mots, 12 puces (5/4/3), 2 050 px bureau, 3 050 px mobile (3,6 écrans) ; T1 colonne gauche vide à 78 % ; T2 lignes à 71 à 90 caractères pour 60 à 62 promis ; `h4` « Ce que nous faisons : » plus faible que ses puces. Correction : T1 photo de l'équipement en couleur dans la colonne gauche (le triptyque déplié) ; T2 `max-width: 62ch`, listes à filets, deux colonnes dès 64 rem ; `h4` en titrage. Commandes : layout, typeset.
4. **[P2] Rythme à plat sur bureau.** T1 : 82 % de la hauteur sans couleur après le triptyque, treize frontières de section identiques. T2 : tiers droit vide sur 3 300 px, valeurs du graphique à 350 px des barres. Correction : production en deux colonnes texte | graphique, pourquoi sur trois colonnes, FAQ avec rappel d'appel collant, « 1 500 kWh » en grand, `production.unite` rendue, `--bloc` varié. Commandes : layout, colorize (T1), bolder.
5. **[P2] Aucune réponse à l'approche.** Inventaire : 1 keyframe et 5 transitions par template, survol galerie `brightness(1.05)` imperceptible. Correction dans le système : T1 `grayscale(0.35)` au survol du triptyque, `cursor: zoom-in`, repère agrandi ; T2 cadre ambre au survol et focus, transition du bandeau, panneau posé en quatre temps pendant l'allumage ; second moment mesuré : barres PVGIS qui poussent à l'entrée (`animation-timeline: view()`, CSS pur, `@supports`, `html.motion`), qui demande d'amender « un seul moment animé » dans DESIGN.md. Commandes : animate, delight.
6. **[P2] Finitions mesurables.** T1 : 9 px de débordement à 1280, anneau de focus Eau invisible sur le champ Eau, mois à 12,8 px et mention provisoire à 13,6 px sous le plancher de 17 px. T2 : `:user-invalid` non stylé, pas de garde pendant le `fetch`, trou dans la dernière rangée de galerie. Les deux : `tel` sans `pattern`, ancres ≠ titres, « kWc » jamais défini. Commandes : harden, polish, clarify.

## Personas

- **Jordan (premier contact)** : bute sur « kWc », « surimposition », « condensats » ; interrompu 24 fois par un surlignage dont certains lui sont adressés (« le devis est-il gratuit ? Si oui, l'écrire ici ») ; « Décrire mon projet » le projette 8 500 px plus bas sans repère.
- **Casey (mobile, pouce)** : premier écran sans bouton d'appel ; 18 écrans ; 4,3 écrans de galerie puis 3,7 de services ; visionneuse sans balayage tactile ; cases `.cases label` de 28 px (T1).
- **Riley (limites)** : sans JS tout tient ; `tel` requis accepte « abc » ; double clic possible pendant l'envoi ; anneau de focus perdu sur le champ Eau (T1).
- **Propriétaire de 55-65 ans à Castries, en plein jour** : T1 lui convient (clair, 18 px) sauf les 12,8 px des mois ; T2 devient miroir au soleil, les 15,2 px éteints partent les premiers ; il voit le cumulus mural légendé thermodynamique et en déduit que le site n'est pas fini ; il appelle depuis le bouton plein ou le numéro de 3 rem, pas depuis le formulaire.

## Observations mineures

Quart supérieur droit vide du premier écran T1 ; `.ligne` en doublon ; « Cliquez sur une photo » sur tactile ; source PVGIS citée deux fois ; h2 48 px > h1 46,4 px en T2 ; `.pied p` à 108 ch ; `li::marker` déclaré deux fois ; aucune ancre vers production, pourquoi, questions.

## Questions à considérer

1. Le client regardera la page sur son téléphone : le premier écran mobile doit-il être le triptyque lui-même (T1) et les boutons sous le titre (T2) ?
2. Services pourrait être le triptyque déplié (T1) ; pour T2, la règle pourrait devenir « la lumière bouge une fois par chose qui appelle ou qui mesure » : photo à l'ouverture, cadre à l'approche, barres à l'entrée. Qu'est-ce qui l'interdit ?
3. Le titre long (14 mots, 6 lignes à 390) ou la variante courte déjà validée « Le soleil de Castries, installé chez vous. » ? Décision client.
4. Huit photos approximatives avec seize avis, ou quatre photos justes et une seule mention provisoire ?
5. T2 verrouillé sombre pour un public qui lit en plein jour : signature à assumer, ou variante crème sous `prefers-color-scheme: light` ?
