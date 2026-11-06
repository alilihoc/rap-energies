// Administration des réalisations de Rap Énergies : un petit serveur Node sans base de données.
// Les réalisations vivent dans src/realisations.json, les photos dans images/sources/ ; chaque enregistrement
// relance la génération des dérivés d'images et la construction des deux templates.
//   node admin/serveur.mjs        puis http://127.0.0.1:8080/admin
// Configuration : admin/config.json (copier admin/config.exemple.json) : motDePasse, port, hote.
import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync, renameSync, statSync, createReadStream } from 'node:fs';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { spawn } from 'node:child_process';
import { resolve, join, extname, dirname, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHEMIN_CONFIG = join(RACINE, 'admin', 'config.json');
if (!existsSync(CHEMIN_CONFIG)) {
  console.error('admin/config.json manquant : copiez admin/config.exemple.json et choisissez un mot de passe.');
  process.exit(1);
}
const config = JSON.parse(readFileSync(CHEMIN_CONFIG, 'utf8'));
if (typeof config.motDePasse !== 'string' || config.motDePasse.length < 8 || config.motDePasse === 'choisissez-un-mot-de-passe-long') {
  console.error('Choisissez un vrai mot de passe (8 caractères au moins) dans admin/config.json.');
  process.exit(1);
}
const PORT = Number(config.port) || 8080;
const HOTE = config.hote || '127.0.0.1';
const DONNEES = join(RACINE, 'src', 'realisations.json');
const SOURCES = join(RACINE, 'images', 'sources');
const CORBEILLE = join(RACINE, 'images', 'corbeille');
const TEMPLATES = ['template-1', 'template-2'];
const EQUIPEMENTS = { panneaux: 'Panneaux photovoltaïques', 'pompe-a-chaleur': 'Pompe à chaleur air-eau', 'chauffe-eau': 'Chauffe-eau thermodynamique' };
const POSITIONS = { '50% 50%': 'Centre', '50% 30%': 'Vers le haut', '50% 70%': 'Vers le bas', '30% 50%': 'Vers la gauche', '70% 50%': 'Vers la droite' };
const TAILLE_MAX = 25 * 1024 * 1024;
const DUREE_SESSION = 12 * 60 * 60 * 1000;

// ---------- données ----------
const lire = () => JSON.parse(readFileSync(DONNEES, 'utf8'));
const ecrire = (liste) => writeFileSync(DONNEES, JSON.stringify(liste, null, 2) + '\n', 'utf8');
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const legende = (p) => [p.titre, p.lieu, p.commune].filter(Boolean).join(' · ');
function slug(texte) {
  return String(texte).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'photo';
}
function slugUnique(base, liste, actuel) {
  let s = base, n = 2;
  while (liste.some((p) => p.fichier === s && p.fichier !== actuel) || (existsSync(join(SOURCES, `${s}.jpg`)) && s !== actuel)) s = `${base}-${n++}`;
  return s;
}
function supprimerDerives(fichier) {
  for (const t of TEMPLATES) {
    const dir = join(RACINE, t, 'images');
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) if (f.startsWith(`${fichier}-`) && /\.(avif|webp|jpg)$/.test(f)) unlinkSync(join(dir, f));
  }
}
function vignette(p) {
  const webp = join(RACINE, 'template-1', 'images', `${p.fichier}-480.webp`);
  return existsSync(webp) ? `/template-1/images/${p.fichier}-480.webp` : `/images/sources/${p.fichier}.jpg`;
}

// ---------- sessions, mot de passe, anti-CSRF ----------
const sessions = new Map();
const echecs = [];
function motDePasseValide(saisi) {
  const a = Buffer.from(String(saisi)), b = Buffer.from(config.motDePasse);
  return a.length === b.length && timingSafeEqual(a, b);
}
function ouvrirSession(res) {
  const jeton = randomBytes(32).toString('hex');
  sessions.set(jeton, { expire: Date.now() + DUREE_SESSION, csrf: randomBytes(16).toString('hex') });
  res.setHeader('Set-Cookie', `rap_admin=${jeton}; HttpOnly; SameSite=Strict; Path=/admin; Max-Age=${DUREE_SESSION / 1000}`);
  return jeton;
}
function session(req) {
  const m = /(?:^|;\s*)rap_admin=([a-f0-9]{64})/.exec(req.headers.cookie || '');
  if (!m) return null;
  const s = sessions.get(m[1]);
  if (!s) return null;
  if (s.expire < Date.now()) { sessions.delete(m[1]); return null; }
  return { jeton: m[1], ...s };
}
function tropDeTentatives() {
  const il_y_a_10_min = Date.now() - 10 * 60 * 1000;
  while (echecs.length && echecs[0] < il_y_a_10_min) echecs.shift();
  return echecs.length >= 5;
}

