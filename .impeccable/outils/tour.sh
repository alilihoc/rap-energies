#!/usr/bin/env bash
# Tour complet de vérification d'un template : captures et mesures, zooms par section, interactions.
#   bash .impeccable/outils/tour.sh template-1
set -u
tpl="$1"
R="$(pwd -W 2>/dev/null || pwd)"
URL="file:///$R/$tpl/index.html"
OUT=".impeccable/review/$tpl"
echo "=== captures $tpl ==="
node .impeccable/outils/captures.mjs "$URL" "$OUT" --modes 2>&1 | tail -5
for s in realisations services production etapes zone pourquoi questions contact; do
  node .impeccable/outils/zoom.mjs "$URL" "#$s" "$OUT/zoom-$s.png" >/dev/null 2>&1 || echo "échec zoom #$s"
done
node .impeccable/outils/zoom.mjs "$URL" "footer" "$OUT/zoom-pied.png" >/dev/null 2>&1
node .impeccable/outils/zoom.mjs "$URL" "#production" "$OUT/zoom-production-390.png" 390 >/dev/null 2>&1
node .impeccable/outils/zoom.mjs "$URL" "#realisations" "$OUT/zoom-realisations-390.png" 390 >/dev/null 2>&1
node .impeccable/outils/zoom.mjs "$URL" "#contact" "$OUT/zoom-contact-390.png" 390 >/dev/null 2>&1
echo "--- interactions $tpl ---"
node .impeccable/outils/interactions.mjs "$URL" "$OUT" 2>&1 | grep -E '"compteur1"|"legende"|"bandeauReduit"|"texte"|"formCache"|"erreurs"'
