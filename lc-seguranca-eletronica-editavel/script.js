const PHONE = '5586994172684';
const DEFAULT_MESSAGE = 'Olá, vim pelo site da LC Segurança Eletrônica e gostaria de solicitar um orçamento.';
const wa = (msg) => `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;

document.querySelectorAll('[data-whatsapp]').forEach(a => { a.href = wa(DEFAULT_MESSAGE); a.target = '_blank'; a.rel = 'noopener' });
document.querySelectorAll('[data-service]').forEach(a => { a.href = wa(`Olá, vim pelo site da LC Segurança Eletrônica e gostaria de um orçamento para ${a.dataset.service}. Estou em Barras-PI ou região.`); a.target = '_blank'; a.rel = 'noopener' });

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');
if (menuButton && nav) {
  const close = () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false') };
  menuButton.addEventListener('click', () => { const open = !nav.classList.contains('open'); nav.classList.toggle('open', open); menuButton.setAttribute('aria-expanded', String(open)) });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close() });
}

const form = document.querySelector('#quoteForm');
if (form) form.addEventListener('submit', e => {
  e.preventDefault(); if (!form.reportValidity()) return;
  const d = new FormData(form);
  const msg = ['Olá, vim pelo site da LC Segurança Eletrônica e gostaria de solicitar um orçamento.', '', `Nome: ${d.get('nome')}`, `Telefone: ${d.get('telefone')}`, `Tipo de imóvel: ${d.get('tipo')}`, `Cidade/Localidade: ${d.get('cidade')}`, `Serviço: ${d.get('servico')}`, `Detalhes: ${d.get('detalhes') || 'Não informado'}`, '', 'Pode me informar a disponibilidade para atendimento?'].join('\n');
  window.open(wa(msg), '_blank', 'noopener');
});

const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) { const obs = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target) } }), { threshold: .1 }); items.forEach(el => obs.observe(el)) } else items.forEach(el => el.classList.add('visible'));

const dialog = document.querySelector('#lightbox');
if (dialog) { const img = dialog.querySelector('img'), cap = dialog.querySelector('p'); document.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', () => { img.src = item.dataset.full; img.alt = item.dataset.caption || 'Projeto real'; cap.textContent = item.dataset.caption || ''; dialog.showModal?.() })); dialog.querySelector('.lightbox-close')?.addEventListener('click', () => dialog.close()); dialog.addEventListener('click', e => { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close() }) }