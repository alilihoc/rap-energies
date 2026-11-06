// Lot de corrections CSS issu des deux relectures de finition (30/10/2026). Idempotent : signale les motifs absents.
import { readFileSync, writeFileSync } from 'node:fs';
function patch(path, pairs) {
  let s = readFileSync(path, 'utf8');
  for (const [a, b] of pairs) {
    if (!s.includes(a)) { console.log(`ABSENT ${path} : ${a.slice(0, 70)}`); continue; }
    s = s.replace(a, b);
  }
  writeFileSync(path, s);
  console.log(path, 'ok');
}
const BANDEAU_MOBILE_AVANT = `  .bandeau { position: static; }
  .bandeau-grille { grid-template-columns: 1fr auto; gap: 0.5rem 1rem; padding-top: 0.75rem; padding-bottom: 0.75rem; }
  .marque { font-size: 1.05rem; grid-row: 1; grid-column: 1; }
  .marque img { width: 2.25rem; height: 2.25rem; }
  .tel { grid-row: 1; grid-column: 2; }
  .nav { grid-row: 2; grid-column: 1 / -1; }
  .nav ul { display: grid; grid-template-columns: 1fr 1fr; gap: 0.1rem 1rem; justify-content: start; }
  .tel { justify-self: end; font-size: 0.95rem; }`;
const BANDEAU_MOBILE_APRES = `  /* La rangée des ancres défile avec la page (top négatif), la marque et le téléphone restent collés. */
  .bandeau { position: sticky; top: -2.75rem; }
  .bandeau-grille { grid-template-columns: 1fr auto; grid-template-rows: 2.75rem 3.5rem; gap: 0 1rem; padding-top: 0; padding-bottom: 0; min-height: 0; }
  .nav { grid-row: 1; grid-column: 1 / -1; height: 2.75rem; display: flex; align-items: center; overflow-x: auto; scrollbar-width: none; }
  .nav::-webkit-scrollbar { display: none; }
  .nav ul { display: flex; flex-wrap: nowrap; gap: 1.25rem; white-space: nowrap; padding-right: var(--marge); justify-content: start; }
  .nav a { padding: 0.25rem 0; }
  .marque { font-size: 1.05rem; grid-row: 2; grid-column: 1; }
  .marque img { width: 2.25rem; height: 2.25rem; }
  .tel { grid-row: 2; grid-column: 2; justify-self: end; font-size: 0.95rem; }`;
const SENTINELLE = ['.sentinelle { position: absolute; top: 0; height: 1px; width: 1px; }', '.sentinelle { position: absolute; top: 0; left: 0; height: 4.5rem; width: 1px; pointer-events: none; }'];
const CASES = (couleur) => `.cases input { appearance: none; width: 1.25rem; height: 1.25rem; margin: 0; flex: none; border: 2px solid ${couleur}; background: transparent; display: grid; place-content: center; cursor: pointer; }
.cases input::before { content: ""; width: 0.65rem; height: 0.65rem; background: ${couleur}; transform: scale(0); transition: transform 0.12s var(--sortie); }
.cases input:checked::before { transform: scale(1); }`;

