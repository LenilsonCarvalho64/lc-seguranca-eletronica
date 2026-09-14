const PHONE = '5586994172684';
const DEFAULT_MESSAGE = 'Olá, vim pelo site da LC Segurança Eletrônica e gostaria de solicitar um orçamento em Barras-PI ou região.';

const whatsappUrl = (message) => `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

const WHATSAPP_ICON = `
<svg aria-hidden="true" viewBox="0 0 32 32" width="19" height="19" focusable="false" style="display:block;flex:0 0 auto">
  <path fill="currentColor" d="M16 3C8.82 3 3 8.64 3 15.6c0 2.38.68 4.6 1.87 6.5L3.1 28.5l6.58-1.7A13.27 13.27 0 0 0 16 28.4c7.18 0 13-5.64 13-12.8S23.18 3 16 3Zm0 23.1c-2.04 0-4.03-.54-5.77-1.57l-.41-.24-3.9 1.01 1.04-3.69-.27-.42a10.03 10.03 0 0 1-1.59-5.59C5.1 9.9 9.99 5.3 16 5.3s10.9 4.6 10.9 10.3S22.01 26.1 16 26.1Zm5.98-7.7c-.33-.16-1.95-.94-2.25-1.05-.3-.1-.52-.16-.74.16-.22.31-.85 1.05-1.04 1.26-.19.21-.38.24-.71.08-.33-.16-1.39-.5-2.65-1.6-.98-.85-1.64-1.9-1.84-2.22-.19-.31-.02-.48.14-.64.15-.14.33-.37.49-.55.16-.18.22-.31.33-.52.11-.21.05-.39-.03-.55-.08-.16-.74-1.73-1.01-2.37-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.39-.3.31-1.14 1.08-1.14 2.64 0 1.56 1.17 3.07 1.33 3.28.16.21 2.3 3.41 5.57 4.78.78.33 1.38.52 1.86.67.78.24 1.49.21 2.05.13.63-.09 1.95-.77 2.22-1.52.27-.75.27-1.39.19-1.52-.08-.13-.3-.21-.63-.37Z"/>
</svg>`;

function loadScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[data-dynamic="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.dataset.dynamic = src;
    s.onload = resolve;
    s.onerror = resolve;
    document.head.appendChild(s);
  });
}

function hydrateImages() {
  const assets = window.LC_ASSETS || {};

  if (!assets.external) assets.external = assets.hero;
  if (!assets.about) assets.about = assets.personal || assets.hero;
  if (!assets.electrical) assets.electrical = assets.about || assets.hero;
  if (!assets.clinic) assets.clinic = assets.lighting || assets.hero;
  if (!assets.logoSymbol && assets.hero) assets.logoSymbol = assets.hero;

  document.querySelectorAll('[data-img]').forEach((img) => {
    const src = assets[img.dataset.img];
    if (src) img.src = src;
  });

  return assets;
}

function addWhatsAppIcons() {
  document.querySelectorAll('.btn-whatsapp').forEach((button) => {
    if (button.querySelector('.whatsapp-svg-icon')) return;
    const icon = document.createElement('span');
    icon.className = 'whatsapp-svg-icon';
    icon.innerHTML = WHATSAPP_ICON;
    icon.style.display = 'inline-grid';
    icon.style.placeItems = 'center';
    button.prepend(icon);
  });

  const floatingIcon = document.querySelector('.whatsapp-float .wa-icon');
  if (floatingIcon) {
    floatingIcon.innerHTML = WHATSAPP_ICON;
    floatingIcon.style.color = '#128c4a';
  }
}

function setupWhatsAppLinks() {
  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.href = whatsappUrl(DEFAULT_MESSAGE);
    link.target = '_blank';
    link.rel = 'noopener';
  });

  document.querySelectorAll('[data-service]').forEach((link) => {
    const service = link.dataset.service;
    link.href = whatsappUrl(`Olá, vim pelo site da LC Segurança Eletrônica e gostaria de um orçamento para ${service}. Estou em Barras-PI ou região. Pode me passar mais informações?`);
    link.target = '_blank';
    link.rel = 'noopener';
  });
}

function setupMenu() {
  const button = document.querySelector('.menu-button');
  const nav = document.querySelector('.main-nav');
  if (!button || !nav) return;

  const close = () => {
    nav.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  button.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  window.addEventListener('resize', () => { if (window.innerWidth > 900) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
}

function setupHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 12);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function setupForm() {
  const form = document.querySelector('#quoteForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const message = [
      'Olá, vim pelo site da LC Segurança Eletrônica e gostaria de solicitar um orçamento.',
      '',
      `Nome: ${data.get('nome')}`,
      `Telefone: ${data.get('telefone')}`,
      `Tipo de imóvel: ${data.get('tipo')}`,
      `Cidade/Localidade: ${data.get('cidade')}`,
      `Serviço: ${data.get('servico')}`,
      `Detalhes: ${data.get('detalhes') || 'Não informado'}`,
      '',
      'Pode me informar a disponibilidade para atendimento?'
    ].join('\n');

    window.open(whatsappUrl(message), '_blank', 'noopener');
  });
}

function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        entry.target.style.setProperty('--delay', `${delay}ms`);
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach((item) => observer.observe(item));
}

function setupLightbox(assets) {
  const dialog = document.querySelector('#lightbox');
  if (!dialog) return;
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('p');
  const closeButton = dialog.querySelector('.lightbox-close');

  const close = () => dialog.open && dialog.close();
  closeButton?.addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const clickedBackdrop = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (clickedBackdrop) close();
  });

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      image.src = assets[item.dataset.full] || '';
      image.alt = item.dataset.caption || 'Projeto real';
      caption.textContent = item.dataset.caption || '';
      if (typeof dialog.showModal === 'function') dialog.showModal();
    });
  });
}

async function bootstrap() {
  await Promise.all([
    loadScript('asset-logo-symbol.js'),
    loadScript('asset-hero.js'),
    loadScript('asset-lighting.js'),
    loadScript('asset-external.js'),
    loadScript('asset-personal.js'),
    loadScript('asset-about.js'),
    loadScript('asset-electrical.js'),
    loadScript('asset-clinic.js')
  ]);

  const assets = hydrateImages();
  setupWhatsAppLinks();
  addWhatsAppIcons();
  setupMenu();
  setupHeader();
  setupForm();
  setupReveal();
  setupLightbox(assets);
}

bootstrap();