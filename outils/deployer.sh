#!/usr/bin/env bash
# Publie le site sur Hostinger par SSH, même procédure que maf-menuiserie.fr et mon-petit-site.fr :
# rapatriement de ce que l'administration en ligne a changé, construction « production » dans dist/, archive, envoi
# par scp, sauvegarde de l'ancien contenu sur le serveur, extraction dans un dossier temporaire et rsync dans
# public_html avec les droits 755/644.
#   bash outils/deployer.sh <domaine> [template-1] [--oui] [--sous-dossier design2] [--sans-recuperer]
#     ex. bash outils/deployer.sh rap-energies.fr                → https://rap-energies.fr/
# --oui : ne pose pas de question. --sans-recuperer : ne rapatrie pas les données de l'administration en ligne
# (à éviter : un redéploiement écraserait alors les réalisations ajoutées par le client).
# À lancer depuis Git Bash (pas PowerShell : il ajoute un BOM aux scripts envoyés par ssh).
# Prérequis : le site ajouté dans hPanel (dossier ~/domains/<domaine>/public_html existant) et la clé SSH enregistrée.
# Variables : HOSTINGER_SSH (utilisateur@hôte) et HOSTINGER_PORT si le compte change.
# Ce que le serveur garde en propre (jamais écrasé ni supprimé) : admin/config.php (mot de passe, envoyé à part
# quand src/prod/admin-config.php existe), admin/sources/, admin/corbeille/, admin/tentatives.json, et les
# sous-dossiers d'aperçu design*/ ; un déploiement de sous-dossier ne touche qu'à ce sous-dossier.
set -euo pipefail
DOMAINE="${1:?domaine manquant, ex. rap-energies.fr}"
shift
TEMPLATE="template-1"; OUI=""; SOUS=""; RECUPERER=1
while [ $# -gt 0 ]; do
  case "$1" in
    template-[0-9]) TEMPLATE="$1";;
    --oui) OUI="--oui";;
    --sous-dossier) SOUS="${2:?nom du sous-dossier manquant}"; shift;;
    --sans-recuperer) RECUPERER=0;;
    *) echo "option inconnue : $1"; exit 1;;
  esac
  shift
done
[ -f "src/$TEMPLATE/page.mjs" ] || { echo "template inconnu ou archivé : $TEMPLATE"; exit 1; }
if [ -n "$SOUS" ] && ! [[ "$SOUS" =~ ^[a-z0-9-]+$ ]]; then echo "sous-dossier invalide : $SOUS (lettres minuscules, chiffres, tirets)"; exit 1; fi

HOTE="${HOSTINGER_SSH:-u570076504@195.179.238.218}"
PORT="${HOSTINGER_PORT:-65002}"
ICI="$(cd "$(dirname "$0")/.." && pwd)"
HORODATAGE="$(date +%Y%m%d-%H%M%S)"
ETIQUETTE="$DOMAINE${SOUS:+-$SOUS}"
ARCHIVE="/tmp/$ETIQUETTE-$HORODATAGE.tar.gz"
CIBLE="domains/$DOMAINE/public_html${SOUS:+/$SOUS}"
SRC="$ICI/dist/$TEMPLATE"
URL="https://$DOMAINE/${SOUS:+$SOUS/}"

if [ "$RECUPERER" = 1 ] && [ -z "$SOUS" ]; then
  echo "0/5 rapatriement des réalisations de l'administration en ligne"
  bash "$ICI/outils/recuperer.sh" "$DOMAINE" || { echo "rapatriement impossible : vérifie la connexion SSH, ou relance avec --sans-recuperer en connaissance de cause"; exit 1; }
fi
echo "1/5 construction production ($TEMPLATE pour $URL)"
(cd "$ICI" && node outils/images.mjs >/dev/null && node outils/build.mjs --prod --domaine "$DOMAINE" ${SOUS:+--chemin "$SOUS"} "$TEMPLATE")
[ -f "$SRC/index.html" ] && [ -f "$SRC/.htaccess" ] && [ -f "$SRC/envoyer.php" ] && [ -f "$SRC/merci.html" ] && [ -d "$SRC/images" ] && [ -f "$SRC/admin/index.php" ] || { echo "dist/$TEMPLATE incomplet"; exit 1; }
if grep -qi "photos\? provisoires\?" "$SRC/index.html"; then
  echo "ATTENTION : la galerie contient encore des photos provisoires (Pexels)."
