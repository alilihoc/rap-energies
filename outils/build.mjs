// Construction du site (template 1 « Plein midi » ; le template 2 est archivé dans archives/template-2/).
//   node outils/build.mjs                                       → template-1/ (consultation locale, formulaire mailto)
//   node outils/build.mjs --prod --domaine rap-energies.fr      → dist/template-1/ (Hostinger : envoyer.php, .htaccess,
//                                                                  merci.html, 404.html)
//   … --chemin design2  → copie destinée à un sous-dossier d'aperçu : adresses en /design2/, pages en noindex,
//                          .htaccess du sous-dossier, sans robots.txt ni sitemap.xml
// Les dérivés d'images sont produits par outils/images.mjs (à lancer avant, indépendant).
// L'administration PHP en ligne, retirée à la demande du client, est archivée dans archives/admin-php/.
import { readdirSync, readFileSync, mkdirSync, writeFileSync, copyFileSync, existsSync, cpSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import * as C from '../src/contenu.mjs';

const args = process.argv.slice(2);
const prod = args.includes('--prod');
const lireOption = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : undefined; };
const domaine = lireOption('--domaine');
const chemin = (lireOption('--chemin') || '').replace(/^\/+|\/+$/g, '');
const sortieBase = lireOption('--sortie') || (prod ? 'dist' : '');
const cibles = args.filter((a) => /^template-\d$/.test(a));
if (!cibles.length) cibles.push(...readdirSync('src').filter((d) => /^template-\d$/.test(d) && existsSync(`src/${d}/page.mjs`)));
if (prod && !domaine) { console.error('--prod demande --domaine <nom-de-domaine> (ex. rap-energies.fr)'); process.exit(1); }
if (domaine) {
  C.coordonnees.site = `https://${domaine.replace(/^https?:\/\//, '').replace(/\/$/, '')}/${chemin ? chemin + '/' : ''}`;
  C.seo.canonical = C.coordonnees.site; // la copie d'aperçu se désigne elle-même (noindex et canonique vers une autre page se contredisent)
}

// Dimensions des sources, pour les attributs width/height des <img>.
const dims = {};
for (const f of readdirSync('images/sources')) {
  if (!f.endsWith('.jpg')) continue;
  const m = await sharp(`images/sources/${f}`).metadata();
  dims[f.replace(/\.jpg$/, '')] = { width: m.width, height: m.height };
}

const POLICES = {
  'template-1': ['bricolage-grotesque/files/bricolage-grotesque-latin-opsz-normal.woff2', 'hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2'],
};

// En production, les fichiers qui gardent leur nom d'un déploiement à l'autre (feuille de style, script, logo et
// symbole) reçoivent une empreinte de leur contenu dans leur adresse (?v=…). Les pages HTML sont toujours revalidées,
// les autres fichiers sont gardés en cache un jour (CSS, JS) ou un an (images) par les navigateurs et le CDN : sans
// cette empreinte, un visiteur déjà venu garderait l'ancien logo ou l'ancienne mise en page.
const empreinte = (fichier) => createHash('sha1').update(readFileSync(fichier)).digest('hex').slice(0, 8);
const LOGOS_VERSIONNES = ['logo.png', 'logo-clair.png', 'symbole.png', 'symbole-64.png', 'symbole-180.png', 'symbole-512.png'];
function versionner(html, tpl) {
  let out = html
    .replace('href="style.css"', `href="style.css?v=${empreinte(`src/${tpl}/style.css`)}"`)
    .replace('src="script.js"', `src="script.js?v=${empreinte('src/commun/script.js')}"`);
  for (const l of LOGOS_VERSIONNES) out = out.replaceAll(`images/${l}"`, `images/${l}?v=${empreinte(`images/logo/${l}`)}"`);
  return out;
}

const illustrations = C.realisations.photos.filter((p) => p.provisoire);
const aRemplacer = () => `# Photos d'illustration

Le client a choisi de garder les photos de banque d'images (Pexels) : la section de la galerie s'intitule « Les équipements en images » et annonce des photos d'illustration, les mentions légales le disent aussi. Liste, titres, auteurs et licence : \`docs/images.md\` à la racine du projet. Elles ne montrent ni Castries ni des chantiers de l'entreprise.

Photos d'illustration de la galerie, dans l'ordre :
${illustrations.length ? illustrations.map((p, i) => `${i + 1}. ${C.legende(p)} (fichier \`${p.fichier}\`)`).join('\n') : 'Aucune : toutes les photos de la galerie sont celles du client.'}

