// ── Theme toggle ──────────────────────────────────────────────────────────────
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('theme-btn');
  if (!btn) return;
  const label = btn.querySelector('.theme-btn-text');

  function current() {
    const set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function render() {
    const next = current() === 'dark' ? 'light' : 'dark';
    label.textContent = next === 'dark' ? 'Dark' : 'Light';
    btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }
  btn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    render();
  });
  render();
})();

// ── Stage filter: the hero chain filters the project list ─────────────────────
(function () {
  const buttons = Array.from(document.querySelectorAll('.chain-btn'));
  const projects = Array.from(document.querySelectorAll('.project'));
  const text = document.getElementById('filter-text');
  const clear = document.getElementById('clear-filter');
  if (!buttons.length || !projects.length) return;
  const total = projects.length;
  let active = null;

  function apply(stage, scroll) {
    active = stage;
    let shown = 0;
    projects.forEach((p) => {
      const match = !stage || p.dataset.stages.split(' ').includes(stage);
      p.hidden = !match;
      if (match) shown++;
    });
    buttons.forEach((b) => {
      const on = b.dataset.stage === stage;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (stage) {
      const name = buttons.find((b) => b.dataset.stage === stage).querySelector('.chain-name').textContent;
      text.textContent = shown + ' of ' + total + ' projects include the ' + name + ' stage';
      clear.hidden = false;
    } else {
      text.textContent = 'All ' + total + ' projects';
      clear.hidden = true;
    }
    if (scroll) {
      document.getElementById('projects').scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' });
    }
  }

  function prefersReduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  buttons.forEach((b) => {
    b.addEventListener('click', () => {
      const stage = b.dataset.stage;
      apply(active === stage ? null : stage, active !== stage);
    });
  });
  clear.addEventListener('click', () => apply(null, false));
})();

// ── Size the one-time signal pulse to the trace width ─────────────────────────
(function () {
  const chain = document.querySelector('.chain');
  if (chain) chain.style.setProperty('--chain-w', chain.offsetWidth + 'px');
})();
