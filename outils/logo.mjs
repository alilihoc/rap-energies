// Préparation du logo rond choisi par le client (anneau de vagues vert, orange, jaune, bleu, « RAP ÉNERGIES » au
// centre), fourni sur fond crème opaque : images/68225512310000ec387824ff.png.
// Produit dans images/logo/ :
//   logo.png, logo-clair.png : le logo entier, extérieur de l'anneau transparent, centre clair conservé (le nom reste
//                              lisible sur fond clair comme sur le champ Encre du pied de page) ;
//   symbole.png, symbole-64/180/512.png : le même logo entier, en carré, pour le bandeau et l'icône du site (une première
//                              version n'y mettait que l'anneau : sans le nom au centre, le logo paraissait vide) ;
//   anneau.png : l'anneau seul, centre transparent, gardé au cas où (non utilisé par le site).
// L'ancienne version (logo carré à la feuille) est dans l'historique git.
//   node outils/logo.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = 'images/68225512310000ec387824ff.png';
const OUT = 'images/logo';
mkdirSync(OUT, { recursive: true });

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = (x, y) => (y * W + x) * 4;
// Couleur de fond : moyenne des 4 coins.
const bg = [0, 0, 0];
let n = 0;
for (const [cx, cy] of [[0, 0], [W - 6, 0], [0, H - 6], [W - 6, H - 6]]) for (let y = cy; y < cy + 6; y++) for (let x = cx; x < cx + 6; x++) { const i = px(x, y); bg[0] += data[i]; bg[1] += data[i + 1]; bg[2] += data[i + 2]; n++; }
bg.forEach((v, k) => (bg[k] = Math.round(v / n)));
console.log('fond mesuré :', `#${bg.map((v) => v.toString(16).padStart(2, '0')).join('')}`, `(${W}×${H})`);
const chroma = (i) => Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2]);
// Couverture d'un pixel par la couleur de l'anneau : 0 pour le fond et le texte (neutres), 1 pour une couleur franche.
const couverture = (i) => Math.max(0, Math.min(1, (chroma(i) - 10) / 60));
// Couleur d'un pixel de bord une fois le fond retiré (le pixel est un mélange couleur + fond).
const sansFond = (i, a) => [0, 1, 2].map((c) => Math.max(0, Math.min(255, Math.round((data[i + c] - (1 - a) * bg[c]) / Math.max(a, 0.05)))));

// Extérieur de l'anneau : remplissage depuis les bords sur les pixels neutres (le centre, fermé par l'anneau, n'est pas atteint).
const dehors = new Uint8Array(W * H);
const pile = [];
for (let x = 0; x < W; x++) pile.push(x, 0, x, H - 1);
for (let y = 0; y < H; y++) pile.push(0, y, W - 1, y);
while (pile.length) {
  const y = pile.pop(), x = pile.pop();
  if (x < 0 || y < 0 || x >= W || y >= H) continue;
  const k = y * W + x;
  if (dehors[k]) continue;
  if (couverture(px(x, y)) >= 0.5) continue;
  dehors[k] = 1;
  pile.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
}

const entier = Buffer.from(data); // logo entier : extérieur transparent
const anneau = Buffer.from(data); // anneau seul : tout ce qui est neutre devient transparent
let minX = W, minY = H, maxX = 0, maxY = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const k = y * W + x, i = k * 4, a = couverture(i);
  // Anneau seul
  if (a < 1) { const c = sansFond(i, a); anneau[i] = c[0]; anneau[i + 1] = c[1]; anneau[i + 2] = c[2]; }
  anneau[i + 3] = Math.round(a * 255);
  // Logo entier
  if (dehors[k]) {
    if (a > 0) { const c = sansFond(i, a); entier[i] = c[0]; entier[i + 1] = c[1]; entier[i + 2] = c[2]; }
    entier[i + 3] = Math.round(a * 255);
  }
  if (a >= 0.5) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
}
const marge = 6;
const cote = Math.max(maxX - minX, maxY - minY) + 1 + 2 * marge;
const cx = Math.round((minX + maxX) / 2), cy = Math.round((minY + maxY) / 2);
const boite = { left: Math.max(0, cx - Math.floor(cote / 2)), top: Math.max(0, cy - Math.floor(cote / 2)), width: Math.min(cote, W), height: Math.min(cote, H) };
boite.width = Math.min(boite.width, W - boite.left); boite.height = Math.min(boite.height, H - boite.top);
console.log('boîte de l\'anneau :', { minX, minY, maxX, maxY }, '→ recadrage', boite);

const base = (buf) => sharp(buf, { raw: { width: W, height: H, channels: 4 } });
await base(entier).extract(boite).png({ compressionLevel: 9 }).toFile(`${OUT}/logo.png`);
await base(entier).extract(boite).png({ compressionLevel: 9 }).toFile(`${OUT}/logo-clair.png`);
await base(entier).extract(boite).png({ compressionLevel: 9 }).toFile(`${OUT}/symbole.png`);
for (const s of [64, 180, 512]) await base(entier).extract(boite).resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${OUT}/symbole-${s}.png`);
await base(anneau).extract(boite).png({ compressionLevel: 9 }).toFile(`${OUT}/anneau.png`);
// Aperçus pour contrôle visuel
const apercu = async (fichier, fondHex, nom) => {
  const img = await sharp(fichier).metadata();
  await sharp({ create: { width: img.width + 40, height: img.height + 40, channels: 4, background: fondHex } }).composite([{ input: fichier, left: 20, top: 20 }]).png().toFile(`${OUT}/_apercu-${nom}.png`);
};
await apercu(`${OUT}/logo.png`, '#fcfbf7', 'logo-sur-blanc');
await apercu(`${OUT}/logo-clair.png`, '#14171c', 'logo-clair-sur-sombre');
await apercu(`${OUT}/symbole.png`, '#14171c', 'symbole-sur-sombre');
await apercu(`${OUT}/symbole-180.png`, '#fcfbf7', 'symbole-sur-blanc');
console.log('écrit : logo.png, logo-clair.png, symbole.png, symbole-64/180/512.png, anneau.png');
