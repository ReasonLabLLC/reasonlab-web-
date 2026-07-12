(() => {
  const modal = document.getElementById('demoModal');
  const frame = document.getElementById('demoFrame');
  const device = document.getElementById('demoDevice');
  const loading = document.getElementById('demoLoading');
  const title = document.getElementById('demoModalTitle');
  const openButtons = document.querySelectorAll('.open-demo');
  const closeButtons = document.querySelectorAll('[data-close-demo]');
  const viewButtons = document.querySelectorAll('[data-view]');

  if (!modal || !frame || !device) return;

  function openDemo(button) {
    const src = button.dataset.demo;
    const demoTitle = button.dataset.title || 'Website Demo';

    title.textContent = demoTitle;
    loading.classList.remove('hidden');
    frame.src = src;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('demo-open');
  }

  function closeDemo() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    frame.src = 'about:blank';
    loading.classList.remove('hidden');
    document.body.classList.remove('demo-open');
  }

  function setView(view) {
    device.classList.toggle('mobile', view === 'mobile');
    device.classList.toggle('desktop', view !== 'mobile');

    viewButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.view === view);
    });
  }

  openButtons.forEach((button) => button.addEventListener('click', () => openDemo(button)));
  closeButtons.forEach((button) => button.addEventListener('click', closeDemo));
  viewButtons.forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));

  frame.addEventListener('load', () => loading.classList.add('hidden'));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeDemo();
  });
})();