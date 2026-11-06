// Documentation : la rangée d'ancres mobile passe à la ligne (plus de défilement horizontal).
import { readFileSync, writeFileSync } from 'node:fs';
const R = [
  ['docs/systemes/design-1.md', ["Sous 40 rem : toujours collant mais avec `top: -2.75rem`, la rangée des cinq ancres (une seule ligne défilante horizontalement) part avec la page et la rangée marque + téléphone reste visible", "Sous 40 rem : toujours collant, avec un `top` négatif égal à la hauteur réelle de la rangée des ancres (variable `--nav-h` posée par le script, 2,75 rem sans script) ; les cinq ancres passent à la ligne sans jamais se couper dans un mot, cette rangée part avec la page et la rangée marque + téléphone reste visible"]],
  ['docs/systemes/design-2.md', ["Sous 40 rem : collant avec `top: -2.75rem`, la rangée des ancres (une ligne défilante) part avec la page, la rangée marque + téléphone reste", "Sous 40 rem : collant avec un `top` négatif égal à la hauteur réelle de la rangée des ancres (`--nav-h` posée par le script), les ancres passent à la ligne sans se couper dans un mot, cette rangée part avec la page et la rangée marque + téléphone reste"]],
  ['DESIGN.md', ["Sous 40 rem, il reste collant avec un `top` négatif : la rangée des ancres (une ligne défilante) part avec la page, la rangée marque + téléphone reste visible.", "Sous 40 rem, il reste collant avec un `top` négatif égal à la hauteur réelle de la rangée des ancres (variable `--nav-h`) : les ancres passent à la ligne sans se couper dans un mot, cette rangée part avec la page, la rangée marque + téléphone reste visible."],
                ["sous 40 rem le bandeau n'est plus collant, marque et téléphone partagent une ligne, la navigation devient une grille de deux colonnes", "sous 40 rem le bandeau reste collant à `top` négatif, les ancres passent à la ligne au-dessus de la rangée marque + téléphone qui reste visible"]],
  ['.impeccable/design.json', ['"name": "bandeau à top négatif, ancres sur une rangée défilante"', '"name": "bandeau à top négatif, ancres à la ligne au-dessus de la rangée marque + téléphone"']],
  ['REPRISE.md', ["la rangée des cinq ancres (une ligne défilante horizontalement) part avec la page, la rangée marque + téléphone reste visible", "les cinq ancres passent à la ligne (hauteur réelle reportée dans `--nav-h` par le script), leur rangée part avec la page, la rangée marque + téléphone reste visible"]],
  ['docs/directions.md', ["collant avec un `top` négatif de la hauteur de la rangée des ancres (une ligne défilante horizontalement), si bien que", "collant avec un `top` négatif de la hauteur réelle de la rangée des ancres (ancres à la ligne, hauteur reportée dans `--nav-h` par le script), si bien que"]],
];
for (const [f, ...pairs] of R) {
  let s = readFileSync(f, 'utf8');
  for (const [a, b] of pairs) { if (!s.includes(a)) console.log('ABSENT', f, ':', a.slice(0, 60)); s = s.replace(a, b); }
  writeFileSync(f, s);
  console.log(f, 'ok');
}
