import { useEffect, useRef } from 'react';

/**
 * Calm scroll reveals — respects prefers-reduced-motion.
 */
export function useReveal(selector = '[data-reveal]') {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = [...root.querySelectorAll(selector)];

    if (reduce) {
      nodes.forEach((el) => el.classList.add('is-revealed'));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
    );

    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector]);

  return rootRef;
}

/**
 * Auto-tags a page's top-level <section> elements with calm scroll reveals —
 * no per-section markup needed. Respects prefers-reduced-motion.
 */
export function useSectionReveal() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const nodes = [...root.querySelectorAll(':scope > section')];
    nodes.forEach((el) => el.classList.add('srn-reveal'));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
    );

    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return rootRef;
}

/**
 * Site-wide: watch <main> for page sections after each route change
 * and apply the same calm scroll reveals used on the homepage.
 */
export function useMainReveal(pathname) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    // Prefer direct page sections; fall back to nested top sections.
    let nodes = [...root.querySelectorAll(':scope > section')];
    if (nodes.length === 0) {
      const page = root.firstElementChild;
      if (page) nodes = [...page.querySelectorAll(':scope > section')];
    }
    // Cap work on very long pages (legal, etc.)
    nodes = nodes.slice(0, 14);

    nodes.forEach((el) => {
      el.classList.add('srn-reveal');
      el.classList.remove('is-revealed');
    });

    // Reveal anything already in view (hero / above fold)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
    );

    nodes.forEach((el) => io.observe(el));

    // Immediate reveal for elements already intersecting
    requestAnimationFrame(() => {
      nodes.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
          el.classList.add('is-revealed');
          io.unobserve(el);
        }
      });
    });

    return () => io.disconnect();
  }, [pathname]);

  return rootRef;
}
