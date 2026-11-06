#!/usr/bin/env bash
# Essai de bout en bout de l'administration PHP, en local sur la copie de production (dist/template-1) :
# connexion, régénération identique à la construction Node, ajout d'une réalisation avec photo, ordre, retrait.
# Laisse dist/template-1 tel que reconstruit (relancer node outils/build.mjs --prod … si besoin).
#   node outils/build.mjs --prod --domaine rap-energies.fr && bash .impeccable/outils/test-admin.sh
set -u
cd "$(dirname "$0")/../.."
MDP="$(head -1 src/prod/admin-mot-de-passe.txt)"
URL=http://127.0.0.1:8090
A="$URL/admin/"
J=.impeccable/mesures/cookies-admin.txt
rm -f "$J"
php -S 127.0.0.1:8090 -t dist/template-1 -d upload_max_filesize=30M -d post_max_size=60M -d memory_limit=1024M >.impeccable/mesures/php-admin.log 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null' EXIT
for i in $(seq 1 30); do curl -s -o /dev/null "$A" && break; sleep 0.3; done
OK=0; KO=0
bien() { echo "  ok    $1"; OK=$((OK+1)); }
mal()  { echo "  ÉCHEC $1"; KO=$((KO+1)); }
verif() { if eval "$2"; then bien "$1"; else mal "$1"; fi; }
csrf() { curl -s -b "$J" -c "$J" "$A" | grep -o 'name="csrf" value="[^"]*"' | head -1 | sed 's/.*value="//; s/"$//'; }
page() { curl -s -b "$J" -c "$J" -L "$@"; }
fiches() { node -e "console.log(JSON.parse(require('fs').readFileSync('dist/template-1/admin/realisations.json','utf8')).length)"; }

echo "== Connexion"
verif "page de connexion" '[ "$(curl -s -o /dev/null -w "%{http_code}" "$A")" = 200 ] && curl -s "$A" | grep -q "mot_de_passe"'
T="$(csrf)"; verif "jeton anti-CSRF présent" '[ -n "$T" ]'
verif "mauvais jeton refusé" 'page -F action=connexion -F csrf=faux -F mot_de_passe="$MDP" "$A" | grep -q "expiré"'
verif "mauvais mot de passe refusé" 'page -F action=connexion -F csrf="$T" -F mot_de_passe=mauvais "$A" | grep -q "incorrect"'
verif "bon mot de passe : liste affichée" 'page -F action=connexion -F csrf="$T" -F mot_de_passe="$MDP" "$A" | grep -q "Ajouter une réalisation"'
T="$(csrf)"; N0="$(fiches)"; echo "  réalisations au départ : $N0"

echo "== Régénération identique à la construction Node"
cp dist/template-1/index.html .impeccable/mesures/index-avant.html
page -F action=regenerer -F csrf="$T" "$A" >/dev/null
if cmp -s .impeccable/mesures/index-avant.html dist/template-1/index.html; then bien "index.html régénéré par PHP identique octet pour octet"; else mal "index.html diffère après régénération (voir diff ci-dessous)"; diff .impeccable/mesures/index-avant.html dist/template-1/index.html | head -20; fi

