// Construction du site (template 1 « Plein midi » ; le template 2 est archivé dans archives/template-2/).
//   node outils/build.mjs                                       → template-1/ (consultation locale, formulaire mailto)
//   node outils/build.mjs --prod --domaine rap-energies.fr      → dist/template-1/ (Hostinger : envoyer.php, .htaccess,
//                                                                  merci.html, 404.html, administration PHP dans admin/)
//   … --chemin design2  → copie destinée à un sous-dossier d'aperçu : adresses en /design2/, pages en noindex,
//                          .htaccess du sous-dossier, sans robots.txt ni sitemap.xml
// Les dérivés d'images sont produits par outils/images.mjs (à lancer avant, indépendant).
import { readdirSync, readFileSync, mkdirSync, writeFileSync, copyFileSync, existsSync, cpSync, rmSync } from 'node:fs';
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
// Attributs sizes de la galerie, par template : repris dans admin/gabarit.json pour que l'administration en ligne
// produise exactement le même balisage.
const GALERIE = { 'template-1': { sizes: '(min-width: 75rem) 600px, (min-width: 48rem) 50vw, 100vw', mosaique: true } };

const provisoires = C.realisations.photos.filter((p) => p.provisoire);
const aRemplacer = () => `# Photos provisoires à remplacer

Les photos de la galerie marquées « provisoire » sont des réservations prises sur Pexels en attendant les photos de chantiers de Rap Énergies. Liste, titres, auteurs et licence : \`docs/images.md\` à la racine du projet. Elles ne montrent ni Castries ni des chantiers de l'entreprise, et la galerie le dit une fois sous son introduction.

Le plus simple pour les remplacer : l'administration en ligne (https://rap-energies.fr/admin/), qui redimensionne la photo, retire ses métadonnées, met à jour la fiche et la galerie du site ; \`outils/recuperer.sh\` rapatrie ensuite ces changements dans le projet.

Photos provisoires encore en place, dans l'ordre de la galerie :
${provisoires.length ? provisoires.map((p, i) => `${i + 1}. ${C.legende(p)} : ${p.detail} (fichier \`${p.fichier}\`)`).join('\n') : 'Aucune : toutes les photos de la galerie sont celles du client.'}

Et pour les trois photos du triptyque du premier écran, reprises en couleur dans la section Services : un toit de tuiles avec panneaux en plein soleil (\`tri-panneaux\`), une pompe à chaleur extérieure (\`tri-pompe\`), un chauffe-eau thermodynamique (\`chauffe-eau-salle-de-bain\`). Pour la bande : un toit de tuiles en plein soleil (\`ombre-midi\`). Pour les étapes : des mains au travail sur un rail ou un tableau, sans visage (\`mains-rail\`).

Règles pour chaque photo : aucun visage reconnaissable de client, aucune plaque d'immatriculation, aucune adresse lisible ; la commune suffit dans la légende. Pour chacune, le client indique la commune, l'équipement et un détail (type de toit, ce que l'appareil remplace). Sans l'administration : déposer le JPEG dans \`images/sources/\`, mettre à jour \`src/realisations.json\`, lancer \`node outils/images.mjs\` puis \`node outils/build.mjs\`. Quand plus aucune photo n'est provisoire, retirer le paragraphe « photos provisoires » des mentions légales.
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
    writeFileSync(`${dest}/${nom}`, sortie, 'utf8');
  }
  copyFileSync(`src/${tpl}/style.css`, `${dest}/style.css`);
  copyFileSync('src/commun/script.js', `${dest}/script.js`);
  if (!chemin) {
    // robots.txt et sitemap.xml n'ont de sens qu'à la racine. L'administration est hors index.
    writeFileSync(`${dest}/robots.txt`, `User-agent: *\nAllow: /\nDisallow: /merci.html\nDisallow: /admin/\nSitemap: ${C.coordonnees.site}sitemap.xml\n`);
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
    // Administration en ligne (PHP) : page, bibliothèque, feuille de style, protections, données initiales, gabarit
    // de la galerie (mêmes textes et mêmes attributs que la page construite ici), mot de passe haché s'il existe.
    cpSync('src/prod/admin', `${dest}/admin`, { recursive: true });
    copyFileSync('src/realisations.json', `${dest}/admin/realisations.json`);
    writeFileSync(`${dest}/admin/gabarit.json`, JSON.stringify({ titre: C.realisations.titre, texte: C.realisations.texte, provisoire: C.realisations.provisoire, ...GALERIE[tpl] }, null, 2) + '\n', 'utf8');
    if (existsSync('src/prod/admin-config.php')) copyFileSync('src/prod/admin-config.php', `${dest}/admin/config.php`);
  } else {
    writeFileSync(`${dest}/images/A-REMPLACER.md`, aRemplacer(), 'utf8');
  }
  console.log(`${tpl} → ${dest}/ : ${Object.keys(pages).join(', ')}${prod ? ', envoyer.php, .htaccess, admin/' : ''} (${C.coordonnees.site})`);
}
