// Vérifie les manipulations d'un template : visionneuse (ouverture, flèche, fermeture), replis, formulaire.
//   node interactions.mjs <url> <dossier-de-sortie>
import { chromium } from 'playwright';
import { lancer } from './navigateur.mjs';
const [url, dir] = process.argv.slice(2);
const b = await lancer(chromium);
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const erreurs = [];
p.on('pageerror', (e) => erreurs.push('pageerror: ' + e.message));
p.on('console', (m) => { if (m.type() === 'error') erreurs.push('console: ' + m.text()); });
await p.goto(url, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(1500);
// Visionneuse
await p.locator('.photo-lien').nth(2).click();
await p.waitForTimeout(600);
const ouverte = await p.evaluate(() => document.querySelector('.visionneuse').open);
const compteur1 = await p.locator('.visionneuse-compteur').innerText();
await p.screenshot({ path: `${dir}/visionneuse.png` });
await p.keyboard.press('ArrowRight');
await p.waitForTimeout(300);
const compteur2 = await p.locator('.visionneuse-compteur').innerText();
const legende = await p.locator('.visionneuse-legende').innerText();
await p.keyboard.press('Escape');
await p.waitForTimeout(300);
const fermee = await p.evaluate(() => !document.querySelector('.visionneuse').open);
const focusRetour = await p.evaluate(() => document.activeElement?.className);
// Replis
await p.locator('details summary').first().click();
await p.waitForTimeout(400);
const details = await p.evaluate(() => document.querySelector('details').open);
await p.locator('#questions').screenshot({ path: `${dir}/questions-ouverte.png` });
// Bandeau réduit
await p.evaluate(() => scrollTo(0, 600));
await p.waitForTimeout(600);
const reduite = await p.evaluate(() => document.querySelector('.bandeau').classList.contains('reduite'));
await p.screenshot({ path: `${dir}/bandeau-reduit.png`, clip: { x: 0, y: 0, width: 1440, height: 80 } });
// Formulaire : validation puis envoi (mailto : la navigation est ignorée en headless, l'état de confirmation doit s'afficher)
await p.locator('#contact').scrollIntoViewIfNeeded();
await p.locator('.bouton-envoyer').click();
await p.waitForTimeout(300);
const invalide = await p.evaluate(() => document.activeElement?.id);
await p.fill('#f-nom', 'Test Relecture');
await p.fill('#f-tel', '06 00 00 00 00');
await p.fill('#f-commune', 'Castries');
await p.locator('.cases input').first().check();
await p.locator('.bouton-envoyer').click();
await p.waitForTimeout(800);
const etat = await p.evaluate(() => { const e = document.querySelector('.form-etat'); return { hidden: e.hidden, texte: e.textContent, formCache: document.querySelector('.formulaire').hidden }; });
await p.locator('#contact').screenshot({ path: `${dir}/formulaire-envoye.png` });
console.log(JSON.stringify({ visionneuseOuverte: ouverte, compteur1, compteur2, legende, fermee, focusRetour, detailsOuvert: details, bandeauReduit: reduite, premierChampInvalide: invalide, etat, erreurs }, null, 1));
await b.close();
