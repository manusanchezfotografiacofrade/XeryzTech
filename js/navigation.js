// Menú móvil: sin JS el menú es una lista visible; con JS se pliega tras un botón.
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
if (toggle && menu) {
  const set = (open) => { menu.toggleAttribute('data-open', open); toggle.setAttribute('aria-expanded', String(open)); };
  toggle.addEventListener('click', () => set(!menu.hasAttribute('data-open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.hasAttribute('data-open')) { set(false); toggle.focus(); }
  });
}
