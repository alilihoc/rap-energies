#!/usr/bin/env bash
# Publie le site sur Hostinger par SSH, même procédure que maf-menuiserie.fr et mon-petit-site.fr :
# construction « production » dans dist/, archive, envoi par scp, sauvegarde de l'ancien contenu sur le serveur,
# extraction dans un dossier temporaire et rsync dans public_html avec les droits 755/644.
#   bash outils/deployer.sh <domaine> [template-1] [--oui] [--sous-dossier design2]
#     ex. bash outils/deployer.sh rap-energies.fr                → https://rap-energies.fr/
# --oui : ne pose pas de question.
# À lancer depuis Git Bash (pas PowerShell : il ajoute un BOM aux scripts envoyés par ssh).
# Prérequis : le site ajouté dans hPanel (dossier ~/domains/<domaine>/public_html existant) et la clé SSH enregistrée.
# Variables : HOSTINGER_SSH (utilisateur@hôte) et HOSTINGER_PORT si le compte change.
# Un déploiement à la racine ne touche jamais aux sous-dossiers d'aperçu (design*/) ; un déploiement de sous-dossier
# ne touche qu'à ce sous-dossier. Tout le reste de public_html est remplacé : l'ancienne administration (/admin/,
# archivée dans archives/admin-php/) est donc supprimée du serveur au premier déploiement qui ne la contient plus.
set -euo pipefail
DOMAINE="${1:?domaine manquant, ex. rap-energies.fr}"
shift
TEMPLATE="template-1"; OUI=""; SOUS=""
while [ $# -gt 0 ]; do
  case "$1" in
    template-[0-9]) TEMPLATE="$1";;
    --oui) OUI="--oui";;
    --sous-dossier) SOUS="${2:?nom du sous-dossier manquant}"; shift;;
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

echo "0/4 construction production ($TEMPLATE pour $URL)"
(cd "$ICI" && node outils/images.mjs >/dev/null && node outils/build.mjs --prod --domaine "$DOMAINE" ${SOUS:+--chemin "$SOUS"} "$TEMPLATE")
[ -f "$SRC/index.html" ] && [ -f "$SRC/.htaccess" ] && [ -f "$SRC/envoyer.php" ] && [ -f "$SRC/merci.html" ] && [ -d "$SRC/images" ] || { echo "dist/$TEMPLATE incomplet"; exit 1; }
if grep -q "À CONFIRMER\|À COMPLÉTER\|À VÉRIFIER" "$SRC/index.html" "$SRC/mentions-legales.html" "$SRC/confidentialite.html"; then
  echo "ATTENTION : des crochets [À CONFIRMER] / [À COMPLÉTER] sont encore visibles dans les pages."
fi
if [ -f "$SRC/config.php" ]; then
  echo "ATTENTION : config.php est présent, les demandes du formulaire iront à l'adresse d'essai, pas au client."
fi
if [ "$OUI" != "--oui" ]; then echo "Publier dist/$TEMPLATE sur $URL ? [o/N]"; read -r rep; [ "$rep" = "o" ] || exit 1; fi

echo "1/4 archive"
tar -czf "$ARCHIVE" -C "$SRC" .
echo "2/4 envoi ($(du -h "$ARCHIVE" | cut -f1))"
scp -P "$PORT" "$ARCHIVE" "$HOTE:~/"
# À la racine, les sous-dossiers d'aperçu (design*/) sont préservés ; dans un sous-dossier, tout le sous-dossier est remplacé.
if [ -n "$SOUS" ]; then EXCLUSIONS=""; else EXCLUSIONS="--exclude=/design*/"; fi
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
echo "3/4 installation sur le serveur"
ssh -p "$PORT" "$HOTE" "bash ~/deploy-$ETIQUETTE.sh && rm ~/deploy-$ETIQUETTE.sh"
rm -f "$ARCHIVE" "/tmp/deploy-$ETIQUETTE.sh"
echo "4/4 contrôles"
PAGES=("$URL" "${URL}mentions-legales.html" "${URL}confidentialite.html" "${URL}merci.html" "${URL}nimporte-quoi")
[ -z "$SOUS" ] && PAGES+=("${URL}sitemap.xml" "${URL}robots.txt")
for u in "${PAGES[@]}"; do
  printf '%s → %s\n' "$u" "$(curl -s -o /dev/null -w '%{http_code}' "$u")"
done
echo "Attendu : 200 partout, 404 pour nimporte-quoi."
echo "Puis : essai du formulaire depuis le site, console du navigateur sans erreur, lien tel: sur mobile (voir MISE-EN-LIGNE.md)."
