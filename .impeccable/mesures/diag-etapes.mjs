import { chromium } from 'playwright';
import { lancer } from '../outils/navigateur.mjs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const b = await lancer(chromium);
for (const tpl of ['template-1', 'template-2']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(pathToFileURL(resolve(`${tpl}/index.html`)).href, { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const q = (s) => document.querySelector(s)?.getBoundingClientRect();
    const g = q('.etapes-grille'), ph = q('.etapes-photo'), tx = q('.etapes-texte'), li = q('.etapes-liste li'), b = q('.etapes-liste li b');
    const cs = getComputedStyle(document.querySelector('.etapes-grille'));
    return { grille: g?.width, photo: ph?.width, texte: tx?.width, li: li?.width, b: b?.width, cols: cs.gridTemplateColumns, hauteurPage: document.documentElement.scrollHeight };
  });
  console.log(tpl, JSON.stringify(r));
  await p.close();
}
await b.close();
