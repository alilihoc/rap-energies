// Capture mobile sans JavaScript après défilement : node sans-js-mobile.mjs <url> <sortie.png> [largeur] [defilement]
import { chromium } from 'playwright';
import { lancer } from './navigateur.mjs';
const [url, out, largeur = '390', defilement = '600'] = process.argv.slice(2);
const b = await lancer(chromium);
const ctx = await b.newContext({ viewport: { width: Number(largeur), height: 844 }, isMobile: true, hasTouch: true, javaScriptEnabled: false });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(800);
await p.evaluate((y) => scrollTo(0, y), Number(defilement));
await p.waitForTimeout(500);
const r = await p.evaluate(() => ({ navBas: Math.round(document.querySelector('.bandeau .nav').getBoundingClientRect().bottom), marqueHaut: Math.round(document.querySelector('.marque').getBoundingClientRect().top), scriptActif: typeof window.__x }));
await p.screenshot({ path: out });
await b.close();
console.log(out, JSON.stringify(r));
