(() => {
  const header = document.querySelector('header');
  const story = document.querySelector('.product-story');
  let headerFrame = null;
  const updateHeader = () => {
    headerFrame = null;
    if (header && story) header.classList.toggle('over-product', story.getBoundingClientRect().top < 92);
  };
  addEventListener('scroll', () => {
    if (headerFrame === null) headerFrame = requestAnimationFrame(updateHeader);
  }, {passive:true});
  addEventListener('resize', updateHeader);
  updateHeader();
  const modes = {
    sinueuse: { label: 'Sinueuse', title: 'Le plaisir des virages.', description: 'Privilégie les routes sinueuses et les détours qui donnent envie de repartir.' },
    rapide: { label: 'Rapide', title: 'Le chemin le plus direct.', description: 'Quand tu veux rejoindre ta destination plus vite, choisis un parcours avec moins de détours.' },
    balade: { label: 'Balade', title: 'Le temps de profiter.', description: 'Mets la découverte au premier plan : des paysages, des pauses et le plaisir de prendre son temps.' }
  };
  const controls = document.querySelectorAll('input[name="ride-style"]');
  const label = document.getElementById('ride-mode-label');
  const title = document.getElementById('ride-mode-title');
  const description = document.getElementById('ride-mode-description');
  if (!controls.length || !label || !title || !description) return;
  const update = (value) => {
    const mode = modes[value];
    if (!mode) return;
    label.textContent = mode.label;
    title.textContent = mode.title;
    description.textContent = mode.description;
    document.querySelectorAll('[data-route-mode]').forEach(path => {
      path.classList.toggle('is-active',path.dataset.routeMode === value);
    });
  };
  controls.forEach(input => input.addEventListener('change', () => { if (input.checked) update(input.value); }));
  update(document.querySelector('input[name="ride-style"]:checked')?.value || 'sinueuse');
})();
