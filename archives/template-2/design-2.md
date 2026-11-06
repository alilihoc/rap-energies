---
name: Rap Énergies, template 2 « Le soir, la maison chauffe »
description: Page sombre et calme, photo du soir plein écran, un seul accent ambre, Literata
colors:
  nuit: "#15130e"
  nuit-relevee: "#1f1b15"
  creme: "#f1ead9"
  creme-eteinte: "#bfb49c"
  filet: "#2a2620"
  filet-clair: "#4a4232"
  ambre: "#f0a43c"
  ambre-appuye: "#e0942c"
  aide-champ: "#8f8674"
  surligne: "#3a2e12"
  surligne-ambre: "#fff0cc"
typography:
  display:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "min(clamp(1.9rem, 1.3rem + 2.1vw, 2.9rem), calc(100cqi / 9.9))"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.9rem, 1.4rem + 1.8vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.08
  title:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.45rem, 1.15rem + 1vw, 2.1rem)"
    fontWeight: 500
    lineHeight: 1.15
  body:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: "0"
spacing:
  marge: "clamp(1.25rem, 4vw, 3rem)"
  bloc: "clamp(3.5rem, 8vw, 6.5rem)"
  largeur: "75rem"
components:
  button-primary:
    backgroundColor: "{colors.ambre}"
    textColor: "{colors.nuit}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.creme}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
  button-send:
    backgroundColor: "{colors.nuit}"
    textColor: "{colors.creme}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
  input:
    backgroundColor: "{colors.nuit-relevee}"
    textColor: "{colors.creme}"
    rounded: "{rounded.none}"
    padding: "0.7rem 0.9rem"
---

# Système de design 2 : « Le soir, la maison chauffe »

Construit le 30 octobre 2026. Page : `template-2/index.html` (source `src/template-2/`). Contrat de direction : `.impeccable/surfaces/template-2-index-html.md`. Fiche de direction et mesures : `docs/directions.md` § 3 et § 4. Images : `docs/images.md`.

## Ce qui a été repris de la méthode

Même socle que le template 1 (`docs/systemes/design-1.md`, section « Ce qui a été repris ») : brief et contrat impeccable, plan relu contre les défauts des générateurs, règles anti-cartes et un libellé par intention, contrastes mesurés, typographie mesurée, scripts de captures et typographie française. En plus, la calibration d'impeccable sur les pages sombres : pas de gris-bleu ardoise, pas de néon, pas de halo, pas de verre dépoli ; le fond est nommé et tenu (Nuit `#15130e`, chaud).

## Idée

Un soir de janvier à Vendargues : la pompe à chaleur tourne dans le noir du jardin, la maison est chaude, l'eau du bain a été chauffée à midi par le toit. La page est cette nuit-là, sombre et calme. La lumière vient des photos et d'une seule couleur, l'ambre des fenêtres allumées, réservée au bouton d'appel et au champ de contact.

## Couleurs

Stratégie retenue, sombre : un fond, un texte, un accent. L'ambre occupe un seul champ entier (le contact, « la fenêtre allumée », environ 9 % de la hauteur à 1440 px) et le bouton plein.

| Nom | Valeur | Rôle |
|---|---|---|
| Nuit | `#15130e` | Fond de page, bandeau, panneau de l'accroche, pied, bouton d'envoi, texte sur l'ambre |
| Nuit relevée | `#1f1b15` | Cadres de la galerie et de la photo des étapes, champs de formulaire |
| Crème | `#f1ead9` | Texte, titres, bouton au trait, nom du logo (`logo-clair.png`) |
| Crème éteinte | `#bfb49c` | Texte secondaire, légendes, mois du graphique |
| Filet | `#2a2620` | Filets de 1 px, cadres |
| Filet clair | `#4a4232` | Bord des champs, cadre de l'image agrandie |
| Ambre | `#f0a43c` | Champ de contact, bouton plein, barres PVGIS, repères de légende, numéros d'étapes, icône des replis, Castries, titres de la page confidentialité |
| Aide de champ | `#8f8674` | Texte indicatif des champs |

**Contrastes mesurés** :

