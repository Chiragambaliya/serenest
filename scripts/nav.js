(function() {
  'use strict';

  function closeMenu(navMenu, hamburger, body) {
    if (!navMenu) return;
    navMenu.classList.remove('open');
    if (hamburger) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    }
    if (body) body.classList.remove('nav-open');
  }

  function initNav() {
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('nav-menu');
    if (!hamburger || !navMenu) return;

    var body = document.body;

    // Backdrop (mobile: tap outside to close) click outside to close (mobile)
    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    body.appendChild(backdrop);

    backdrop.addEventListener('click', function() {
      closeMenu(navMenu, hamburger, body);
    });

    hamburger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      body.classList.toggle('nav-open', isOpen);
    });

    navMenu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        closeMenu(navMenu, hamburger, body);
      });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu(navMenu, hamburger, body);
      }
    });

    window.addEventListener('resize', function() {
      if (window.innerWidth > 900 && navMenu.classList.contains('open')) {
        closeMenu(navMenu, hamburger, body);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
