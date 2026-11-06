import { readFileSync, writeFileSync } from 'node:fs';
const R = [
  ['docs/systemes/design-1.md', [
    ['(variable `--nav-h` posée par le script, 2,75 rem sans script)', '(variable `--nav-h` posée par le script, repli CSS 4,5 rem sans script)'],
    ['Verdict de la passe de notation : voir `REPRISE.md`.', 'Passes de verdict : huit corrections notées **resolved** (la condition des 35 % du triptyque a demandé une seconde passe : 36,2 % mesurés) ; régression relevée sur le repli sans script du bandeau mobile, fermée ensuite par des valeurs CSS de repli (`--nav-h`) et vérifiée par capture mobile sans script, non renotée (limite de deux tours du mode opératoire). Dernière disposition enregistrée du relecteur : fix, un seul point ouvert, celui-là.'],
  ]],
  ['docs/systemes/design-2.md', [
    ['Verdict de la passe de notation : voir `REPRISE.md`.', 'Passes de verdict : huit corrections notées **resolved**, puis les deux régressions du lot (journal des images, rangée d\'ancres coupée) notées **resolved** ; dernière régression relevée, le repli sans script de `--nav-h`, fermée ensuite par des valeurs CSS par palier (4,5 rem sous 40 rem, 6,625 rem sous 22,5 rem) et vérifiée par capture mobile sans script, non renotée (limite de deux tours). Dernière disposition enregistrée du relecteur : fix, un seul point ouvert, celui-là.'],
  ]],
  ['REPRISE.md', [
    ['Détail dans `docs/systemes/design-N.md`, section « Relecture de finition » ; verdicts ci-dessous.', 'Détail dans `docs/systemes/design-N.md`, section « Relecture de finition ». Verdicts : template 1, huit corrections resolved après deux passes (le triptyque devait atteindre 35 % du premier écran : 36,2 % obtenus) ; template 2, huit corrections resolved, puis deux régressions resolved. Dernier point relevé par les deux relecteurs : le repli sans JavaScript de la hauteur de la rangée d\'ancres mobile (`--nav-h`), fermé après leur second verdict par des valeurs CSS par palier et vérifié par captures mobiles sans script (`.impeccable/review/template-N/sans-js-mobile-defile-390.png` et `-320.png`), non renoté (limite de deux tours). Dernière disposition enregistrée : fix, ce seul point ouvert ; aucun ship prononcé, et un ship n\'aurait couvert que les corrections notées.'],
    ['les cinq ancres passent à la ligne (hauteur réelle reportée dans `--nav-h` par le script), leur rangée part avec la page', 'les cinq ancres passent à la ligne (hauteur réelle reportée dans `--nav-h` par le script, repli CSS 4,5 rem et 6,625 rem sous 22,5 rem pour le template 2), leur rangée part avec la page'],
  ]],
  ['DESIGN.md', [
    ['(variable `--nav-h`) : les ancres passent à la ligne', '(variable `--nav-h`, posée par le script avec un repli CSS par palier) : les ancres passent à la ligne'],
  ]],
];
for (const [f, pairs] of R) {
  let s = readFileSync(f, 'utf8');
  for (const [a, b] of pairs) { if (!s.includes(a)) console.log('ABSENT', f, ':', a.slice(0, 60)); s = s.replace(a, b); }
  writeFileSync(f, s);
  console.log(f, 'ok');
}
