import { readFileSync, writeFileSync } from 'node:fs';
const f = 'outils/build.mjs';
let s = readFileSync(f, 'utf8');
const R = [
  [`//   node outils/build.mjs --prod --domaine rap-energies.fr [template-1] → dist/template-N/ (Hostinger : envoyer.php, .htaccess,
//                                                                          merci.html, 404.html, canonical sur le domaine donné)`,
   `//   node outils/build.mjs --prod --domaine rap-energies.fr [template-1] → dist/template-N/ (Hostinger : envoyer.php, .htaccess,
//                                                                          merci.html, 404.html, canonical sur le domaine donné)
//   … --chemin design2  → copie destinée au sous-dossier /design2/ du site : adresses en /design2/, pages en noindex,
//                          .htaccess du sous-dossier, sans robots.txt ni sitemap.xml (ils restent ceux de la racine)`],
  [`const domaine = lireOption('--domaine');`, `const domaine = lireOption('--domaine');
const chemin = (lireOption('--chemin') || '').replace(/^\/+|\/+$/g, '');`],
  [`if (domaine) C.coordonnees.site = \`https://\${domaine.replace(/^https?:\/\//, '').replace(/\/$/, '')}/\`;`,
   `if (domaine) C.coordonnees.site = \`https://\${domaine.replace(/^https?:\/\//, '').replace(/\/$/, '')}/\${chemin ? chemin + '/' : ''}\`;`],
  [`  for (const [nom, html] of Object.entries(pages)) writeFileSync(\`\${dest}/\${nom}\`, html, 'utf8');`,
   `  for (const [nom, html] of Object.entries(pages)) {
    // Dans un sous-dossier d'aperçu, aucune page n'est indexable.
    const sortie = chemin && !html.includes('name="robots"') ? html.replace('<meta name="viewport" content="width=device-width, initial-scale=1">', '$&\n<meta name="robots" content="noindex, follow">') : html;
    writeFileSync(\`\${dest}/\${nom}\`, sortie, 'utf8');
  }`],
  [`  writeFileSync(\`\${dest}/robots.txt\`, \`User-agent: *\nAllow: /\nDisallow: /merci.html\nSitemap: \${C.coordonnees.site}sitemap.xml\n\`);
  writeFileSync(
    \`\${dest}/sitemap.xml\`,
    \`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>\${C.coordonnees.site}</loc></url>\n<url><loc>\${C.coordonnees.site}mentions-legales.html</loc></url>\n<url><loc>\${C.coordonnees.site}confidentialite.html</loc></url>\n</urlset>\n\`,
  );`,
   `  if (!chemin) {
    // robots.txt et sitemap.xml n'ont de sens qu'à la racine ; /design2/ est l'aperçu de l'autre template, hors index.
    writeFileSync(\`\${dest}/robots.txt\`, \`User-agent: *\nAllow: /\nDisallow: /merci.html\nDisallow: /design2/\nSitemap: \${C.coordonnees.site}sitemap.xml\n\`);
    writeFileSync(
      \`\${dest}/sitemap.xml\`,
      \`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>\${C.coordonnees.site}</loc></url>\n<url><loc>\${C.coordonnees.site}mentions-legales.html</loc></url>\n<url><loc>\${C.coordonnees.site}confidentialite.html</loc></url>\n</urlset>\n\`,
    );
  }`],
  [`    copyFileSync('src/prod/htaccess', \`\${dest}/.htaccess\`);`,
   `    let htaccess = readFileSync('src/prod/htaccess', 'utf8');
    if (chemin) {
      htaccess = htaccess
        .replace('RewriteBase /', \`RewriteBase /\${chemin}/\`)
        .replace('RewriteRule ^ / [L,R=301]', \`RewriteRule ^ /\${chemin}/ [L,R=301]\`)
        + \`\n# Sous-dossier d'aperçu : rien n'est indexable\n<IfModule mod_headers.c>\n  Header always set X-Robots-Tag "noindex"\n</IfModule>\n\`;
    }
    writeFileSync(\`\${dest}/.htaccess\`, htaccess);`],
  [`import { readdirSync, mkdirSync, writeFileSync, copyFileSync, existsSync, cpSync, rmSync } from 'node:fs';`,
   `import { readdirSync, readFileSync, mkdirSync, writeFileSync, copyFileSync, existsSync, cpSync, rmSync } from 'node:fs';`],
];
for (const [a, b] of R) { if (!s.includes(a)) console.log('ABSENT :', a.slice(0, 70)); s = s.replace(a, b); }
writeFileSync(f, s);
console.log('build.mjs ok');
