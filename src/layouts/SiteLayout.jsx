import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import EmailCapture from '../components/EmailCapture';
import { useAuth } from '../lib/useAuth';
import { useMainReveal } from '../hooks/useReveal';

/* Editorial seal — filled oval with a drawn S, not a generic leaf. */
function BrandMark({ size = 42 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="brand-mark"
    >
      <ellipse cx="24" cy="24" rx="22" ry="23.5" className="brand-mark__fill" />
      <ellipse
        cx="24"
        cy="24"
        rx="20.25"
        ry="21.75"
        stroke="currentColor"
        strokeWidth="1.2"
        className="brand-mark__ring"
      />
      <path
        d="M30.6 15.2c-1.9-1.7-4.4-2.55-7.3-2.55-5.2 0-8.55 2.7-8.55 6.35 0 3.15 2.1 4.9 6.45 5.95l3.7.85c2.7.65 3.9 1.5 3.9 3.05 0 2-2 3.4-5.2 3.4-2.5 0-4.65-.65-6.55-1.95"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.4 32.8c1.85 1.6 4.25 2.45 7.05 2.45 5.05 0 8.35-2.6 8.35-6.2 0-3-2-4.8-6.25-5.75l-3.65-.85c-2.9-.65-4.15-1.55-4.15-3.15 0-1.85 1.8-3.15 4.75-3.15 2.2 0 4.15.6 5.9 1.75"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.42"
      />
    </svg>
  );
}

/* Primary navigation — editorial masthead, not a SaaS link strip. */
const NAV_LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/professionals', label: 'Professionals' },
  { to: '/academy', label: 'Academy' },
  { to: '/about', label: 'About' },
  { to: '/resources', label: 'Reading' },
  { to: '/contact', label: 'Contact' },
];

