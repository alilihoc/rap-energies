// Régression R2 relevée par le relecteur du template 2 : la rangée d'ancres mobile était coupée au milieu d'un mot.
// Les ancres passent à la ligne (jamais de coupe dans un mot) et le bandeau collant se décale de la hauteur réelle
// de la rangée (variable --nav-h posée par le script, 2,75 rem par défaut sans script).
import { readFileSync, writeFileSync } from 'node:fs';
const AVANT = `  .bandeau { position: sticky; top: -2.75rem; }
  .bandeau-grille { grid-template-columns: 1fr auto; grid-template-rows: 2.75rem 3.5rem; gap: 0 1rem; padding-top: 0; padding-bottom: 0; min-height: 0; }
  .nav { grid-row: 1; grid-column: 1 / -1; height: 2.75rem; display: flex; align-items: center; overflow-x: auto; scrollbar-width: none; }
  .nav::-webkit-scrollbar { display: none; }
  .nav ul { display: flex; flex-wrap: nowrap; gap: 1.25rem; white-space: nowrap; padding-right: var(--marge); justify-content: start; }
  .nav a { padding: 0.25rem 0; }`;
const APRES = `  .bandeau { position: sticky; top: calc(-1 * var(--nav-h, 2.75rem)); }
  .bandeau-grille { grid-template-columns: 1fr auto; grid-template-rows: auto 3.5rem; gap: 0 1rem; padding-top: 0; padding-bottom: 0; min-height: 0; }
  .nav { grid-row: 1; grid-column: 1 / -1; padding: 0.45rem 0 0.2rem; }
  .nav ul { display: flex; flex-wrap: wrap; gap: 0.1rem 1rem; white-space: nowrap; justify-content: start; font-size: 0.95rem; }
  .nav a { padding: 0.2rem 0; }`;
for (const f of ['src/template-1/style.css', 'src/template-2/style.css']) {
  const s = readFileSync(f, 'utf8');
  if (!s.includes(AVANT)) { console.log('ABSENT dans', f); continue; }
  writeFileSync(f, s.replace(AVANT, APRES));
  console.log(f, 'ok');
}
