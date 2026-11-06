// Composants partagés par les deux templates : en-tête de document, bandeau, galerie et visionneuse,
// corps des services, graphique PVGIS, étapes, zone, réassurance, questions, contact, pied, pages légales.
// Chaque template compose ces briques dans son ordre et avec ses classes ; le contenu vient de src/contenu.mjs.
import { readFileSync } from 'node:fs';
import { t, esc, fr } from '../../outils/typo.mjs';
import * as C from '../contenu.mjs';

export const LARGEURS = [480, 800, 1200, 1800];

// Icônes Phosphor (regular), un seul style, inclus en ligne.
const ICONES = {};
export function icone(nom, classe = 'ico') {
  if (!ICONES[nom]) {
    const svg = readFileSync(`node_modules/@phosphor-icons/core/assets/regular/${nom}.svg`, 'utf8');
    ICONES[nom] = svg
      .replace(/<rect[^>]*fill="none"[^>]*\/>/, '')
      .replace('<svg ', '<svg aria-hidden="true" focusable="false" fill="currentColor" class="__CLASSE__" ');
  }
  return ICONES[nom].replace('__CLASSE__', classe);
}

// <picture> responsive. dims : { nom: { width, height } } mesuré au build depuis images/sources/.
export function picture(nom, { alt, sizes = '100vw', eager = false, position, classe = '', dims }) {
  const d = dims[nom];
  if (!d) throw new Error(`dimensions inconnues pour ${nom}`);
  const larg = LARGEURS.filter((w) => w <= d.width);
  const srcset = (ext) => larg.map((w) => `images/${nom}-${w}.${ext} ${w}w`).join(', ');
  const h1200 = Math.round((1200 * d.height) / d.width);
  const style = position ? ` style="object-position:${position}"` : '';
  const charge = eager ? ' loading="eager" fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"';
  return `<picture${classe ? ` class="${classe}"` : ''}>
<source type="image/avif" srcset="${srcset('avif')}" sizes="${sizes}">
<source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}">
<img src="images/${nom}-1200.jpg" width="1200" height="${h1200}" alt="${esc(alt)}"${charge}${style}>
</picture>`;
}

// En-tête de document.
export function tete({ titre, description, canonical, polices, jsonld = false, legale = false }) {
  // Pas de préchargement des polices : en ouverture depuis le disque (file://), la requête CORS du preload est
  // refusée et salit la console ; les polices se chargent par le CSS avec font-display: swap.
  const preload = '';
  const ld = jsonld
    ? `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Electrician',
        name: C.marque.nom,
        legalName: 'RAP ENERGIES',
        url: C.coordonnees.site,
        image: `${C.coordonnees.site}images/logo.png`,
        telephone: '+33699346686',
        email: C.coordonnees.email,
        address: { '@type': 'PostalAddress', streetAddress: C.coordonnees.adresse, postalCode: C.coordonnees.codePostal, addressLocality: C.coordonnees.ville, addressCountry: 'FR' },
        areaServed: C.zone.communes.map((c) => ({ '@type': 'City', name: c })),
      })}</script>`
    : '';
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titre)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${legale ? '<meta name="robots" content="noindex, follow">' : ''}
<link rel="icon" href="images/symbole-64.png" type="image/png" sizes="64x64">
<link rel="apple-touch-icon" href="images/symbole-180.png">
<meta name="theme-color" content="__THEME__">
${preload}
<link rel="stylesheet" href="style.css">
<script>if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')</script>
${ld}
</head>`;
}

// Bandeau : lien d'évitement, marque (symbole + nom), navigation, téléphone. prefixe = 'index.html' sur les pages légales.
export function bandeau({ prefixe = '', logo = 'symbole-180.png' } = {}) {
  const liens = C.navigation
    .map((n) => `<li><a href="${prefixe}${n.href}">${n.court ? `<span class="nav-long">${t(n.libelle)}</span><span class="nav-court">${t(n.court)}</span>` : t(n.libelle)}</a></li>`)
    .join('');
  return `<a class="evitement" href="#contenu">Aller au contenu</a>
