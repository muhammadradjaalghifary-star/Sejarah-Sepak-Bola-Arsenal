// Interaksi ringan: menu HP, dropdown era, header, animasi muncul, penanda musim aktif.
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  // Menu HP
  const menuBtn = $('#menuBtn');
  const panel = $('#mobileMenu');
  if (menuBtn && panel) {
    const setOpen = (open) => {
      menuBtn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      document.body.style.overflow = open ? 'hidden' : '';
      $('#iconOpen').classList.toggle('hidden', open);
      $('#iconClose').classList.toggle('hidden', !open);
    };
    menuBtn.addEventListener('click', () => setOpen(menuBtn.getAttribute('aria-expanded') !== 'true'));
    $$('a', panel).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    window.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (m) => m.matches && setOpen(false));
  }

  // Dropdown era (desktop)
  const eraBtn = $('#eraBtn');
  const eraMenu = $('#eraMenu');
  if (eraBtn && eraMenu) {
    const setEra = (open) => { eraBtn.setAttribute('aria-expanded', String(open)); eraMenu.hidden = !open; };
    eraBtn.addEventListener('click', (e) => { e.stopPropagation(); setEra(eraMenu.hidden); });
    document.addEventListener('click', (e) => { if (!eraMenu.contains(e.target)) setEra(false); });
    window.addEventListener('keydown', (e) => e.key === 'Escape' && setEra(false));
  }

  // Header & progress bar
  const header = $('.header');
  const bar = $('.progress');
  const onScroll = () => {
    const y = window.scrollY;
    header && header.classList.toggle('scrolled', y > 8);
    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Animasi muncul
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // Penanda musim aktif di rel jersey
  const rail = $('.season-rail');
  if (rail && 'IntersectionObserver' in window) {
    const links = $$('a', rail);
    const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.remove('active'));
        const a = map.get(en.target.id);
        if (a) {
          a.classList.add('active');
          const left = a.offsetLeft - rail.clientWidth / 2 + a.clientWidth / 2;
          rail.scrollTo({ left, behavior: 'smooth' });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('[data-season]').forEach((s) => sio.observe(s));
  }
})();
