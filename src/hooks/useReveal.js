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
