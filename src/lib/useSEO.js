import { useEffect } from 'react';
import { canonicalUrl, SITE_ORIGIN } from './seo.js';

function setMeta(attr, key, content) {
  if (content == null) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// Track per-page JSON-LD blocks we injected so we can remove them on unmount.
function clearManagedJsonLd() {
  document.head
    .querySelectorAll('script[type="application/ld+json"][data-managed="route"]')
    .forEach((n) => n.remove());
}

function addJsonLd(obj) {
  if (!obj) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-managed', 'route');
  script.text = JSON.stringify(obj);
  document.head.appendChild(script);
}

/**
 * Set per-route SEO head tags. Call once per page with stable values.
 *
 * @param {Object} opts
 * @param {string} opts.path     - canonical route path, e.g. "/services"
 * @param {string} opts.title
 * @param {string} opts.description
 * @param {string} [opts.ogTitle]
 * @param {string} [opts.ogDescription]
 * @param {boolean} [opts.noindex]
 * @param {Object|Object[]} [opts.jsonLd] - page-specific structured data
 */
export function useSEO(opts) {
  const {
    path,
    title,
    description,
    ogTitle,
    ogDescription,
    noindex = false,
    jsonLd,
  } = opts || {};

  useEffect(() => {
    if (title) document.title = title;
    if (description) setMeta('name', 'description', description);

    const url = canonicalUrl(path || '/');
    setLink('canonical', url);

    setMeta('property', 'og:title', ogTitle || title);
    setMeta('property', 'og:description', ogDescription || description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', path === '/' ? 'website' : 'article');
    setMeta('property', 'og:site_name', 'Serenest');

    // Robots
    if (noindex) {
      setMeta('name', 'robots', 'noindex, nofollow');
    } else {
      const el = document.head.querySelector('meta[name="robots"]');
      if (el) el.remove();
    }

    // Page-specific JSON-LD (cleared on unmount; homepage globals in index.html remain).
    clearManagedJsonLd();
    if (jsonLd) {
      const arr = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      arr.forEach(addJsonLd);
    }

    return () => {
      clearManagedJsonLd();
    };
  }, [path, title, description, ogTitle, ogDescription, noindex, jsonLd]);

  return { canonical: canonicalUrl(path || '/'), origin: SITE_ORIGIN };
}
