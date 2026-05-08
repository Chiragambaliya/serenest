/**
 * Client-side SEO: titles, descriptions, canonical URL, Open Graph, Twitter, robots.
 * Set VITE_SITE_URL (e.g. https://serenest.fit) in production so canonicals match your domain.
 */

const DEFAULT_ORIGIN = 'https://serenest.fit';

export function getSiteOrigin() {
  const fromEnv = import.meta.env.VITE_SITE_URL;
  if (fromEnv && typeof fromEnv === 'string') return fromEnv.replace(/\/$/, '');
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin.replace(/\/$/, '');
  return DEFAULT_ORIGIN;
}

/** URL path prefix when the app is not served from domain root (Vite `base`). */
export function getPublicBasePath() {
  const b = import.meta.env.BASE_URL ?? '/';
  if (b === '/') return '';
  return b.replace(/\/$/, '');
}

export function absoluteUrl(pathname) {
  const origin = getSiteOrigin();
  const base = getPublicBasePath();
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${origin}${base}${path}`;
}

const ROUTES = {
  '/': {
    title: 'Serenest — Clinical telepsychiatry for India',
    description:
      'Book secure video and audio psychiatry consultations with licensed clinicians in India. Assessments (PHQ-9, GAD-7), continuity of care, and privacy-first telehealth.',
    isHome: true,
  },
  '/about': {
    title: 'About Serenest',
    description:
      'Learn how Serenest delivers clinical telepsychiatry in India: our team, standards of care, and commitment to safe, documented consultations.',
  },
  '/services': {
    title: 'Services',
    description:
      'Telepsychiatry services: initial assessment, follow-up, therapy coordination, and medication management pathways — delivered online with clear clinical documentation.',
  },
  '/professionals': {
    title: 'Find a professional',
    description:
      'Browse Serenest clinicians and care team members. Book online psychiatry consultations suited to your needs and schedule.',
  },
  '/professionals/apply': {
    title: 'Join as a clinician',
    description:
      'Apply to practise on Serenest. Telepsychiatry platform for licensed mental health professionals in India.',
  },
  '/book': {
    title: 'Book a session',
    description:
      'Request an appointment for a telepsychiatry consultation. Choose your preferred date, mode (video/audio), and practitioner type.',
  },
  '/pricing': {
    title: 'Pricing',
    description:
      'Transparent pricing for Serenest telepsychiatry consultations in India. See session types and how to get started.',
  },
  '/faq': {
    title: 'FAQ',
    description:
      'Frequently asked questions about Serenest: booking, consultations, privacy, prescriptions, and telemedicine in India.',
  },
  '/blog': {
    title: 'Blog',
    description:
      'Articles on mental health privacy, measurement-based care (PHQ-9, GAD-7), and telemedicine guidance for patients in India.',
  },
  '/privacy': {
    title: 'Privacy policy',
    description:
      'How Serenest handles personal and health information, security practices, and your rights when using our telepsychiatry platform.',
  },
  '/patient/find-professional': {
    title: 'Find a professional',
    description:
      'Search Serenest professionals by language, focus area, and availability. Book a telepsychiatry session online.',
  },
  '/screening': {
    title: 'Mental health self-screening',
    description:
      'Confidential PHQ-9 and GAD-7 screening plus optional tools (sleep, wellbeing, alcohol, and more). Not a diagnosis — results help our care team triage.',
  },
};

const KNOWN_EXACT = new Set(Object.keys(ROUTES));

function blogFallback() {
  return {
    title: 'Blog',
    description: ROUTES['/blog'].description,
  };
}

/**
 * @param {string} pathname
 * @returns {{ title: string, description: string, isHome?: boolean, noindex?: boolean, ogType?: string }}
 */
export function seoForPathname(pathname) {
  if (pathname.startsWith('/admin')) {
    return {
      title: 'Admin',
      description: 'Serenest internal admin.',
      noindex: true,
    };
  }
  if (pathname.startsWith('/consultation/')) {
    return {
      title: 'Consultation',
      description: 'Secure telepsychiatry consultation room.',
      noindex: true,
    };
  }

  if (KNOWN_EXACT.has(pathname)) return { ...ROUTES[pathname] };

  if (pathname.startsWith('/blog/') && pathname !== '/blog') {
    return blogFallback();
  }

  return {
    title: 'Page not found',
    description: 'This page is not available on Serenest. Return to the home page or use the menu to continue.',
    noindex: true,
  };
}

function setMetaName(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaProperty(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMetaName(name) {
  document.querySelectorAll(`meta[name="${name}"]`).forEach((n) => n.remove());
}

function setCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setHreflang(href) {
  let el = document.querySelector('link[rel="alternate"][hreflang="en-IN"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'alternate');
    el.setAttribute('hreflang', 'en-IN');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function formatTitle(title, isHome) {
  if (isHome) return title;
  if (/\|\s*Serenest\s*$/i.test(title)) return title;
  return `${title} | Serenest`;
}

/**
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} opts.description
 * @param {string} [opts.path]
 * @param {boolean} [opts.noindex]
 * @param {string} [opts.ogType]
 * @param {boolean} [opts.isHome]
 */
export function applyPageSeo(opts) {
  const {
    title,
    description,
    path = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/',
    noindex = false,
    ogType = 'website',
    isHome = false,
  } = opts;

  const pathOnly = path.split('?')[0] || '/';
  const normalizedPath = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
  const url = absoluteUrl(normalizedPath);

  const fullTitle = formatTitle(title, isHome);

  document.title = fullTitle;

  setMetaName('description', description);
  setMetaProperty('og:title', fullTitle);
  setMetaProperty('og:description', description);
  setMetaProperty('og:url', url);
  setMetaProperty('og:type', ogType);
  setMetaProperty('og:site_name', 'Serenest');
  setMetaProperty('og:locale', 'en_IN');

  setMetaName('twitter:card', 'summary_large_image');
  setMetaName('twitter:title', fullTitle);
  setMetaName('twitter:description', description);

  const ogImage = import.meta.env.VITE_OG_IMAGE_URL || absoluteUrl('/favicon.svg');
  setMetaProperty('og:image', ogImage);
  setMetaName('twitter:image', ogImage);

  setCanonical(url);
  setHreflang(url);

  if (noindex) {
    setMetaName('robots', 'noindex, nofollow');
  } else {
    removeMetaName('robots');
    setMetaName('robots', 'index, follow');
  }
}
