import { useEffect } from 'react';
import { canonicalUrl, ogTypeFor, SITE_ORIGIN } from './seo.js';

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
    setMeta('property', 'og:type', ogTypeFor(path || '/'));
    setMeta('property', 'og:site_name', 'Serenest');
    setMeta('name', 'twitter:title', ogTitle || title);
    setMeta('name', 'twitter:description', ogDescription || description);

    if (noindex) {
      setMeta('name', 'robots', 'noindex, nofollow');
    } else {
      // Mirror the server-rendered default so client navigation never leaves
      // a stale noindex behind.
      setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }
  }, [path, title, description, ogTitle, ogDescription, noindex]);

  return { canonical: canonicalUrl(path || '/'), origin: SITE_ORIGIN };
}
