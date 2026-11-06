---
name: Rap Énergies
description: Système « Plein midi » du site d'un électricien RGE de Castries (le second système, « Le soir, la maison chauffe », est archivé dans archives/template-2/)
colors:
  blanc: "#fcfbf7"
  encre: "#14171c"
  second-plan: "#4b5361"
  filet: "#e4e1d9"
  soleil: "#f2b41a"
  chaleur: "#ef6b1c"
  eau: "#1f66cc"
  sur-encre-second: "#b8b2a6"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "min(clamp(1.9rem, 1.1rem + 2.4vw, 3.25rem), calc(100cqi / 9.4))"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Hanken Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  none: "0"
spacing:
  marge: "clamp(1.25rem, 4vw, 3rem)"
  bloc: "clamp(3.5rem, 8vw, 6.5rem)"
  largeur: "75rem"
components:
  button-primary:
    backgroundColor: "{colors.encre}"
    textColor: "{colors.blanc}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.encre}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
  input:
    backgroundColor: "{colors.blanc}"
    textColor: "{colors.encre}"
    rounded: "{rounded.none}"
    padding: "0.7rem 0.9rem"
---

# Design System: Rap Énergies, « Plein midi »

Un seul système depuis le 3 novembre 2026 : « Plein midi », retenu par le studio pour la mise en ligne (le client tranchera sur cette base). Sa fiche complète, avec l'historique des relectures, est dans `docs/systemes/design-1.md`. Le second système, « Le soir, la maison chauffe », est archivé avec ses sources, sa fiche et son contrat dans `archives/template-2/`. L'administration en ligne des photos, retirée à la demande du client, est archivée dans `archives/admin-php/` ; elle appliquait ce même système.

## Overview

**Creative North Star: "Un électricien de Castries qui montre ses toits"**

Prouver par les chantiers, appeler comme action, dire vrai et local. « Plein midi » est l'heure où le toit produit le plus : blanc chaud, encre, et les trois couleurs du logo données chacune à un équipement (jaune Soleil pour les panneaux, orange Chaleur pour la pompe à chaleur, bleu Eau pour le chauffe-eau), avec une grotesque large et grasse.

La page refuse la page générique de la catégorie : pas de dégradé bleu-vert « énergie », pas de cartes à icônes, pas de kicker en capitales, pas d'avis ni de chiffre inventé.

