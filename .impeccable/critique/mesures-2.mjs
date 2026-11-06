// Mesures déterministes complémentaires (assessment B, passe 2) : largeur de défilement à 1024, 1280 et 1440 px
// (barres de défilement masquées puis visibles), éléments qui dépassent la fenêtre, comportement avec
// prefers-reduced-motion: reduce (classe « motion » sur <html>, animations actives).
// Usage : node .impeccable/critique/mesures-2.mjs [BASE_PAGES]   (défaut : http://localhost:8500)
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lancer } from '../outils/navigateur.mjs';

const base = (process.argv[2] || 'http://localhost:8500').replace(/\/$/, '');
const ici = path.dirname(fileURLToPath(import.meta.url));
const sortie = path.join(ici, 'mesures-2-resultat.json');
const LARGEURS = [1024, 1280, 1440];

function mesurerLargeur() {
  const sel = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    else if (typeof el.className === 'string' && el.className.trim()) s += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
    return s;
  };
  const cw = document.documentElement.clientWidth;
  const depassants = [];
  for (const el of document.querySelectorAll('body *')) {
    if (['SCRIPT', 'STYLE', 'PATH'].includes(el.tagName)) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.right > cw + 0.5 || r.left < -0.5) depassants.push({ selecteur: sel(el), gauche: Math.round(r.left), droite: Math.round(r.right), largeur: Math.round(r.width), position: cs.position, parentOverflow: el.parentElement ? getComputedStyle(el.parentElement).overflowX : null });
  }
  return {
    innerWidth, clientWidth: cw, largeurBarre: innerWidth - cw,
    scrollWidth: document.documentElement.scrollWidth, bodyScrollWidth: document.body.scrollWidth,
    debordementHorizontal: document.documentElement.scrollWidth > cw,
    nbDepassants: depassants.length, depassants: depassants.slice(0, 30),
  };
}

function mesurerMouvement() {
  const sel = (el) => {
    if (!el || !el.tagName) return null;
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    else if (typeof el.className === 'string' && el.className.trim()) s += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
    return s;
  };
  const anims = document.getAnimations();
  const noms = {};
  for (const a of anims) { const k = a.animationName || a.transitionProperty || a.constructor.name; noms[k] = (noms[k] || 0) + 1; }
  return {
    mediaReduce: matchMedia('(prefers-reduced-motion: reduce)').matches,
    classeMotionSurHtml: document.documentElement.classList.contains('motion'),
    classesHtml: document.documentElement.className,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    nbAnimations: anims.length,
    nbEnCours: anims.filter((a) => a.playState === 'running').length,
    parNom: noms,
    animations: anims.slice(0, 40).map((a) => ({ type: a.constructor.name, nom: a.animationName || a.transitionProperty || null, etat: a.playState, cible: a.effect && a.effect.target ? sel(a.effect.target) : null, chronologie: a.timeline ? a.timeline.constructor.name : null })),
  };
}

const resultat = { base, date: new Date().toISOString(), templates: [] };
const navigateurs = [{ nom: 'barres masquées (défaut Playwright)', instance: await lancer(chromium) }];
try {
  navigateurs.push({ nom: 'barres de défilement visibles', instance: await chromium.launch({ channel: 'msedge', ignoreDefaultArgs: ['--hide-scrollbars'] }) });
} catch (e) {
  resultat.avertissement = 'Lancement Edge avec barres visibles impossible : ' + String((e && e.message) || e);
}
try {
  for (const n of [1, 2]) {
    const url = `${base}/template-${n}/index.html`;
    const t = { template: n, url, largeurs: [], mouvement: {} };
    for (const nav of navigateurs) {
      for (const w of LARGEURS) {
        const ctx = await nav.instance.newContext({ viewport: { width: w, height: 800 }, deviceScaleFactor: 1 });
        const page = await ctx.newPage();
        const erreurs = [];
        page.on('pageerror', (e) => erreurs.push(String(e)));
        await page.goto(url, { waitUntil: 'load', timeout: 30000 });
        await page.waitForTimeout(1500);
        const haut = await page.evaluate(mesurerLargeur);
        await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
        await page.waitForTimeout(800);
        const bas = await page.evaluate(mesurerLargeur);
        t.largeurs.push({ navigateur: nav.nom, largeur: w, enHaut: haut, enBasApresDefilement: { scrollWidth: bas.scrollWidth, clientWidth: bas.clientWidth, debordementHorizontal: bas.debordementHorizontal, nbDepassants: bas.nbDepassants, depassants: bas.depassants }, erreursPage: erreurs });
        await ctx.close();
      }
    }
    for (const pref of ['reduce', 'no-preference']) {
      const ctx = await navigateurs[0].instance.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: pref });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(200);
      const t0 = await page.evaluate(mesurerMouvement);
      await page.waitForTimeout(2500);
      const t1 = await page.evaluate(mesurerMouvement);
      // Défilement jusqu'au graphique : les barres (animation-timeline: view()) ne doivent s'animer qu'avec la classe motion.
      await page.evaluate(() => { const g = document.querySelector('.graphique'); if (g) g.scrollIntoView({ block: 'center' }); });
      await page.waitForTimeout(600);
      const t2 = await page.evaluate(mesurerMouvement);
      t.mouvement[pref] = { auChargement: t0, apres2500ms: { nbAnimations: t1.nbAnimations, nbEnCours: t1.nbEnCours, parNom: t1.parNom }, auGraphique: { nbAnimations: t2.nbAnimations, nbEnCours: t2.nbEnCours, parNom: t2.parNom, classeMotionSurHtml: t2.classeMotionSurHtml, animations: t2.animations } };
      await ctx.close();
    }
    resultat.templates.push(t);
  }
} finally {
  for (const nav of navigateurs) await nav.instance.close();
}
await writeFile(sortie, JSON.stringify(resultat, null, 2), 'utf8');
for (const t of resultat.templates) {
  for (const l of t.largeurs) console.log(`template-${t.template} ${l.navigateur} ${l.largeur}px : clientWidth ${l.enHaut.clientWidth} (barre ${l.enHaut.largeurBarre}px), scrollWidth ${l.enHaut.scrollWidth} → débordement ${l.enHaut.debordementHorizontal ? 'OUI' : 'non'}, dépassants ${l.enHaut.nbDepassants} ; en bas : scrollWidth ${l.enBasApresDefilement.scrollWidth}, dépassants ${l.enBasApresDefilement.nbDepassants}`);
  for (const [pref, m] of Object.entries(t.mouvement)) console.log(`template-${t.template} reduced-motion=${pref} : media=${m.auChargement.mediaReduce}, classe motion=${m.auChargement.classeMotionSurHtml}, animations au chargement ${m.auChargement.nbAnimations} (en cours ${m.auChargement.nbEnCours}), après 2,5 s ${m.apres2500ms.nbAnimations}, au graphique ${m.auGraphique.nbAnimations} (en cours ${m.auGraphique.nbEnCours}), scroll-behavior ${m.auChargement.scrollBehavior}`);
}
if (resultat.avertissement) console.error(resultat.avertissement);
console.error(`Résultat écrit dans ${sortie}`);
