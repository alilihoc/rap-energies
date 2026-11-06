// Rap Énergies : navigation réduite au défilement, visionneuse de la galerie, envoi du formulaire.
// Tout le site reste lisible et utilisable sans ce script.
(() => {
  // Bandeau réduit une fois la page défilée de la hauteur du bandeau : on observe une sentinelle de 4,5 rem posée
  // en haut du document (pas d'écouteur de défilement) ; tant qu'elle est visible, le bandeau garde sa taille.
  const bandeau = document.querySelector('.bandeau');
  const sentinelle = document.querySelector('.sentinelle');
  if (bandeau && sentinelle && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => bandeau.classList.toggle('reduite', !e.isIntersecting), { rootMargin: '0px', threshold: 0 }).observe(sentinelle);
  }
  // Sous 40 rem, la rangée des ancres part avec la page (bandeau collant à top négatif) : on lui donne sa hauteur réelle,
  // qui dépend du nombre de lignes occupées par les ancres.
  const nav = document.querySelector('.bandeau .nav');
  if (bandeau && nav && 'ResizeObserver' in window) {
    const ul = nav.querySelector('ul');
    new ResizeObserver(() => {
      bandeau.style.setProperty('--nav-h', `${nav.offsetHeight}px`);
      // Fondu à droite seulement quand la rangée déborde réellement (sinon la dernière ancre pâlirait pour rien).
      if (ul) nav.classList.toggle('deborde', ul.scrollWidth > ul.clientWidth + 1);
    }).observe(nav);
  }
  // Section courante soulignée dans la navigation : celle qui traverse la bande haute de l'écran.
  if (nav && 'IntersectionObserver' in window) {
    const ancres = [...nav.querySelectorAll('a[href^="#"]')];
    const cibles = ancres.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);
    if (cibles.length) {
      const courante = (id) => ancres.forEach((a) => (a.hash === `#${id}` ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
      const obs = new IntersectionObserver((entrees) => entrees.forEach((e) => { if (e.isIntersecting) courante(e.target.id); }), { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
      cibles.forEach((c) => obs.observe(c));
    }
  }

  // Visionneuse : <dialog> natif, flèches du clavier, fermeture par Échap, bouton ou clic hors de l'image.
  const dialog = document.querySelector('.visionneuse');
  const liens = [...document.querySelectorAll('.photo-lien')];
  if (dialog && liens.length && typeof dialog.showModal === 'function') {
    const zone = dialog.querySelector('.visionneuse-image');
    const legende = dialog.querySelector('.visionneuse-legende');
    const num = dialog.querySelector('.visionneuse-compteur .num');
    let courant = 0;
    const montrer = (n) => {
      courant = (n + liens.length) % liens.length;
      const lien = liens[courant];
      const pic = lien.querySelector('picture').cloneNode(true);
      pic.querySelectorAll('[sizes]').forEach((el) => el.setAttribute('sizes', '100vw'));
      const img = pic.querySelector('img');
      img.loading = 'eager';
      img.removeAttribute('fetchpriority');
      img.removeAttribute('style');
      zone.replaceChildren(pic);
      legende.textContent = lien.dataset.legende || '';
      num.textContent = courant + 1;
    };
    liens.forEach((lien, n) => {
      lien.addEventListener('click', (e) => {
        e.preventDefault();
        montrer(n);
        dialog.showModal();
      });
    });
    dialog.querySelector('.visionneuse-prec').addEventListener('click', () => montrer(courant - 1));
    dialog.querySelector('.visionneuse-suiv').addEventListener('click', () => montrer(courant + 1));
    dialog.querySelector('.visionneuse-fermer').addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') montrer(courant - 1);
      if (e.key === 'ArrowRight') montrer(courant + 1);
    });
    dialog.addEventListener('click', (e) => {
      if (!e.target.closest('.visionneuse-contenu, button')) dialog.close();
    });
    // Balayage horizontal au doigt : photo suivante ou précédente.
    let depart = null;
    dialog.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') depart = e.clientX; });
    dialog.addEventListener('pointerup', (e) => {
      if (depart === null) return;
      const dx = e.clientX - depart;
      depart = null;
      if (Math.abs(dx) > 48) montrer(dx < 0 ? courant + 1 : courant - 1);
    });
    dialog.addEventListener('close', () => liens[courant].focus());
  }

  // Formulaire : point d'envoi réel à renseigner à la mise en ligne (data-endpoint) ; sans lui, on compose
  // un courriel vers rapenergies@gmail.com avec les champs saisis. Les messages viennent des textes validés.
  const form = document.querySelector('.formulaire');
  const etat = document.querySelector('.form-etat');
  if (form && etat) {
    // mode : 'ok' (envoi confirmé par le point d'envoi, le formulaire se range), 'erreur', ou 'info' (voie mailto :
    // rien n'a été envoyé par le site, le formulaire reste visible).
    const afficher = (texte, mode) => {
      etat.textContent = texte;
      etat.hidden = false;
      etat.classList.toggle('erreur', mode === 'erreur');
      etat.classList.toggle('info', mode === 'info');
      if (mode === 'ok') form.hidden = true;
      etat.focus();
    };
    const bouton = form.querySelector('button[type="submit"]');
    const libelle = bouton ? bouton.textContent : '';
    let enCours = false;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (enCours || !form.reportValidity()) return;
      const donnees = new FormData(form);
      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        // Point d'envoi réel (envoyer.php chez l'hébergeur) : il répond en JSON { ok, message }.
        // Pendant l'envoi, le bouton est désactivé et le dit : pas de double envoi.
        enCours = true;
        form.setAttribute('aria-busy', 'true');
        if (bouton) { bouton.disabled = true; bouton.textContent = form.dataset.envoi || libelle; }
        try {
          const r = await fetch(endpoint, { method: 'POST', body: donnees, headers: { Accept: 'application/json' } });
          const reponse = await r.json().catch(() => ({}));
          if (!r.ok || !reponse.ok) {
            afficher(r.status === 422 && reponse.message ? reponse.message : form.dataset.erreur, 'erreur');
            return;
          }
          afficher(form.dataset.confirmation, 'ok');
        } catch {
          afficher(form.dataset.erreur, 'erreur');
        } finally {
          enCours = false;
          form.removeAttribute('aria-busy');
          if (bouton) { bouton.disabled = false; bouton.textContent = libelle; }
        }
        return;
      }
      const lignes = [];
      for (const [cle, val] of donnees.entries()) if (String(val).trim()) lignes.push(`${cle} : ${val}`);
      const url = `mailto:${form.dataset.courriel}?subject=${encodeURIComponent(form.dataset.sujet)}&body=${encodeURIComponent(lignes.join('\n'))}`;
      window.location.href = url;
      afficher(form.dataset.ouverture, 'info');
    });
  }
})();
