---
name: Rap Énergies, template 1 « Plein midi »
description: Page claire et franche, palette complète tirée du logo, un équipement par couleur
colors:
  blanc-de-midi: "#fcfbf7"
  encre: "#14171c"
  second-plan: "#4b5361"
  filet: "#e4e1d9"
  soleil: "#f2b41a"
  chaleur: "#ef6b1c"
  eau: "#1f66cc"
  sur-encre: "#fcfbf7"
  sur-encre-second: "#b8b2a6"
  surligne: "#fff1bf"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "min(clamp(1.9rem, 1.1rem + 2.4vw, 3.25rem), calc(100cqi / 9.4))"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 1.3rem + 1.6vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 1.1rem + 1vw, 2rem)"
    fontWeight: 800
    lineHeight: 1.1
  body:
    fontFamily: "Hanken Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Hanken Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  none: "0"
spacing:
  marge: "clamp(1.25rem, 4vw, 3rem)"
  bloc: "clamp(3.5rem, 8vw, 6.5rem)"
  largeur: "75rem"
components:
  button-primary:
    backgroundColor: "{colors.encre}"
    textColor: "{colors.sur-encre}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.encre}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
  button-send:
    backgroundColor: "{colors.blanc-de-midi}"
    textColor: "{colors.encre}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.encre}"
    rounded: "{rounded.none}"
    padding: "0.7rem 0.9rem"
---

# Système de design 1 : « Plein midi »

Construit le 30 octobre 2026. Page : `template-1/index.html` (source `src/template-1/`). Contrat de direction : `.impeccable/surfaces/template-1-index-html.md`. Fiche de direction et mesures : `docs/directions.md` § 2 et § 4. Images : `docs/images.md`.

## Ce qui a été repris de la méthode

- **impeccable** : brief `PRODUCT.md`, contrat en six blocs, craft floor lu avant d'écrire, détecteur, relecteur de finition neuf, provenance inscrite dans chaque photo.
- **frontend-design** : plan en jetons relu contre les défauts des pages générées (pas de crème + sérif + terracotta, pas de noir + néon, pas de kicker) ; un seul moment animé.
- **design-taste-frontend** : pas de cartes, pas de zigzag, boutons sur une ligne, un libellé par intention, hero en quatre éléments.
- **better-colors** : rôles et contrastes mesurés avec `contraste.mjs`.
- **web-typography** : corps 18 px, interligne 1,55, mesure 62 ch, polices variables auto-hébergées sous 200 Ko, zoom 200 % sans débordement.
- **Catus Bonus** : fonction de typographie française (`outils/typo.mjs`), scripts de captures, bandeau réduit, titre borné par la largeur du conteneur.

## Idée

À midi sur un toit de tuiles de Castries, les panneaux sont à pleine puissance et le chauffe-eau vient de s'allumer. La page est cette heure-là : blanche, franche, et chaque équipement porte une couleur du logo. Le jaune du soleil pour les panneaux, l'orange de la chaleur pour la pompe à chaleur, le bleu de l'eau pour le chauffe-eau. La feuille verte reste au logo.

## Couleurs

Palette complète : un fond blanc chaud, une encre, trois couleurs saturées qui ont chacune un seul sens. Le champ Encre ferme la page (contact et pied), environ 12 % de la hauteur à 1440 px.

| Nom | Valeur | Rôle |
|---|---|---|
| Blanc de midi | `#fcfbf7` | Fond de page, texte sur l'encre |
| Encre | `#14171c` | Texte, bouton plein, champ de contact et pied |
| Second plan | `#4b5361` | Texte secondaire, légendes, source du graphique |
| Filet | `#e4e1d9` | Filets de 1 px, fond des images avant chargement |
| Soleil | `#f2b41a` | Panneaux : champ du triptyque, barre du titre de service, repère de légende, barres PVGIS (le soleil qui produit). Les crochets ne sont plus surlignés en jaune depuis le 2 novembre 2026 : pointillé Second plan |
| Chaleur | `#ef6b1c` | Pompe à chaleur : champ, barre, repère |
| Eau | `#1f66cc` | Chauffe-eau : champ, barre, repère ; anneau de focus |
| Sur encre second | `#b8b2a6` | Texte secondaire sur le champ Encre |

