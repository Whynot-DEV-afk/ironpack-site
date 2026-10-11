(() => {
  'use strict';
  let started = false, ready = false, timer;
  const message = (type, extra = {}) => parent.postMessage({type, ...extra}, location.origin);
  const resize = () => message('ironpack:form:height', {height: Math.ceil((document.querySelector('.ml-embedded')?.getBoundingClientRect().height || 234) + 16)});
  function start() {
    if (started) return; started = true;
    const observer = new MutationObserver(() => {
      const form = document.querySelector('.ml-embedded form'), email = form?.querySelector('input[type="email"]');
      if (!email || ready) return; ready = true;
      email.setAttribute('aria-label', 'Ton adresse e-mail'); email.placeholder = 'ton.email@exemple.com'; email.required = true;
      const submit = form.querySelector('button.primary'); if (submit) submit.textContent = 'Recevoir les nouvelles de la bêta';
      const consent = document.createElement('label'); consent.className = 'newsletter-consent';
      const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.required = true; checkbox.name = 'ironpack_newsletter_consent'; checkbox.value = 'beta-news-2026-10-11';
      const text = document.createElement('span'); text.textContent = 'J’accepte de recevoir les nouvelles et invitations de la bêta IRONPACK par e-mail. Je peux me désinscrire à tout moment.';
      consent.append(checkbox, text); if (submit) submit.parentElement.before(consent); else form.append(consent);
      if (submit) {
        submit.disabled = true;
        checkbox.addEventListener('change', () => { submit.disabled = !checkbox.checked; });
        submit.addEventListener('click', event => { if (!checkbox.checked) { event.preventDefault(); event.stopImmediatePropagation(); checkbox.reportValidity(); } }, true);
      }
      form.addEventListener('submit', event => { if (!checkbox.checked) { event.preventDefault(); event.stopImmediatePropagation(); checkbox.reportValidity(); } }, true);
      document.getElementById('frame-status').hidden = true; clearTimeout(timer); observer.disconnect();
      message('ironpack:form:ready'); resize(); new ResizeObserver(resize).observe(document.querySelector('.ml-embedded'));
    });
    observer.observe(document.body, {childList: true, subtree: true});
    window.ml = window.ml || function () { (window.ml.q = window.ml.q || []).push(arguments); }; window.ml('account', '2303043');
    const script = document.createElement('script'); script.src = 'https://assets.mailerlite.com/js/universal.js'; script.async = true;
    script.onerror = () => { clearTimeout(timer); observer.disconnect(); message('ironpack:form:error'); };
    timer = setTimeout(() => { observer.disconnect(); message('ironpack:form:error'); }, 18000); document.head.append(script);
  }
  window.addEventListener('message', event => { if (parent !== window && event.source === parent && event.origin === location.origin && event.data?.type === 'ironpack:form:authorize') start(); });
})();
