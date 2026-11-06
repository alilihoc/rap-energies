import { chromium } from 'playwright';
import { lancer } from '../outils/navigateur.mjs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const b = await lancer(chromium);
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(pathToFileURL(resolve('template-1/index.html')).href, { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
const r = await p.evaluate(() => { const t = document.querySelector('.tryptique').getBoundingClientRect(); const b = document.querySelector('.bandeau').getBoundingClientRect(); return { bandeau: b.height, tryptiqueHaut: Math.round(t.top), tryptiqueBas: Math.round(t.bottom), part: ((Math.min(t.bottom, 900) - t.top) / 900 * 100).toFixed(1) + ' %' }; });
console.log('T1 1440×900 :', JSON.stringify(r));
for (const w of [390, 320]) {
  const m = await b.newPage({ viewport: { width: w, height: 844 }, isMobile: true, hasTouch: true });
  for (const tpl of ['template-1', 'template-2']) {
    await m.goto(pathToFileURL(resolve(`${tpl}/index.html`)).href, { waitUntil: 'networkidle' });
    await m.waitForTimeout(800);
    const r2 = await m.evaluate(() => { const nav = document.querySelector('.bandeau .nav'); const ul = nav.querySelector('ul'); return { navH: nav.offsetHeight, ulScroll: ul.scrollWidth, ulClient: ul.clientWidth, lignes: Math.round(ul.offsetHeight / 24), varNav: getComputedStyle(document.querySelector('.bandeau')).getPropertyValue('--nav-h') }; });
    await m.evaluate(() => scrollTo(0, 600));
    await m.waitForTimeout(500);
    const r3 = await m.evaluate(() => ({ marqueTop: Math.round(document.querySelector('.marque').getBoundingClientRect().top), navBottom: Math.round(document.querySelector('.bandeau .nav').getBoundingClientRect().bottom) }));
    console.log(`${tpl} ${w} :`, JSON.stringify({ ...r2, apresDefilement: r3 }));
  }
  await m.close();
}
await b.close();