const FOOTER_GROUPS = [
  {
    title: 'Care',
    links: [
      { to: '/book', label: 'Book appointment' },
      { to: '/patient/find-professional', label: 'Find a professional' },
      { to: '/screening', label: 'Self screening' },
      { to: '/pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { to: '/academy', label: 'Academy' },
      { to: '/blog', label: 'Blog' },
      { to: '/guides', label: 'Guides' },
      { to: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Work with us',
    links: [
      { to: '/corporate', label: 'Corporate EAP' },
      { to: '/partner', label: 'Partner' },
      { to: '/careers', label: 'Careers' },
      { to: '/professionals', label: 'For professionals' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/team', label: 'Team' },
      { to: '/contact', label: 'Contact' },
    ],
  },
];

const FOOTER_LEGAL = [
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/refund-policy', label: 'Refunds' },
  { to: '/cookie-policy', label: 'Cookies' },
  { to: '/legal', label: 'All policies' },
];

/* Secondary links kept in the footer and on their parent pages rather
   than the header, to keep the nav bar from getting oversized:
   Book a Consultation (/book), Find a Professional
   (/patient/find-professional), Self-Screening (/screening), Pricing
   (/pricing), Blog (/blog), FAQ (/faq), Corporate EAP (/corporate),
   Partner (/partner), Careers (/careers), Our Team (/team). */

export default function SiteLayout() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [footerOpen, setFooterOpen] = useState(null);
  const location                   = useLocation();
  const { user }                   = useAuth();
  const mainRef                    = useMainReveal(location.pathname);

  const isPatient = user?.user_metadata?.role === 'patient' || Boolean(user);
  const patientFirstName = user
    ? (user.user_metadata?.full_name || user.user_metadata?.name || '').split(' ')[0]
    : '';

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Footer / in-app links change the route but keep the old scroll offset,
  // so the new page looks like it "didn't load" (still stuck at the bottom).
  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      // Wait a tick so the new page can mount before we seek the anchor.
      const t = window.setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'auto', block: 'start' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
      }, 0);
      return () => window.clearTimeout(t);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.hash, location.key]);

  // Scroll-aware header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, handleKeyDown]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Active nav link helper
  const navClass = ({ isActive }) =>
    isActive ? 'nav-link nav-link-active' : 'nav-link';

  // Avoid covering form CTA buttons on mobile pages.
  const hideFloatingWhatsApp =
    location.pathname.startsWith('/book') ||
    location.pathname.startsWith('/professionals/apply') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/consultation');

  return (
    <div className="theme-editorial">
      <a className="skip-link" href="#main">Skip to content</a>

      <header className={`header masthead ${scrolled ? 'is-scrolled' : 'is-top'}`}>
        <div className="container header-inner masthead__inner">
          <Link
            to="/"
            className="brand"
            aria-label="Serenest — Home"
          >
            <BrandMark size={44} />
            <span className="brand-wordmark">
              <span className="brand-text">Serenest</span>
              <span className="brand-tagline">Clinical practice</span>
            </span>
          </Link>

          <nav
            className="header-links masthead__nav"
            aria-label="Main navigation"
          >
            <div className="masthead__links" role="list">
              {NAV_LINKS.map((item) => (
                <NavLink key={item.to} to={item.to} className={navClass} role="listitem">
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="masthead__actions">
              <NavLink
                to={user ? '/patient/dashboard' : '/patient/login'}
                className="masthead__account"
              >
                {user
                  ? (patientFirstName ? `Hi, ${patientFirstName}` : 'Account')
                  : 'Sign in'}
              </NavLink>

              <Link className="header-cta masthead__cta" to="/book">
                <span className="masthead__cta-label">Book appointment</span>
                <span className="masthead__cta-arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </nav>

          <button
            type="button"
            className={`menu-btn ${menuOpen ? 'is-open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="menu-bars" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer ──────────────────────────────────── */}
      {menuOpen && (
        <div
          className="menu-overlay"
          role="presentation"
          onClick={() => setMenuOpen(false)}
        >
          <aside
            id="mobile-menu"
            className="menu-drawer"
            role="dialog"
            aria-label="Mobile navigation"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="menu-drawer-head">
              <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
                <BrandMark size={32} />
                <span className="brand-wordmark">
                  <span className="brand-text">Serenest</span>
                  <span className="brand-tagline">Clinical practice</span>
                </span>
              </Link>
              <button
                type="button"
                className="menu-close-btn"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                Close
              </button>
            </div>

            {/* Nav links — grouped */}
            <nav className="menu-links" aria-label="Mobile navigation">
              {user ? (
                <div className="menu-section">
                  <Link to="/patient/dashboard" className="menu-link menu-link--accent" onClick={() => setMenuOpen(false)}>
                    {patientFirstName ? `Hi, ${patientFirstName}` : 'My account'}
                    <span className="menu-link-arrow">→</span>
                  </Link>
                </div>
              ) : (
                <div className="menu-section">
                  <Link to="/patient/login" className="menu-link menu-link--accent" onClick={() => setMenuOpen(false)}>
                    Sign in
                    <span className="menu-link-arrow">→</span>
                  </Link>
                </div>
              )}

              <div className="menu-section">
                <p className="menu-section-label">Menu</p>
                {NAV_LINKS.map((item) => (
                  <Link key={item.to} to={item.to} className="menu-link" onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="menu-section">
                <p className="menu-section-label">Quick links</p>
                <Link to="/screening"                 className="menu-link" onClick={() => setMenuOpen(false)}>Self-Screening</Link>
                <Link to="/patient/find-professional" className="menu-link" onClick={() => setMenuOpen(false)}>Find a Professional</Link>
                <Link to="/pricing"                   className="menu-link" onClick={() => setMenuOpen(false)}>Pricing</Link>
                <Link to="/blog"                      className="menu-link" onClick={() => setMenuOpen(false)}>Blog</Link>
                <Link to="/faq"                        className="menu-link" onClick={() => setMenuOpen(false)}>FAQ</Link>
                <Link to="/team"                       className="menu-link" onClick={() => setMenuOpen(false)}>Our Team</Link>
                <Link to="/careers"                    className="menu-link" onClick={() => setMenuOpen(false)}>Careers</Link>
              </div>
            </nav>

            {/* CTA */}
            <div className="menu-drawer-foot">
              <Link
                className="header-cta masthead__cta masthead__cta--drawer"
                to="/book"
                onClick={() => setMenuOpen(false)}
              >
                <span className="masthead__cta-label">Book appointment</span>
                <span className="masthead__cta-arrow" aria-hidden="true">→</span>
              </Link>
              <p className="menu-drawer-note">
                Prefer a time — we confirm by phone or WhatsApp
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Content ───────────────────────────────────── */}
      <main id="main" ref={mainRef}>
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="ed-footer" aria-label="Site footer">
        <div className="ed-footer__shell">
          <div className="ed-footer__cta">
            <div className="ed-footer__cta-copy">
              <h3>Need help today?</h3>
              <p>Book a consultation with a qualified mental health professional.</p>
            </div>
            <div className="ed-footer__cta-actions">
              <Link
                className="btn btn-primary"
                to="/book"
                onClick={() => {
                  if (location.pathname.startsWith('/book')) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                Book appointment
              </Link>
              <a
                className="btn btn-whatsapp"
                href="https://wa.me/917777936367?text=Hi%2C%20I%27d%20like%20to%20book%20a%20session%20with%20Serenest"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="ed-footer__main">
            <div className="ed-footer__brand">
              <Link to="/" className="ed-footer__logo">
                <BrandMark size={28} />
                <span>Serenest</span>
              </Link>
              <p>Doctor-led mental healthcare across India.</p>
              <div className="ed-footer__contact">
                <a href="mailto:support@serenest.in">support@serenest.in</a>
                <span aria-hidden="true" className="ed-footer__dot" />
                <a href="tel:+917777936367">+91 77779 36367</a>
              </div>
            </div>

            <div className="ed-footer__cols">
              {FOOTER_GROUPS.map((group) => {
                const isOpen = footerOpen === group.title;
                return (
                  <details
                    key={group.title}
                    className="ed-footer__drop"
                    open={isOpen}
                  >
                    <summary
                      className="ed-footer__title"
                      onClick={(e) => {
                        e.preventDefault();
                        setFooterOpen(isOpen ? null : group.title);
                      }}
                    >
                      <span>{group.title}</span>
                      <span className="ed-footer__toggle" aria-hidden="true" />
                    </summary>
                    <nav aria-label={`${group.title} links`}>
                      {group.links.map((link) => (
                        <Link key={link.to} to={link.to}>{link.label}</Link>
                      ))}
                    </nav>
                  </details>
                );
              })}
            </div>
          </div>

          <div className="ed-footer__subscribe">
            <div className="ed-footer__subscribe-copy">
              <h3>Stay in the loop</h3>
              <p>Occasional updates. No spam.</p>
            </div>
            <EmailCapture source="footer_newsletter" variant="light" />
          </div>

          <div className="ed-footer__bottom">
            <p>© {new Date().getFullYear()} Serenest Education Pvt Ltd</p>
            <nav className="ed-footer__legal" aria-label="Legal">
              {FOOTER_LEGAL.map((link) => (
                <Link key={link.to} to={link.to}>{link.label}</Link>
              ))}
            </nav>
            <p className="ed-footer__made">Made with care in India</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp floating button */}
      {!hideFloatingWhatsApp && (
        <a
          href="https://wa.me/917777936367?text=Hi%2C%20I%27d%20like%20to%20book%20a%20session%20with%20Serenest"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Chat with us on WhatsApp"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 999,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#25D366',
            boxShadow: '0 4px 16px rgba(37,211,102,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,211,102,0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.45)';
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}
    </div>
  );
}
