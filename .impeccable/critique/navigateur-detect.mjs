// Preuves navigateur pour l'assessment B : ouvre chaque template servi par le live-server impeccable,
// vérifie que l'injection est possible, injecte /detect.js, collecte la console et prend une capture.
// Usage : node .impeccable/critique/navigateur-detect.mjs PORT_DETECT [BASE_PAGES]
//   PORT_DETECT : port du live-server impeccable (sert /detect.js, mais pas le projet).
//   BASE_PAGES  : origine qui sert la racine du projet (défaut : la même que detect.js).
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lancer } from '../outils/navigateur.mjs';

const port = process.argv[2] || process.env.PORT;
if (!port) {
  console.error('Usage : node navigateur-detect.mjs PORT_DETECT [BASE_PAGES]');
  process.exit(1);
}
const base = `http://localhost:${port}`;
const basePages = (process.argv[3] || base).replace(/\/$/, '');
const ici = path.dirname(fileURLToPath(import.meta.url));
const dossierCaptures = path.join(ici, 'captures');
await mkdir(dossierCaptures, { recursive: true });

const SECTIONS = ['services', 'etapes', 'zone', 'pourquoi', 'faq', 'contact'];

// Mesures faites dans la page : paddings réels des sections, gouttière .colonne, visionneuse, interlignes < 1,3.
function mesurer(sections) {
  const px = (v) => Math.round(parseFloat(v) * 100) / 100;
  const out = { sections: [], visionneuse: null, interlignesSerres: [], overlay: null };
  for (const cls of sections) {
    const s = document.querySelector(`main > section.${cls}`);
    if (!s) { out.sections.push({ section: cls, absente: true }); continue; }
    const cs = getComputedStyle(s);
    const colonne = s.querySelector(':scope > .colonne');
    const rs = s.getBoundingClientRect();
    const rc = colonne ? colonne.getBoundingClientRect() : null;
    out.sections.push({
      section: cls,
      enfantDirectDeMain: s.parentElement === document.querySelector('main'),
      paddingTop: px(cs.paddingTop), paddingBottom: px(cs.paddingBottom),
      paddingLeft: px(cs.paddingLeft), paddingRight: px(cs.paddingRight),
      borderTop: cs.borderTopWidth + ' ' + cs.borderTopColor,
      background: cs.backgroundColor,
      colonne: rc ? {
        largeur: px(rc.width),
        retraitGauche: px(rc.left - rs.left), retraitDroite: px(rs.right - rc.right),
        retraitHaut: px(rc.top - rs.top), retraitBas: px(rs.bottom - rc.bottom),
      } : null,
    });
  }
  const d = document.querySelector('dialog.visionneuse');
  if (d) {
    const cd = getComputedStyle(d);
    const contenu = d.querySelector('.visionneuse-contenu');
    const cc = contenu ? getComputedStyle(contenu) : null;
    out.visionneuse = {
      ouverte: d.open, display: cd.display, padding: cd.padding, background: cd.backgroundColor,
      enfants: [...d.children].map((e) => ({ balise: e.tagName.toLowerCase(), classe: e.className, texte: (e.textContent || '').trim().slice(0, 40), position: getComputedStyle(e).position })),
      contenuPadding: cc ? { top: px(cc.paddingTop), right: px(cc.paddingRight), bottom: px(cc.paddingBottom), left: px(cc.paddingLeft) } : null,
      boutons: [...d.querySelectorAll('button')].map((b) => { const c = getComputedStyle(b); return { classe: b.className, position: c.position, left: c.left, right: c.right, top: c.top, texte: (b.textContent || '').trim(), ariaLabel: b.getAttribute('aria-label') }; }),
    };
  }
  // Interlignes : tout élément visible ayant du texte direct, dont line-height / font-size < 1,3
  const marcheur = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  const vus = new Set();
  for (let el = marcheur.nextNode(); el; el = marcheur.nextNode()) {
    if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'NOSCRIPT'].includes(el.tagName)) continue;
    const texteDirect = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ');
    if (!texteDirect) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    const lhBrut = cs.lineHeight;
    const lh = lhBrut === 'normal' ? NaN : parseFloat(lhBrut);
    const ratio = lh / fs;
    if (!(ratio < 1.3) && lhBrut !== 'normal') continue;
    const cle = el.tagName + '.' + el.className + '|' + lhBrut + '|' + cs.fontSize;
    if (vus.has(cle)) continue;
    vus.add(cle);
    out.interlignesSerres.push({
      balise: el.tagName.toLowerCase(), classe: String(el.className).slice(0, 50), texte: texteDirect.slice(0, 45),
      fontSize: px(fs), lineHeight: lhBrut === 'normal' ? 'normal' : px(lh), ratio: lhBrut === 'normal' ? 'normal' : Math.round(ratio * 1000) / 1000,
      multiLigne: lhBrut === 'normal' ? null : r.height > lh * 1.5,
    });
  }
  out.overlay = {
    noeudsImpeccable: document.querySelectorAll('[class*="impeccable" i],[id*="impeccable" i],[data-impeccable],impeccable-overlay,[class*="imp-" i]').length,
    globalesImpeccable: Object.keys(window).filter((k) => /impeccable|detect/i.test(k)),
    scriptsDetect: [...document.scripts].filter((s) => /detect\.js/.test(s.src)).map((s) => s.src),
  };
  return out;
}