echo "== Ajout avec photo"
R="$(page -F action=enregistrer -F csrf="$T" -F i=nouvelle -F equipement=pompe-a-chaleur -F titre= -F "lieu=unité extérieure sur dalle" -F commune=Vendargues -F "detail=Essai automatique, à retirer." -F "alt=Essai : unité de pompe à chaleur" -F "position=50% 70%" -F "photo=@images/sources/mains-rail.jpg;type=image/jpeg" "$A")"
verif "réalisation ajoutée (message)" 'echo "$R" | grep -q "Réalisation ajoutée"'
verif "une fiche de plus" '[ "$(fiches)" -eq $((N0+1)) ]'
SLUG="$(node -e "const l=JSON.parse(require('fs').readFileSync('dist/template-1/admin/realisations.json','utf8'));console.log(l[l.length-1].fichier)")"
echo "  fichier : $SLUG"
verif "source 1 800 px enregistrée sans EXIF" '[ -f "dist/template-1/admin/sources/$SLUG.jpg" ] && [ "$(php -r "echo getimagesize(\"dist/template-1/admin/sources/$SLUG.jpg\")[0];")" -le 1800 ] && ! grep -a -q -i "exif" "dist/template-1/admin/sources/$SLUG.jpg"'
verif "dérivés AVIF, WebP et JPEG produits" '[ "$(ls dist/template-1/images | grep -c "^$SLUG-.*\.avif$")" -ge 3 ] && [ "$(ls dist/template-1/images | grep -c "^$SLUG-.*\.webp$")" -ge 3 ] && [ -f "dist/template-1/images/$SLUG-1200.jpg" ]'
verif "index.html contient la nouvelle photo et le bon compteur" 'grep -q "images/$SLUG-1200.jpg" dist/template-1/index.html && grep -q "<span class=\"num\">1</span> / $((N0+1))" dist/template-1/index.html'
verif "la liste de l'administration la montre avec sa vignette" 'page "$A" | grep -q "images/$SLUG-480.webp"'
verif "faux fichier refusé" 'printf "pas une image" > .impeccable/mesures/faux.jpg && page -F action=enregistrer -F csrf="$T" -F i=nouvelle -F equipement=panneaux -F lieu=x -F commune=y -F alt=z -F "photo=@.impeccable/mesures/faux.jpg;type=image/jpeg" "$A" | grep -q "pas une photo"'
verif "champs obligatoires contrôlés" 'page -F action=enregistrer -F csrf="$T" -F i=nouvelle -F equipement=panneaux -F lieu= -F commune=y -F alt=z "$A" | grep -q "obligatoires"'

echo "== Modification et ordre"
I=$N0
verif "fiche de modification affichée" 'page "$A?page=fiche&i=$I" | grep -q "Modifier une réalisation"'
verif "modification sans photo enregistrée" 'page -F action=enregistrer -F csrf="$T" -F i=$I -F equipement=pompe-a-chaleur -F titre= -F "lieu=unité extérieure sur dalle" -F commune=Teyran -F "detail=Essai modifié." -F "alt=Essai" -F "position=50% 30%" "$A" | grep -q "enregistrée" && grep -q "Teyran" dist/template-1/index.html'
page -F action=monter -F csrf="$T" -F i=$I "$A" >/dev/null
verif "monter : la fiche d'essai n'est plus dernière" '[ "$(node -e "const l=JSON.parse(require(\"fs\").readFileSync(\"dist/template-1/admin/realisations.json\",\"utf8\"));console.log(l.findIndex(p=>p.fichier===\"$SLUG\"))")" -eq $((I-1)) ]'
page -F action=descendre -F csrf="$T" -F i=$((I-1)) "$A" >/dev/null
verif "descendre : elle est de nouveau dernière" '[ "$(node -e "const l=JSON.parse(require(\"fs\").readFileSync(\"dist/template-1/admin/realisations.json\",\"utf8\"));console.log(l.findIndex(p=>p.fichier===\"$SLUG\"))")" -eq $I ]'

echo "== Retrait"
verif "retrait de la fiche d'essai" 'page -F action=supprimer -F csrf="$T" -F i=$I "$A" | grep -q "retirée"'
verif "fiches revenues au nombre initial" '[ "$(fiches)" -eq "$N0" ]'
verif "dérivés effacés, source à la corbeille" '[ "$(ls dist/template-1/images | grep -c "^$SLUG-")" -eq 0 ] && ls dist/template-1/admin/corbeille | grep -q "^$SLUG-"'
verif "index.html revenu au contenu initial" 'cmp -s .impeccable/mesures/index-avant.html dist/template-1/index.html'

echo "== Déconnexion"
verif "déconnecté" 'page -F action=deconnexion -F csrf="$T" "$A" | grep -q "mot_de_passe"'
rm -rf dist/template-1/admin/sources dist/template-1/admin/corbeille dist/template-1/admin/tentatives.json .impeccable/mesures/faux.jpg "$J"
echo "== $OK réussites, $KO échecs"
[ "$KO" -eq 0 ]
