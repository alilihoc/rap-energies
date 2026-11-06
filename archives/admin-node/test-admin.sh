#!/usr/bin/env bash
# Essai de bout en bout de l'administration : connexion, ajout d'une réalisation avec photo, reconstruction,
# réordonnancement, suppression. Laisse les données comme avant.
set -u
cd "$(dirname "$0")/../.."
URL=http://127.0.0.1:8080
MDP=$(node -e "console.log(JSON.parse(require('fs').readFileSync('admin/config.json','utf8')).motDePasse)")
J=.impeccable/mesures/cookies.txt
rm -f "$J"
for i in $(seq 1 20); do curl -s -o /dev/null "$URL/admin" && break; sleep 0.5; done
echo "1. page de connexion : $(curl -s -o /dev/null -w '%{http_code}' $URL/admin)"
echo "2. mauvais mot de passe : $(curl -s -o /dev/null -w '%{http_code}' -d 'motDePasse=mauvais' $URL/admin/connexion)"
echo "3. bon mot de passe : $(curl -s -o /dev/null -w '%{http_code}' -c $J --data-urlencode "motDePasse=$MDP" $URL/admin/connexion)"
LISTE=$(curl -s -b $J $URL/admin)
JETON=$(echo "$LISTE" | grep -o 'name="jeton" value="[a-f0-9]*"' | head -1 | sed 's/.*value="//; s/"//')
echo "4. liste connectée : $(echo "$LISTE" | grep -c 'class="liste"') liste, jeton ${JETON:0:8}…, $(echo "$LISTE" | grep -o '<li>' | wc -l) réalisations"
echo "5. statique : template-1 $(curl -s -o /dev/null -w '%{http_code}' $URL/template-1/) · template-2 $(curl -s -o /dev/null -w '%{http_code}' $URL/template-2/) · src interdit $(curl -s -o /dev/null -w '%{http_code}' $URL/src/contenu.mjs) · config interdit $(curl -s -o /dev/null -w '%{http_code}' $URL/admin/config.json)"
echo "6. POST sans jeton : $(curl -s -o /dev/null -w '%{http_code}' -b $J -d 'jeton=faux' $URL/admin/reconstruire)"
cp images/sources/mains-rail.jpg .impeccable/mesures/photo-essai.jpg
echo "7. ajout avec photo : $(curl -s -o /dev/null -w '%{http_code}' -b $J -F "jeton=$JETON" -F 'equipement=pompe-a-chaleur' -F 'titre=' -F 'lieu=unité extérieure sur dalle' -F 'commune=Vendargues' -F 'detail=Essai automatique, à supprimer.' -F 'alt=Essai' -F 'position=50% 70%' -F 'photo=@.impeccable/mesures/photo-essai.jpg;type=image/jpeg' $URL/admin/realisation)"
sleep 1
echo "   fiches : $(node -e "console.log(JSON.parse(require('fs').readFileSync('src/realisations.json','utf8')).length)") · dernière : $(node -e "const l=JSON.parse(require('fs').readFileSync('src/realisations.json','utf8'));const p=l[l.length-1];console.log(p.fichier+' | '+p.titre+' · '+p.lieu+' · '+p.commune+' | provisoire='+p.provisoire)")"
for i in $(seq 1 60); do curl -s -b $J $URL/admin | grep -q 'Dernière reconstruction' && break; sleep 1; done
echo "   reconstruction : $(curl -s -b $J $URL/admin | grep -o 'Dernière reconstruction ([^)]*) : [a-zé]*')"
SLUG=$(node -e "const l=JSON.parse(require('fs').readFileSync('src/realisations.json','utf8'));console.log(l[l.length-1].fichier)")
echo "   dérivés : $(ls template-1/images | grep -c "^$SLUG-") (T1) $(ls template-2/images | grep -c "^$SLUG-") (T2) · dans les pages : $(grep -c "$SLUG" template-1/index.html) / $(grep -c "$SLUG" template-2/index.html) · source : $(ls images/sources | grep -c "^$SLUG.jpg") · EXIF : $(node -e "import('sharp').then(async({default:s})=>{const m=await s('images/sources/$SLUG.jpg').metadata();console.log(m.width+'x'+m.height, m.exif?'exif présent':'sans exif')})")"
R="$(pwd -W)"; node .impeccable/outils/zoom.mjs "file:///$R/template-1/index.html" "#realisations" .impeccable/review/template-1/zoom-realisations-9.png >/dev/null 2>&1 && echo "   capture : zoom-realisations-9.png"
echo "8. monter la dernière : $(curl -s -o /dev/null -w '%{http_code}' -b $J -d "jeton=$JETON" $URL/admin/realisation/8/monter) → position : $(node -e "const l=JSON.parse(require('fs').readFileSync('src/realisations.json','utf8'));console.log(l.findIndex(p=>p.fichier==='$SLUG'))")"
sleep 4
echo "9. supprimer l'essai : $(curl -s -o /dev/null -w '%{http_code}' -b $J -d "jeton=$JETON" $URL/admin/realisation/7/supprimer)"
sleep 1
echo "   fiches : $(node -e "console.log(JSON.parse(require('fs').readFileSync('src/realisations.json','utf8')).length)") · dérivés restants : $(ls template-1/images | grep -c "^$SLUG-") · corbeille : $(ls images/corbeille | grep -c "^$SLUG")"
for i in $(seq 1 60); do curl -s -b $J $URL/admin | grep -q 'Reconstruction en cours' || break; sleep 1; done
echo "   pages après suppression : $(grep -c "$SLUG" template-1/index.html) / $(grep -c "$SLUG" template-2/index.html)"
echo "10. déconnexion : $(curl -s -o /dev/null -w '%{http_code}' -b $J -d "jeton=$JETON" $URL/admin/deconnexion) puis liste : $(curl -s -b $J $URL/admin | grep -c 'Connexion')"
rm -f .impeccable/mesures/photo-essai.jpg "$J"
