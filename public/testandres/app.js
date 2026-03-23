/* public/testandres/app.js
   Vanilla JS — zero deps.
   All selectors and classes namespaced v2- so they never touch main.js.
*/
(function () {
  'use strict';

  // ══════════════════════════════════════
  // 1. THEME — dark-first, persisted
  // ══════════════════════════════════════
  const body     = document.body;
  const themeBtn = document.getElementById('v2-theme-btn');

  // Initialise from localStorage or system preference
  const saved = localStorage.getItem('v2-theme');
  if (saved === 'light') {
    body.classList.add('v2-light');
  } else if (!saved && window.matchMedia('(prefers-color-scheme: light)').matches) {
    body.classList.add('v2-light');
  }
  // If saved === 'dark' or nothing → keep dark (default)

  themeBtn?.addEventListener('click', () => {
    const isLight = body.classList.toggle('v2-light');
    localStorage.setItem('v2-theme', isLight ? 'light' : 'dark');
  });

  // ══════════════════════════════════════
  // 2. MOBILE MENU
  // ══════════════════════════════════════
  const menuBtn = document.getElementById('v2-menu-btn');
  const nav     = document.getElementById('v2-nav');

  menuBtn?.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('is-open', !open);
  });

  // Close nav on link click (mobile)
  nav?.querySelectorAll('.v2-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn?.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    });
  });

  // ══════════════════════════════════════
  // 3. TYPEWRITER
  // ══════════════════════════════════════
  const phrases = [
    'Instrumentation Engineer',
    'IoT Systems Builder',
    'ML / Computer Vision',
    'Embedded Systems Designer',
    'AWS Cloud Architect',
  ];
  const tw   = document.getElementById('v2-typewriter');
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    if (!tw) return;
    const phrase = phrases[pi];
    if (!deleting) {
      tw.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 70);
    } else {
      tw.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 38);
    }
  }
  tick();

  // ══════════════════════════════════════
  // 4. FOCUS-ON-SCROLL
  //    Closest item to viewport center
  //    gets .is-focused; others dim.
  // ══════════════════════════════════════
  function initFocusList(listId) {
    const list  = document.getElementById(listId);
    if (!list) return;
    const cards = Array.from(list.querySelectorAll('[data-focus]'));
    if (!cards.length) return;

    let raf = null;

    function update() {
      const vc = window.innerHeight / 2;
      let bestIdx = 0, bestDist = Infinity;

      cards.forEach((card, i) => {
        const r    = card.getBoundingClientRect();
        const mid  = r.top + r.height / 2;
        const dist = Math.abs(mid - vc);
        if (dist < bestDist) { bestDist = dist; bestIdx = i; }
      });

      cards.forEach((card, i) => card.classList.toggle('is-focused', i === bestIdx));
    }

    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => { update(); raf = null; });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  initFocusList('v2-exp-list');
  initFocusList('v2-cert-list');

  // ══════════════════════════════════════
  // 5. SCROLL SPY — nav active link
  // ══════════════════════════════════════
  const navLinks = document.querySelectorAll('.v2-nav__link');
  const sections = [
    document.getElementById('v2-about'),
    document.getElementById('v2-skills'),
    document.getElementById('v2-projects'),
    document.getElementById('v2-experience'),
    document.getElementById('v2-contact'),
  ].filter(Boolean);

  function updateSpy() {
    const scrollY = window.scrollY + 80;
    let active = 0;
    sections.forEach((sec, i) => {
      if (sec.offsetTop <= scrollY) active = i;
    });
    navLinks.forEach((link, i) => link.classList.toggle('is-active', i === active));
  }

  window.addEventListener('scroll', updateSpy, { passive: true });
  updateSpy();

  // ══════════════════════════════════════
  // 6. REVEAL ON SCROLL (Intersection Observer)
  // ══════════════════════════════════════
  const reveals = document.querySelectorAll('.v2-reveal');

  reveals.forEach(el => el.classList.add('v2-hidden'));

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.remove('v2-hidden');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObs.observe(el));

})();
