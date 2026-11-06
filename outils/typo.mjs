// Typographie française : espaces insécables là où l'usage les demande, pour que les textes
// validés restent lisibles tels quels dans le code et ne cassent jamais avant une ponctuation.
//   fr(texte) → texte avec espaces insécables (fines avant ; ! ?, insécables avant : » et après «,
//   dans les nombres, les unités et le numéro de téléphone).
const FINE = ' '; // espace fine insécable, avant ; ! ?
const INSECABLE = ' '; // espace insécable

export function fr(texte) {
  if (typeof texte !== 'string') return texte;
  return texte
    .replace(/ ([;!?])/g, `${FINE}$1`)
    .replace(/ :/g, `${INSECABLE}:`)
    .replace(/« /g, `«${INSECABLE}`)
    .replace(/ »/g, `${INSECABLE}»`)
    // numéro de téléphone 06 99 34 66 86
    .replace(/(\d{2}) (\d{2}) (\d{2}) (\d{2}) (\d{2})/g, `$1${INSECABLE}$2${INSECABLE}$3${INSECABLE}$4${INSECABLE}$5`)
    // milliers : 1 500 kWh, 10 000 €
    .replace(/(\d) (\d{3})\b/g, `$1${INSECABLE}$2`)
    // unités et symboles
    .replace(/(\d) (kWh|kWc|km|€|%|px|h|m²|ans|personnes)/g, `$1${INSECABLE}$2`)
    .replace(/(\d) °/g, `$1${INSECABLE}°`)
    .replace(/n° /g, `n°${INSECABLE}`)
    .replace(/(\d{1,2}) (janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/g, `$1${INSECABLE}$2`);
}

// Convertit les crochets de suivi [À CONFIRMER …] / [À COMPLÉTER …] / [À VÉRIFIER …] en <mark>.
export function marques(html) {
  return html.replace(/\[À (CONFIRMER|COMPLÉTER|VÉRIFIER)([^\]]*)\]/g, (m, type, reste) => `<mark class="pl" title="À ${type.toLowerCase()} avec le client">[À ${type}${reste}]</mark>`);
}

// Échappement HTML des textes (les textes validés ne contiennent pas de balisage).
export function esc(texte) {
  return String(texte).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Texte prêt à insérer : échappé, typographié, crochets convertis.
export const t = (texte) => marques(esc(fr(texte)));
