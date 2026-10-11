(() => {
  'use strict';
  const button = document.getElementById('load-signup'), container = document.getElementById('signup-container'), status = document.getElementById('signup-status'), privacy = window.IronpackPrivacy;
  let requested = false, frame = null, timeout;
  function stop() { clearTimeout(timeout); frame?.remove(); frame = null; container.hidden = true; button.disabled = false; button.hidden = false; }
  function load() {
    if (!privacy?.allowed() || frame) return;
    button.disabled = true; status.textContent = 'Chargement du formulaire…';
    frame = document.createElement('iframe'); frame.title = 'Inscription aux nouvelles de la bêta IRONPACK'; frame.className = 'signup-frame';
    frame.setAttribute('sandbox', 'allow-scripts allow-forms allow-same-origin'); frame.referrerPolicy = 'no-referrer'; frame.src = 'inscription';
    frame.addEventListener('load', () => { if (privacy.allowed()) frame?.contentWindow?.postMessage({type: 'ironpack:form:authorize'}, location.origin); });
    container.hidden = false; container.replaceChildren(frame);
    timeout = setTimeout(() => { stop(); status.textContent = 'Le formulaire ne s’est pas chargé. Réessaie ou écris à contact@ironpack.app.'; }, 20000);
  }
  button?.addEventListener('click', () => { requested = true; if (privacy?.allowed()) load(); else privacy?.open(); });
  window.addEventListener('ironpack:privacy', event => {
    if (!event.detail.form) { const wasLoaded = !!frame; stop(); if (requested || wasLoaded) status.textContent = 'Formulaire désactivé. Tu peux modifier ton choix dans « Gérer les cookies ».'; requested = false; }
    else if (requested) load();
  });
  window.addEventListener('message', event => {
    if (!frame || event.source !== frame.contentWindow || event.origin !== location.origin || !privacy.allowed()) return;
    if (event.data?.type === 'ironpack:form:ready') { clearTimeout(timeout); status.textContent = ''; button.hidden = true; }
    if (event.data?.type === 'ironpack:form:height' && Number.isFinite(event.data.height)) frame.style.height = Math.max(250, Math.min(1600, event.data.height)) + 'px';
    if (event.data?.type === 'ironpack:form:error') { stop(); status.textContent = 'Le formulaire est indisponible. Réessaie ou écris à contact@ironpack.app.'; }
  });
})();
