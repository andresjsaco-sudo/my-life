// Apply a saved theme before first paint to avoid a flash.
(function () {
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (e) { /* storage unavailable: follow the system setting */ }
})();
