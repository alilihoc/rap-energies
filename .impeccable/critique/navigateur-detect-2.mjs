// Preuves navigateur, passe 2 (assessment B) : pour chaque template servi en local, onglet neuf,
// test d'injection (document.title et <script>), injection de /detect.js du live-server impeccable,
// attente 3 s, relevé de la console (messages « impeccable », erreurs), requêtes échouées, captures,
// puis mesures dans la page de ce que le CLI affirme (retraits des sections, visionneuse, interlignes,
// repères <mark class="pl">, axe du graphique, longueur de ligne).
// Usage : node .impeccable/critique/navigateur-detect-2.mjs PORT_DETECT [BASE_PAGES]
//   PORT_DETECT : port du live-server impeccable (sert /detect.js, mais pas le projet).
//   BASE_PAGES  : origine qui sert la racine du projet (défaut : la même que detect.js).
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lancer } from '../outils/navigateur.mjs';

const port = process.argv[2] || process.env.PORT;
if (!port) {
  console.error('Usage : node navigateur-detect-2.mjs PORT_DETECT [BASE_PAGES]');
  process.exit(1);
}
const base = `http://localhost:${port}`;
const basePages = (process.argv[3] || base).replace(/\/$/, '');
const ici = path.dirname(fileURLToPath(import.meta.url));
const dossierCaptures = path.join(ici, 'captures-2');
const sortie = path.join(ici, 'navigateur-detect-2-resultat.json');
await mkdir(dossierCaptures, { recursive: true });

const SECTIONS = ['services', 'etapes', 'zone', 'pourquoi', 'faq', 'contact'];