fi
if grep -q "À CONFIRMER\|À COMPLÉTER\|À VÉRIFIER" "$SRC/index.html" "$SRC/mentions-legales.html" "$SRC/confidentialite.html"; then
  echo "ATTENTION : des crochets [À CONFIRMER] / [À COMPLÉTER] sont encore visibles dans les pages."
fi
if [ -f "$SRC/config.php" ]; then
  echo "ATTENTION : config.php est présent, les demandes du formulaire iront à l'adresse d'essai, pas au client."
fi
[ -f "$SRC/admin/config.php" ] || echo "ATTENTION : pas de src/prod/admin-config.php : l'administration en ligne gardera son mot de passe actuel (ou n'en aura pas)."
if [ "$OUI" != "--oui" ]; then echo "Publier dist/$TEMPLATE sur $URL ? [o/N]"; read -r rep; [ "$rep" = "o" ] || exit 1; fi

echo "2/5 archive"
tar -czf "$ARCHIVE" -C "$SRC" --exclude=./admin/config.php .
echo "3/5 envoi ($(du -h "$ARCHIVE" | cut -f1))"
scp -P "$PORT" "$ARCHIVE" "$HOTE:~/"
# À la racine, les sous-dossiers d'aperçu (design*/) et les fichiers propres au serveur sont préservés.
if [ -n "$SOUS" ]; then EXCLUSIONS=""; else EXCLUSIONS="--exclude=/design*/ --exclude=/admin/config.php --exclude=/admin/sources/ --exclude=/admin/corbeille/ --exclude=/admin/tentatives.json --exclude=/admin/realisations.lock"; fi
printf '%s\n' \
  'set -euo pipefail' \
  "R=~/domains/$DOMAINE/public_html" \
  "D=~/$CIBLE" \
  "A=~/$(basename "$ARCHIVE")" \
  '[ -d "$R" ] || { echo "dossier $R absent : ajoute le site dans hPanel d abord (Sites web, Ajouter un site web)"; exit 1; }' \
  'mkdir -p "$D" ~/backups' \
  "[ -n \"\$(ls -A \"\$D\" 2>/dev/null)\" ] && tar -czf ~/backups/$ETIQUETTE-$HORODATAGE.tar.gz -C \"\$D\" . || true" \
  'T=$(mktemp -d); tar -xzf "$A" -C "$T"' \
  '[ -f "$T/index.html" ] && [ -f "$T/.htaccess" ] && [ -f "$T/envoyer.php" ] || { echo "archive incomplète"; exit 1; }' \
  "rsync -a --delete --no-perms --chmod=D755,F644 $EXCLUSIONS \"\$T\"/ \"\$D\"/" \
  'rm -rf "$T" "$A"' \
  'echo "déployé dans $D"; ls -la "$D" | head -30' \
  > "/tmp/deploy-$ETIQUETTE.sh"
scp -P "$PORT" "/tmp/deploy-$ETIQUETTE.sh" "$HOTE:~/deploy-$ETIQUETTE.sh"
echo "4/5 installation sur le serveur"
ssh -p "$PORT" "$HOTE" "bash ~/deploy-$ETIQUETTE.sh && rm ~/deploy-$ETIQUETTE.sh"
if [ -f "$SRC/admin/config.php" ] && [ -z "$SOUS" ]; then
  scp -P "$PORT" "$SRC/admin/config.php" "$HOTE:~/$CIBLE/admin/config.php"
  ssh -p "$PORT" "$HOTE" "chmod 600 ~/$CIBLE/admin/config.php"
  echo "   mot de passe de l'administration installé (admin/config.php)"
fi
rm -f "$ARCHIVE" "/tmp/deploy-$ETIQUETTE.sh"
echo "5/5 contrôles"
PAGES=("$URL" "${URL}mentions-legales.html" "${URL}confidentialite.html" "${URL}merci.html" "${URL}nimporte-quoi" "${URL}admin/" "${URL}admin/config.php" "${URL}admin/realisations.json")
[ -z "$SOUS" ] && PAGES+=("${URL}sitemap.xml" "${URL}robots.txt")
for u in "${PAGES[@]}"; do
  printf '%s → %s\n' "$u" "$(curl -s -o /dev/null -w '%{http_code}' "$u")"
done
echo "Attendu : 200 partout, 404 pour nimporte-quoi, 403 pour admin/config.php et admin/realisations.json."
echo "Puis : essai du formulaire depuis le site, connexion à l'administration, console du navigateur sans erreur (voir MISE-EN-LIGNE.md)."
