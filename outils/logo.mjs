// Détourage des logos fournis (fond crème opaque) : flood fill depuis les bords pour la partie symbole,
// clé de couleur globale dans la zone du nom (pour vider les contre-formes des lettres), puis recadrage.
// Produit dans images/logo/ : logo.png (symbole + nom, fond transparent), logo-clair.png (nom en crème,
// pour fond sombre), symbole.png (carré), symbole-64/180/512.png, et imprime les boîtes mesurées.
//   node outils/logo.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = 'images/6817aee43100005fc5761b66.png';
const OUT = 'images/logo';
mkdirSync(OUT, { recursive: true });

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = (x, y) => (y * W + x) * 4;
// Couleur de fond : moyenne des 4 coins (carré de 6 px).
const coins = [[0, 0], [W - 6, 0], [0, H - 6], [W - 6, H - 6]];
const bg = [0, 0, 0];
let n = 0;
for (const [cx, cy] of coins) for (let y = cy; y < cy + 6; y++) for (let x = cx; x < cx + 6; x++) { const i = px(x, y); bg[0] += data[i]; bg[1] += data[i + 1]; bg[2] += data[i + 2]; n++; }
bg.forEach((v, k) => (bg[k] = Math.round(v / n)));
console.log('fond mesuré :', `#${bg.map((v) => v.toString(16).padStart(2, '0')).join('')}`);
const dist = (i) => Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2]);

// 1. Flood fill depuis les bords (pixels proches du fond) → masque fond.
const T = 7; // distance RVB en deçà de laquelle un pixel est "fond" (les traits blancs du symbole sont à ~15 : on n'y entre pas)
const fond = new Uint8Array(W * H);
const pile = [];
for (let x = 0; x < W; x++) { pile.push(x, 0, x, H - 1); }
for (let y = 0; y < H; y++) { pile.push(0, y, W - 1, y); }
while (pile.length) {
  const y = pile.pop(), x = pile.pop();
  if (x < 0 || y < 0 || x >= W || y >= H) continue;
  const k = y * W + x;
  if (fond[k]) continue;
  if (dist(px(x, y)) >= T) continue;
  fond[k] = 1;
  pile.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
}
// Boîte du contenu (non-fond)
let minX = W, minY = H, maxX = 0, maxY = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!fond[y * W + x]) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
console.log('boîte contenu :', { minX, minY, maxX, maxY });

// Séparation symbole / nom : on cherche la première ligne vide (tout fond) sous le symbole.
let ySep = -1;
for (let y = Math.round((minY + maxY) / 2); y < maxY; y++) {
  let vide = true;
  for (let x = minX; x <= maxX; x++) if (!fond[y * W + x]) { vide = false; break; }
  if (vide) { ySep = y; break; }
}
console.log('séparation symbole/nom à y =', ySep);
// Boîte du symbole seul
let sMaxX = 0, sMinX = W, sMaxY = 0, sMinY = H;
for (let y = minY; y < ySep; y++) for (let x = minX; x <= maxX; x++) if (!fond[y * W + x]) { if (x < sMinX) sMinX = x; if (x > sMaxX) sMaxX = x; if (y < sMinY) sMinY = y; if (y > sMaxY) sMaxY = y; }
console.log('boîte symbole :', { sMinX, sMinY, sMaxX, sMaxY });

// 2. Construction des sorties.
const out = Buffer.from(data); // version sombre (nom noir)
const clair = Buffer.from(data); // version claire (nom crème)
const CREME = [0xf4, 0xef, 0xe4];
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const k = y * W + x, i = k * 4;
  const d = dist(i);
  if (y >= ySep) {
    // Zone du nom : alpha selon l'écart au fond (lettres noires → opaque, fond → transparent)
    const a = Math.max(0, Math.min(1, (d - 12) / 160));
    out[i + 3] = Math.round(a * 255);
    // Version claire : les lettres deviennent crème, même alpha
    clair[i] = CREME[0]; clair[i + 1] = CREME[1]; clair[i + 2] = CREME[2]; clair[i + 3] = Math.round(a * 255);
  } else if (fond[k]) {
    out[i + 3] = 0; clair[i + 3] = 0;
  } else {
    // Bord du symbole : adoucir les pixels proches du fond et voisins du fond
    let voisinFond = false;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W && yy < H && fond[yy * W + xx]) { voisinFond = true; break; } }
    if (voisinFond && d < 60) { const a = Math.round(Math.max(0, Math.min(1, (d - 4) / 44)) * 255); out[i + 3] = a; clair[i + 3] = a; }
  }
}
const marge = 8;
const boite = { left: Math.max(0, minX - marge), top: Math.max(0, minY - marge), width: Math.min(W, maxX + marge) - Math.max(0, minX - marge), height: Math.min(H, maxY + marge) - Math.max(0, minY - marge) };
const sym = { left: Math.max(0, sMinX - marge), top: Math.max(0, sMinY - marge), width: Math.min(W, sMaxX + marge) - Math.max(0, sMinX - marge), height: Math.min(W, sMaxY + marge) - Math.max(0, sMinY - marge) };
const base = (buf) => sharp(buf, { raw: { width: W, height: H, channels: 4 } });
await base(out).extract(boite).png({ compressionLevel: 9 }).toFile(`${OUT}/logo.png`);
await base(clair).extract(boite).png({ compressionLevel: 9 }).toFile(`${OUT}/logo-clair.png`);
await base(out).extract(sym).png({ compressionLevel: 9 }).toFile(`${OUT}/symbole.png`);
for (const s of [64, 180, 512]) await base(out).extract(sym).resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${OUT}/symbole-${s}.png`);
// Aperçus sur fond clair et fond sombre pour contrôle visuel
const apercu = async (fichier, fondHex, nom) => {
  const img = await sharp(fichier).metadata();
  await sharp({ create: { width: img.width + 40, height: img.height + 40, channels: 4, background: fondHex } }).composite([{ input: fichier, left: 20, top: 20 }]).png().toFile(`${OUT}/_apercu-${nom}.png`);
};
await apercu(`${OUT}/logo.png`, '#ffffff', 'logo-sur-blanc');
await apercu(`${OUT}/logo-clair.png`, '#15130f', 'logo-clair-sur-sombre');
await apercu(`${OUT}/symbole.png`, '#15130f', 'symbole-sur-sombre');
console.log('boîte logo :', boite, 'boîte symbole :', sym);