// ---------- lecture des corps de requête ----------
async function lireCorps(req) {
  const type = req.headers['content-type'] || '';
  const taille = Number(req.headers['content-length'] || 0);
  if (taille > TAILLE_MAX) throw Object.assign(new Error('Fichier trop volumineux (25 Mo au plus).'), { statut: 413 });
  if (type.startsWith('multipart/form-data')) {
    const fd = await new Response(Readable.toWeb(req), { headers: { 'content-type': type } }).formData();
    return fd;
  }
  let texte = '';
  for await (const morceau of req) { texte += morceau; if (texte.length > 1e6) throw Object.assign(new Error('Requête trop longue.'), { statut: 413 }); }
  const fd = new FormData();
  for (const [k, v] of new URLSearchParams(texte)) fd.append(k, v);
  return fd;
}

// ---------- reconstruction ----------
let construction = { enCours: false, journal: '', date: null, code: null };
function lancer(script) {
  return new Promise((ok) => {
    const p = spawn(process.execPath, [join(RACINE, 'outils', script)], { cwd: RACINE });
    let sortie = '';
    p.stdout.on('data', (d) => (sortie += d));
    p.stderr.on('data', (d) => (sortie += d));
    p.on('close', (code) => ok({ code, sortie }));
  });
}
async function reconstruire() {
  if (construction.enCours) return;
  construction = { enCours: true, journal: 'Dérivés d\'images…\n', date: new Date(), code: null };
  const a = await lancer('images.mjs');
  construction.journal += a.sortie + '\nConstruction des pages…\n';
  const b = await lancer('build.mjs');
  construction.journal += b.sortie;
  construction.code = a.code || b.code;
  construction.enCours = false;
}

// ---------- traitement d'une photo envoyée ----------
async function enregistrerPhoto(fichier, nom, description) {
  if (!fichier || typeof fichier.arrayBuffer !== 'function' || !fichier.size) return false;
  if (!/^image\/(jpeg|png|webp|heic|heif|avif|tiff)$/.test(fichier.type) && !/\.(jpe?g|png|webp|heic|heif|avif|tiff?)$/i.test(fichier.name || '')) {
    throw Object.assign(new Error('Format de photo non reconnu (JPEG, PNG, WebP, HEIC, AVIF ou TIFF).'), { statut: 400 });
  }
  const tampon = Buffer.from(await fichier.arrayBuffer());
  mkdirSync(SOURCES, { recursive: true });
  // Rotation d'après l'orientation EXIF, 1800 px au plus, métadonnées d'origine retirées (dont la position GPS),
  // une courte description EXIF posée à la place.
  await sharp(tampon, { failOn: 'none' })
    .rotate()
    .resize({ width: 1800, height: 2700, fit: 'inside', withoutEnlargement: true })
    .withExif({ IFD0: { ImageDescription: description, Copyright: 'RAP ENERGIES SAS' } })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(join(SOURCES, `${nom}.jpg`));
  return true;
}

