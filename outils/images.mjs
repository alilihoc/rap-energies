// Dérivés responsives des photos pour chaque template : AVIF et WebP en 480, 800, 1200, 1800 px,
// JPEG de secours en 1200 et 1800 px, dans template-N/images/. Les logos sont copiés tels quels.
// La provenance (commentaire JPEG posé par impeccable embed-prompt) est reprise dans l'EXIF des dérivés.
//   node outils/images.mjs [template-1|template-2]   (sans argument : les deux ; les fichiers existants sont gardés)
import sharp from 'sharp';
import { mkdirSync, existsSync, copyFileSync, readFileSync } from 'node:fs';

const LARGEURS = [480, 800, 1200, 1800];
// La galerie vient de src/realisations.json (tenu à jour par l'administration, admin/serveur.mjs).
const GALERIE = JSON.parse(readFileSync('src/realisations.json', 'utf8')).map((p) => p.fichier);
// Le template 2 est archivé (archives/template-2/) : seul le template 1 est produit.
const PHOTOS = {
  'template-1': [...GALERIE, 'tri-panneaux', 'tri-pompe', 'chauffe-eau-salle-de-bain', 'ombre-midi', 'mains-rail'],
};
const LOGOS = ['logo.png', 'logo-clair.png', 'symbole.png', 'symbole-64.png', 'symbole-180.png', 'symbole-512.png'];

// Lit le commentaire JPEG (segment COM, FF FE) posé par embed-prompt.
function commentaireJpeg(fichier) {
  const b = readFileSync(fichier);
  let i = 2;
  while (i < b.length - 4) {
    if (b[i] !== 0xff) break;
    const marker = b[i + 1];
    const len = b.readUInt16BE(i + 2);
    if (marker === 0xfe) return b.subarray(i + 4, i + 2 + len).toString('utf8');
    if (marker === 0xda) break; // début des données image
    i += 2 + len;
  }
  return '';
}

const cibles = process.argv[2] ? [process.argv[2]] : Object.keys(PHOTOS);
let faits = 0, gardes = 0;
for (const tpl of cibles) {
  const dir = `${tpl}/images`;
  mkdirSync(dir, { recursive: true });
  for (const l of LOGOS) copyFileSync(`images/logo/${l}`, `${dir}/${l}`);
  for (const nom of PHOTOS[tpl]) {
    const src = `images/sources/${nom}.jpg`;
    const meta = await sharp(src).metadata();
    const provenance = commentaireJpeg(src);
    const exif = provenance ? { IFD0: { ImageDescription: provenance, Copyright: 'Licence Pexels, voir ImageDescription' } } : undefined;
    const base = () => (exif ? sharp(src).withExif(exif) : sharp(src));
    for (const w of LARGEURS) {
      if (w > meta.width) continue;
      const sorties = [
        [`${dir}/${nom}-${w}.avif`, (s) => s.avif({ quality: 56, effort: 4 })],
        [`${dir}/${nom}-${w}.webp`, (s) => s.webp({ quality: 78 })],
      ];
      if (w === 1200 || w === 1800) sorties.push([`${dir}/${nom}-${w}.jpg`, (s) => s.jpeg({ quality: 80, mozjpeg: true })]);
      for (const [out, enc] of sorties) {
        if (existsSync(out)) { gardes++; continue; }
        await enc(base().resize({ width: w, withoutEnlargement: true })).toFile(out);
        faits++;
      }
    }
    process.stdout.write(`${tpl} ${nom} ok\n`);
  }
}
console.log(`dérivés écrits : ${faits}, déjà présents : ${gardes}`);
