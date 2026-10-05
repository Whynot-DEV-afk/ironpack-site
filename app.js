const button = document.getElementById('load-signup');
const container = document.getElementById('signup-container');
const status = document.getElementById('signup-status');
button.addEventListener('click', () => {
  button.disabled = true;
  status.textContent = 'Chargement du formulaire sécurisé…';
  container.hidden = false;
  window.ml = window.ml || function () { (window.ml.q = window.ml.q || []).push(arguments); };
  window.ml('account', '2303043');
  const script = document.createElement('script');
  script.src = 'https://assets.mailerlite.com/js/universal.js';
  script.async = true;
  const fail = () => {
    status.textContent = 'Le formulaire ne s’est pas chargé. Recharge la page ou contacte-nous à contact@ironpack.app.';
    button.hidden = true;
  };
  script.onerror = fail;
  document.head.append(script);
  const observer = new MutationObserver(() => {
    const email = container.querySelector('input[type="email"]');
    if (!email) return;
    email.setAttribute('aria-label', 'Ton adresse email');
    email.placeholder = 'ton.email@exemple.com';
    email.required = true;
    const submit = container.querySelector('button.primary');
    if (submit) submit.textContent = 'Je rejoins la meute';
    button.hidden = true;
    status.textContent = '';
    clearTimeout(timeout);
    observer.disconnect();
  });
  observer.observe(container, { childList: true, subtree: true });
  const timeout = setTimeout(fail, 20000);
});