// ---------- gabarits HTML ----------
function page({ titre, corps, message, erreur }) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>${esc(titre)} · Administration Rap Énergies</title>
<style>
:root { color-scheme: light; }
* { box-sizing: border-box; }
body { margin: 0; font: 17px/1.5 system-ui, "Segoe UI", sans-serif; color: #14171c; background: #f5f4f0; }
header { background: #14171c; color: #fcfbf7; padding: 0.9rem 1.5rem; display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap; }
header strong { font-size: 1.1rem; } header a { color: #fcfbf7; } header form { margin-left: auto; }
main { max-width: 64rem; margin: 0 auto; padding: 1.5rem; }
h1 { font-size: 1.6rem; margin: 0 0 1rem; } h2 { font-size: 1.2rem; margin: 2rem 0 0.75rem; }
.message { background: #e7f3e7; border: 1px solid #9ccc9c; padding: 0.75rem 1rem; margin-bottom: 1rem; }
.erreur { background: #fde8e4; border: 1px solid #f0a08e; padding: 0.75rem 1rem; margin-bottom: 1rem; }
.actions { display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center; margin: 1rem 0; }
button, .bouton { font: inherit; padding: 0.55rem 1rem; border: 2px solid #14171c; background: #14171c; color: #fcfbf7; cursor: pointer; text-decoration: none; display: inline-block; }
button.secondaire, .bouton.secondaire { background: transparent; color: #14171c; }
button.danger { background: transparent; color: #a3261d; border-color: #a3261d; }
button:disabled { opacity: 0.5; cursor: default; }
.liste { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.75rem; }
.liste li { display: grid; grid-template-columns: 9rem 1fr auto; gap: 1rem; align-items: center; background: #fff; border: 1px solid #ddd9cf; padding: 0.75rem; }
.liste img { width: 9rem; aspect-ratio: 4 / 3; object-fit: cover; display: block; background: #e4e1d9; }
.liste .infos { min-width: 0; } .liste .infos p { margin: 0.1rem 0; } .liste .infos .d { color: #4b5361; font-size: 0.95rem; }
.badge { display: inline-block; font-size: 0.8rem; padding: 0.1rem 0.5rem; border: 1px solid #c9a227; background: #fff1bf; margin-left: 0.5rem; }
.ordre { display: grid; gap: 0.35rem; } .ordre form { margin: 0; } .ordre button { padding: 0.3rem 0.6rem; }
form.fiche { display: grid; gap: 1rem; background: #fff; border: 1px solid #ddd9cf; padding: 1.25rem; }
form.fiche label { display: grid; gap: 0.3rem; font-weight: 600; } form.fiche label span.aide { font-weight: 400; color: #4b5361; font-size: 0.9rem; }
input[type=text], select, textarea { font: inherit; padding: 0.55rem 0.7rem; border: 1px solid #9a968c; width: 100%; }
.deux { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.apercu { max-width: 20rem; display: block; border: 1px solid #ddd9cf; }
pre { background: #fff; border: 1px solid #ddd9cf; padding: 1rem; overflow: auto; max-height: 20rem; font-size: 0.85rem; }
@media (max-width: 40rem) { .liste li { grid-template-columns: 1fr; } .liste img { width: 100%; } .deux { grid-template-columns: 1fr; } }
</style></head><body>
<header><strong>Administration Rap Énergies</strong><a href="/admin">Réalisations</a><a href="/template-1/" target="_blank" rel="noopener">Voir le template 1</a><a href="/template-2/" target="_blank" rel="noopener">Voir le template 2</a>${corps.includes('name="jeton"') ? `<form method="post" action="/admin/deconnexion"><input type="hidden" name="jeton" value="${corps.match(/name="jeton" value="([a-f0-9]+)"/)?.[1] || ''}"><button class="secondaire" style="color:#fcfbf7;border-color:#fcfbf7">Se déconnecter</button></form>` : ''}</header>
<main>${message ? `<p class="message">${esc(message)}</p>` : ''}${erreur ? `<p class="erreur">${esc(erreur)}</p>` : ''}${corps}</main></body></html>`;
}

function pageConnexion(erreur) {
  return page({ titre: 'Connexion', erreur, corps: `<h1>Connexion</h1>
<form class="fiche" method="post" action="/admin/connexion" style="max-width:24rem">
<label>Mot de passe <input type="password" name="motDePasse" autocomplete="current-password" required autofocus></label>
<div><button>Entrer</button></div></form>` });
}

function pageListe(liste, csrf, message, erreur) {
  const items = liste
    .map(
      (p, i) => `<li>
<img src="${vignette(p)}" alt="">
<div class="infos"><p><strong>${esc(legende(p))}</strong>${p.provisoire ? '<span class="badge">photo provisoire</span>' : ''}</p><p class="d">${esc(p.detail)}</p><p class="d">${esc(EQUIPEMENTS[p.equipement] || p.equipement)} · fichier <code>${esc(p.fichier)}</code></p>
<div class="actions"><a class="bouton secondaire" href="/admin/realisation/${i}">Modifier</a>
<form method="post" action="/admin/realisation/${i}/supprimer" onsubmit="return confirm('Supprimer cette réalisation ? La photo sera déplacée dans images/corbeille/.')"><input type="hidden" name="jeton" value="${csrf}"><button class="danger">Supprimer</button></form></div></div>
<div class="ordre"><form method="post" action="/admin/realisation/${i}/monter"><input type="hidden" name="jeton" value="${csrf}"><button class="secondaire" ${i === 0 ? 'disabled' : ''} aria-label="Monter">▲</button></form><form method="post" action="/admin/realisation/${i}/descendre"><input type="hidden" name="jeton" value="${csrf}"><button class="secondaire" ${i === liste.length - 1 ? 'disabled' : ''} aria-label="Descendre">▼</button></form></div>
</li>`,
    )
    .join('');
  const etat = construction.enCours
    ? '<p class="message">Reconstruction en cours… rechargez la page dans quelques secondes.</p>'
    : construction.date
      ? `<h2>Dernière reconstruction (${construction.date.toLocaleTimeString('fr-FR')}) : ${construction.code ? 'échec' : 'réussie'}</h2><pre>${esc(construction.journal)}</pre>`
      : '';
  return page({ titre: 'Réalisations', message, erreur, corps: `<h1>Réalisations (${liste.length})</h1>
<p>L'ordre de la liste est l'ordre d'affichage dans la galerie des deux templates. Chaque enregistrement reconstruit les deux templates ; la reconstruction prend quelques secondes par nouvelle photo.</p>
<div class="actions"><a class="bouton" href="/admin/realisation/nouvelle">Ajouter une réalisation</a>
<form method="post" action="/admin/reconstruire"><input type="hidden" name="jeton" value="${csrf}"><button class="secondaire" ${construction.enCours ? 'disabled' : ''}>Reconstruire les deux templates</button></form></div>
<ul class="liste">${items || '<li>Aucune réalisation pour l\'instant.</li>'}</ul>
${etat}` });
}

function pageFiche(p, index, csrf, erreur) {
  const nouvelle = index === null;
  const opt = (obj, val) => Object.entries(obj).map(([k, v]) => `<option value="${esc(k)}" ${k === val ? 'selected' : ''}>${esc(v)}</option>`).join('');
  return page({ titre: nouvelle ? 'Nouvelle réalisation' : 'Modifier une réalisation', erreur, corps: `<h1>${nouvelle ? 'Nouvelle réalisation' : 'Modifier une réalisation'}</h1>
<form class="fiche" method="post" action="${nouvelle ? '/admin/realisation' : `/admin/realisation/${index}`}" enctype="multipart/form-data">
<input type="hidden" name="jeton" value="${csrf}">
${nouvelle ? '' : `<img class="apercu" src="${vignette(p)}" alt="">`}
<label>Photo ${nouvelle ? '' : '<span class="aide">(laisser vide pour garder la photo actuelle)</span>'}<input type="file" name="photo" accept="image/*" ${nouvelle ? 'required' : ''}><span class="aide">JPEG, PNG, WebP ou HEIC. La photo est redimensionnée à 1 800 px, redressée, et ses métadonnées d'origine (dont la position GPS) sont retirées. Pas de visage reconnaissable, pas de plaque, pas d'adresse lisible.</span></label>
<div class="deux">
<label>Équipement <select name="equipement">${opt(EQUIPEMENTS, p.equipement || 'panneaux')}</select></label>
<label>Titre de la légende <span class="aide">(par défaut le nom de l'équipement)</span><input type="text" name="titre" value="${esc(p.titre)}" placeholder="Panneaux photovoltaïques"></label>
</div>
<div class="deux">
<label>Lieu ou type de toit <input type="text" name="lieu" value="${esc(p.lieu)}" placeholder="toit en tuiles canal" required></label>
<label>Commune <input type="text" name="commune" value="${esc(p.commune)}" placeholder="Castries" required></label>
</div>
<label>Détail utile <span class="aide">(une phrase : ce que ça remplace, la puissance, l'orientation…)</span><input type="text" name="detail" value="${esc(p.detail)}" placeholder="Remplace une chaudière au fioul."></label>
<label>Texte alternatif <span class="aide">(ce qu'on voit sur la photo, pour les lecteurs d'écran)</span><input type="text" name="alt" value="${esc(p.alt)}" placeholder="Panneaux photovoltaïques sur un toit de tuiles, ciel bleu" required></label>
<div class="deux">
<label>Cadrage de la photo <select name="position">${opt(POSITIONS, p.position || '50% 50%')}</select></label>
<label style="align-self:end"><span style="display:flex;gap:0.5rem;align-items:center;font-weight:400"><input type="checkbox" name="provisoire" ${p.provisoire ? 'checked' : ''} style="width:auto"> Photo provisoire (mention affichée sous la légende)</span></label>
</div>
<div class="actions"><button>Enregistrer et reconstruire</button><a class="bouton secondaire" href="/admin">Annuler</a></div>
</form>` });
}

// ---------- fichiers statiques des templates et des sources ----------
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8' };
function statique(req, res, chemin) {
  const autorises = ['/template-1/', '/template-2/', '/images/sources/'];
  if (!autorises.some((a) => chemin.startsWith(a))) return false;
  let fichier = join(RACINE, normalize(decodeURIComponent(chemin)));
  if (!fichier.startsWith(RACINE + sep)) return false;
  if (chemin.endsWith('/')) fichier = join(fichier, 'index.html');
  if (!existsSync(fichier) || !statSync(fichier).isFile()) return false;
  res.writeHead(200, { 'Content-Type': TYPES[extname(fichier).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  createReadStream(fichier).pipe(res);
  return true;
}

// ---------- routage ----------
const rediriger = (res, url) => { res.writeHead(303, { Location: url }); res.end(); };
const html = (res, statut, texte) => { res.writeHead(statut, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(texte); };
const msg = (texte) => `/admin?msg=${encodeURIComponent(texte)}`;

function lireFiche(fd, existant, liste) {
  const champ = (n) => String(fd.get(n) ?? '').trim();
  const p = {
    fichier: existant?.fichier,
    equipement: EQUIPEMENTS[champ('equipement')] ? champ('equipement') : 'panneaux',
    titre: champ('titre'),
    lieu: champ('lieu'),
    commune: champ('commune'),
    detail: champ('detail'),
    alt: champ('alt'),
    position: POSITIONS[champ('position')] ? champ('position') : '50% 50%',
    provisoire: fd.get('provisoire') === 'on',
  };
  if (!p.titre) p.titre = EQUIPEMENTS[p.equipement];
  if (!p.lieu || !p.commune || !p.alt) throw Object.assign(new Error('Lieu, commune et texte alternatif sont obligatoires.'), { statut: 400 });
  if (!p.fichier) p.fichier = slugUnique(slug(`${p.titre}-${p.lieu}-${p.commune}`), liste, null);
  return p;
}

async function traiter(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const chemin = url.pathname;
  if (chemin === '/') return rediriger(res, '/admin');
  if (!chemin.startsWith('/admin')) {
    if (statique(req, res, chemin)) return;
    return html(res, 404, page({ titre: 'Introuvable', corps: '<h1>Page introuvable</h1><p><a href="/admin">Retour à l\'administration</a></p>' }));
  }
  const s = session(req);
  // Connexion
  if (chemin === '/admin/connexion' && req.method === 'POST') {
    if (tropDeTentatives()) return html(res, 429, pageConnexion('Trop de tentatives. Attendez dix minutes.'));
    const fd = await lireCorps(req);
    if (motDePasseValide(fd.get('motDePasse'))) { ouvrirSession(res); return rediriger(res, '/admin'); }
    echecs.push(Date.now());
    return html(res, 401, pageConnexion('Mot de passe incorrect.'));
  }
  if (!s) return html(res, chemin === '/admin' ? 200 : 401, pageConnexion());
  // Toute action POST exige le jeton anti-CSRF de la session
  let fd = null;
  if (req.method === 'POST') {
    fd = await lireCorps(req);
    if (fd.get('jeton') !== s.csrf) return html(res, 403, page({ titre: 'Refusé', corps: '<h1>Formulaire expiré</h1><p>Rechargez la page et recommencez. <a href="/admin">Retour</a></p>' }));
  }
  if (chemin === '/admin/deconnexion' && fd) { sessions.delete(s.jeton); res.setHeader('Set-Cookie', 'rap_admin=; Path=/admin; Max-Age=0'); return rediriger(res, '/admin'); }
  const liste = lire();
  if (chemin === '/admin' && req.method === 'GET') return html(res, 200, pageListe(liste, s.csrf, url.searchParams.get('msg'), url.searchParams.get('err')));
  if (chemin === '/admin/reconstruire' && fd) { reconstruire(); return rediriger(res, msg('Reconstruction lancée.')); }
  if (chemin === '/admin/realisation/nouvelle' && req.method === 'GET') return html(res, 200, pageFiche({ equipement: 'panneaux', position: '50% 50%' }, null, s.csrf));
  if (chemin === '/admin/realisation' && fd) {
    try {
      const p = lireFiche(fd, null, liste);
      const ok = await enregistrerPhoto(fd.get('photo'), p.fichier, `Photo Rap Énergies : ${legende(p)}`);
      if (!ok) throw Object.assign(new Error('Une photo est nécessaire pour une nouvelle réalisation.'), { statut: 400 });
      liste.push(p);
      ecrire(liste);
      reconstruire();
      return rediriger(res, msg('Réalisation ajoutée ; reconstruction lancée.'));
    } catch (e) { return html(res, e.statut || 500, pageFiche({ ...Object.fromEntries([...fd.entries()].filter(([k]) => k !== 'photo')), provisoire: fd.get('provisoire') === 'on' }, null, s.csrf, e.message)); }
  }
  const m = /^\/admin\/realisation\/(\d+)(?:\/(supprimer|monter|descendre))?$/.exec(chemin);
  if (m) {
    const i = Number(m[1]);
    if (!liste[i]) return rediriger(res, `/admin?err=${encodeURIComponent('Réalisation introuvable.')}`);
    const action = m[2];
    if (!action && req.method === 'GET') return html(res, 200, pageFiche(liste[i], i, s.csrf));
    if (!fd) return rediriger(res, '/admin');
    if (!action) {
      try {
        const p = lireFiche(fd, liste[i], liste);
        const photo = fd.get('photo');
        if (photo && typeof photo.arrayBuffer === 'function' && photo.size) {
          supprimerDerives(p.fichier);
          await enregistrerPhoto(photo, p.fichier, `Photo Rap Énergies : ${legende(p)}`);
          p.provisoire = fd.get('provisoire') === 'on';
        }
        liste[i] = p;
        ecrire(liste);
        reconstruire();
        return rediriger(res, msg('Réalisation enregistrée ; reconstruction lancée.'));
      } catch (e) { return html(res, e.statut || 500, pageFiche({ ...liste[i], ...Object.fromEntries([...fd.entries()].filter(([k]) => k !== 'photo')), provisoire: fd.get('provisoire') === 'on' }, i, s.csrf, e.message)); }
    }
    if (action === 'supprimer') {
      const [p] = liste.splice(i, 1);
      ecrire(liste);
      supprimerDerives(p.fichier);
      const src = join(SOURCES, `${p.fichier}.jpg`);
      if (existsSync(src)) { mkdirSync(CORBEILLE, { recursive: true }); renameSync(src, join(CORBEILLE, `${p.fichier}-${Date.now()}.jpg`)); }
      reconstruire();
      return rediriger(res, msg('Réalisation supprimée ; reconstruction lancée.'));
    }
    const j = action === 'monter' ? i - 1 : i + 1;
    if (liste[j]) { [liste[i], liste[j]] = [liste[j], liste[i]]; ecrire(liste); reconstruire(); }
    return rediriger(res, msg('Ordre modifié ; reconstruction lancée.'));
  }
  return html(res, 404, page({ titre: 'Introuvable', corps: '<h1>Page introuvable</h1><p><a href="/admin">Retour</a></p>' }));
}

createServer((req, res) => {
  traiter(req, res).catch((e) => {
    console.error(e);
    if (!res.headersSent) html(res, e.statut || 500, page({ titre: 'Erreur', corps: `<h1>Erreur</h1><p>${esc(e.message)}</p><p><a href="/admin">Retour</a></p>` }));
    else res.end();
  });
}).listen(PORT, HOTE, () => console.log(`Administration : http://${HOTE}:${PORT}/admin`));
