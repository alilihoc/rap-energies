// Contrôle d'une page en ligne dans un vrai navigateur : polices chargées, images, débordement, erreurs de console.
//   node .impeccable/mesures/controle-en-ligne.mjs [url] [suffixe]
//   ex. node .impeccable/mesures/controle-en-ligne.mjs https://rap-energies.fr/design2/ design2
// Captures dans .impeccable/review/en-ligne[-suffixe]-desktop.png et -mobile.png.
import { chromium } from 'playwright';
import { lancer } from '../outils/navigateur.mjs';
const url = process.argv[2] || 'https://rap-energies.fr/';
const suffixe = process.argv[3] ? `-${process.argv[3]}` : '';
const b = await lancer(chromium);
for (const [nom, opts] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['mobile', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }]]) {
  const p = await b.newPage({ deviceScaleFactor: 1, ...opts });
  const erreurs = [];
  p.on('pageerror', (e) => erreurs.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') erreurs.push('console: ' + m.text()); });
  p.on('requestfailed', (r) => erreurs.push('requête échouée: ' + r.url()));
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => ({
    polices: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
    imagesChargees: [...document.images].filter((i) => i.complete && i.naturalWidth > 0).length,
    imagesTotal: document.images.length,
    debordement: document.documentElement.scrollWidth - innerWidth,
    motion: document.documentElement.classList.contains('motion'),
    titre: document.title,
    canonique: document.querySelector('link[rel=canonical]')?.href,
    robots: document.querySelector('meta[name=robots]')?.content ?? null,
  }));
  await p.screenshot({ path: `.impeccable/review/en-ligne${suffixe}-${nom}.png` });
  console.log(nom, JSON.stringify(r), '| erreurs :', JSON.stringify(erreurs));
  await p.close();
}
await b.close();
