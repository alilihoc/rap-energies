// Capture d'un élément (sélecteur CSS) à 1440 ou à une largeur donnée : node zoom.mjs <url> <selecteur> <sortie.png> [largeur]
import { chromium } from 'playwright';
import { lancer } from './navigateur.mjs';
const [url, sel, out, largeur = '1440'] = process.argv.slice(2);
const b = await lancer(chromium);
const w = Number(largeur);
const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1, ...(w < 600 ? { isMobile: true, hasTouch: true } : {}) });
await p.goto(url, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(1600);
// Le bandeau collant ne doit pas se superposer à la section capturée : on le rend statique le temps de la prise de vue.
await p.addStyleTag({ content: '.bandeau { position: static !important; }' });
const el = p.locator(sel).first();
await el.scrollIntoViewIfNeeded();
await p.waitForTimeout(400);
await el.screenshot({ path: out });
await b.close();
console.log(out);
