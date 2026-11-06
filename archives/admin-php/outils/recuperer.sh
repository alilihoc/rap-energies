#!/usr/bin/env bash
# Rapatrie ce que l'administration en ligne a changé : admin/realisations.json → src/realisations.json et les photos
# envoyées (admin/sources/*.jpg) → images/sources/. Lancé par outils/deployer.sh avant chaque construction, pour qu'un
# redéploiement n'écrase jamais les réalisations ajoutées par le client. Peut aussi se lancer seul.
#   bash outils/recuperer.sh <domaine>
# Sort sans rien faire si l'administration n'est pas encore en ligne (pas de admin/realisations.json sur le serveur).
set -euo pipefail
DOMAINE="${1:?domaine manquant, ex. rap-energies.fr}"
HOTE="${HOSTINGER_SSH:-u570076504@195.179.238.218}"
PORT="${HOSTINGER_PORT:-65002}"
ICI="$(cd "$(dirname "$0")/.." && pwd)"
D="domains/$DOMAINE/public_html/admin"
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT
# Une seule connexion : archive des données et des sources, vide si l'administration n'est pas installée.
ssh -p "$PORT" "$HOTE" "cd ~/$D 2>/dev/null && [ -f realisations.json ] && tar -czf - realisations.json \$(ls -d sources 2>/dev/null) || true" > "$T/admin.tar.gz" 2>/dev/null || true
if [ ! -s "$T/admin.tar.gz" ]; then echo "récupération : rien à rapatrier (administration absente du serveur)"; exit 0; fi
tar -xzf "$T/admin.tar.gz" -C "$T"
if [ -f "$T/realisations.json" ]; then
  if cmp -s "$T/realisations.json" "$ICI/src/realisations.json"; then echo "récupération : réalisations identiques à la copie locale"
  else cp "$T/realisations.json" "$ICI/src/realisations.json"; echo "récupération : src/realisations.json mis à jour depuis le serveur"; fi
fi
N=0
if [ -d "$T/sources" ]; then
  mkdir -p "$ICI/images/sources"
  for f in "$T"/sources/*.jpg; do
    [ -f "$f" ] || continue
    if ! cmp -s "$f" "$ICI/images/sources/$(basename "$f")"; then cp "$f" "$ICI/images/sources/"; N=$((N + 1)); fi
  done
fi
echo "récupération : $N photo(s) rapatriée(s) dans images/sources/"