patch('src/template-1/style.css', [
  SENTINELLE,
  ['::selection { background: var(--soleil); color: var(--encre); }', '::selection { background: var(--encre); color: var(--fond); }'],
  ['.contact :focus-visible, .pied :focus-visible, .visionneuse :focus-visible { outline-color: var(--soleil); }', '.contact :focus-visible, .pied :focus-visible, .visionneuse :focus-visible { outline-color: var(--fond); }'],
  ['.note { color: var(--second); font-size: 0.95rem; }', '.note { color: var(--second); font-size: 0.95rem; }\nli::marker { color: var(--second); }\ninput, textarea { caret-color: var(--encre); }'],
  ['.bouton-envoyer { background: var(--soleil); color: var(--encre); border-color: var(--soleil); }\n.bouton-envoyer:hover { background: #e3a40c; border-color: #e3a40c; }', '.bouton-envoyer { background: var(--fond); color: var(--encre); border-color: var(--fond); }\n.bouton-envoyer:hover { background: #e9e6df; border-color: #e9e6df; }'],
  ['.accroche { padding-top: clamp(1.75rem, 4vw, 2.5rem); }', '.accroche { padding-top: clamp(1.5rem, 3vw, 2rem); }'],
  ['.tryptique { list-style: none; padding: 0; margin: clamp(1.75rem, 3vw, 2.25rem) 0 0; display: grid; grid-template-columns: 5fr 4fr 3fr; }', '.tryptique { list-style: none; padding: 0; margin: clamp(1.5rem, 2.5vw, 1.75rem) 0 0; display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 4fr) minmax(0, 3fr); }'],
  ['font: 800 clamp(1.3rem, 0.95rem + 1.3vw, 2.1rem)/1.05 var(--titres); letter-spacing: -0.02em; text-wrap: balance; }', 'font: 800 clamp(1.2rem, 0.85rem + 1vw, 1.8rem)/1.05 var(--titres); letter-spacing: -0.02em; text-wrap: balance; hyphens: auto; }'],
  ['.tryptique li:last-child .nom { padding-right: max(var(--marge), calc((100vw - var(--largeur)) / 2)); }', '.tryptique li:last-child .nom { padding-right: var(--marge); }'],
  ['.visionneuse button:hover { background: var(--soleil); }', '.visionneuse button:hover { background: var(--filet); }'],
  ['.ensemble { margin-top: 2.5rem; padding-top: 2.5rem; border-top: 1px solid var(--filet); max-width: 52rem; }', '.ensemble { margin-top: 2.5rem; padding-top: 2.5rem; border-top: 1px solid var(--filet); }\n.ensemble h3, .ensemble p { max-width: 52rem; }'],
  ['.communes li:first-child { background: var(--soleil); padding: 0 0.3em; }', '.communes li:first-child { background: var(--encre); color: var(--fond); padding: 0 0.3em; }'],
  ['.cases input { width: 1.25rem; height: 1.25rem; accent-color: var(--soleil); margin: 0; }', CASES('var(--sur-encre)')],
  ['.form-etat { grid-column: 1 / -1; margin: 1.5rem 0 0; padding: 1rem 1.25rem; background: var(--soleil); color: var(--encre); font-weight: 600; }\n.form-etat.erreur { background: var(--fond); }', '.form-etat { grid-column: 1 / -1; margin: 1.5rem 0 0; padding: 1rem 1.25rem; background: var(--fond); color: var(--encre); font-weight: 600; }\n.form-etat.info { background: transparent; color: var(--sur-encre); border: 1px solid var(--sur-encre-second); }'],
  [BANDEAU_MOBILE_AVANT, BANDEAU_MOBILE_APRES],
  ['.graphique-vertical .barres li { display: grid; grid-template-columns: 2rem 1fr 3rem;', '.graphique-vertical .barres li { display: grid; grid-template-columns: 3.4rem 1fr 3rem;'],
]);

patch('src/template-2/style.css', [
  SENTINELLE,
  ['.accroche { position: relative; min-height: calc(100vh - 4.5rem); min-height: calc(100dvh - 4.5rem); display: grid; align-items: end; }', '.accroche { position: relative; min-height: calc(100vh - 4.5rem); min-height: calc(100dvh - 4.5rem); display: grid; align-items: end; padding-top: 0; padding-bottom: 0; }'],
  ['.galerie figure { margin: 0; background: var(--nuit-relevee); border: 1px solid var(--filet); padding: 0.6rem 0.6rem 0.9rem; height: 100%; }', '.galerie figure { margin: 0; }'],
  ['.photo-lien { display: block; }', '.photo-lien { display: block; padding: 0.6rem; background: var(--nuit-relevee); border: 1px solid var(--filet); }'],
  ['padding: 0.75rem 0.3rem 0; font: 400 0.95rem/1.4 var(--ui); color: var(--creme-eteinte); }', 'padding: 0.75rem 0.1rem 0; font: 400 0.95rem/1.4 var(--ui); color: var(--creme-eteinte); }'],
  ['.note { color: var(--creme-eteinte); font-size: 0.95rem; }', '.note { color: var(--creme-eteinte); font-size: 0.95rem; }\nli::marker { color: var(--creme-eteinte); }\ninput, textarea { caret-color: var(--ambre); }'],
  ['.cases input { width: 1.25rem; height: 1.25rem; accent-color: var(--nuit); margin: 0; }', CASES('var(--nuit)')],
  ['.form-etat.erreur { background: var(--creme); color: var(--encre); }', '.form-etat.erreur { background: var(--creme); color: var(--encre); }\n.form-etat.info { background: transparent; color: var(--encre); border: 1px solid var(--encre); }'],
  ['.accroche-photo { position: static; height: 52vh; min-height: 18rem; }', '.accroche-photo { position: static; height: 40vh; min-height: 14rem; }'],
  ['.graphique-horizontal .barres li { grid-template-columns: 2rem 1fr 3rem; gap: 0.6rem; }', '.graphique-horizontal .barres li { grid-template-columns: 3.4rem 1fr 3rem; gap: 0.6rem; }'],
  [BANDEAU_MOBILE_AVANT, BANDEAU_MOBILE_APRES],
]);
