/* Optional form: disabled until a specific choice. No analytics or advertising. */
(() => {
  'use strict';
  const KEY = 'ironpack.privacy.v1', LIFETIME = 180 * 24 * 60 * 60 * 1000;
  let memory;
  const valid = value => value && value.version === 1 && typeof value.form === 'boolean' && Number.isFinite(value.savedAt) && Number.isFinite(value.expiresAt) && value.savedAt <= Date.now() + 5000 && value.expiresAt > Date.now() && value.expiresAt - value.savedAt === LIFETIME;
  function read() {
    if (valid(memory)) return memory;
    memory = undefined;
    try { const value = JSON.parse(localStorage.getItem(KEY)); if (valid(value)) return value; localStorage.removeItem(KEY); return null; } catch { return null; }
  }
  function clearProviderStorage() {
    for (const storeName of ['localStorage', 'sessionStorage']) {
      try { const store = window[storeName]; for (let i = store.length - 1; i >= 0; i--) { const key = store.key(i); if (key && /^(mailerlite:|ml_guid$|ml_subscriber$)/i.test(key)) store.removeItem(key); } } catch { /* Refusing stays possible without storage. */ }
    }
    const domains = ['', location.hostname, '.' + location.hostname];
    if (location.hostname.endsWith('.ironpack.app')) domains.push('ironpack.app', '.ironpack.app');
    let cookies = ''; try { cookies = document.cookie; } catch { return; }
    cookies.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim(); if (!/^(mailerlite[:_]|ml_guid$|ml_subscriber$)/i.test(name)) return;
      for (const domain of domains) try { document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax' + (domain ? '; Domain=' + domain : '') + (location.protocol === 'https:' ? '; Secure' : ''); } catch { /* Browser-managed third-party storage may be inaccessible. */ }
    });
  }
  function save(form) {
    const savedAt = Date.now(); memory = {version: 1, form: !!form, savedAt, expiresAt: savedAt + LIFETIME};
    try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch { /* Choice stays valid on this page. */ }
    lastAllowed = !!form; window.dispatchEvent(new CustomEvent('ironpack:privacy', {detail: {form: lastAllowed}}));
    if (!form) clearProviderStorage(); return memory;
  }
  let panel, lastAllowed = read()?.form === true;
  function sync() { lastAllowed = read()?.form === true; window.dispatchEvent(new CustomEvent('ironpack:privacy', {detail: {form: lastAllowed}})); }
  function open() {
    if (!panel) return; const state = read();
    panel.querySelector('[data-current-choice]').textContent = state ? (state.form ? 'Choix actuel : formulaire externe autorisé.' : 'Choix actuel : formulaire externe refusé.') : 'Le formulaire externe est désactivé tant que tu ne l’autorises pas.';
    if (!panel.open) panel.showModal();
  }
  window.IronpackPrivacy = {read, save, allowed: () => read()?.form === true, open};
  function init() {
    panel = document.createElement('dialog'); panel.className = 'privacy-dialog'; panel.setAttribute('aria-labelledby', 'privacy-dialog-title');
    panel.innerHTML = `<div class="privacy-dialog-heading"><span class="legal-kicker">TES CHOIX</span><button class="privacy-close" type="button" aria-label="Fermer les préférences">×</button></div><h2 id="privacy-dialog-title">Cookies & confidentialité</h2><p>Le formulaire d’inscription est fourni par MailerLite. Son chargement lui transmet ton adresse IP et peut utiliser des cookies ou un stockage local pour faire fonctionner le formulaire.</p><p>Tu peux consulter tout le site sans l’autoriser. Aucun outil de publicité ou de mesure d’audience n’est ajouté par IRONPACK.</p><p class="privacy-current" data-current-choice></p><div class="privacy-actions"><button class="privacy-choice" data-refuse type="button">Refuser</button><button class="privacy-choice" data-allow type="button">Autoriser le formulaire</button></div><p class="privacy-fine">Choix conservé 180 jours, modifiable à tout moment. Autoriser le formulaire ne t’inscrit pas à la newsletter.</p><a class="legal-inline" href="cookies">En savoir plus sur les cookies ↗</a>`;
    document.body.append(panel);
    panel.querySelector('.privacy-close').addEventListener('click', () => panel.close());
    panel.querySelector('[data-refuse]').addEventListener('click', () => { save(false); panel.close(); });
    panel.querySelector('[data-allow]').addEventListener('click', () => { save(true); panel.close(); });
    document.querySelectorAll('[data-cookie-settings]').forEach(button => { button.hidden = false; button.addEventListener('click', open); });
    if (read()?.form === false) clearProviderStorage();
  }
  window.addEventListener('storage', event => { if (event.key !== KEY && event.key !== null) return; memory = undefined; sync(); });
  window.addEventListener('pageshow', sync);
  // Expiration or a preference removed in another tab must also unload an open form.
  setInterval(() => { if (lastAllowed && !read()?.form) sync(); }, 60000);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true}); else init();
})();
