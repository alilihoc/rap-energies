// Largeur de défilement des deux templates à des fenêtres intermédiaires (1024, 1100, 1280) : aucun élément ne doit
// dépasser la fenêtre. Capture du premier écran à 1280 dans .impeccable/critique/apres/<template>/premier-1280.png.
//   node .impeccable/mesures/largeur.mjs
import { chromium } from 'playwright';
import { lancer } from '../outils/navigateur.mjs';
const b = await lancer(chromium);
for (const tpl of ['template-1', 'template-2']) {
  for (const w of [1024, 1100, 1280]) {
    const p = await b.newPage({ viewport: { width: w, height: 800 } });
    await p.goto(`file:///C:/Users/hali/dev/sites-client/rap-enerigie/${tpl}/index.html`, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    const r = await p.evaluate(() => ({
      largeurDocument: document.documentElement.scrollWidth,
      fenetre: innerWidth,
      debordent: [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 6).map((e) => `${e.tagName.toLowerCase()}.${e.className}`),
    }));
    console.log(tpl, w, JSON.stringify(r));
    if (w === 1280) await p.screenshot({ path: `.impeccable/critique/apres/${tpl}/premier-1280.png` });
    await p.close();
  }
}
await b.close();
