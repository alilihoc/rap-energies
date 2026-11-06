// Planche de comparaison : découpe la même zone dans plusieurs captures et les pose côte à côte (deux colonnes).
//   node montage.mjs <sortie.png> <x> <y> <largeur> <hauteur> <capture1.png> <capture2.png> ...
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { lancer } from './navigateur.mjs';

const [dst, x, y, w, h, ...srcs] = process.argv.slice(2);
if (!dst || !srcs.length) {
  console.error('usage : node montage.mjs <sortie.png> <x> <y> <largeur> <hauteur> <captures...>');
  process.exit(1);
}
const cells = srcs
  .map(
    (s) =>
      `<div style="width:${w}px;height:${h}px;overflow:hidden;display:inline-block;outline:1px solid #000"><img src="data:image/png;base64,${readFileSync(s).toString('base64')}" style="display:block;margin:-${y}px 0 0 -${x}px"></div>`,
  )
  .join('');
const browser = await lancer(chromium);
const page = await browser.newPage({ viewport: { width: Number(w) * 2, height: Number(h) * Math.ceil(srcs.length / 2) } });
await page.setContent(`<body style="margin:0;line-height:0">${cells}</body>`);
await page.waitForTimeout(150);
await page.screenshot({ path: dst, fullPage: true });
await browser.close();
console.log(dst);