<div class="sentinelle" aria-hidden="true"></div>
<header class="bandeau">
<div class="colonne bandeau-grille">
<a class="marque" href="${prefixe || '#haut'}"><img src="images/${logo}" width="180" height="180" alt=""><span>${t(C.marque.nom)}</span></a>
<nav class="nav" aria-label="Sections du site"><ul>${liens}</ul></nav>
<a class="tel" href="${C.coordonnees.telHref}">${icone('phone')}<span>${fr(C.coordonnees.tel)}</span></a>
</div>
</header>`;
}

export function boutons(classePlein = 'bouton bouton-plein', classeTrait = 'bouton bouton-trait') {
  return `<p class="actions"><a class="${classePlein}" href="${C.coordonnees.telHref}">${t(C.actions.appeler)}</a><a class="${classeTrait}" href="#contact">${t(C.actions.decrire)}</a></p>`;
}

// Répartition des photos de la galerie du template 1 sur six colonnes : des rangées de deux (3 + 3) et de trois
// (2 + 2 + 2) en alternance ; une photo seule en fin de liste prend toute la largeur (6), deux prennent 3 + 3.
export function portees(n) {
  const out = [];
  let rangeeDeDeux = true;
  while (out.length < n) {
    const reste = n - out.length;
    if (reste === 1) out.push(6);
    else if (reste === 2) out.push(3, 3);
    else if (rangeeDeDeux) out.push(3, 3);
    else out.push(2, 2, 2);
    rangeeDeDeux = !rangeeDeDeux;
  }
  return out.slice(0, n);
}

// Galerie des réalisations (figures + liens vers le JPEG 1800 sans script) et visionneuse <dialog>.
// Les fiches viennent de src/realisations.json ; la légende est « Titre · lieu · commune ».
export function galerie({ dims, sizes, classeSection = 'realisations', mosaique = false }) {
  const photos = C.realisations.photos;
  const spans = mosaique ? portees(photos.length) : [];
  const items = photos
    .map((p, i) => {
      const leg = C.legende(p);
      const legendeNue = leg.replace(/\s*·?\s*\[À [^\]]*\]/g, '').trim();
      const classe = mosaique && spans[i] === 6 ? ' large' : '';
      const style = mosaique ? ` style="--c:${spans[i]}"` : '';
      return `<li class="galerie-item${classe}" data-equipement="${p.equipement}"${style}>
<figure>
<a class="photo-lien" href="images/${p.fichier}-1800.jpg" data-legende="${esc(fr(legendeNue))}" data-index="${i}">
${picture(p.fichier, { alt: p.alt, sizes, position: p.position, dims })}
</a>
<figcaption><span class="repere repere-${p.equipement}" aria-hidden="true"></span><span class="legende">${t(leg)}</span>${p.detail ? `<span class="detail">${t(p.detail)}</span>` : ''}</figcaption>
</figure>
</li>`;
    })
    .join('\n');
  // La mention « photos provisoires » est dite une fois, sous l'introduction, et non sous chaque photo.
  const provisoire = photos.some((p) => p.provisoire) ? `\n<p class="note galerie-note">${t(C.realisations.provisoire)}</p>` : '';
  return `<section class="${classeSection}" id="realisations" aria-labelledby="t-realisations">
<div class="colonne realisations-tete">
<h2 id="t-realisations">${t(C.realisations.titre)}</h2>
<p class="intro">${t(C.realisations.texte)}</p>${provisoire}
</div>
<ul class="galerie colonne">
${items}
</ul>
</section>
<dialog class="visionneuse" aria-label="Photo agrandie">
<div class="visionneuse-contenu">
<div class="visionneuse-image"></div>
<p class="visionneuse-legende"></p>
<p class="visionneuse-compteur"><span class="num">1</span> / ${photos.length}</p>
</div>
<button class="visionneuse-prec" type="button" aria-label="Photo précédente">${icone('caret-left')}</button>
<button class="visionneuse-suiv" type="button" aria-label="Photo suivante">${icone('caret-right')}</button>
<button class="visionneuse-fermer" type="button" aria-label="Fermer la photo">${icone('x')}</button>
</dialog>`;
}

// Corps d'un service : paragraphes d'intro, « Ce que nous faisons », note éventuelle.
export function serviceCorps(s) {
  return `<div class="service-intro">${s.texte.map((p) => `<p>${t(p)}</p>`).join('')}</div>
<div class="faisons"><h4>${t(C.services.faisonsTitre)}</h4><ul>${s.faisons.map((f) => `<li>${t(f)}</li>`).join('')}</ul>${s.note ? `<p class="note">${t(s.note)}</p>` : ''}</div>`;
}

export function ensemble() {
  return `<div class="ensemble"><h3>${t(C.services.ensemble.titre)}</h3><p>${t(C.services.ensemble.texte)}</p></div>`;
}

// Autres services (liste en grand) et entretien des installations posées, mis en avant sous les trois couleurs des équipements.
export function autresServices() {
  const A = C.autres;
  return `<section class="autres" id="autres-services" aria-labelledby="t-autres">
