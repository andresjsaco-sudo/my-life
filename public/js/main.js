// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
reveals.forEach(el => el.classList.add('hidden'));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.remove('hidden');
        entry.target.classList.add('animate-in');
      }, i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => observer.observe(el));

// Nav active state
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top <= 150) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === '#' + current);
  });
}
window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// Mobile menu
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  siteNav.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    });
  });
}

// Typewriter (hero tagline)
const tagline = document.querySelector('.hero-tagline');
if (tagline) {
  const wrap = tagline.querySelector('.typewriter-wrap');
  const cursor = tagline.querySelector('.cursor');
  const texts = [
    'I build things that sense the world',
    'Instrumentation & IoT Engineer',
    'IEEE RAS · Uninorte',
    'From transistors to the cloud'
  ];
  let textIndex = 0, charIndex = 0, deleting = false;

  function typeWriter() {
    const currentText = texts[textIndex];
    if (!cursor) return;

    if (!deleting) {
      if (charIndex < currentText.length) {
        wrap.appendChild(document.createTextNode(currentText[charIndex]));
        charIndex++;
        setTimeout(typeWriter, 55);
      } else {
        setTimeout(() => { deleting = true; typeWriter(); }, 2000);
      }
    } else {
      if (wrap.lastChild) {
        wrap.removeChild(wrap.lastChild);
        charIndex--;
        setTimeout(typeWriter, 25);
      } else {
        deleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(typeWriter, 400);
      }
    }
  }
  typeWriter();
}

// Theme toggle
const toggle = document.getElementById('theme-toggle');
if (toggle) {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    toggle.checked = true;
  }
  toggle.addEventListener('change', () => {
    document.body.classList.toggle('light', toggle.checked);
    localStorage.setItem('theme', toggle.checked ? 'light' : 'dark');
  });
}
