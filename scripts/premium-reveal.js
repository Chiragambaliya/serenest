/**
 * Premium scroll reveal — adds .visible to .reveal / .reveal-scale when in viewport
 * Use with premium.css for smooth, staggered section animations
 */
(function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

  function observeReveals() {
    document.querySelectorAll('.reveal, .reveal-scale').forEach(function(el) {
      if (!el.classList.contains('visible')) observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeReveals);
  } else {
    observeReveals();
  }
})();