<div class="colonne">
<h2 id="t-autres">${t(A.titre)}</h2>
<p>${t(A.intro)}</p>
<ul class="metiers">${A.liste.map((m) => `<li>${t(m)}</li>`).join('')}</ul>
<div class="entretien">
<div class="entretien-barres" aria-hidden="true"><span></span><span></span><span></span></div>
<h3>${t(A.entretien.titre)}</h3>
<p>${t(A.entretien.texte)}</p>
</div>
</div>
</section>`;
}

// Graphique PVGIS : liste de douze mois, barres en CSS (hauteur ou largeur selon le template), valeurs visibles.
// Les mois sont toujours abrégés : une colonne sur douze n'a jamais la place d'un nom entier (« Septembre » débordait
// sur « Octobre » sur grand écran) ; le nom entier reste dans le title de l'abréviation.
export function production({ orientation }) {
  const max = 170;
  const barres = C.production.mois
    .map(
      (m) => `<li style="--v:${m.kwh}"><span class="barre" aria-hidden="true"></span><span class="val">${m.kwh}</span><span class="mois"><abbr title="${t(m.nom)}">${m.court}</abbr></span></li>`,
    )
    .join('');
  return `<section class="production" id="production" aria-labelledby="t-production">
<div class="colonne">
<h2 id="t-production">${t(C.production.titre)}</h2>
<div class="production-texte">${C.production.paragraphes.map((p) => `<p>${t(p)}</p>`).join('')}<p class="note glossaire">${t(C.production.glossaire)}</p>${boutons()}</div>
<figure class="graphique graphique-${orientation}">
<p class="chiffre"><strong>${fr(`${C.production.total.toLocaleString('fr-FR')} kWh`)}</strong> <span>${t(C.production.totalTexte)}</span></p>
<p class="unite">${t(C.production.unite)}</p>
<ol class="barres" style="--max:${max}" aria-label="${esc(fr(C.production.legendeFigure))}">${barres}</ol>
<figcaption>${t(C.production.legendeFigure)} ${t(C.production.source).replace('PVGIS 5.3', `<a href="${C.production.sourceHref}" rel="external">PVGIS 5.3</a>`)}</figcaption>
</figure>
</div>
</section>`;
}

export function etapes({ photo, dims, sizes }) {
  // La première étape (« Vous nous appelez ») est un vrai lien d'appel : une action au milieu de la page.
  const liste = C.etapes.liste
    .map((e, i) => {
      const tete = i === 0 ? t(e.tete).replace('Vous nous appelez', `<a href="${C.coordonnees.telHref}">Vous nous appelez</a>`) : t(e.tete);
      return `<li><div class="etape"><b>${tete}</b>${t(e.suite)}</div></li>`;
    })
    .join('');
  return `<section class="etapes" id="etapes" aria-labelledby="t-etapes">
<div class="colonne etapes-grille">
<div class="etapes-photo">${picture(photo.nom, { alt: photo.alt, sizes, position: photo.position, dims })}</div>
<div class="etapes-texte"><h2 id="t-etapes">${t(C.etapes.titre)}</h2><ol class="etapes-liste">${liste}</ol></div>
</div>
</section>`;
}

export function zone() {
  const communes = C.zone.communes.map((c) => `<li>${t(c)}</li>`).join('');
  return `<section class="zone" id="zone" aria-labelledby="t-zone">
<div class="colonne">
<h2 id="t-zone">${t(C.zone.titre)}</h2>
<p>${t(C.zone.avant)}</p>
<ul class="communes">${communes}</ul>
<p>${t(C.zone.apres)}</p>${C.zone.note ? `\n<p class="note">${t(C.zone.note)}</p>` : ''}
</div>
</section>`;
}

export function pourquoi() {
  const points = C.pourquoi.points.map((p) => `<li><b>${t(p.tete)}</b> <span>${t(p.texte)}</span></li>`).join('');
  return `<section class="pourquoi" id="pourquoi" aria-labelledby="t-pourquoi">
