// Lance le navigateur des outils de capture : Edge par défaut (déjà installé sous Windows), sinon Chrome,
// sinon le Chromium de Playwright. Variable d'environnement NAVIGATEUR=msedge|chrome|chromium pour forcer.
export async function lancer(chromium) {
  const voulu = process.env.NAVIGATEUR;
  const essais = voulu ? [voulu] : ['msedge', 'chrome', 'chromium'];
  let erreur;
  for (const canal of essais) {
    try {
      return await chromium.launch(canal === 'chromium' ? {} : { channel: canal });
    } catch (e) {
      erreur = e;
    }
  }
  throw erreur;
}
