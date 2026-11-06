// Efface la marque du fabricant lisible sur les photos provisoires de pompes à chaleur (PRODUCT.md : aucune marque
// de matériel). Retouche locale : un morceau du même panneau gris, pris à côté du logo, est recopié par-dessus.
// La licence Pexels autorise la modification ; l'original est gardé dans images/corbeille/avant-retouche/ et le
// commentaire JPEG de provenance (posé par impeccable embed-prompt, lu par outils/images.mjs) est conservé.
//   node outils/retoucher-marque.mjs            → essai : écrit des recadrages avant/après dans le dossier donné par
//                                                 RETOUCHE_SORTIE (ou .impeccable/critique/retouche/), ne touche à rien
//   node outils/retoucher-marque.mjs --appliquer → remplace les sources et efface leurs dérivés (à régénérer par images.mjs)
import sharp from 'sharp';
import { mkdirSync, copyFileSync, existsSync, readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';

// Zones en fractions de la largeur et de la hauteur de l'image. cible : la boîte du logo ; source : le morceau de
// panneau recopié (étiré à la taille de la cible s'il est plus petit).
const RETOUCHES = {
  'tri-pompe': { cible: { x: 0.341, y: 0.598, w: 0.081, h: 0.064 }, source: { x: 0.341, y: 0.53, w: 0.081, h: 0.064 } },
  // Le panneau a un léger dégradé vertical : le morceau est pris à gauche du logo, à la même hauteur, sur du panneau nu.
  // Panneau à double dégradé : morceau pris juste au-dessus (même dégradé horizontal), ton ramené canal par canal
  // sur la bande de panneau nu qui touche le haut du logo (ref).
  'pompe-a-chaleur-gravier': { cible: { x: 0.418, y: 0.593, w: 0.073, h: 0.061 }, source: { x: 0.418, y: 0.532, w: 0.055, h: 0.061 }, ref: { x: 0.418, y: 0.583, w: 0.055, h: 0.01 } },
  'pompe-a-chaleur-mur': { cible: { x: 0.47, y: 0.536, w: 0.064, h: 0.044 }, source: { x: 0.412, y: 0.536, w: 0.056, h: 0.044 } },
};
// Bords du morceau fondus sur quelques pixels (alpha en dégradé) : aucune arête de ton ne se voit.
const FONDU = 6;

const appliquer = process.argv.includes('--appliquer');
const sortie = process.env.RETOUCHE_SORTIE || '.impeccable/critique/retouche';
mkdirSync(sortie, { recursive: true });

function commentaireJpeg(b) {
  let i = 2;
  while (i < b.length - 4) {
    if (b[i] !== 0xff) break;
    const marker = b[i + 1];
    const len = b.readUInt16BE(i + 2);
    if (marker === 0xfe) return b.subarray(i + 4, i + 2 + len);
    if (marker === 0xda) break;
    i += 2 + len;
  }
  return null;
}
function avecCommentaire(jpeg, com) {
  if (!com) return jpeg;
  const seg = Buffer.alloc(4);
  seg[0] = 0xff; seg[1] = 0xfe; seg.writeUInt16BE(com.length + 2, 2);
  return Buffer.concat([jpeg.subarray(0, 2), seg, com, jpeg.subarray(2)]);
}
const px = (f, total) => Math.round(f * total);

for (const [nom, r] of Object.entries(RETOUCHES)) {
  const chemin = `images/sources/${nom}.jpg`;
  const original = readFileSync(chemin);
  const com = commentaireJpeg(original);
  const img = sharp(original);
  const { width: W, height: H } = await img.metadata();
  const cible = { left: px(r.cible.x, W), top: px(r.cible.y, H), width: px(r.cible.w, W), height: px(r.cible.h, H) };
  const src = { left: px(r.source.x, W), top: px(r.source.y, H), width: px(r.source.w, W), height: px(r.source.h, H) };
  let morceau = sharp(original).extract(src);
  if (r.ref) {
    const ref = { left: px(r.ref.x, W), top: px(r.ref.y, H), width: px(r.ref.w, W), height: px(r.ref.h, H) };
    const [sRef, sSrc] = await Promise.all([sharp(original).extract(ref).stats(), sharp(original).extract(src).stats()]);
    const gains = sRef.channels.slice(0, 3).map((c, i) => c.mean / sSrc.channels[i].mean);
    morceau = sharp(await morceau.toBuffer()).linear(gains, [0, 0, 0]);
  }
  const plein = await morceau.resize(cible.width, cible.height, { fit: 'fill' }).removeAlpha().toBuffer();
  const interieur = await sharp({ create: { width: cible.width - 2 * FONDU, height: cible.height - 2 * FONDU, channels: 3, background: '#fff' } }).png().toBuffer();
  const masque = await sharp({ create: { width: cible.width, height: cible.height, channels: 3, background: '#000' } })
    .composite([{ input: interieur, left: FONDU, top: FONDU }])
    .blur(FONDU / 2)
    .greyscale()
    .toColourspace('b-w')
    .png()
    .toBuffer();
  const patch = await sharp(plein).joinChannel(masque).png().toBuffer();
  const retouche = await sharp(original).composite([{ input: patch, left: cible.left, top: cible.top }]).withMetadata().jpeg({ quality: 93, mozjpeg: true }).toBuffer();
  // Recadrages de contrôle autour de la zone, avant et après.
  const marge = Math.round(cible.width * 0.6);
  const zone = { left: Math.max(0, cible.left - marge), top: Math.max(0, cible.top - marge), width: Math.min(W - Math.max(0, cible.left - marge), cible.width + 2 * marge), height: Math.min(H - Math.max(0, cible.top - marge), cible.height + 2 * marge) };
  await sharp(original).extract(zone).png().toFile(`${sortie}/${nom}-avant.png`);
  await sharp(retouche).extract(zone).png().toFile(`${sortie}/${nom}-apres.png`);
  console.log(`${nom} ${W}×${H} : logo ${cible.left},${cible.top} ${cible.width}×${cible.height} ; patch depuis ${src.left},${src.top} ${src.width}×${src.height} ; provenance ${com ? 'conservée' : 'absente'}`);
  if (appliquer) {
    mkdirSync('images/corbeille/avant-retouche', { recursive: true });
    if (!existsSync(`images/corbeille/avant-retouche/${nom}.jpg`)) copyFileSync(chemin, `images/corbeille/avant-retouche/${nom}.jpg`);
    writeFileSync(chemin, avecCommentaire(retouche, com));
    for (const tpl of ['template-1', 'template-2']) {
      if (!existsSync(`${tpl}/images`)) continue;
      for (const f of readdirSync(`${tpl}/images`)) if (f.startsWith(`${nom}-`)) unlinkSync(`${tpl}/images/${f}`);
    }
    console.log(`  → source remplacée, original dans images/corbeille/avant-retouche/, dérivés effacés`);
  }
}
if (!appliquer) console.log(`Essai seulement : recadrages dans ${sortie}/ ; relancer avec --appliquer pour écrire les sources.`);