<div class="colonne">
<h2 id="t-pourquoi">${t(C.pourquoi.titre)}</h2>
<ul class="points">${points}</ul>
</div>
</section>`;
}

// rappel : sur bureau, un rappel de l'appel (texte du contact et numéro) accompagne les questions dans une colonne collante.
export function questions({ rappel = false } = {}) {
  const qs = C.faq.questions
    .map((q) => `<details><summary><span>${t(q.q)}</span>${icone('plus', 'ico ico-plus')}</summary><p>${t(q.r)}</p></details>`)
    .join('');
  const aside = rappel
    ? `\n<aside class="faq-appel" aria-label="Nous joindre"><p>${t(C.contact.texte)}</p><p><a class="tel-grand" href="${C.coordonnees.telHref}">${fr(C.coordonnees.tel)}</a></p></aside>`
    : '';
  return `<section class="faq" id="questions" aria-labelledby="t-questions">
<div class="colonne">
<h2 id="t-questions">${t(C.faq.titre)}</h2>
<div class="questions">${qs}</div>${aside}
</div>
</section>`;
}

// endpoint : adresse du point d'envoi (envoyer.php en production Hostinger) ; vide en local, le formulaire compose un courriel.
export function contact({ classeBouton = 'bouton bouton-envoyer', endpoint = '' }) {
  const ch = C.contact.champs;
  const cases = C.contact.projets.map((p) => `<label><input type="checkbox" name="projet[]" value="${esc(p)}"> <span>${t(p)}</span></label>`).join('');
  const action = endpoint ? ` action="${esc(endpoint)}"` : ` action="mailto:${C.coordonnees.email}" enctype="text/plain"`;
  return `<section class="contact" id="contact" aria-labelledby="t-contact">
<div class="colonne contact-grille">
<div class="contact-texte">
<h2 id="t-contact">${t(C.contact.titre)}</h2>
<p>${t(C.contact.texte)}</p>
<p><a class="tel-grand" href="${C.coordonnees.telHref}">${fr(C.coordonnees.tel)}</a></p>
<p class="coord"><a href="mailto:${C.coordonnees.email}">${C.coordonnees.email}</a><br>${t(`${C.coordonnees.adresse}, ${C.coordonnees.codePostal} ${C.coordonnees.ville}`)}</p>${C.contact.horaires ? `\n<p class="note">${t(C.contact.horaires)}</p>` : ''}
</div>
<form class="formulaire" method="post"${action} data-endpoint="${esc(endpoint)}" data-courriel="${C.coordonnees.email}" data-sujet="${esc(C.contact.sujetCourriel)}" data-confirmation="${esc(fr(C.contact.confirmation))}" data-erreur="${esc(fr(C.contact.erreur))}" data-ouverture="${esc(fr(C.contact.ouverture))}" data-envoi="${esc(fr(C.contact.envoiEnCours))}">
<p class="piege" aria-hidden="true"><label for="f-site-web">Site web (laisser vide)</label><input id="f-site-web" name="site-web" type="text" tabindex="-1" autocomplete="off"></p>
<p class="champ"><label for="f-nom">${t(ch.nom)}</label><input id="f-nom" name="nom" type="text" autocomplete="name" required></p>
<p class="champ"><label for="f-tel">${t(ch.tel)} <span class="aide">(${t(ch.telAide)})</span></label><input id="f-tel" name="telephone" type="tel" inputmode="tel" autocomplete="tel" pattern="[0-9 +\\.\\-\\(\\)]{10,20}" title="${esc(fr(ch.telAide))}" required></p>
<p class="champ"><label for="f-commune">${t(ch.commune)}</label><input id="f-commune" name="commune" type="text" autocomplete="address-level2" list="communes-liste" required><datalist id="communes-liste">${C.zone.communes.map((c) => `<option value="${esc(c)}">`).join('')}</datalist></p>
<p class="champ"><label for="f-email">${t(ch.email)}</label><input id="f-email" name="email" type="email" autocomplete="email"></p>
<fieldset class="champ champ-large cases-groupe"><legend>${t(ch.projet)} <span class="aide">(${t(ch.projetAide)})</span></legend><div class="cases">${cases}</div></fieldset>
<p class="champ champ-large"><label for="f-message">${t(ch.message)}</label><textarea id="f-message" name="message" rows="4" maxlength="2000" placeholder="${esc(fr(ch.messageAide))}"></textarea></p>
<p class="champ champ-large consentement">${t(C.contact.consentement).replace('Confidentialité', '<a href="confidentialite.html">Confidentialité</a>')}</p>
<p class="champ champ-large envoi"><button class="${classeBouton}" type="submit">${t(C.actions.envoyer)}</button></p>
</form>
<p class="form-etat" role="status" aria-live="polite" tabindex="-1" hidden></p>
</div>
</section>`;
}

export function pied({ logo = 'logo.png', prefixe = '' } = {}) {
  const liens = C.pied.liens.map((l) => `<a href="${prefixe}${l.href}">${t(l.libelle)}</a>`).join(' · ');
  // Dimensions lues dans l'en-tête du PNG (images/logo/, produit par outils/logo.mjs) : pas de valeur à tenir à jour.
  const png = readFileSync(`images/logo/${logo}`);
  const largeur = png.readUInt32BE(16), hauteur = png.readUInt32BE(20);
  return `<footer class="pied">