const navigateur = await lancer(chromium);
const resultats = [];
try {
  for (const n of [1, 2]) {
    const url = `${basePages}/template-${n}/index.html`;
    const contexte = await navigateur.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
    const page = await contexte.newPage();
    const consoleMessages = [];
    const erreursPage = [];
    const requetesEchouees = [];
    const reponsesErreur = [];
    page.on('console', (m) => consoleMessages.push({ type: m.type(), texte: m.text(), source: m.location()?.url || '' }));
    page.on('pageerror', (e) => erreursPage.push(String((e && e.stack) || e)));
    page.on('requestfailed', (r) => requetesEchouees.push({ url: r.url(), erreur: r.failure() && r.failure().errorText }));
    page.on('response', (r) => { if (r.status() >= 400) reponsesErreur.push({ url: r.url(), statut: r.status() }); });

    const resultat = { template: n, url };
    try {
      const reponse = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      resultat.statutHttp = reponse ? reponse.status() : null;
      await page.waitForTimeout(800);
      resultat.titre = await page.title();

      // 1. L'injection est-elle possible ? (modifier document.title, ajouter une balise <script>)
      resultat.testInjection = await page.evaluate(() => {
        const avant = document.title;
        document.title = avant + ' [test injection]';
        const titreModifie = document.title !== avant;
        const s = document.createElement('script');
        s.textContent = 'window.__testInjectionImpeccable = 42;';
        document.head.appendChild(s);
        const scriptExecute = window.__testInjectionImpeccable === 42;
        document.title = avant;
        s.remove();
        return { titreModifiable: titreModifie, scriptExecute, possible: titreModifie && scriptExecute };
      });

      // 2. Injection de detect.js
      const nbConsoleAvant = consoleMessages.length;
      try {
        await page.addScriptTag({ url: `${base}/detect.js` });
        resultat.injectionDetect = { ok: true, url: `${base}/detect.js` };
      } catch (e) {
        resultat.injectionDetect = { ok: false, url: `${base}/detect.js`, erreur: String(e && e.message || e) };
      }
      await page.waitForTimeout(3000);
      resultat.consoleImpeccable = consoleMessages.filter((m) => /impeccable/i.test(m.texte));
      resultat.consoleApresInjection = consoleMessages.slice(nbConsoleAvant);

      // 3. Capture avec l'overlay
      const capture = path.join(dossierCaptures, `overlay-template-${n}.png`);
      await page.screenshot({ path: capture, fullPage: false });
      resultat.capture = capture;
      if (process.env.PLEINE_PAGE) {
        // Les éléments signalés sont sous la ligne de flottaison : capture pleine page pour voir les marqueurs de l'overlay.
        const capturePage = path.join(dossierCaptures, `overlay-template-${n}-page.png`);
        await page.screenshot({ path: capturePage, fullPage: true });
        resultat.capturePleinePage = capturePage;
      }

      // 3 bis. Constats structurés via l'API exposée par detect.js (window.impeccableDetectAsync, etc.)
      resultat.apiDetect = await page.evaluate(async () => {
        const fn = window.impeccableDetectAsync || window.impeccableDetect || window.impeccableScanAsync || window.impeccableScan;
        if (!fn) return { disponible: false, erreurCoeur: window.__impeccableCoreError || null };
        let r;
        try { r = await fn(); } catch (e) { return { disponible: true, erreur: String(e) }; }
        const sel = (el) => {
          if (!el || !el.tagName) return null;
          let s = el.tagName.toLowerCase();
          if (el.id) s += '#' + el.id;
          else if (typeof el.className === 'string' && el.className.trim()) s += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
          const texte = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
          return texte ? `${s} « ${texte} »` : s;
        };
        const nettoyer = (v, prof = 0) => {
          if (prof > 5) return '…';
          if (v && v.nodeType) return sel(v);
          if (Array.isArray(v)) return v.map((x) => nettoyer(x, prof + 1));
          if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v)) o[k] = nettoyer(v[k], prof + 1); return o; }
          if (typeof v === 'function') return '[fonction]';
          return v;
        };
        return { disponible: true, fonction: fn.name || 'anonyme', resultat: nettoyer(r) };
      });

      // 4. Mesures de contrôle des constats CLI
      resultat.mesures = await page.evaluate(mesurer, SECTIONS);

      // 5. Visionneuse ouverte : mesure réelle des retraits (puis refermée)
      resultat.visionneuseOuverte = await page.evaluate(() => {
        const d = document.querySelector('dialog.visionneuse');
        if (!d) return null;
        try { d.showModal(); } catch (e) { return { erreur: String(e) }; }
        const rd = d.getBoundingClientRect();
        const contenu = d.querySelector('.visionneuse-contenu');
        const rc = contenu.getBoundingClientRect();
        const cc = getComputedStyle(contenu);
        const boutons = [...d.querySelectorAll('button')].map((b) => { const r = b.getBoundingClientRect(); return { classe: b.className, gauche: Math.round(r.left - rd.left), droite: Math.round(rd.right - r.right), haut: Math.round(r.top - rd.top), largeur: Math.round(r.width) }; });
        const legende = d.querySelector('.visionneuse-legende').getBoundingClientRect();
        const res = {
          ouverte: d.open, dialogPadding: getComputedStyle(d).padding, largeurDialog: Math.round(rd.width),
          contenuPadding: { top: cc.paddingTop, right: cc.paddingRight, bottom: cc.paddingBottom, left: cc.paddingLeft },
          retraitContenuGauche: Math.round(rc.left - rd.left), retraitContenuDroite: Math.round(rd.right - rc.right),
          boutons,
          legendeVide: !d.querySelector('.visionneuse-legende').textContent.trim(),
          legendeLargeur: Math.round(legende.width),
        };
        return res;
      });
      if (resultat.visionneuseOuverte && resultat.visionneuseOuverte.ouverte) {
        await page.screenshot({ path: path.join(dossierCaptures, `overlay-template-${n}-visionneuse.png`), fullPage: false });
        await page.evaluate(() => document.querySelector('dialog.visionneuse').close());
      }
    } catch (e) {
      resultat.erreurScript = String((e && e.stack) || e);
    }
    resultat.erreursPage = erreursPage;
    resultat.requetesEchouees = requetesEchouees;
    resultat.reponsesErreur = reponsesErreur;
    resultat.consoleErreurs = consoleMessages.filter((m) => m.type === 'error' || m.type === 'warning');
    resultat.consoleTotal = consoleMessages.length;
    resultat.consoleTout = consoleMessages;
    resultats.push(resultat);
    await contexte.close();
  }
} finally {
  await navigateur.close();
}

const sortie = path.join(ici, 'navigateur-detect-resultat.json');
await writeFile(sortie, JSON.stringify(resultats, null, 2), 'utf8');
console.log(JSON.stringify(resultats, null, 2));
console.error(`Résultat écrit dans ${sortie}`);
