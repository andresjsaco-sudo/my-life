// ── Theme toggle ──────────────────────────────────────────────────────────────
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('theme-btn');
  if (!btn) return;
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  function current() {
    return root.getAttribute('data-theme') || (media.matches ? 'dark' : 'light');
  }
  function render() {
    btn.setAttribute('aria-label', current() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  btn.addEventListener('click', function () {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
    render();
  });
  media.addEventListener('change', render);
  render();
})();

// ── LTE map: hover a cell to highlight it, its neighbors and its data ─────────
(function () {
  const maps = document.querySelectorAll('[data-lte-map]');
  if (!maps.length) return;
  const readout = document.querySelector('[data-lte-readout]');

  function setField(name, value) {
    if (!readout) return;
    const el = readout.querySelector('[data-field="' + name + '"]');
    if (el) el.textContent = value;
  }

  maps.forEach(function (map) {
    const svg = map.querySelector('.lte-svg');
    const cells = Array.from(map.querySelectorAll('.lte-cell'));
    const dots = Array.from(map.querySelectorAll('.lte-dot'));
    const near = Number(svg.getAttribute('data-near')) || 90;
    const pos = cells.map(function (c) { return [Number(c.dataset.cx), Number(c.dataset.cy)]; });
    let active = -1;

    function select(i) {
      if (i === active) return;
      active = i;
      const [x, y] = pos[i];
      cells.forEach(function (c, k) {
        const d = Math.hypot(pos[k][0] - x, pos[k][1] - y);
        c.classList.toggle('is-on', k === i);
        c.classList.toggle('is-near', k !== i && d < near);
      });
      dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
      const c = cells[i].dataset;
      const locality = c.loc;
      setField('site', 'eNB-' + c.id);
      setField('zone', 'UPZ ' + c.upz + ', ' + locality);
      setField('loc', locality);
      setField('upz', 'UPZ ' + c.upz);
      setField('pos', c.lat + ', ' + c.lon);
      setField('nb', readout && readout.classList.contains('readout')
        ? c.nb + ' within 900 m'
        : c.nb + ' sites within 900 m');
    }

    function fromEvent(e) {
      const t = e.target.closest ? e.target.closest('.lte-cell') : null;
      if (t) select(Number(t.dataset.i));
    }
    svg.addEventListener('pointerover', fromEvent);
    svg.addEventListener('pointerdown', fromEvent);

    const start = cells.findIndex(function (c) { return c.dataset.id === '42'; });
    select(start >= 0 ? start : 0);
  });

  // Layer toggles on the case study page.
  document.querySelectorAll('[data-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const layer = btn.dataset.toggle;
      const on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      maps.forEach(function (m) { m.classList.toggle('off-' + layer, !on); });
    });
  });
})();
