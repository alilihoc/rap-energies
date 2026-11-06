// Résumé lisible d'un rapport impeccable detect --json : node detect-liste.mjs <rapport.json>
import { readFileSync } from 'node:fs';
import { basename, dirname } from 'node:path';
const d = JSON.parse(readFileSync(process.argv[2], 'utf8'));
console.log('findings :', d.length);
for (const x of d) console.log(x.severity, '|', basename(dirname(x.file)), '|', x.antipattern, '|', String(x.snippet || '').slice(0, 150).replace(/\n/g, ' '));
