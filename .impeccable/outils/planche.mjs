// Planches contact de 12 vignettes étiquetées, pour choisir des photos candidates :
//   node planche.mjs <dossier-d-images> <prefixe-de-sortie>
// Produit <prefixe>-1.png, <prefixe>-2.png… Il faut Playwright (npm i -D playwright) et Edge ou Chrome.
import { chromium } from 'playwright';
import { readdirSync, readFileSync } from 'node:fs';
import { lancer } from './navigateur.mjs';

const [dir, out] = process.argv.slice(2);
if (!dir || !out) {
  console.error('usage : node planche.mjs <dossier> <prefixe-de-sortie>');
  process.exit(1);
}
const files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && readFileSync(`${dir}/${f}`).length > 5000);
const browser = await lancer(chromium);
for (let i = 0; i < files.length; i += 12) {
  const cells = files
    .slice(i, i + 12)
    .map((f) => {
      const type = f.toLowerCase().endsWith('.png') ? 'png' : f.toLowerCase().endsWith('.webp') ? 'webp' : 'jpeg';
      const b64 = readFileSync(`${dir}/${f}`).toString('base64');
      return `<figure style="margin:0;width:330px"><img src="data:image/${type};base64,${b64}" style="width:330px;height:240px;object-fit:cover;display:block"><figcaption style="font:bold 16px sans-serif;padding:4px">${f.replace(/\.\w+$/, '')}</figcaption></figure>`;
    })
    .join('');
  const page = await browser.newPage({ viewport: { width: 1360, height: 820 } });
  await page.setContent(`<body style="margin:0;background:#222;color:#fff;display:flex;flex-wrap:wrap;gap:8px;padding:6px">${cells}</body>`);
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${out}-${i / 12 + 1}.png`, fullPage: true });
  await page.close();
}
await browser.close();
console.log(`${files.length} images, ${Math.ceil(files.length / 12)} planches`);
