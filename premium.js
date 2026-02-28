/* ═══════════════════════════════════════════════════
   SERENEST — PREMIUM INTERACTIONS
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  const isMobile = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ─────────────────────────────────────────
     PAGE LOADER
  ───────────────────────────────────────── */
  const loader = document.querySelector('.page-loader');
  if (loader) {
    const hide = () => loader.classList.add('hidden');
    if (document.readyState === 'complete') {
      setTimeout(hide, 1500);
    } else {
      window.addEventListener('load', () => setTimeout(hide, 900));
      setTimeout(hide, 2200); // failsafe
    }
  }

  /* ─────────────────────────────────────────
     CUSTOM CURSOR
  ───────────────────────────────────────── */
  if (!isMobile) {
    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = -100, my = -100, rx = -100, ry = -100;
    let raf;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
    });

    const lerp = (a, b, t) => a + (b - a) * t;
    const tickRing = () => {
      rx = lerp(rx, mx, 0.1);
      ry = lerp(ry, my, 0.1);
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      raf = requestAnimationFrame(tickRing);
    };
    tickRing();

    document.addEventListener('mousedown', () => {
      dot.classList.add('clicking');
      ring.classList.add('clicking');
    });
    document.addEventListener('mouseup', () => {
      dot.classList.remove('clicking');
      ring.classList.remove('clicking');
    });
    document.addEventListener('mouseleave', () => { ring.classList.add('hidden'); });
    document.addEventListener('mouseenter', () => { ring.classList.remove('hidden'); });

    const hoverEls = 'a, button, [onclick], .filter-btn, .cat-btn, .faq-question, .session-type, .time-slot, .condition-pill, .pill, .specialist-card, .feature-card, .team-card, .testimonial-card, .post-card, .contact-method, .benefit-card, .who-card, .service-card, .expect-card, .mission-stat, .tilt-card, .slider-dot, .social-link, .marquee-pill';
    document.querySelectorAll(hoverEls).forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
    });
  }

  /* ─────────────────────────────────────────
     SCROLL PROGRESS BAR
  ───────────────────────────────────────── */
  const progressEl = document.createElement('div');
  progressEl.className = 'scroll-progress-bar';
  document.body.appendChild(progressEl);

  const updateProgress = () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? scrollTop / docHeight : 0;
    progressEl.style.transform = `scaleX(${pct})`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ─────────────────────────────────────────
     ENHANCED SCROLL REVEAL
  ───────────────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseFloat(el.style.transitionDelay) || 0;
      setTimeout(() => el.classList.add('visible'), delay * 1000);
      revealObs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObs.observe(el);
  });

  /* ─────────────────────────────────────────
     NAV SCROLL EFFECT
  ───────────────────────────────────────── */
  const navbar = document.getElementById('navbar') || document.querySelector('nav');
  if (navbar) {
    const desktop = window.innerWidth > 900;
    const updateNav = () => {
      const s = window.scrollY > 50;
      navbar.classList.toggle('scrolled', s);
      navbar.style.padding = s
        ? (desktop ? '12px 60px' : '12px 24px')
        : (desktop ? '20px 60px' : '16px 24px');
    };
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ─────────────────────────────────────────
     MOBILE NAV DRAWER
  ───────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    // Build drawer from nav-menu links
    const navMenu = document.getElementById('nav-menu');
    const links   = navMenu ? Array.from(navMenu.querySelectorAll('a')) : [];

    const drawer = document.createElement('div');
    drawer.className = 'nav-drawer';
    const currentPage = location.pathname.split('/').pop() || 'index.html';

    const linkHTML = links
      .filter(l => !l.classList.contains('nav-cta'))
      .map(l => {
        const href = l.getAttribute('href') || '#';
        const isActive = href === currentPage ? ' active-link' : '';
        return `<a href="${href}" class="drawer-link${isActive}">${l.textContent.trim()}</a>`;
      }).join('');

    drawer.innerHTML = `
      <div class="drawer-backdrop"></div>
      <div class="drawer-panel">
        <button class="drawer-close" aria-label="Close menu">✕</button>
        <a href="index.html" class="drawer-logo">Sere<span>nest</span></a>
        <nav class="drawer-nav">${linkHTML}</nav>
        <a href="book.html" class="drawer-cta-btn">Book a Consultation →</a>
      </div>`;
    document.body.appendChild(drawer);

    const openDrawer  = () => {
      drawer.classList.add('open');
      hamburger.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
    };
    const closeDrawer = () => {
      drawer.classList.remove('open');
      hamburger.classList.remove('is-open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    };

    hamburger.addEventListener('click', openDrawer);
    drawer.querySelector('.drawer-close').addEventListener('click', closeDrawer);
    drawer.querySelector('.drawer-backdrop').addEventListener('click', closeDrawer);
    drawer.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', closeDrawer));

    // Escape key
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  }

  /* ─────────────────────────────────────────
     ANIMATED COUNTER
  ───────────────────────────────────────── */
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el       = entry.target;
      const raw      = el.dataset.count;
      const suffix   = el.dataset.suffix || '';
      const prefix   = el.dataset.prefix || '';
      if (!raw) return;

      const target   = parseFloat(raw);
      const isDecimal = raw.includes('.');
      const dur      = 2200;
      const start    = performance.now();

      const easeOut  = t => 1 - Math.pow(1 - t, 3);
      const tick     = now => {
        const p   = Math.min((now - start) / dur, 1);
        const val = target * easeOut(p);
        el.textContent = prefix + (isDecimal ? val.toFixed(1) : Math.floor(val).toLocaleString('en-IN')) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

  /* ─────────────────────────────────────────
     3D CARD TILT
  ───────────────────────────────────────── */
  if (!isMobile) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      let animFrame;
      let targetX = 0, targetY = 0, curX = 0, curY = 0;

      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        targetX = ((e.clientY - r.top)  / r.height - 0.5) * -10;
        targetY = ((e.clientX - r.left) / r.width  - 0.5) *  10;

        if (!animFrame) {
          const lerp = (a, b, t) => a + (b - a) * 0.15;
          const frame = () => {
            curX = lerp(curX, targetX, 0.15);
            curY = lerp(curY, targetY, 0.15);
            card.style.transform = `perspective(900px) rotateX(${curX}deg) rotateY(${curY}deg) scale(1.025)`;
            if (Math.abs(curX - targetX) > 0.01 || Math.abs(curY - targetY) > 0.01) {
              animFrame = requestAnimationFrame(frame);
            } else {
              animFrame = null;
            }
          };
          animFrame = requestAnimationFrame(frame);
        }
      });

      card.addEventListener('mouseleave', () => {
        cancelAnimationFrame(animFrame);
        animFrame = null;
        targetX = 0; targetY = 0;
        card.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease';
        card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
        setTimeout(() => { card.style.transition = ''; }, 550);
      });
    });
  }

  /* ─────────────────────────────────────────
     MAGNETIC BUTTONS
  ───────────────────────────────────────── */
  if (!isMobile) {
    document.querySelectorAll('.magnetic-wrap').forEach(wrap => {
      wrap.addEventListener('mousemove', e => {
        const r  = wrap.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) * 0.28;
        const dy = (e.clientY - r.top  - r.height / 2) * 0.28;
        wrap.style.transform  = `translate(${dx}px, ${dy}px)`;
        wrap.style.transition = 'transform 0.15s ease';
      });
      wrap.addEventListener('mouseleave', () => {
        wrap.style.transform  = 'translate(0, 0)';
        wrap.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      });
    });
  }

  /* ─────────────────────────────────────────
     TESTIMONIAL AUTO-SLIDER
  ───────────────────────────────────────── */
  const sliderEl   = document.querySelector('.testimonials-slider');
  const dotsWrap   = document.querySelector('.slider-dots');
  if (sliderEl && dotsWrap) {
    const cards     = sliderEl.querySelectorAll('.testimonial-card');
    const numCards  = cards.length;
    let current     = 0;
    let autoTimer;

    const dots = Array.from(dotsWrap.querySelectorAll('.slider-dot'));

    const goTo = (i) => {
      current = ((i % numCards) + numCards) % numCards;
      const cardW = cards[0].offsetWidth + 24;
      sliderEl.style.transform = `translateX(-${current * cardW}px)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === current));
    };

    dots.forEach((dot, i) => dot.addEventListener('click', () => { clearInterval(autoTimer); goTo(i); resetAuto(); }));
    goTo(0);

    const resetAuto = () => { autoTimer = setInterval(() => goTo(current + 1), 4200); };
    resetAuto();

    const outerWrap = sliderEl.closest('.testimonials-slider-outer');
    if (outerWrap) {
      outerWrap.addEventListener('mouseenter', () => clearInterval(autoTimer));
      outerWrap.addEventListener('mouseleave', () => resetAuto());
    }

    // Touch swipe
    let touchStartX = 0;
    sliderEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    sliderEl.addEventListener('touchend', e => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 50) { clearInterval(autoTimer); goTo(current + (dx > 0 ? 1 : -1)); resetAuto(); }
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     PARALLAX (desktop only)
  ───────────────────────────────────────── */
  if (!isMobile) {
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (parallaxEls.length) {
      let ticking = false;
      const doParallax = () => {
        parallaxEls.forEach(el => {
          const speed  = parseFloat(el.dataset.parallax) || 0.2;
          const rect   = el.parentElement?.getBoundingClientRect() || el.getBoundingClientRect();
          const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed;
          el.style.transform = `translateY(${offset}px)`;
        });
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(doParallax); ticking = true; }
      }, { passive: true });
    }
  }

  /* ─────────────────────────────────────────
     RIPPLE EFFECT ON BUTTONS
  ───────────────────────────────────────── */
  document.querySelectorAll('.btn-primary, .btn-white, .form-submit').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const r = this.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      ripple.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:${size}px; height:${size}px;
        left:${e.clientX - r.left - size/2}px; top:${e.clientY - r.top - size/2}px;
        background:rgba(255,255,255,0.25); transform:scale(0);
        animation:rippleAnim 0.55s ease-out forwards;`;
      if (!document.getElementById('ripple-style')) {
        const s = document.createElement('style');
        s.id = 'ripple-style';
        s.textContent = '@keyframes rippleAnim{to{transform:scale(1);opacity:0;}}';
        document.head.appendChild(s);
      }
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ─────────────────────────────────────────
     STAGGER CHILDREN ON VISIBLE
  ───────────────────────────────────────── */
  const staggerObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const children = entry.target.querySelectorAll(':scope > .reveal');
      children.forEach((child, i) => {
        setTimeout(() => child.classList.add('visible'), i * 90);
      });
      staggerObs.unobserve(entry.target);
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.steps-grid, .features-grid, .benefits-grid, .team-grid, .testimonials-grid, .who-grid, .process-grid, .footer-grid').forEach(el => {
    staggerObs.observe(el);
  });

  /* ─────────────────────────────────────────
     STATS BAR COUNTER TRIGGER
  ───────────────────────────────────────── */
  // Already handled by the [data-count] observer above

  /* ─────────────────────────────────────────
     TYPED / TYPEWRITER (index hero only)
  ───────────────────────────────────────── */
  const typeTargets = document.querySelectorAll('[data-typewriter]');
  typeTargets.forEach(el => {
    const phrases = el.dataset.typewriter.split('|');
    let pi = 0, ci = 0, deleting = false;
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    cursor.style.cssText = 'display:inline-block;width:2px;background:var(--sage,#7D9B76);height:0.85em;margin-left:3px;vertical-align:middle;animation:twBlink 0.75s step-end infinite;';
    if (!document.getElementById('tw-style')) {
      const s = document.createElement('style');
      s.id = 'tw-style';
      s.textContent = '@keyframes twBlink{0%,100%{opacity:1}50%{opacity:0}}';
      document.head.appendChild(s);
    }
    el.appendChild(cursor);
    const tick = () => {
      const phrase = phrases[pi];
      if (!deleting) {
        el.firstChild.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) { deleting = true; setTimeout(tick, 2200); return; }
        setTimeout(tick, 80 + Math.random() * 40);
      } else {
        el.firstChild.textContent = phrase.slice(0, --ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 400); return; }
        setTimeout(tick, 45);
      }
    };
    // Wrap text in a span
    const textNode = el.childNodes[0];
    if (textNode && textNode.nodeType === 3) {
      const span = document.createElement('span');
      span.textContent = '';
      el.insertBefore(span, el.firstChild);
      textNode.remove();
    }
    setTimeout(tick, 1200);
  });

  /* ─────────────────────────────────────────
     SMOOTH HOVER LINE ON NAV LINKS
  ───────────────────────────────────────── */
  // Handled purely via CSS ::after

  /* ─────────────────────────────────────────
     FORM SUCCESS ANIMATIONS (enhance existing)
  ───────────────────────────────────────── */
  document.querySelectorAll('.form-submit').forEach(btn => {
    btn.addEventListener('click', function () {
      const form = this.closest('form');
      if (!form) return;
      // native browser validation runs first; success state handled per-page
    });
  });

})();
