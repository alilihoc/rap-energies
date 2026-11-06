// La mosaïque du template 1 reçoit ses portées depuis le gabarit (variable --c, classe .large) pour accepter
// un nombre quelconque de réalisations ajoutées par l'administration.
import { readFileSync, writeFileSync } from 'node:fs';
const f = 'src/template-1/style.css';
let s = readFileSync(f, 'utf8');
const R = [
  [`.galerie li:nth-child(1), .galerie li:nth-child(2), .galerie li:nth-child(6), .galerie li:nth-child(7) { grid-column: span 3; }
.galerie li:nth-child(3), .galerie li:nth-child(4), .galerie li:nth-child(5) { grid-column: span 2; }
.galerie li:nth-child(8) { grid-column: span 6; }`, `.galerie li { grid-column: span var(--c, 2); }`],
  ['.galerie li:nth-child(8) picture { aspect-ratio: 21 / 9; }', '.galerie li.large picture { aspect-ratio: 21 / 9; }'],
  [`  .galerie li:nth-child(n) { grid-column: span 1; }
  .galerie li:nth-child(8) { grid-column: span 2; }
  .galerie li:nth-child(8) picture { aspect-ratio: 16 / 9; }`, `  .galerie li { grid-column: span 1; }
  .galerie li.large { grid-column: span 2; }
  .galerie li.large picture { aspect-ratio: 16 / 9; }`],
  [`  .galerie li:nth-child(8) { grid-column: span 1; }
  .galerie li:nth-child(8) picture { aspect-ratio: 4 / 3; }`, `  .galerie li.large { grid-column: span 1; }
  .galerie li.large picture { aspect-ratio: 4 / 3; }`],
];
for (const [a, b] of R) { if (!s.includes(a)) console.log('ABSENT :', a.slice(0, 60)); s = s.replace(a, b); }
writeFileSync(f, s);
console.log(f, 'ok');