**Contrastes mesurés** (`node .impeccable/outils/contraste.mjs`) :

| Texte | Fond | Contraste |
|---|---|---|
| Encre | Blanc de midi | 17,35:1 |
| Second plan | Blanc de midi | 7,49:1 |
| Encre | Soleil | 9,68:1 |
| Encre | Chaleur | 5,81:1 |
| Blanc | Eau | 5,48:1 |
| Blanc de midi | Encre | 17,35:1 |
| Sur encre second | Encre | 8,52:1 |
| Soleil | Encre | 9,68:1 |

Paires interdites et évitées : blanc sur Chaleur (3,09:1, grand texte seulement), Encre sur Eau (3,28:1).

**La règle d'une couleur, un équipement.** Soleil, Chaleur et Eau ne servent qu'à désigner leur équipement, dans le triptyque, les barres de titre, les repères de légende. Le jaune garde une seule exception, prévue par le contrat : les barres du graphique de production (c'est le soleil qui produit). Sur le champ Encre, le bouton d'envoi, le message d'état et les cases à cocher sont en Blanc de midi ; dans la liste des communes, Castries est un bloc Encre à texte Blanc de midi ; la sélection de texte est Encre sur Blanc. (Corrigé après la relecture de finition, qui avait relevé quatre emplois du Soleil hors réservation.)

**Mode sombre** : verrouillé clair (`color-scheme: light`) ; la capture `sombre.png` est identique à la version claire.

## Typographie

| Rôle | Police | Réglage |
|---|---|---|
| Titre de page | Bricolage Grotesque (fichier `opsz`, axes opsz + wght, 77 Ko) | 800, `min(clamp(1,9 rem, 1,1 rem + 2,4 vw, 3,25 rem), 100cqi / 9,4)` : le diviseur vient de la largeur de « thermodynamique, » mesurée à petite taille optique (8,47 em à 100 px, plus large à 32 px) ; la colonne est un conteneur |
| Titres de section | Bricolage Grotesque | 800, `clamp(1,8 rem, 1,3 rem + 1,6 vw, 2,75 rem)`, interligne 1,05, `text-wrap: balance`, 22 ch au plus |
| Titres de service, noms du triptyque, communes, numéros d'étapes | Bricolage Grotesque | 800 ; noms du triptyque `clamp(1,2 rem, 0,85 rem + 1 vw, 1,8 rem)` avec `hyphens: auto` pour que « thermodynamique » tienne dans le champ de 3 colonnes ; communes 700 jusqu'à 2,3 rem |
| Texte | Hanken Grotesk (fichier `wght`, 35 Ko) | 400, 1,125 rem, interligne 1,55, mesure 62 ch ; accroche 1,15 rem |
| Navigation, boutons, légendes, formulaire | Hanken Grotesk | 600 ; légendes 0,95 rem ; chiffres tabulaires sur les numéros seulement |

Aucune italique chargée. Polices servies depuis `template-1/fonts/`, `font-display: swap`, 112 Ko au total.

## Mise en page

Grille centrée de 75 rem, marges `clamp(1,25 rem, 4 vw, 3 rem)`, sections espacées de `clamp(3,5 rem, 8 vw, 6,5 rem)` et séparées d'un filet. Rayons nuls partout.

1. **Bandeau** : collant, 4,5 rem ; se réduit après 72 px de défilement (une sentinelle de 4,5 rem en haut du document est observée par `IntersectionObserver`, pas d'écouteur de défilement ; symbole mis à l'échelle 0,75 par `transform`, hauteur inchangée) ; symbole + nom en Bricolage, cinq ancres (section courante soulignée par `aria-current`), téléphone avec icône Phosphor. Sous 40 rem : toujours collant, avec un `top` négatif égal à la hauteur réelle de la rangée des ancres (variable `--nav-h` posée par le script, repli CSS 2,95 rem sans script) ; les cinq ancres tiennent sur une rangée qui défile latéralement avec un fondu, libellés courts « Chantiers » et « Étapes », cette rangée part avec la page et la rangée marque + téléphone reste visible ; sous 22,5 rem le nom est masqué, le symbole reste.
2. **Accroche** : titre sur trois lignes à 1440 px (dix colonnes au plus), texte sur 62 ch, bouton plein Encre « Appeler le 06 99 34 66 86 », bouton au trait « Décrire mon projet », ligne d'adresse ; puis le **triptyque** bord à bord (`minmax(0, 5fr) minmax(0, 4fr) minmax(0, 3fr)`, soit 600 / 480 / 360 px à 1440) : photo en bichromie (`filter: grayscale(1)` + `mix-blend-mode: multiply` sur le champ coloré, hauteur `clamp(12 rem, 24 vh, 16 rem)`) et nom de l'équipement sous la photo, lien vers la section ; les trois noms sont visibles dans le premier écran à 1440 × 900 (triptyque d'environ y = 540 à 850). Sous 48 rem : une ligne par équipement, photo à gauche (36 %), nom à droite.
3. **Réalisations** : mosaïque sur six colonnes (3 + 3, 2 + 2 + 2, 3 + 3, 6), photos 4:3 et une bande 21:9, légendes sous les photos avec repère carré de la couleur de l'équipement, mention « photo provisoire ». Agrandissement dans un `<dialog>` (fond `rgb(20 23 28 / .96)`, boutons Phosphor, compteur, flèches du clavier, focus rendu au lien) ; sans JavaScript, le lien ouvre le JPEG de 1800 px. Deux colonnes sous 48 rem, une sous 40 rem.
4. **Services** : trois rangées titre à gauche (barre de couleur 3,5 × 0,75 rem au-dessus du titre) et texte à droite (5/7), puis « Les trois ensemble » en 1,5 rem.
5. **Bande** : photo seule, hauteur `clamp(16 rem, 42 vw, 30 rem)`.
6. **Production** : texte sur 62 ch, graphique de douze colonnes Soleil (hauteur proportionnelle à `--v`, valeurs au-dessus, mois dessous, filet de base) ; sous 40 rem, même balisage en barres horizontales.
7. **Comment ça se passe** : photo 4:5 collante à gauche (5 colonnes), six étapes numérotées à droite (numéro Bricolage 2 rem dans une colonne de 3 rem, texte dans `.etape`).
8. **Zone** : les dix-sept communes en Bricolage 700, Castries en bloc Encre à texte Blanc de midi.
9. **Pourquoi** : six points à filets sur trois colonnes (une sous 64 rem).
10. **Questions** : six `<details>` sur deux colonnes, icône Phosphor « plus » qui tourne de 45° à l'ouverture.
11. **Contact** : champ Encre pleine largeur ; texte, numéro en 3 rem, formulaire sur deux colonnes à champs blancs, cases à cocher dessinées (bord et coche Blanc de midi), consentement avec lien vers la page Confidentialité, bouton Blanc de midi « Envoyer ma demande » ; message d'état dans un bloc Blanc de midi (envoi confirmé par le point d'envoi) ou encadré (voie `mailto` provisoire : le formulaire reste visible et le message dit que la messagerie s'ouvre).
12. **Pied** : sur le champ Encre, logo complet clair, coordonnées, qualification, liens légaux, sources, réalisation.

Pages légales : même bandeau et pied, colonne de 62 ch, `noindex`.

## Mouvement

Trois moments de lumière, sous `html.motion` (classe posée par un script dans `<head>` sauf `prefers-reduced-motion`), et rien de décoratif. **L'ouverture** : le titre, le texte et les boutons se lèvent (`clip-path: inset(100% 0 0 0)` → `inset(0)`, 600 ms, décalages 0 / 100 / 180 / 260 ms), puis les trois champs du triptyque du même geste (700 ms, à partir de 200 ms, décalage de 90 ms, `cubic-bezier(0.16, 1, 0.3, 1)`). **L'approche** : au survol ou au focus d'un volet du triptyque, la couleur revient sous la teinte (`grayscale(1)` → `grayscale(0.2)`, 400 ms) ; dans la galerie, la photo s'approche (`scale: 1.03`, 500 ms), le repère grossit et la légende se souligne. **La mesure** : les barres PVGIS poussent une fois à leur entrée dans l'écran (`animation-timeline: view()`, plage `cover 5% → 40%`, sous `@supports` ; barres fixes sans prise en charge). Les boutons répondent à l'appui (`scale: 0.98`), le bandeau change de hauteur en transition, le symbole se réduit par `transform`, l'icône des replis tourne. Pas d'entrée de section au défilement, pas de parallaxe. Défilement doux sous `html.motion` seulement. (Règle amendée le 2 novembre 2026 après la critique : la version précédente n'autorisait que l'ouverture et l'appui.)

## Surfaces du navigateur

`::selection` Encre sur Blanc de midi, `scrollbar-color` Encre sur Blanc de midi, `accent-color` Encre, cases à cocher dessinées, `caret-color` Encre, `li::marker` Second plan, `:focus-visible` anneau Eau de 3 px (Blanc de midi sur le champ Encre et dans la visionneuse), `text-underline-offset: 0.16em`, chiffres tabulaires sur les numéros.

## Images

Triptyque : `tri-panneaux`, `tri-pompe`, `chauffe-eau-salle-de-bain` (bichromie). Galerie : huit photos communes aux deux templates (`toit-tuiles-sombres` a remplacé `toit-tuiles-rouges`, dont la dominante violette sortait de la palette). Bande : `ombre-midi`. Étapes : `mains-rail`. Toutes provisoires (Pexels), provenance dans `docs/images.md` et dans les métadonnées des fichiers, attentes dans `template-1/images/A-REMPLACER.md`.

## Relecture de finition

Relecteur neuf (agent `general-purpose`, paquet de l'annexe A du mode opératoire), le 30 octobre 2026. Disposition : **fix**, huit corrections, toutes appliquées en un lot puis recapturées aux mêmes chemins :

1. Bandeau réduit dès le chargement (sentinelle de 1 px jamais visible sous `rootMargin: -72px`) : sentinelle de 4,5 rem et `rootMargin: 0`, accroche resserrée de 16 px pour garder le triptyque dans le premier écran.
2. Triptyque 543 / 434 / 461 px au lieu de 600 / 480 / 360 (piste `3fr` élargie par « thermodynamique » et son padding) : `minmax(0, Nfr)`, nom plus petit avec césure, padding droit du dernier champ ramené à la marge.
3. Soleil employé hors réservation (bouton d'envoi, message d'état, cases, Castries) : repassés en Blanc de midi ou Encre ; contrat OWN-WORLD amendé.
4. Premier écran mobile sans image ni téléphone au défilement : bandeau collant à `top` négatif, ancres sur une rangée défilante, marque et téléphone qui restent.
5. Point médian orphelin dans la légende de la visionneuse : séparateur final retiré.
6. Lien PVGIS orphelin dans la légende du graphique : lien porté sur « PVGIS 5.3 » dans la phrase Source.
7. « Voir la page Confidentialité » sans lien : lien ajouté.
8. Photo de chauffe-eau utilisée deux fois et toit à dominante violette : seconde photo provisoire pour le triptyque, toit remplacé ; filet de « Les trois ensemble » sur toute la largeur.

Le relecteur avait aussi noté, sans en faire des corrections : un titre de page qui pourrait être plus grand (plafond libre), des barres de service timides à côté du triptyque, et l'ordre inversé DESIGN.md / relecture (documentation écrite avant le verdict, resynchronisée après). Passes de verdict : huit corrections notées **resolved** (la condition des 35 % du triptyque a demandé une seconde passe : 36,2 % mesurés) ; régression relevée sur le repli sans script du bandeau mobile, fermée ensuite par des valeurs CSS de repli (`--nav-h`) et vérifiée par capture mobile sans script, non renotée (limite de deux tours du mode opératoire). Dernière disposition enregistrée du relecteur : fix, un seul point ouvert, celui-là.
