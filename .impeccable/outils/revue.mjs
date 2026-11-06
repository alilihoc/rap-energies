// Captures de relecture des designs 10 à 12 dans .impeccable/review/design-N/ :
// desktop.png (1440, page entière), mobile.png (390, page entière), premier-ecran.png, puis les états
// interactifs propres à chaque design (le relecteur n'a pas de navigateur).
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const RACINE = 'C:/Users/hali/dev/catus-bonus/.impeccable/review';
const browser = await chromium.launch({ channel: 'msedge' });

async function ouvrir(n, opts) {
  const page = await browser.newPage({ deviceScaleFactor: 1, ...opts });
  await page.goto(`http://localhost:4329/design-${n}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return page;
}
async function toutDefiler(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 300) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(90); }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(1200);
}

for (const n of (process.argv[2] ? [Number(process.argv[2])] : [10, 11, 12])) {
  const dir = `${RACINE}/design-${n}`;
  mkdirSync(dir, { recursive: true });
  for (const [nom, opts] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['mobile', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }]]) {
    const page = await ouvrir(n, opts);
    await toutDefiler(page);
    await page.screenshot({ path: `${dir}/${nom}.png`, fullPage: true });
    await page.close();
  }
  const page = await ouvrir(n, { viewport: { width: 1440, height: 900 } });
  await page.waitForTimeout(2400);
  await page.screenshot({ path: `${dir}/premier-ecran.png` });

  if (n === 10) {
    await page.mouse.move(300, 260);
    await page.waitForTimeout(400);
    for (let i = 0; i <= 14; i++) { await page.mouse.move(300 + i * 55, 260 + Math.sin(i / 2) * 60); await page.waitForTimeout(16); }
    await page.screenshot({ path: `${dir}/leurre-en-mouvement.png` });
    const b = await page.locator('.hero .btn').boundingBox();
    await page.mouse.move(b.x + b.width / 2, b.y - 150, { steps: 12 });
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `${dir}/leurre-pres-du-bouton.png` });
    await page.mouse.move(720, 20);
    await page.locator('.bout').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${dir}/appel.png` });
  }
  if (n === 11) {
    await page.evaluate(() => scrollTo(0, 520));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${dir}/relief.png` });
    const e = page.locator('[data-entree="difficultes-4"]');
    await e.hover();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${dir}/legende-survol.png` });
  }
  if (n === 12) {
    const tops = await page.evaluate(() => [...document.querySelectorAll('[data-moment]')].map((s) => s.getBoundingClientRect().top + scrollY));
    for (let i = 0; i < tops.length; i++) {
      await page.evaluate((y) => scrollTo(0, y - 200), tops[i]);
      await page.waitForTimeout(1100);
      await page.screenshot({ path: `${dir}/heure-${i}.png` });
    }
  }
  await page.close();

  const red = await ouvrir(n, { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await red.waitForTimeout(800);
  await red.screenshot({ path: `${dir}/moins-de-mouvements.png` });
  await red.close();
  if (n === 10) {
    for (const w of [390, 320]) {
      const m = await ouvrir(n, { viewport: { width: w, height: 844 }, isMobile: true, hasTouch: true });
      await m.evaluate(() => scrollTo(0, 700));
      await m.waitForTimeout(1200);
      await m.screenshot({ path: `${dir}/nav-reduite-${w}.png` });
      await m.close();
    }
  }
  if (n === 11) {
    const m = await ouvrir(n, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await m.waitForTimeout(2400);
    const haut = await m.evaluate(() => document.querySelector('.carte').getBoundingClientRect().top + scrollY);
    await m.evaluate((y) => scrollTo(0, y - 300), haut);
    await m.waitForTimeout(900);
    await m.screenshot({ path: `${dir}/mobile-trace.png` });
    await m.close();
  }
  if (n === 12) {
    const m = await ouvrir(n, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await m.evaluate(() => scrollTo(0, 1500));
    await m.waitForTimeout(1200);
    await m.screenshot({ path: `${dir}/mobile-defilement.png` });
    await m.close();
  }
}
await browser.close();
console.log('captures de relecture écrites');
