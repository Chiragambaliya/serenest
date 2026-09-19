import { useEffect } from 'react';
import {
  canonicalUrl,
  SITE_ORIGIN,
  OG_IMAGE,
  OG_IMAGE_ALT,
} from './seo.js';

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

function setLink(rel, href, extra = {}) {
  const extraSel = Object.entries(extra)
    .map(([k, v]) => `[${k}="${v}"]`)
    .join('');
  let el = document.head.querySelector(`link[rel="${rel}"]${extraSel}`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    for (const [k, v] of Object.entries(extra)) el.setAttribute(k, v);
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
    ogType,
    noindex = false,
  } = opts || {};

  useEffect(() => {
    if (title) document.title = title;
    if (description) setMeta('name', 'description', description);

    const url = canonicalUrl(path || '/');
    setLink('canonical', url);
    setLink('alternate', url, { hreflang: 'en-IN' });
    setLink('alternate', url, { hreflang: 'x-default' });

    const resolvedOgType = ogType || (path && path.startsWith('/blog/') ? 'article' : 'website');
    setMeta('property', 'og:title', ogTitle || title);
    setMeta('property', 'og:description', ogDescription || description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', resolvedOgType);
    setMeta('property', 'og:locale', 'en_IN');
    setMeta('property', 'og:site_name', 'Serenest');
    setMeta('property', 'og:image', OG_IMAGE);
    setMeta('property', 'og:image:alt', OG_IMAGE_ALT);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', ogTitle || title);
    setMeta('name', 'twitter:description', ogDescription || description);
    setMeta('name', 'twitter:image', OG_IMAGE);
    setMeta('name', 'twitter:image:alt', OG_IMAGE_ALT);

    if (noindex) {
      setMeta('name', 'robots', 'noindex, nofollow');
    } else {
      const el = document.head.querySelector('meta[name="robots"]');
      if (el) el.remove();
    }
  }, [path, title, description, ogTitle, ogDescription, ogType, noindex]);

  return { canonical: canonicalUrl(path || '/'), origin: SITE_ORIGIN };
}
