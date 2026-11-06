#!/usr/bin/env bash
# Parcours de l'administration en ligne avec curl : protections, connexion, régénération (page inchangée), ajout
# d'une réalisation d'essai avec photo, vérification sur la page publique, retrait, déconnexion.
#   bash .impeccable/outils/test-admin-en-ligne.sh https://rap-energies.fr [mot de passe]
# Le mot de passe est lu dans src/prod/admin-mot-de-passe.txt s'il n'est pas donné. Laisse le site comme avant.
set -u
cd "$(dirname "$0")/../.."
BASE="${1:?url du site, ex. https://rap-energies.fr}"
MDP="${2:-$(head -1 src/prod/admin-mot-de-passe.txt)}"
A="$BASE/admin/"
J="$(mktemp)"; trap 'rm -f "$J" .impeccable/mesures/index-ligne-*.html' EXIT
OK=0; KO=0
bien() { echo "  ok    $1"; OK=$((OK+1)); }
mal()  { echo "  ÉCHEC $1"; KO=$((KO+1)); }
verif() { if eval "$2"; then bien "$1"; else mal "$1"; fi; }
code() { curl -s -o /dev/null -w '%{http_code}' "$1"; }
csrf() { curl -s -b "$J" -c "$J" "$A" | grep -o 'name="csrf" value="[^"]*"' | head -1 | sed 's/.*value="//; s/"$//'; }
page() { curl -s -b "$J" -c "$J" -L "$@"; }
compte() { curl -s -b "$J" -c "$J" "$A" | grep -o '<li class="realisation' | wc -l | tr -d ' '; }

echo "== Protections"
verif "admin/ répond 200 avec X-Robots-Tag noindex" '[ "$(code "$A")" = 200 ] && curl -sI "$A" | grep -qi "x-robots-tag: noindex"'
verif "config.php interdit (403)" '[ "$(code "${A}config.php")" = 403 ]'
verif "realisations.json interdit (403)" '[ "$(code "${A}realisations.json")" = 403 ]'
verif "lib.php interdit (403)" '[ "$(code "${A}lib.php")" = 403 ]'
verif "sources/ interdit (403 ou 404)" '[ "$(code "${A}sources/")" = 403 ] || [ "$(code "${A}sources/")" = 404 ]'
verif "robots.txt interdit /admin/" 'curl -s "$BASE/robots.txt" | grep -q "Disallow: /admin/"'

echo "== Connexion"
T="$(csrf)"; verif "jeton anti-CSRF présent" '[ -n "$T" ]'
verif "mauvais mot de passe refusé" 'page -F action=connexion -F csrf="$T" -F mot_de_passe=mauvais "$A" | grep -q "incorrect"'
verif "bon mot de passe : liste affichée" 'page -F action=connexion -F csrf="$T" -F mot_de_passe="$MDP" "$A" | grep -q "Ajouter une réalisation"'
T="$(csrf)"; N0="$(compte)"; echo "  réalisations au départ : $N0"

echo "== Régénération sans changement"
curl -s "$BASE/" > .impeccable/mesures/index-ligne-avant.html
page -F action=regenerer -F csrf="$T" "$A" | grep -q "régénérée" && bien "régénération acceptée" || mal "régénération refusée"
curl -s "$BASE/" > .impeccable/mesures/index-ligne-apres.html
verif "page publique identique après régénération" 'cmp -s .impeccable/mesures/index-ligne-avant.html .impeccable/mesures/index-ligne-apres.html'

echo "== Ajout d'essai, vérification publique, retrait"
R="$(page -F action=enregistrer -F csrf="$T" -F i=nouvelle -F equipement=pompe-a-chaleur -F titre= -F "lieu=essai automatique" -F commune=Vendargues -F "detail=Essai, retire aussitot." -F "alt=Essai" -F "position=50% 50%" -F "photo=@images/sources/mains-rail.jpg;type=image/jpeg" "$A")"
verif "réalisation d'essai ajoutée" 'echo "$R" | grep -q "Réalisation ajoutée"'
verif "une réalisation de plus dans la liste" '[ "$(compte)" -eq $((N0+1)) ]'
verif "la page publique la montre, avec le bon compteur" 'curl -s "$BASE/" | grep -q "essai automatique" && curl -s "$BASE/" | grep -q "<span class=\"num\">1</span> / $((N0+1))"'
SRC="$(curl -s "$BASE/" | grep -o 'images/[a-z0-9-]*essai-automatique[a-z0-9-]*-1200\.jpg' | head -1)"
verif "ses dérivés sont servis (JPEG 1200 et WebP 480)" '[ -n "$SRC" ] && [ "$(code "$BASE/$SRC")" = 200 ] && [ "$(code "$BASE/${SRC%-1200.jpg}-480.webp")" = 200 ]'
verif "retrait de la réalisation d'essai" 'page -F action=supprimer -F csrf="$T" -F i=$N0 "$A" | grep -q "retirée"'
verif "liste revenue au nombre initial" '[ "$(compte)" -eq "$N0" ]'
curl -s "$BASE/" > .impeccable/mesures/index-ligne-fin.html
verif "page publique revenue à l'identique" 'cmp -s .impeccable/mesures/index-ligne-avant.html .impeccable/mesures/index-ligne-fin.html'
verif "dérivés de l'essai retirés (404)" '[ -z "$SRC" ] || [ "$(code "$BASE/$SRC")" = 404 ]'

echo "== Déconnexion"
verif "déconnecté" 'page -F action=deconnexion -F csrf="$T" "$A" | grep -q "mot_de_passe"'
echo "== $OK réussites, $KO échecs"
[ "$KO" -eq 0 ]
