// Tour de captures et de mesures d'une page, pour la relecture de finition :
//   node captures.mjs <url> <dossier-de-sortie> [--modes]
// Produit, dans le dossier :
//   desktop.png (1440, page entière)   mobile.png (390, page entière)
//   premier-ecran.png (1440×900)       mobile-premier.png (390×844)     premier-320.png (320×700)
//   nav-reduite-320.png (320, après 700 px de défilement : navigation réduite)
//   defile-250.png, defile-500.png, defile-800.png (1440×900 après défilement)
//   mobile-defile-200.png, mobile-defile-420.png (390×844 après défilement)
//   avec --modes : sombre.png, sans-js.png, reduit.png (1280×800 : prefers-color-scheme dark,
//   JavaScript coupé, prefers-reduced-motion)
// Puis imprime les mesures : débordement horizontal à 320, 390, 720 (zoom 200 % d'un écran de 1440)
// et 1440, largeur de la fenêtre de mise en page, bord droit du h1 et de son texte à 320 et 390.
// Les captures attendent que les polices soient chargées et que l'animation d'ouverture soit finie.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { lancer } from './navigateur.mjs';

const [url, dir, ...options] = process.argv.slice(2);
if (!url || !dir) {
  console.error('usage : node captures.mjs <url> <dossier-de-sortie> [--modes]');
  process.exit(1);
}
mkdirSync(dir, { recursive: true });
const browser = await lancer(chromium);
const ATTENTE = 2300;

async function ouvrir(opts) {
  const page = await browser.newPage({ deviceScaleFactor: 1, ...opts });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(ATTENTE);
  return page;
}
const bureau = { viewport: { width: 1440, height: 900 } };
const mobile = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
const petit = { viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true };

async function toutDefiler(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 300) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(400);
}
const mesurer = (page) =>
  page.evaluate(() => {
    const h1 = document.querySelector('h1');
    let droite = null;
    let texte = null;
    if (h1) {
      droite = Math.round(h1.getBoundingClientRect().right);
      const r = document.createRange();
      r.selectNodeContents(h1);
      texte = Math.round(Math.max(...[...r.getClientRects()].map((x) => x.right)));
    }
    return { inner: innerWidth, debord: document.documentElement.scrollWidth - innerWidth, h1: droite, texte };
  });

const mesures = [];

// Pages entières
for (const [nom, opts] of [['desktop', bureau], ['mobile', mobile]]) {
  const page = await ouvrir(opts);
  await toutDefiler(page);
  mesures.push({ largeur: opts.viewport.width, ...(await mesurer(page)) });
  await page.screenshot({ path: `${dir}/${nom}.png`, fullPage: true });
  await page.close();
}

// Premier écran et défilements, bureau
let page = await ouvrir(bureau);
await page.screenshot({ path: `${dir}/premier-ecran.png` });
for (const y of [250, 500, 800]) {
  await page.evaluate((y) => scrollTo(0, y), y);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${dir}/defile-${y}.png` });
}
await page.close();

// Premier écran et défilements, mobile
page = await ouvrir(mobile);
await page.screenshot({ path: `${dir}/mobile-premier.png` });
for (const y of [200, 420]) {
  await page.evaluate((y) => scrollTo(0, y), y);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${dir}/mobile-defile-${y}.png` });
}
await page.close();

// 320 : premier écran, navigation réduite, mesures
page = await ouvrir(petit);
await page.screenshot({ path: `${dir}/premier-320.png` });
mesures.push({ largeur: 320, ...(await mesurer(page)) });
await page.evaluate(() => scrollTo(0, 700));
await page.waitForTimeout(400);
await page.screenshot({ path: `${dir}/nav-reduite-320.png` });
await page.close();

// Zoom 200 % : un écran de 1440 px zoomé à 200 % se met en page sur 720 px.
page = await ouvrir({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 });
mesures.push({ largeur: '720 (zoom 200 %)', ...(await mesurer(page)) });
await page.close();

if (options.includes('--modes')) {
  for (const [nom, opts] of [
    ['sombre', { colorScheme: 'dark' }],
    ['sans-js', { javaScriptEnabled: false }],
    ['reduit', { reducedMotion: 'reduce' }],
  ]) {
    const p = await browser.newPage({ viewport: { width: 1280, height: 800 }, ...opts });
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.waitForTimeout(nom === 'sans-js' ? 800 : ATTENTE);
    await p.screenshot({ path: `${dir}/${nom}.png` });
    await p.close();
  }
}
await browser.close();

for (const m of mesures) {
  const titre = m.h1 === null ? 'pas de h1' : `h1 → ${m.h1} px, texte → ${m.texte} px`;
  console.log(`${String(m.largeur).padEnd(16)} fenêtre ${m.inner} px, débordement ${m.debord} px, ${titre}`);
}
const problemes = mesures.filter((m) => m.debord > 0 || (typeof m.largeur === 'number' && m.inner !== m.largeur));
console.log(problemes.length ? `À CORRIGER : ${problemes.length} largeur(s) débordent.` : 'Aucun débordement.');
