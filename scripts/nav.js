(function() {
  'use strict';
  function initNav() {
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('nav-menu');
    if (!hamburger || !navMenu) return;
    hamburger.addEventListener('click', function() {
      var isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
    navMenu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
      });
    });
  }
  if (document.body) initNav();
  else document.addEventListener('DOMContentLoaded', initNav);
})();