// Mesures faites dans la page : retraits réels des sections et de leur .colonne, visionneuse fermée,
// éléments dont line-height / font-size < 1,3 (ou line-height « normal »), repères mark.pl, axe du graphique,
// longueur de ligne des blocs de texte, nœuds ajoutés par l'overlay.
function mesurer(sections) {
  const px = (v) => Math.round(parseFloat(v) * 100) / 100;
  const sel = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    else if (typeof el.className === 'string' && el.className.trim()) s += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
    return s;
  };
  const out = { sections: [], visionneuseFermee: null, interlignesSerres: [], marques: null, axeGraphique: null, longueursDeLigne: [], overlay: null };
  const main = document.querySelector('main');
  for (const cls of sections) {
    const s = document.querySelector(`main > section.${cls}`);
    if (!s) { out.sections.push({ section: cls, absente: true }); continue; }
    const cs = getComputedStyle(s);
    const colonne = s.querySelector(':scope > .colonne');
    const rs = s.getBoundingClientRect();
    const rc = colonne ? colonne.getBoundingClientRect() : null;
    const h2 = s.querySelector('h2');
    const rh = h2 ? h2.getBoundingClientRect() : null;
    out.sections.push({
      section: cls,
      enfantDirectDeMain: s.parentElement === main,
      paddingTop: px(cs.paddingTop), paddingBottom: px(cs.paddingBottom),
      paddingLeft: px(cs.paddingLeft), paddingRight: px(cs.paddingRight),
      borderTop: cs.borderTopWidth + ' ' + cs.borderTopColor,
      background: cs.backgroundColor,
      colonne: rc ? { largeur: px(rc.width), retraitGauche: px(rc.left - rs.left), retraitDroite: px(rs.right - rc.right), retraitHaut: px(rc.top - rs.top), retraitBas: px(rs.bottom - rc.bottom) } : null,
      premierTitre: rh ? { texte: h2.textContent.trim().slice(0, 40), distanceHaut: px(rh.top - rs.top), distanceGauche: px(rh.left - rs.left) } : null,
    });
  }
  const d = document.querySelector('dialog.visionneuse');
  if (d) {
    const cd = getComputedStyle(d);
    const contenu = d.querySelector('.visionneuse-contenu');
    const cc = contenu ? getComputedStyle(contenu) : null;
    out.visionneuseFermee = {
      ouverte: d.open, display: cd.display, padding: cd.padding, background: cd.backgroundColor,
      enfants: [...d.children].map((e) => ({ balise: e.tagName.toLowerCase(), classe: e.className, texte: (e.textContent || '').trim().slice(0, 40), position: getComputedStyle(e).position })),
      contenuPadding: cc ? { top: cc.paddingTop, right: cc.paddingRight, bottom: cc.paddingBottom, left: cc.paddingLeft } : null,
    };
  }
  // Interlignes : tout élément visible ayant du texte direct, dont line-height / font-size < 1,3 (calcul brut, comme un détecteur)
  const marcheur = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  const vus = new Set();
  for (let el = marcheur.nextNode(); el; el = marcheur.nextNode()) {
    if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'NOSCRIPT'].includes(el.tagName)) continue;
    const noeudsTexte = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
    if (!noeudsTexte.length) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    const lhBrut = cs.lineHeight;
    const normal = lhBrut === 'normal';
    const lh = normal ? NaN : parseFloat(lhBrut);
    const ratio = lh / fs;
    if (!normal && !(ratio < 1.3)) continue;
    const cle = sel(el) + '|' + lhBrut + '|' + cs.fontSize;
    if (vus.has(cle)) continue;
    vus.add(cle);
    const range = document.createRange();
    range.selectNodeContents(noeudsTexte[0]);
    const rects = range.getClientRects();
    out.interlignesSerres.push({
      selecteur: sel(el), texte: noeudsTexte.map((n) => n.textContent.trim()).join(' ').slice(0, 45),
      fontSize: px(fs), lineHeight: normal ? 'normal' : lhBrut, ratioBrut: normal ? 'normal' : ratio, ratio: normal ? 'normal' : Math.round(ratio * 1000) / 1000,
      nbLignesTexte: rects.length, hauteurElement: px(r.height), multiLigne: normal ? rects.length > 1 : r.height > lh * 1.5,
    });
  }
  // Repères provisoires <mark class="pl"> : espace vertical réel entre le texte et le bord du fond coloré
  const marques = [...document.querySelectorAll('mark.pl')];
  const marquesVisibles = marques.filter((m) => m.getClientRects().length > 0);
  const parTaille = {};
  for (const m of marquesVisibles) { const k = getComputedStyle(m).fontSize; parTaille[k] = (parTaille[k] || 0) + 1; }
  out.marques = {
    total: marques.length, visibles: marquesVisibles.length, parTaille,
    exemples: marquesVisibles.slice(0, 3).map((m) => { const cs = getComputedStyle(m); return { texte: m.textContent.trim().slice(0, 40), fontSize: cs.fontSize, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, paddingLeft: cs.paddingLeft, background: cs.backgroundColor, display: cs.display, parent: sel(m.parentElement) }; }),
  };
  // Axe du graphique : distance entre le bas du texte des mois et le filet bas de <ol class="barres">
  const barres = document.querySelector('.barres');
  if (barres) {
    const cb = getComputedStyle(barres);
    const rb = barres.getBoundingClientRect();
    const mois = barres.querySelector('li .mois');
    let texte = null;
    if (mois) {
      const rg = document.createRange();
      rg.selectNodeContents(mois);
      const rr = rg.getBoundingClientRect();
      const cm = getComputedStyle(mois);
      const rm = mois.getBoundingClientRect();
      const filetHaut = rb.bottom - parseFloat(cb.borderBottomWidth);
      texte = { hauteurBoite: px(rm.height), paddingTop: cm.paddingTop, paddingBottom: cm.paddingBottom, lineHeight: cm.lineHeight, fontSize: cm.fontSize, basTexteVersFilet: px(filetHaut - rr.bottom), basBoiteVersFilet: px(filetHaut - rm.bottom) };
    }
    out.axeGraphique = { selecteur: sel(barres), borderBottom: cb.borderBottomWidth + ' ' + cb.borderBottomColor, paddingBottom: cb.paddingBottom, display: cb.display, mois: texte };
  }
  // Longueur de ligne : blocs de texte sans enfant bloc, rendus sur ≥ 2 lignes, plus de 75 caractères par ligne
  for (const el of document.querySelectorAll('p, li, dd, dt, figcaption, summary, h1, h2, h3, h4, b, span, a, legend, label, div')) {
    if (el.closest('dialog') || !el.textContent.trim()) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || !/block|list-item|flex|grid/.test(cs.display)) continue;
    if ([...el.children].some((c) => /block|grid|flex|list-item|table/.test(getComputedStyle(c).display))) continue;
    const rg = document.createRange();
    rg.selectNodeContents(el);
    const rects = [...rg.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
    if (!rects.length) continue;
    const lignes = new Set(rects.map((r) => Math.round(r.top / 8))).size;
    if (lignes < 2) continue;
    const nbCar = el.textContent.replace(/\s+/g, ' ').trim().length;
    const parLigne = Math.round(nbCar / lignes);
    if (parLigne > 75) out.longueursDeLigne.push({ selecteur: sel(el), lignes, caracteres: nbCar, parLigne, maxWidth: cs.maxWidth, largeur: px(el.getBoundingClientRect().width), fontSize: cs.fontSize, texte: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 50) });
  }
  // Overlay : nœuds ajoutés depuis l'instantané pris avant l'injection
  const nouveaux = window.__avantInjection ? [...document.querySelectorAll('*')].filter((e) => !window.__avantInjection.has(e)) : null;
  out.overlay = {
    nbNoeudsAjoutes: nouveaux ? nouveaux.length : null,
    noeudsAjoutes: nouveaux ? nouveaux.slice(0, 40).map((e) => ({ selecteur: sel(e), position: getComputedStyle(e).position, zIndex: getComputedStyle(e).zIndex, shadow: !!e.shadowRoot, parent: e.parentElement ? sel(e.parentElement) : null })) : null,
    noeudsNommesImpeccable: document.querySelectorAll('[class*="impeccable" i],[id*="impeccable" i],[data-impeccable],impeccable-overlay').length,
    globalesImpeccable: Object.keys(window).filter((k) => /impeccable|detect/i.test(k)),
    erreurCoeur: window.__impeccableCoreError ? String(window.__impeccableCoreError) : null,
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

    const resultat = { template: n, url, detectJs: `${base}/detect.js` };
    try {
      const reponse = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      resultat.statutHttp = reponse ? reponse.status() : null;
      await page.waitForTimeout(800);
      resultat.titre = await page.title();
      resultat.consoleAvantInjection = consoleMessages.length;

      // 1. L'injection est-elle possible ? (modifier document.title, exécuter une balise <script> ajoutée)
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
        window.__avantInjection = new Set(document.querySelectorAll('*'));
        return { titreModifiable: titreModifie, scriptExecute, possible: titreModifie && scriptExecute, nbElementsAvant: window.__avantInjection.size };
      });

      // 2. Injection de detect.js puis attente de 3 s
      const nbConsoleAvant = consoleMessages.length;
      try {
        await page.addScriptTag({ url: `${base}/detect.js` });
        resultat.injectionDetect = { ok: true };
      } catch (e) {
        resultat.injectionDetect = { ok: false, erreur: String((e && e.message) || e) };
      }
      await page.waitForTimeout(3000);
      resultat.consoleImpeccable = consoleMessages.filter((m) => /impeccable/i.test(m.texte));
      resultat.consoleApresInjection = consoleMessages.slice(nbConsoleAvant);

      // 3. Captures : fenêtre (overlay visible) et page entière
      const capture = path.join(dossierCaptures, `overlay-template-${n}.png`);
      await page.screenshot({ path: capture, fullPage: false });
      resultat.capture = capture;
      const capturePage = path.join(dossierCaptures, `overlay-template-${n}-page.png`);
      await page.screenshot({ path: capturePage, fullPage: true });
      resultat.capturePleinePage = capturePage;

      // 4. Constats structurés via l'API exposée par detect.js (window.impeccableDetectAsync, etc.)
      resultat.apiDetect = await page.evaluate(async () => {
        const cles = Object.keys(window).filter((k) => /impeccable|detect/i.test(k));
        const noms = ['impeccableDetectAsync', 'impeccableDetect', 'impeccableScanAsync', 'impeccableScan'];
        let fn = null, nomFn = null;
        for (const k of noms) if (typeof window[k] === 'function') { fn = window[k]; nomFn = k; break; }
        if (!fn) for (const k of cles) if (typeof window[k] === 'function') { fn = window[k]; nomFn = k; break; }
        if (!fn) return { disponible: false, cles, erreurCoeur: window.__impeccableCoreError ? String(window.__impeccableCoreError) : null };
        let r;
        try { r = await fn(); } catch (e) { return { disponible: true, fonction: nomFn, cles, erreur: String(e) }; }
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
        return { disponible: true, fonction: nomFn, cles, resultat: nettoyer(r) };
      });

      // 5. Mesures de contrôle des constats CLI
      resultat.mesures = await page.evaluate(mesurer, SECTIONS);

      // 6. Visionneuse ouverte : retraits réels, puis capture et fermeture
      resultat.visionneuseOuverte = await page.evaluate(() => {
        const d = document.querySelector('dialog.visionneuse');
        if (!d) return null;
        try { d.showModal(); } catch (e) { return { erreur: String(e) }; }
        const rd = d.getBoundingClientRect();
        const contenu = d.querySelector('.visionneuse-contenu');
        const rc = contenu.getBoundingClientRect();
        const cc = getComputedStyle(contenu);
        const boutons = [...d.querySelectorAll('button')].map((b) => { const r = b.getBoundingClientRect(); return { classe: b.className, gauche: Math.round(r.left - rd.left), droite: Math.round(rd.right - r.right), haut: Math.round(r.top - rd.top), largeur: Math.round(r.width), texte: b.textContent.trim(), ariaLabel: b.getAttribute('aria-label') }; });
        const legende = d.querySelector('.visionneuse-legende');
        const compteur = d.querySelector('.visionneuse-compteur');
        const rcpt = compteur.getBoundingClientRect();
        return {
          ouverte: d.open, dialogPadding: getComputedStyle(d).padding, largeurDialog: Math.round(rd.width), hauteurDialog: Math.round(rd.height),
          contenuPadding: { top: cc.paddingTop, right: cc.paddingRight, bottom: cc.paddingBottom, left: cc.paddingLeft },
          retraitContenuGauche: Math.round(rc.left - rd.left), retraitContenuDroite: Math.round(rd.right - rc.right),
          compteur: { texte: compteur.textContent.trim(), retraitGauche: Math.round(rcpt.left - rd.left), retraitDroite: Math.round(rd.right - rcpt.right), retraitBas: Math.round(rd.bottom - rcpt.bottom) },
          legendeVide: !legende.textContent.trim(),
          boutons,
        };
      });
      if (resultat.visionneuseOuverte && resultat.visionneuseOuverte.ouverte) {
        const captureV = path.join(dossierCaptures, `overlay-template-${n}-visionneuse.png`);
        await page.screenshot({ path: captureV, fullPage: false });
        resultat.captureVisionneuse = captureV;
        await page.evaluate(() => document.querySelector('dialog.visionneuse').close());
      }
    } catch (e) {
      resultat.erreurScript = String((e && e.stack) || e);
    }
    resultat.erreursPage = erreursPage;
    resultat.requetesEchouees = requetesEchouees;
    resultat.reponsesErreur = reponsesErreur;
    resultat.consoleErreursAvertissements = consoleMessages.filter((m) => m.type === 'error' || m.type === 'warning');
    resultat.consoleTotal = consoleMessages.length;
    resultat.consoleTout = consoleMessages;
    resultats.push(resultat);
    await contexte.close();
  }
} finally {
  await navigateur.close();
}

await writeFile(sortie, JSON.stringify(resultats, null, 2), 'utf8');
for (const r of resultats) {
  console.log(`template-${r.template} : HTTP ${r.statutHttp}, injection ${r.testInjection && r.testInjection.possible ? 'possible' : 'IMPOSSIBLE'}, detect.js ${r.injectionDetect && r.injectionDetect.ok ? 'chargé' : 'NON chargé'}, console « impeccable » ${r.consoleImpeccable ? r.consoleImpeccable.length : 0}, erreurs page ${r.erreursPage.length}, requêtes échouées ${r.requetesEchouees.length}, réponses >= 400 ${r.reponsesErreur.length}, nœuds ajoutés ${r.mesures && r.mesures.overlay ? r.mesures.overlay.nbNoeudsAjoutes : '?'}${r.erreurScript ? ', ERREUR SCRIPT' : ''}`);
}
console.error(`Résultat écrit dans ${sortie}`);
