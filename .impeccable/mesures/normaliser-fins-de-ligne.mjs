// Remet les fichiers sources en fins de ligne LF (les patchs Python sous Windows ont écrit du CRLF).
import { readFileSync, writeFileSync } from 'node:fs';
const fichiers = ['src/template-1/style.css', 'src/template-2/style.css', 'src/contenu.mjs', 'outils/images.mjs', 'outils/logo.mjs', 'docs/images.md'];
for (const f of fichiers) {
  const s = readFileSync(f, 'utf8');
  const n = (s.match(/\r\n/g) || []).length;
  if (n) writeFileSync(f, s.replace(/\r\n/g, '\n'));
  console.log(f, n ? `${n} CRLF → LF` : 'déjà LF');
}
