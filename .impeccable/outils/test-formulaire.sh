#!/usr/bin/env bash
# Essai du formulaire PHP en local (sans envoi d'e-mail : FORMULAIRE_ESSAI=1 écrit dans %TEMP%/rap-formulaire-essai.txt).
#   bash .impeccable/outils/test-formulaire.sh [template-1|template-2]
set -u
cd "$(dirname "$0")/../.."
TPL="${1:-template-1}"
[ -d "dist/$TPL" ] || { echo "dist/$TPL absent : node outils/build.mjs --prod --domaine rap-energies.fr $TPL"; exit 1; }
ESSAI="$(cygpath -u "$(php -r "echo sys_get_temp_dir();")")/rap-formulaire-essai.txt"
rm -f "$ESSAI"
FORMULAIRE_ESSAI=1 php -S 127.0.0.1:8767 -t "dist/$TPL" >/tmp/php-essai.log 2>&1 &
PHP_PID=$!
for i in $(seq 1 20); do curl -s -o /dev/null http://127.0.0.1:8767/ && break; sleep 0.3; done
U=http://127.0.0.1:8767
echo "accueil : $(curl -s -o /dev/null -w '%{http_code}' $U/) · merci : $(curl -s -o /dev/null -w '%{http_code}' $U/merci.html) · 404 : $(curl -s -o /dev/null -w '%{http_code}' $U/404.html)"
echo "GET envoyer.php (redirige) : $(curl -s -o /dev/null -w '%{http_code} → %{redirect_url}' $U/envoyer.php)"
echo "POST incomplet, JSON : $(curl -s -H 'Accept: application/json' -d 'nom=A' $U/envoyer.php)"
echo "POST mauvais téléphone : $(curl -s -H 'Accept: application/json' --data-urlencode 'nom=Essai Local' --data-urlencode 'telephone=12' --data-urlencode 'commune=Castries' $U/envoyer.php)"
echo "POST pot de miel : $(curl -s -H 'Accept: application/json' --data-urlencode 'nom=Robot' --data-urlencode 'telephone=0600000000' --data-urlencode 'commune=X' --data-urlencode 'site-web=http://spam' $U/envoyer.php)"
echo "POST complet, JSON : $(curl -s -H 'Accept: application/json' --data-urlencode 'nom=Essai Local' --data-urlencode 'telephone=06 00 00 00 00' --data-urlencode 'email=essai@exemple.fr' --data-urlencode 'commune=Castries' --data-urlencode 'projet[]=Panneaux solaires' --data-urlencode 'projet[]=Chauffe-eau thermodynamique' --data-urlencode 'message=Bonjour, ceci est un essai.' $U/envoyer.php)"
echo "POST complet, sans JS : $(curl -s -o /dev/null -w '%{http_code} → %{redirect_url}' --data-urlencode 'nom=Essai Sans Script' --data-urlencode 'telephone=0600000000' --data-urlencode 'commune=Vendargues' $U/envoyer.php)"
echo "--- courriels enregistrés ---"
cat "$ESSAI" 2>/dev/null || echo "(fichier d'essai absent : $ESSAI)"
cat > .impeccable/mesures/essai-formulaire-navigateur.mjs <<'EOF'
import { chromium } from 'playwright';
import { lancer } from '../outils/navigateur.mjs';
const b = await lancer(chromium);
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const erreurs = [];
p.on('pageerror', (e) => erreurs.push(e.message));
p.on('console', (m) => { if (m.type() === 'error') erreurs.push(m.text()); });
await p.goto('http://127.0.0.1:8767/', { waitUntil: 'networkidle' });
await p.fill('#f-nom', 'Essai Navigateur');
await p.fill('#f-tel', '06 11 22 33 44');
await p.fill('#f-commune', 'Baillargues');
await p.locator('.cases input').nth(1).check();
await p.locator('.bouton-envoyer').click();
await p.waitForTimeout(1200);
const etat = await p.evaluate(() => ({ texte: document.querySelector('.form-etat').textContent, formCache: document.querySelector('.formulaire').hidden }));
console.log('navigateur (fetch JSON) :', JSON.stringify(etat), '| erreurs console :', JSON.stringify(erreurs));
await b.close();
EOF
node .impeccable/mesures/essai-formulaire-navigateur.mjs
kill $PHP_PID 2>/dev/null
echo "--- journal php ---"; tail -5 /tmp/php-essai.log
