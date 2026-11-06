// Template 2, « Le soir, la maison chauffe » : page sombre, photo du soir plein écran, panneau nuit, ambre unique.
import { C, t, fr, tete, bandeau, boutons, picture, galerie, serviceCorps, ensemble, production, etapes, zone, pourquoi, questions, contact, pied, pageLegale, pagesMessage } from '../commun/composants.mjs';

const THEME = '#15130E';

export function rendre({ dims, polices, endpoint = '' }) {
  const services = C.services.liste
    .map(
      (s) => `<div class="service" id="${s.id}" role="listitem">
<h3 class="service-nom">${t(s.titre)}</h3>
<div class="service-corps">${serviceCorps(s)}</div>
</div>`,
    )
    .join('\n');

  const index = `${tete({ titre: C.seo.title, description: C.seo.description, canonical: C.seo.canonical, polices, jsonld: true }).replace('__THEME__', THEME)}
<body id="haut">
${bandeau({ logo: 'symbole-180.png' })}
<main id="contenu">
<section class="accroche" aria-labelledby="titre">
<div class="accroche-photo">${picture('rue-soir', { alt: 'Maisons aux façades ocre et crème, toits de tuiles, lampadaire allumé au crépuscule', sizes: '100vw', position: '50% 62%', dims, eager: true })}</div>
<div class="colonne accroche-grille">
<div class="panneau">
<h1 id="titre">${t(C.accroche.titreVariante)}</h1>
<p class="accroche-p">${t(C.accroche.texteVariante)}</p>
${boutons()}
<p class="ligne">${t(C.accroche.ligne)}</p>
</div>
</div>
</section>

${galerie({ dims, sizes: '(min-width: 75rem) 584px, (min-width: 40rem) 50vw, 100vw' })}

<section class="services" id="services" aria-labelledby="t-services">
<div class="colonne">
<h2 id="t-services">${t(C.services.titre)}</h2>
<div class="services-liste" role="list">
${services}
</div>
${ensemble()}
</div>
</section>

<figure class="bande">${picture('tuiles-rasantes', { alt: 'Tuiles canal en terre cuite en gros plan, lumière rasante', sizes: '100vw', position: '50% 50%', dims })}</figure>

${production({ orientation: 'horizontal' })}

${etapes({ photo: { nom: 'mains-chaudiere', alt: 'Mains gantées réglant un appareil de chauffage à cadrans', position: '50% 50%' }, dims, sizes: '(min-width: 60rem) 480px, 100vw' })}

${zone()}

${pourquoi()}

${questions({ rappel: true })}

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
