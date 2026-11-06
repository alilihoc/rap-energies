import { chromium } from 'playwright';
import { lancer } from '../outils/navigateur.mjs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const b = await lancer(chromium);
for (const tpl of ['template-1', 'template-2']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(pathToFileURL(resolve(`${tpl}/index.html`)).href, { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const out = new Map();
    for (const el of document.querySelectorAll('body *')) {
      if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      const cs = getComputedStyle(el);
      const fs = parseFloat(cs.fontSize), lh = parseFloat(cs.lineHeight);
      if (!fs || !lh || fs >= 24) continue;
      const ratio = lh / fs;
      if (ratio >= 1.15 && ratio < 1.295) { const k = `${el.tagName.toLowerCase()}.${el.className} ${fs.toFixed(1)}px/${lh.toFixed(1)}px = ${ratio.toFixed(2)}`; out.set(k, (out.get(k) || 0) + 1); }
    }
    return [...out.entries()];
  });
  console.log(tpl, r);
  await p.close();
}
await b.close();