<div class="colonne pied-grille">
<img class="pied-logo" src="images/${logo}" width="${largeur}" height="${hauteur}" alt="${esc(C.marque.nom)}">
<div class="pied-texte">
<p>${t(C.pied.ligne)}</p>
<p>${t(C.pied.rge)}</p>
<p class="pied-liens">${liens}</p>
<p class="pied-sources">${t(C.pied.sources)}</p>
<p>${t(C.pied.realisation.avant)}<a href="${C.pied.realisation.href}" rel="external">${t(C.pied.realisation.libelle)}</a></p>
</div>
</div>
</footer>
<script src="script.js" defer></script>`;
}

// Pages légales : même bandeau et même pied, texte en colonne de lecture.
export function pageLegale({ quelle, polices, theme, logoPied, logoBandeau }) {
  const L = C.legal[quelle];
  const titre = quelle === 'mentions' ? C.seo.titleMentions : C.seo.titleConfidentialite;
  const corps =
    quelle === 'mentions'
      ? L.paragraphes.map((p) => `<p>${t(p)}</p>`).join('')
      : `<dl class="confid">${L.blocs.map((b) => `<dt>${t(b.tete)}</dt><dd>${t(b.texte.charAt(0).toUpperCase() + b.texte.slice(1))}</dd>`).join('')}</dl>`;
  return `${tete({ titre, description: C.seo.description, canonical: `${C.coordonnees.site}${quelle === 'mentions' ? 'mentions-legales.html' : 'confidentialite.html'}`, polices, legale: true }).replace('__THEME__', theme)}
<body class="page-legale" id="haut">
${bandeau({ prefixe: 'index.html', logo: logoBandeau })}
<main class="legale colonne" id="contenu">
<h1>${t(L.titre)}</h1>
${corps}
<p class="retour"><a href="index.html">${t(C.legal.retour)}</a></p>
</main>
${pied({ logo: logoPied, prefixe: '' })}
</body>
</html>`;
}

// Pages de message (merci après envoi du formulaire, 404) : même bandeau et même pied que les pages légales.
export function pageMessage({ titre, h1, paragraphes, polices, theme, logoPied, logoBandeau, noindex = true }) {
  return `${tete({ titre, description: C.seo.description, canonical: C.coordonnees.site, polices, legale: noindex }).replace('__THEME__', theme)}
<body class="page-legale" id="haut">
${bandeau({ prefixe: 'index.html', logo: logoBandeau })}
<main class="legale colonne" id="contenu">
<h1>${t(h1)}</h1>
${paragraphes.map((p) => `<p>${p}</p>`).join('\n')}
<p class="retour"><a href="index.html">${t(C.legal.retour)}</a></p>
</main>
${pied({ logo: logoPied, prefixe: '' })}
</body>
</html>`;
}

// Les deux pages de message communes aux templates.
export function pagesMessage(opts) {
  const tel = `<a href="${C.coordonnees.telHref}">${fr(C.coordonnees.tel)}</a>`;
  const mail = `<a href="mailto:${C.coordonnees.email}">${C.coordonnees.email}</a>`;
  return {
    'merci.html': pageMessage({
      ...opts,
      titre: `Demande envoyée | ${C.marque.nom}`,
      h1: 'Merci, votre demande est bien partie',
      paragraphes: [t('Nous vous rappelons au numéro indiqué.'), `${t("Si c'est urgent, appelez le")} ${tel} ${t('ou écrivez à')} ${mail}.`],
    }),
    '404.html': pageMessage({
      ...opts,
      titre: `Page introuvable | ${C.marque.nom}`,
      h1: 'Cette page n\'existe pas',
      paragraphes: [t("L'adresse a peut-être changé. Tout le site tient sur une page : retrouvez les réalisations, les services et le formulaire depuis l'accueil."), `${t('Pour nous joindre directement :')} ${tel} · ${mail}.`],
    }),
  };
}

export { C, t, esc, fr };
