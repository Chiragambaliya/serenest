import { useEffect } from 'react';
import { canonicalUrl, SITE_ORIGIN } from './seo.js';

// On initial document load, server.js injects the route-correct title,
// meta description, canonical, OG tags, and JSON-LD into the HTML between
// the <!--SEO_HEAD_START--> sentinels. This hook only needs to keep those
// in sync when the user navigates client-side within the SPA. It updates
// the existing tags in place (no duplicates) and intentionally leaves
// JSON-LD alone — the server-rendered block stays authoritative.

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

export function useSEO(opts) {
  const {
    path,
    title,
    description,
    ogTitle,
    ogDescription,
    noindex = false,
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

    if (noindex) {
      setMeta('name', 'robots', 'noindex, nofollow');
    } else {
      const el = document.head.querySelector('meta[name="robots"]');
      if (el) el.remove();
    }
  }, [path, title, description, ogTitle, ogDescription, noindex]);

  return { canonical: canonicalUrl(path || '/'), origin: SITE_ORIGIN };
}