**Key Characteristics:**
- Rayons nuls partout, filets de 1 px, grille centrée de 75 rem.
- Un seul bouton plein par vue, un libellé par intention (« Appeler le 06 99 34 66 86 », « Décrire mon projet », « Envoyer ma demande »).
- Les photos sont le contenu : mosaïque, légendes sous les photos, jamais de texte dessus.
- Trois moments de lumière, rien de décoratif : l'ouverture (le titre, le texte et les boutons se lèvent, puis le triptyque), l'approche (la couleur revient sous la teinte au survol d'un volet, la photo de galerie s'approche) et la mesure (les barres PVGIS poussent une fois à leur entrée dans l'écran, en CSS pur). Tout visible sans JavaScript et sans mouvement.
- Les crochets [À CONFIRMER] restent visibles jusqu'à validation, encadrés d'un pointillé en Second plan comme des notes d'édition (jamais de surlignage jaune : la couleur reste aux équipements).

## Colors

Palette mesurée (`.impeccable/outils/contraste.mjs`), un seul sens par couleur.

### Primary
- **Encre** (`#14171c`) : texte, bouton plein, champ de clôture (contact et pied).

### Secondary
- **Soleil** (`#f2b41a`), **Chaleur** (`#ef6b1c`), **Eau** (`#1f66cc`) : les trois équipements, dans le triptyque, les barres de titre de service, les repères de légende et les carrés des intertitres ; encre dessus pour Soleil (9,68:1) et Chaleur (5,81:1), Blanc de midi dessus pour Eau (5,48:1).

### Neutral
- **Blanc de midi** (`#fcfbf7`) : fond (encre dessus 17,35:1), champs de formulaire.
- **Second plan** (`#4b5361`) : texte secondaire (7,49:1), notes, crochets.
- **Filet** (`#e4e1d9`) : filets de 1 px, fonds d'attente des photos.
- **Sur Encre, second** (`#b8b2a6`) : texte secondaire sur le champ Encre.

### Named Rules
**La règle d'une couleur, un équipement.** Soleil, Chaleur et Eau ne désignent que leur équipement ; le jaune garde une seule exception, prévue par le contrat : les barres de production. Sur le champ Encre, bouton d'envoi, message d'état et cases à cocher sont en Blanc de midi.
## Typography

**Display Font:** Bricolage Grotesque 800 (fichier `opsz`), avec Segoe UI puis system-ui en repli.
**Body Font:** Hanken Grotesk 400, 600 et 700.

**Character:** la page parle fort et droit. Aucune italique n'est chargée.

### Hierarchy
- **Display** (800 jusqu'à 3,25 rem) : le titre de la page, borné par la largeur du conteneur pour que « thermodynamique, » tienne à 320 px.
- **Headline** (800 jusqu'à 2,75 rem) : titres de section, 22 ch au plus, `text-wrap: balance`.
- **Title** (800 jusqu'à 2 rem) : titres de service et « Les trois ensemble » ; le total PVGIS en 800 jusqu'à 3,75 rem.
- **Body** (1,125 rem ; interligne 1,55 ; mesure 60 à 62 ch).
- **Label** (1 rem) : légendes, chiffres et mois du graphique, consentement, pied ; rien sous 16 px pour un public de plus de cinquante ans.

### Named Rules
**La règle du mot le plus long.** La colonne du titre est un conteneur ; `font-size: min(clamp(…), 100cqi / L)` avec L mesuré dans le navigateur à petite taille optique (9,4 em pour Bricolage 800).

## Layout

Grille centrée de 75 rem, marges `clamp(1,25 rem, 4 vw, 3 rem)`, sections espacées de `clamp(3,5 rem, 8 vw, 6,5 rem)` (0,75 bloc pour zone, pourquoi et questions), filets de 1 px entre sections. Les champs de couleur et les photos « jusqu'au bord » sortent de la grille et y ramènent leur texte. Production sur deux colonnes (texte | graphique), « Pourquoi » sur trois colonnes, services avec la photo de l'équipement dans la colonne du titre. Sous 64 rem les grilles passent en une colonne ; sous 48 rem la galerie passe à deux colonnes puis une sous 40 rem ; sous 40 rem le bandeau reste collant à `top` négatif, les ancres tiennent sur une seule rangée (libellés courts « Chantiers » et « Étapes », fondu à droite si elle déborde) au-dessus de la rangée marque + téléphone qui reste visible ; sous 22,5 rem le nom de la marque est masqué, le symbole reste.

## Elevation & Depth

Aucune ombre. La profondeur vient des champs de couleur pleins (Encre, Soleil, Chaleur, Eau) et des photos elles-mêmes. La visionneuse pose l'image sur un fond presque opaque Encre.

**La règle du plat.** Pas d'ombre portée, pas de halo, pas de verre dépoli, pas de dégradé ; un changement d'état se dit par la couleur, par l'échelle à l'appui (`scale: 0.98`) ou par une photo qui s'approche (`scale: 1.03`).

## Shapes

Rayons nuls partout : boutons, champs, images, notes d'édition. Les repères de légende sont des carrés. Les filets font 1 px. Les barres du graphique sont des rectangles pleins.

## Components

### Buttons
- **Shape:** rectangles sans rayon, bordure de 2 px, hauteur minimale 3,25 rem, libellé sur une ligne.
- **Primary:** Encre, texte Blanc de midi ; au survol, inversé (fond Blanc de midi, texte Encre, bordure conservée).
- **Outline:** bordure Encre, fond transparent, léger voile au survol.
- **Send:** Blanc de midi à texte Encre sur le champ Encre.
- **Focus / Active:** anneau de focus de 3 px Eau (Blanc de midi sur l'Encre), `scale: 0.98` à l'appui.

### Cards / Containers
Aucune carte comme structure : les photos sont nues dans la mosaïque, légende dessous avec un repère carré de la couleur de l'équipement.
### Inputs / Fields
Fond Blanc de midi, texte Encre, bordure transparente de 2 px, texte indicatif Second plan ; focus : anneau Eau ; champ laissé invalide : bordure Second plan et fond Filet. Étiquettes au-dessus, aide entre parenthèses, cases à cocher dessinées (`appearance: none`, bord de 2 px et coche carrée).

### Navigation
Bandeau collant de 4,5 rem ; logo rond entier (« RAP ÉNERGIES » au centre, 3,75 rem, 3 rem sous 40 rem) réduit à l'échelle 0,85 après 72 px de défilement (hauteur constante, le nom suit le logo) ; logo + nom, cinq ancres avec la section courante soulignée (`aria-current`), téléphone avec icône Phosphor. Sous 40 rem : `top` négatif égal à la hauteur réelle de la rangée des ancres (variable `--nav-h`, repli CSS 2,95 rem), rangée qui défile latéralement, libellés courts. Lien d'évitement en premier dans le document.

### Signature Components
- **Triptyque bichromie :** trois champs Soleil, Chaleur, Eau de 5/4/3 colonnes, photo en niveaux de gris multipliée par le champ, nom de l'équipement sous la photo ; se lève à l'ouverture après le titre ; à l'approche, la couleur revient.
- **Graphique PVGIS :** total annuel en grand, douze colonnes Soleil en CSS pur, valeurs visibles, source citée ; les barres poussent à l'entrée dans l'écran.
- **Visionneuse :** `<dialog>` natif, boutons Phosphor, compteur, flèches du clavier et balayage tactile, focus rendu au lien.

## Do's and Don'ts

### Do:
- **Do** garder une couleur par équipement.
- **Do** poser les légendes sous les photos, avec l'équipement, le lieu et un détail.
- **Do** mesurer chaque paire texte/fond avant de l'employer (4,5:1 texte courant, 3:1 grand texte).
- **Do** laisser les crochets [À CONFIRMER] visibles tant que le client n'a pas répondu.

### Don't:
- **Don't** ajouter de kicker, de carte à icône, d'ombre portée, de dégradé ou de glyphe en guise d'icône.
- **Don't** écrire de texte sur une photo, ni poser de voile sur une photo.
- **Don't** charger une ressource depuis un autre domaine, ni une italique (budget de polices).
- **Don't** animer autre chose que l'ouverture, la réponse à l'approche ou à l'appui, et la mesure (barres PVGIS) : pas d'entrée de section au défilement, pas de parallaxe, pas de boucle.
