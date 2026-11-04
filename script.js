(function () {
  var root = document.documentElement;
  root.classList.add('js');

  // Theme: remember the visitor's choice; default follows the OS setting
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  } catch (e) {}

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // Mobile menu
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // "More projects" filter chips: show cards whose data-cat contains the chosen category
  var chips = document.querySelectorAll('.filters .chip');
  var cards = document.querySelectorAll('#moreCards .card');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      cards.forEach(function (card) {
        var cats = (card.getAttribute('data-cat') || '').split(' ');
        card.hidden = !(f === 'all' || cats.indexOf(f) !== -1);
        if (!card.hidden) card.classList.add('in');   // revealed cards stay visible after filtering
      });
    });
  });

  // Map gallery: filter chips (client work / independent)
  var mapChips = document.querySelectorAll('.map-filters .chip');
  var mapCards = document.querySelectorAll('.map-card');
  mapChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-mapfilter');
      mapChips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      mapCards.forEach(function (card) {
        card.hidden = !(f === 'all' || card.getAttribute('data-group') === f);
        if (!card.hidden) card.classList.add('in');
      });
    });
  });

  // Map gallery: lightbox. Each card holds its maps as JSON in data-maps.
  var viewer = document.getElementById('mapViewer');
  if (viewer && typeof viewer.showModal === 'function') {
    var vImg = document.getElementById('mvImg');
    var vCap = document.getElementById('mvCap');
    var vCount = document.getElementById('mvCount');
    var vOpen = document.getElementById('mvOpen');
    var vPrev = document.getElementById('mvPrev');
    var vNext = document.getElementById('mvNext');
    var set = [], pos = 0;

    function show(i) {
      pos = (i + set.length) % set.length;
      var m = set[pos];
      vImg.src = m.src; vImg.width = m.w; vImg.height = m.h; vImg.alt = m.alt;
      vCap.textContent = m.cap;
      vOpen.href = m.src;
      vCount.textContent = set.length > 1 ? (pos + 1) + ' of ' + set.length : '';
      vPrev.hidden = vNext.hidden = set.length < 2;
    }
    document.querySelectorAll('.map-thumb').forEach(function (btn) {
      btn.addEventListener('click', function () {
        try { set = JSON.parse(btn.getAttribute('data-maps')); } catch (e) { return; }
        show(0);
        viewer.showModal();
      });
    });
    vPrev.addEventListener('click', function () { show(pos - 1); });
    vNext.addEventListener('click', function () { show(pos + 1); });
    document.getElementById('mvClose').addEventListener('click', function () { viewer.close(); });
    viewer.addEventListener('click', function (e) {   // click on the dark area closes
      if (e.target === viewer || e.target.classList.contains('viewer-fig')) viewer.close();
    });
    viewer.addEventListener('keydown', function (e) {
      if (set.length < 2) return;
      if (e.key === 'ArrowLeft') show(pos - 1);
      if (e.key === 'ArrowRight') show(pos + 1);
    });
    viewer.addEventListener('close', function () { vImg.src = 'data:,'; });
  } else {
    // very old browsers: open the image in a new tab instead
    document.querySelectorAll('.map-thumb').forEach(function (btn) {
      btn.addEventListener('click', function () {
        try { window.open(JSON.parse(btn.getAttribute('data-maps'))[0].src, '_blank'); } catch (e) {}
      });
    });
  }

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
