---
version: 1
slug: "template-1-index-html"
primary_target: "template-1/index.html"
related_targets: []
---

## Direction contract

Surface : `template-1/index.html`, page d'accueil de Rap Énergies, mode Persuade (l'action est appeler le 06 99 34 66 86, à défaut envoyer le formulaire). Direction 1, « Plein midi » (`docs/directions.md` § 2).

THESIS : À midi sur un toit de tuiles de Castries, les panneaux sont à pleine puissance et le chauffe-eau vient de s'allumer ; la page est cette heure-là, blanche et franche, et chaque équipement porte une couleur du logo (jaune Soleil pour les panneaux, orange Chaleur pour la pompe à chaleur, bleu Eau pour le chauffe-eau). Elle refuse le hero fendu « texte à gauche, photo à droite », les cartes à icônes, le dégradé énergie, le crème + terracotta et toute promesse chiffrée.

OWN-WORLD : fond Blanc de midi #FCFBF7, Encre #14171C, Second plan #4B5361, Filet #E4E1D9 ; Soleil #F2B41A, Chaleur #EF6B1C, Eau #1F66CC réservés chacun à un équipement (champ du triptyque, barre au-dessus du titre de service, repère de légende, barres PVGIS en Soleil). Bricolage Grotesque 800 pour les titres, Hanken Grotesk pour le texte. Rayons nuls partout. Bouton plein Encre à texte blanc, bouton au trait Encre ; sur le champ Encre, le bouton d'envoi, le message d'état et les cases à cocher passent en Blanc de midi, jamais en Soleil. Le champ Encre ferme la page (contact et pied). Les photos sont en bichromie dans le triptyque et en couleur ailleurs, légendes sous les photos, jamais dessus.

STORY : le visiteur comprend qu'un électricien de Castries pose trois équipements précis, voit les trois en couleur puis les chantiers réels, lit ce qu'un toit produit ici avec la source, comprend les six étapes, trouve sa commune, puis appelle ou décrit son projet.

FIRST VIEWPORT (1440 × 900) : navigation 72 px (logo, cinq ancres, téléphone) ; à gauche, titre Bricolage 800 sur dix colonnes au plus (trois lignes), texte sur 62 ch, bouton plein « Appeler le 06 99 34 66 86 », bouton au trait « Décrire mon projet », ligne d'adresse ; sous le bloc, le triptyque bord à bord sur toute la largeur : trois champs Soleil, Chaleur, Eau de 5/4/3 colonnes, chacun avec sa photo en bichromie (toit de tuiles et panneaux, pompe à chaleur, chauffe-eau) et le nom de l'équipement en Bricolage 800 sous la photo, lien vers la section. Le triptyque est l'image du premier écran et occupe au moins 35 % de sa hauteur.

FORM : page d'accueil à défilement, deuxième de la liste ordonnée des directions (clair / palette complète) ; tirage `concept-seed` non lancé, à la demande du mode opératoire du projet (deux directions écrites à la main pour un choix client) : l'absence de clé de tirage est voulue. Signature : le triptyque bichromie qui se lève à l'ouverture (clip-path depuis le bas, 700 ms, décalage 90 ms, cubic-bezier(0.16, 1, 0.3, 1)), le titre, le texte et les boutons se levant du même geste juste avant lui. Deux autres moments de lumière, et rien d'autre (amendement du 2 novembre 2026, après critique) : à l'approche d'un volet ou d'une photo, la couleur revient sous la teinte ; les barres PVGIS poussent une fois à leur entrée dans l'écran (CSS pur, `animation-timeline: view()`, barres fixes sans prise en charge). Photos par section : triptyque (3 bichromies), réalisations (4 en mosaïque 6 colonnes, deux par rangée, avec `<dialog>` ; les quatre photos provisoires crédibles, les autres écartées), services (la photo du volet de chaque équipement reprise en couleur dans la colonne du titre), bande (ombre d'un toit sur un mur blanc), étapes (mains gantées sur un rail). Pas de photo pour production, zone, pourquoi, questions, contact. Production sur deux colonnes (texte | graphique) avec le total annuel en grand.

FINISH : unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
