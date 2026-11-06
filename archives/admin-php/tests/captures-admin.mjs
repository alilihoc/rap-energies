// Captures de l'administration PHP servie en local : connexion, liste, fiche, à 1280 et 390 px.
//   php -S 127.0.0.1:8092 -t dist/template-1 &  puis  node .impeccable/mesures/captures-admin.mjs [mot de passe]
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { lancer } from '../outils/navigateur.mjs';
const mdp = process.argv[2] || readFileSync('src/prod/admin-mot-de-passe.txt', 'utf8').trim();
const base = 'http://127.0.0.1:8092/admin/';
const b = await lancer(chromium);
for (const [nom, opts] of [['1280', { viewport: { width: 1280, height: 860 } }], ['390', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }]]) {
  const ctx = await b.newContext({ deviceScaleFactor: 1, ...opts });
  const p = await ctx.newPage();
  const erreurs = [];
  p.on('pageerror', (e) => erreurs.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') erreurs.push('console: ' + m.text()); });
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `.impeccable/critique/apres/admin-connexion-${nom}.png` });
  await p.fill('input[name=mot_de_passe]', mdp);
  await p.click('button[type=submit]');
  await p.waitForLoadState('networkidle');
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `.impeccable/critique/apres/admin-liste-${nom}.png`, fullPage: true });
  await p.goto(base + '?page=fiche&i=1', { waitUntil: 'networkidle' });
  await p.screenshot({ path: `.impeccable/critique/apres/admin-fiche-${nom}.png`, fullPage: true });
  await p.goto(base + '?page=fiche&i=nouvelle', { waitUntil: 'networkidle' });
  await p.screenshot({ path: `.impeccable/critique/apres/admin-nouvelle-${nom}.png`, fullPage: true });
  const r = await p.evaluate(() => ({ debordement: document.documentElement.scrollWidth - innerWidth, polices: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family) }));
  console.log(nom, JSON.stringify(r), '| erreurs :', JSON.stringify(erreurs));
  await ctx.close();
}
await b.close();
