// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
reveals.forEach(el => el.classList.add('hidden'));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.remove('hidden');
        entry.target.classList.add('animate-in');
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });
reveals.forEach(el => observer.observe(el));

// Nav active state
const sections = document.querySelectorAll('section[id], [id="hero"], [id="skills"], [id="contact"]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 200) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const isActive = href === `#${current}`;
    link.classList.toggle('active', isActive);
  });
});

// Mobile menu
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    });
  });
}

// Typewriter effect for subtitle
const subtitle = document.querySelector('.hero-subtitle');
const texts = [
  'I build things that sense the world',
  'Instrumentation & IoT Engineer',
  'IEEE RAS · Uninorte',
  'From transistors to the cloud'
];
let textIndex = 0, charIndex = 0, deleting = false;

function typeWriter() {
  const currentText = texts[textIndex];
  const cursor = subtitle.querySelector('.cursor');

  if (!deleting) {
    if (charIndex < currentText.length) {
      subtitle.insertBefore(document.createTextNode(currentText[charIndex]), cursor);
      charIndex++;
      setTimeout(typeWriter, 60);
    } else {
      setTimeout(() => { deleting = true; typeWriter(); }, 2200);
    }
  } else {
    const nodes = Array.from(subtitle.childNodes).filter(n => n.nodeType === 3);
    if (nodes.length > 0) {
      nodes[nodes.length - 1].remove();
      charIndex--;
      setTimeout(typeWriter, 30);
    } else {
      deleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(typeWriter, 500);
    }
  }
}

typeWriter();

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