| Texte | Fond | Contraste |
|---|---|---|
| Crème | Nuit | 15,48:1 |
| Crème éteinte | Nuit | 9,04:1 |
| Ambre | Nuit | 8,91:1 |
| Nuit (encre) | Ambre | 8,91:1 |
| Crème | Nuit relevée | 14,28:1 |
| Aide de champ | Nuit relevée | 5,15:1 (mesuré sur Nuit, Nuit relevée est plus claire d'un cran) |

Paire interdite et évitée : brun `#5c4a1e` sur Ambre (4,11:1) ; sur l'ambre, tout le texte est en Nuit.

**La règle de la fenêtre allumée.** L'ambre n'est jamais une décoration : il marque ce qui appelle (bouton, champ de contact), ce qui compte (Castries, les numéros d'étapes) et ce qui mesure (les barres PVGIS). Aucun dégradé, aucun voile, aucun halo.

**Mode sombre** : verrouillé sombre (`color-scheme: dark`).

## Typographie

| Rôle | Police | Réglage |
|---|---|---|
| Titre de page | Literata (fichier `opsz`, axes opsz + wght, 110 Ko), `font-optical-sizing: auto` | 500, `min(clamp(1,9 rem, 1,3 rem + 2,1 vw, 2,9 rem), 100cqi / 9,9)` (« thermodynamique, » = 9,27 em à 100 px, plus large à petite taille) ; le panneau est un conteneur |
| Titres de section | Literata | 500, `clamp(1,9 rem, 1,4 rem + 1,8 vw, 3 rem)`, interligne 1,08 |
| Noms des services, communes, questions, points de réassurance | Literata | 500 |
| Texte | Literata | 400, 1,125 rem, interligne 1,6, mesure 60 ch |
| Navigation, boutons, légendes, graphique, formulaire, pied, numéros | Schibsted Grotesk (fichier `wght`, 47 Ko) | 400 à 700 ; chiffres tabulaires sur les numéros seulement (la fonction élargit la ponctuation dans cette police) |

Aucune italique chargée (l'italique de Literata ferait dépasser 200 Ko) : les questions sont en Literata 500 romain. 157 Ko de polices au total.

## Mise en page

Grille centrée de 75 rem, mêmes marges et espacements que le template 1, rayons nuls, filets de 1 px entre les sections.

1. **Bandeau** : Nuit, collant, 4,5 rem, réduit après 72 px de défilement (sentinelle de 4,5 rem observée par `IntersectionObserver`, symbole à l'échelle 0,75 par `transform`) ; symbole + nom en Literata 600, cinq ancres (section courante soulignée en ambre par `aria-current`) et téléphone en Schibsted. Sous 40 rem : collant avec un `top` négatif égal à la hauteur réelle de la rangée des ancres (`--nav-h` posée par le script, repli 2,95 rem), les ancres tiennent sur une rangée qui défile latéralement avec un fondu (libellés courts « Chantiers » et « Étapes »), cette rangée part avec la page et la rangée marque + téléphone reste ; sous 22,5 rem le nom est masqué.
2. **Accroche** : section sans padding vertical (le padding de `main > section` y est annulé), photo du soir sur toute la largeur et exactement la hauteur restante (`min-height: calc(100dvh - 4,5 rem)`, `object-position: 50 % 62 %` pour garder le lampadaire et les fenêtres allumées) ; posé dessus, aligné sur la grille et ancré au bord bas, un panneau Nuit de 56 rem au plus (neuf colonnes, pour tenir le titre en trois lignes) avec titre, texte, bouton plein Ambre, bouton au trait Crème, ligne d'adresse ; aucun texte directement sur la photo ; la galerie commence juste sous le premier écran. Sous 48 rem : photo de 40 vh puis panneau pleine largeur.
3. **Réalisations** : huit photos 4:3 sur trois colonnes, chacune dans un cadre porté par le lien (fond Nuit relevée, filet 1 px, marge intérieure 0,6 rem), légende **sous le cadre**, sur le fond Nuit, en Schibsted (repère carré Ambre, légende Crème, détail et « photo provisoire » en Crème éteinte) : des tirages encadrés et leur cartel, pas des cartes. Deux colonnes sous 60 rem, une sous 40 rem. Visionneuse `<dialog>` à fond `rgb(21 19 14 / .97)`, image encadrée d'un filet clair.
4. **Services** : liste à filets, nom de l'équipement en Literata à gauche (4 colonnes), texte à droite (8), puis « Les trois ensemble » en 1,7 rem.
5. **Bande** : tuiles canal en lumière rasante, `clamp(15 rem, 38 vw, 27 rem)`.
6. **Production** : texte sur 60 ch, douze barres horizontales Ambre (mois à gauche en Schibsted, valeur à droite), largeur proportionnelle à `--v` ; sous 48 rem les mois passent en abréviations (« janv. », « févr. »…).
7. **Comment ça se passe** : photo 4:5 encadrée et collante à gauche, six étapes à droite, numéros en Literata Ambre.
8. **Zone** : communes en Literata 500 jusqu'à 2 rem, Castries en Ambre.
9. **Pourquoi** : six points à filets sur deux colonnes (60 rem au plus).
10. **Questions** : six `<details>` sur une colonne de 50 rem, questions en Literata 500, icône « plus » Ambre.
11. **Contact** : champ Ambre pleine largeur, texte et titres en Nuit, numéro en Literata 3,2 rem, formulaire à champs Nuit relevée (texte Crème, bord Filet clair, anneau de focus Nuit), cases à cocher dessinées (bord et coche Nuit), consentement avec lien vers la page Confidentialité, bouton plein Nuit « Envoyer ma demande » ; message d'état dans un bloc Nuit (envoi confirmé) ou encadré Nuit (voie `mailto` provisoire : le formulaire reste visible, le message dit que la messagerie s'ouvre).
12. **Pied** : Nuit, logo complet clair, coordonnées, qualification, liens, sources, réalisation, en Schibsted 0,95 rem.

## Mouvement

Trois moments de lumière, sous `html.motion`, et rien de décoratif. **L'ouverture** : la photo de l'accroche s'allume (`opacity 0 → 1` et `filter: brightness(0.3) → brightness(1)`, 1 200 ms, `cubic-bezier(0.16, 1, 0.3, 1)`) pendant que le panneau se pose en quatre temps (titre, texte, boutons, ligne : `opacity 0 → 1`, `translate 14px → 0`, 550 ms, décalages 150 / 250 / 330 / 410 ms). **L'approche** : au survol ou au focus d'une photo de la galerie, le cadre passe de Filet à Ambre (250 ms) : l'ambre marque ce qui appelle. **La mesure** : les barres PVGIS poussent une fois à leur entrée dans l'écran (`animation-timeline: view()`, plage `cover 5% → 40%`, sous `@supports` ; barres fixes sans prise en charge). Boutons à l'appui `scale: 0.98`, bandeau qui change de hauteur en transition, symbole réduit par `transform`, icône des replis qui tourne. Pas d'entrée de section au défilement, pas de parallaxe. Sans JavaScript, la photo est pleine lumière et le panneau en place dès le départ. (Règle amendée le 2 novembre 2026 après la critique : la version précédente n'autorisait que l'ouverture et l'appui.)

## Surfaces du navigateur

`::selection` Ambre sur Nuit, `scrollbar-color` Crème éteinte sur Nuit, `accent-color` Ambre, cases à cocher dessinées, `caret-color` Ambre, `li::marker` Crème éteinte, `:focus-visible` anneau Ambre de 3 px (Nuit sur le champ Ambre), `text-underline-offset: 0.18em`.

## Images

Accroche : `rue-soir` (maisons ocre et crème au crépuscule, lampadaire allumé). Galerie : les huit photos communes (`toit-tuiles-sombres` a remplacé `toit-tuiles-rouges`). Bande : `tuiles-rasantes`. Étapes : `mains-chaudiere`. Toutes provisoires (Pexels), provenance dans `docs/images.md`, attentes dans `template-2/images/A-REMPLACER.md`.

## Relecture de finition

Relecteur neuf (agent `general-purpose`, paquet de l'annexe A du mode opératoire), le 30 octobre 2026. Disposition : **fix**, huit corrections, toutes appliquées en un lot puis recapturées aux mêmes chemins :

1. Accroche plus haute que l'écran (padding hérité de `main > section`, panneau coupé, photo qui dépassait sous lui) : padding annulé, photo + panneau = hauteur restante exacte.
2. Bandeau réduit dès le chargement : sentinelle de 4,5 rem et `rootMargin: 0`.
3. Légendes enfermées dans le cadre (lues comme des cartes) : cadre porté par le lien, légende sous le cadre.
4. Premier écran mobile (bandeau de trois rangées, photo 52 vh, bouton ambre à 1 160 px) : bandeau collant à `top` négatif avec ancres sur une rangée défilante, photo 40 vh.
5. Voie `mailto` qui affichait « votre demande est bien partie » sans envoi : formulaire laissé visible, message d'interface distinct, confirmation réservée au point d'envoi réel.
6. Point médian orphelin dans la légende de la visionneuse : séparateur final retiré.
7. « Voir la page Confidentialité » sans lien : lien ajouté.
8. Mois réduits à une lettre ambiguë à 390 px : abréviations françaises.

Le relecteur avait aussi noté, sans en faire des corrections : des titres qui pourraient exploiter davantage l'axe optique de Literata, les cases à cocher natives grises (dessinées depuis), `::marker` et `caret-color` par défaut (thémés depuis), `novalidate` qui coupait la validation native sans script (retiré). Passes de verdict : huit corrections notées **resolved**, puis les deux régressions du lot (journal des images, rangée d'ancres coupée) notées **resolved** ; dernière régression relevée, le repli sans script de `--nav-h`, fermée ensuite par des valeurs CSS par palier (4,5 rem sous 40 rem, 6,625 rem sous 22,5 rem) et vérifiée par capture mobile sans script, non renotée (limite de deux tours). Dernière disposition enregistrée du relecteur : fix, un seul point ouvert, celui-là.
