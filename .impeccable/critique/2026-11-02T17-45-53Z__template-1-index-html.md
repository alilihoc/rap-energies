---
target: template-1/index.html (seconde critique, après la passe d'amélioration)
total_score: 29
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\hali\\dev\\sites-client\\rap-enerigie\\template-1\\index.html"
target_fingerprint: "sha256:8d858b3573b286986056d25151681279e374a7218425d2cf188018a1bd8d5db1"
target_path: "C:\\Users\\hali\\dev\\sites-client\\rap-enerigie\\template-1\\index.html"
timestamp: 2026-11-02T17-45-53Z
slug: template-1-index-html
---
Seconde critique, après la passe d'amélioration du 2 novembre 2026. Méthode : deux relecteurs design indépendants (un par template) et un passage détecteur + navigateur isolé. Captures dans `.impeccable/critique/captures-2/`, JSON `detect-2-*.json`, `navigateur-detect-2-resultat.json`, `mesures-2-resultat.json`.

## Score de santé (heuristiques de Nielsen, 0-4)

| # | Heuristique | T1 | T2 | Constat clé |
|---|---|---|---|---|
| 1 | Visibilité de l'état | 3 | 3 | Section courante soulignée, « Envoi en cours… », compteur ; message mailto loin du bouton |
| 2 | Correspondance monde réel | 4 | 3 | kWc défini ; T2 : crochets lus comme du contenu, ancres ≠ titres |
| 3 | Contrôle et liberté | 4 | 3 | Visionneuse complète (Échap, balayage, focus rendu) ; pas de haut de page |
| 4 | Cohérence et standards | 3 | 3 | Un libellé par intention ; survol du bouton plein T1 invisible (corrigé ensuite) |
| 5 | Prévention des erreurs | 3 | 3 | inputmode, pattern, datalist, double envoi bloqué ; aide téléphone seulement dans title (corrigé ensuite) |
| 6 | Reconnaissance plutôt que rappel | 4 | 3 | Numéro partout ; T2 mobile : « Contact » hors de la rangée d'ancres (corrigé ensuite) |
| 7 | Flexibilité et efficacité | n/a | n/a | Page Persuade à parcours unique |
| 8 | Esthétique et minimalisme | 3 | 2 | Services 436 mots, 12 puces ; 20 crochets (encadrés en pointillé ensuite) |
| 9 | Récupération des erreurs | 2 | 2 | Champ invalide marqué mais sans phrase d'erreur persistante |
| 10 | Aide et documentation | 3 | 3 | FAQ juste ; trois réponses sur six finissent par un crochet |
| **Total** | | **29/36** | **25/36** | **Bon (81 %) et Acceptable (69 %)** |

Première critique (deux heuristiques n/a) : 23/32 (72 %) et 22/32 (69 %).

## Verdict de spécificité

Les deux pages sont conçues pour cet artisan et ce lieu dans les mots, les données (PVGIS pour Castries, 17 communes) et les systèmes de couleur ; elles restent interchangeables dans l'image tant que les photos sont des photos de banque, et aucune personne n'y apparaît.

Détecteur : mode statique inchangé (7 faux positifs et 1 interligne non localisable par template) ; en navigateur, 13 et 15 constats dont les surlignages des crochets (sans objet), un filet de graphique collé aux mois (T1), un pied à 86 caractères par ligne (T1), trois interlignes à 1,30 arrondis (T2) : tous corrigés ensuite. Aucun débordement à 1024, 1280, 1440 ; aucune erreur console ; `prefers-reduced-motion` : aucune animation active.

## Ce qui a changé depuis la première critique

- Ouverture animée sur les deux templates, barres PVGIS qui poussent, réponses au survol et au focus ; le total « 1 500 kWh » en grand ; production sur deux colonnes.
- Premier écran mobile : boutons visibles au-dessus du pli sur les deux templates.
- Galerie : quatre photos, mention provisoire unique, marques effacées.
- Services : photos en T1, listes à filets, mesure resserrée.

## Problèmes prioritaires relevés (et sort)

1. **[P0, T2] Galerie mobile en deux colonnes** (régression de la règle `:has()` qui écrasait la colonne unique) : corrigé avec `:where()`, vérifié à 390.
2. **[P1] Services reste le creux** : 436 mots, 12 puces, 2,6 écrans bureau, 3,8 à 4,3 écrans mobile. Non traité : raccourcir les puces ou les replier est une décision de texte à prendre avec le client.
3. **[P1, T1] Aucune action entre l'accroche et le contact** : corrigé (boutons sous le texte de production, « Vous nous appelez » devenu lien d'appel).
4. **[P2] Ergonomie mobile 50 ans et plus** : ancres de 30 px et « Contact » hors écran, replis de 27-30 px, cases de 29 px, textes secondaires à 15,2 px : corrigés (libellés courts « Chantiers » et « Étapes », ancres à 44 px, padding sur `summary`, cases à 44 px, légendes et chiffres à 16 px, aide du téléphone visible, `maxlength` sur le message, e-mail après la commune).
5. **[P2] Triptyque mobile déséquilibré** (104 / 104 / 210 px) : corrigé (`aspect-ratio: 4 / 3`).
6. **[P2] Surlignage jaune des crochets lu comme une couleur de marque** : corrigé (note d'édition encadrée en pointillé, couleur secondaire) ; l'idée d'un build « aperçu client » qui masque les crochets reste à décider.
7. **[P3] Survols faibles** : corrigés (bouton plein inversé au survol, triptyque qui s'approche) ; cadres de galerie T2 passés au filet clair.

## Ce qui reste ouvert

- Les photos : la preuve repose sur quatre images de banque et une mention « provisoires » ; seules les photos du client changeront ce point.
- Aucune personne, aucun prénom (question client n° 9).
- Services : densité du texte (décision client ou texte raccourci).
- T2 : page sombre lue en plein jour (70 % des pixels sous 25/255) : signature à assumer ou variante claire.
- Messages d'erreur de formulaire : une phrase persistante par champ, au-delà de la bulle du navigateur.
