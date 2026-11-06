// Contraste WCAG de paires texte/fond : node contraste.mjs '#texte' '#fond' ['#texte' '#fond' ...]
// Imprime le rapport de chaque paire (4,5:1 minimum pour le texte courant, 3:1 pour le grand texte).
const lum = (hex) => {
  const c = hex
    .replace('#', '')
    .match(/\w\w/g)
    .map((x) => parseInt(x, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const rapport = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return ((x + 0.05) / (y + 0.05)).toFixed(2);
};
const args = process.argv.slice(2);
if (args.length < 2 || args.length % 2) {
  console.error("usage : node contraste.mjs '#texte' '#fond' ['#texte' '#fond' ...]");
  process.exit(1);
}
for (let i = 0; i < args.length; i += 2) console.log(`${args[i]} sur ${args[i + 1]} : ${rapport(args[i], args[i + 1])}:1`);
