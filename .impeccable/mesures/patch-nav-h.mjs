// R3 (relecteur template 2) : repli CSS de --nav-h par palier, pour l'état sans script.
import { readFileSync, writeFileSync } from 'node:fs';
const cibles = { 'src/template-1/style.css': '4.5rem', 'src/template-2/style.css': '6.625rem' };
for (const [f, h320] of Object.entries(cibles)) {
  let s = readFileSync(f, 'utf8');
  const a = '  .bandeau { position: sticky; top: calc(-1 * var(--nav-h, 2.75rem)); }';
  const b = '  .bandeau { --nav-h: 4.5rem; position: sticky; top: calc(-1 * var(--nav-h)); }';
  if (!s.includes(a)) console.log('ABSENT', f, 'bloc 40rem');
  s = s.replace(a, b);
  const c = '@media (max-width: 22.5rem) {\n';
  if (!s.includes(c)) console.log('ABSENT', f, 'bloc 22.5rem');
  s = s.replace(c, `${c}  .bandeau { --nav-h: ${h320}; }\n`);
  writeFileSync(f, s);
  console.log(f, 'ok');
}