Les trois photos du triptyque du premier écran, reprises en couleur dans la section Services (\`tri-panneaux\`, \`tri-pompe\`, \`chauffe-eau-salle-de-bain\`), la bande (\`ombre-midi\`) et la photo des étapes (\`mains-rail\`) sont aussi des photos d'illustration.

Si le client envoie un jour de vraies photos de chantiers : aucun visage reconnaissable, aucune plaque d'immatriculation, aucune adresse lisible ; déposer le JPEG dans \`images/sources/\`, mettre à jour \`src/realisations.json\` (commune, équipement, détail, \`provisoire: false\`), lancer \`node outils/images.mjs\` puis \`node outils/build.mjs\`. Quand plus aucune photo n'est d'illustration, remettre le titre « Nos chantiers, à Castries et autour » dans \`src/contenu.mjs\` et corriger le paragraphe des photographies dans les mentions légales.
`;

for (const tpl of cibles) {
  const { rendre } = await import(`../src/${tpl}/page.mjs`);
  const dest = sortieBase ? `${sortieBase}/${tpl}` : tpl;
  if (prod) { rmSync(dest, { recursive: true, force: true }); mkdirSync(dest, { recursive: true }); }
  mkdirSync(`${dest}/fonts`, { recursive: true });
  mkdirSync(`${dest}/images`, { recursive: true });
  const polices = (POLICES[tpl] || []).map((p) => p.split('/').pop());
  (POLICES[tpl] || []).forEach((p) => copyFileSync(`node_modules/@fontsource-variable/${p}`, `${dest}/fonts/${p.split('/').pop()}`));
  const pages = rendre({ dims, polices, endpoint: prod ? 'envoyer.php' : '' });
  for (const [nom, html] of Object.entries(pages)) {
    // Dans un sous-dossier d'aperçu, aucune page n'est indexable.
    const sortie = chemin && !html.includes('name="robots"')
      ? html.replace('<meta name="viewport" content="width=device-width, initial-scale=1">', '$&\n<meta name="robots" content="noindex, follow">')
      : html;
    writeFileSync(`${dest}/${nom}`, prod ? versionner(sortie, tpl) : sortie, 'utf8');
  }
  copyFileSync(`src/${tpl}/style.css`, `${dest}/style.css`);
  copyFileSync('src/commun/script.js', `${dest}/script.js`);
  if (!chemin) {
    // robots.txt et sitemap.xml n'ont de sens qu'à la racine.
    writeFileSync(`${dest}/robots.txt`, `User-agent: *\nAllow: /\nDisallow: /merci.html\nSitemap: ${C.coordonnees.site}sitemap.xml\n`);
    writeFileSync(
      `${dest}/sitemap.xml`,
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>${C.coordonnees.site}</loc></url>\n<url><loc>${C.coordonnees.site}mentions-legales.html</loc></url>\n<url><loc>${C.coordonnees.site}confidentialite.html</loc></url>\n</urlset>\n`,
    );
  }
  if (prod) {
    // Dérivés d'images : ceux du dossier local du template (produits par images.mjs), copiés tels quels.
    if (!existsSync(`${tpl}/images`)) { console.error(`${tpl}/images absent : lancer node outils/images.mjs d'abord`); process.exit(1); }
    cpSync(`${tpl}/images`, `${dest}/images`, { recursive: true, filter: (src) => !src.endsWith('A-REMPLACER.md') });
    copyFileSync('src/prod/envoyer.php', `${dest}/envoyer.php`);
    let htaccess = readFileSync('src/prod/htaccess', 'utf8');
    if (chemin) {
      htaccess = htaccess
        .replace('RewriteBase /', `RewriteBase /${chemin}/`)
        .replace('ErrorDocument 404 /404.html', `ErrorDocument 404 /${chemin}/404.html`)
        + `\n# Sous-dossier d'aperçu : rien n'est indexable\n<IfModule mod_headers.c>\n  Header always set X-Robots-Tag "noindex"\n</IfModule>\n`;
    }
    writeFileSync(`${dest}/.htaccess`, htaccess);
    if (existsSync('src/prod/config.php')) copyFileSync('src/prod/config.php', `${dest}/config.php`);
  } else {
    writeFileSync(`${dest}/images/A-REMPLACER.md`, aRemplacer(), 'utf8');
  }
  console.log(`${tpl} → ${dest}/ : ${Object.keys(pages).join(', ')}${prod ? ', envoyer.php, .htaccess' : ''} (${C.coordonnees.site})`);
}
