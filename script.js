function hydrateImages() {
  const assets = window.LC_ASSETS || {};
  document.querySelectorAll('[data-img]').forEach((img) => {
    const src = assets[img.dataset.img];
    if (src) img.src = src;
  });
  return assets;
}

const LC_ASSETS = hydrateImages();

const PHONE = '5586994172684';
const DEFAULT_MESSAGE = 'Olá, vim pelo site da LC Segurança Eletrônica e gostaria de solicitar um orçamento em Barras-PI ou região.';

const whatsappUrl = (message) => `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

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

function setupLightbox() {
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
      image.src = LC_ASSETS[item.dataset.full] || item.dataset.full;
      image.alt = item.dataset.caption || 'Projeto real';
      caption.textContent = item.dataset.caption || '';
      if (typeof dialog.showModal === 'function') dialog.showModal();
    });
  });
}

setupWhatsAppLinks();
setupMenu();
setupHeader();
setupForm();
setupReveal();
setupLightbox();
