// Template 1, « Plein midi » : page claire, palette complète tirée du logo, triptyque bichromie en premier écran.
import { C, t, fr, tete, bandeau, boutons, picture, galerie, serviceCorps, ensemble, production, etapes, zone, pourquoi, questions, contact, pied, pageLegale, pagesMessage } from '../commun/composants.mjs';

const THEME = '#FCFBF7';

export function rendre({ dims, polices, endpoint = '' }) {
  const tri = [
    { nom: 'tri-panneaux', service: C.services.liste[0], alt: 'Panneaux photovoltaïques sur un toit de tuiles rouges', position: '50% 50%' },
    { nom: 'tri-pompe', service: C.services.liste[1], alt: 'Unité extérieure de pompe à chaleur près d\'un mur de maison et de plantes en pot', position: '40% 55%' },
    { nom: 'chauffe-eau-salle-de-bain', service: C.services.liste[2], alt: 'Chauffe-eau mural blanc dans une salle de bains carrelée', position: '18% 28%' },
  ];
  const tryptique = tri
    .map(
      (x, i) => `<li class="tri-${x.service.couleur}" style="--i:${i}"><a href="#${x.service.id}">${picture(x.nom, { alt: x.alt, sizes: '(min-width: 48rem) 42vw, 100vw', position: x.position, dims, eager: true })}<span class="nom">${t(x.service.titre)}</span></a></li>`,
    )
    .join('\n');

  // Chaque service reprend, en couleur, la photo de son volet du triptyque : la palette redescend dans la page.
  const services = C.services.liste
    .map((s, i) => {
      const x = tri[i];
      return `<article class="service service-${s.couleur}" id="${s.id}" aria-labelledby="t-${s.id}">
<div class="service-tete"><h3 id="t-${s.id}">${t(s.titre)}</h3>${picture(x.nom, { alt: x.alt, sizes: '(min-width: 64rem) 30vw, 100vw', position: x.position, dims })}</div>
<div class="service-corps">${serviceCorps(s)}</div>
</article>`;
    })
    .join('\n');

  const index = `${tete({ titre: C.seo.title, description: C.seo.description, canonical: C.seo.canonical, polices, jsonld: true }).replace('__THEME__', THEME)}
<body id="haut">
${bandeau({ logo: 'symbole-180.png' })}
<main id="contenu">
<section class="accroche" aria-labelledby="titre">
<div class="colonne accroche-texte">
<h1 id="titre">${t(C.accroche.titre)}</h1>
<p class="accroche-p">${t(C.accroche.texte)}</p>
${boutons()}
<p class="ligne">${t(C.accroche.ligne)}</p>
</div>
<ul class="tryptique" aria-label="Nos trois équipements">
${tryptique}
</ul>
</section>

${galerie({ dims, sizes: '(min-width: 75rem) 600px, (min-width: 48rem) 50vw, 100vw', mosaique: true })}

<section class="services" id="services" aria-labelledby="t-services">
<div class="colonne">
<h2 id="t-services">${t(C.services.titre)}</h2>
${services}
${ensemble()}
</div>
</section>

<figure class="bande">${picture('ombre-midi', { alt: 'Toit de tuiles rouges portant son ombre sur un mur blanc sous un ciel bleu', sizes: '100vw', position: '50% 60%', dims })}</figure>

${production({ orientation: 'vertical' })}

${etapes({ photo: { nom: 'mains-rail', alt: 'Mains gantées fixant un rail de panneau solaire', position: '50% 50%' }, dims, sizes: '(min-width: 60rem) 480px, 100vw' })}

${zone()}

${pourquoi()}

${questions()}

${contact({ classeBouton: 'bouton bouton-envoyer', endpoint })}
</main>
${pied({ logo: 'logo-clair.png' })}
</body>
</html>`;

  const communs = { polices, theme: THEME, logoPied: 'logo-clair.png', logoBandeau: 'symbole-180.png' };
  return {
    'index.html': index,
    'mentions-legales.html': pageLegale({ quelle: 'mentions', ...communs }),
    'confidentialite.html': pageLegale({ quelle: 'confidentialite', ...communs }),
    ...pagesMessage(communs),
  };
}
