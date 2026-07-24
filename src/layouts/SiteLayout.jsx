import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import ProfessionalsSubNav from '../components/ProfessionalsSubNav';
import EdIcon from '../components/EdIcon';
import EmailCapture from '../components/EmailCapture';
import { useAuth } from '../lib/useAuth';

/* ── Primary navigation (flat — matches the locked nav structure) ── */
const NAV_LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/professionals', label: 'For Professionals' },
  { to: '/academy', label: 'Academy' },
  { to: '/about', label: 'About' },
  { to: '/guides', label: 'Resources' },
  { to: '/contact', label: 'Contact' },
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
  const location                   = useLocation();
  const { user }                   = useAuth();

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

      <header className={`header ${scrolled ? 'is-scrolled' : 'is-top'}`}>
        <div className="container header-inner">
          {/* Brand */}
          <Link
            to="/"
            className="brand"
            aria-label="Serenest — Home"
          >
            <img src="/favicon.svg" alt="" width="24" height="24" className="brand-mark" />
            <span className="brand-wordmark">
              <span className="brand-text">Serenest</span>
              <span className="brand-tagline">Mental health</span>
            </span>
          </Link>

          {/* Desktop nav (default site) */}
          <nav
            className="header-links"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass}>
                {item.label}
              </NavLink>
            ))}

            <span className="nav-divider" aria-hidden="true" />

            <NavLink
              to={user ? '/patient/dashboard' : '/patient/login'}
              className={navClass}
              style={{ fontWeight: 600 }}
            >
              {user
                ? (patientFirstName ? `Hi, ${patientFirstName}` : 'My account')
                : 'Sign in'}
            </NavLink>

            <Link className="header-cta" to="/book">
              Book an Appointment
            </Link>
          </nav>

          {/* Hamburger */}
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

      {location.pathname.startsWith('/professionals') ? <ProfessionalsSubNav /> : null}

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
              <Link to="/" className="brand" style={{ fontSize: 13 }} onClick={() => setMenuOpen(false)}>
                <span className="brand-wordmark">
                  <span className="brand-text">Serenest</span>
                </span>
              </Link>
              <button
                type="button"
                className="menu-close-btn"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                ✕
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
                className="btn btn-primary btn-full btn-lg"
                to="/book"
                onClick={() => setMenuOpen(false)}
              >
                Book an appointment →
              </Link>
              <p className="menu-drawer-note">
                Prefer a time — we confirm by phone or WhatsApp
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Content ───────────────────────────────────── */}
      <main id="main">
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="ed-footer" aria-label="Site footer">
        <div className="ed-footer__shell">
          {/* Pre-footer CTA */}
          <div className="ed-footer__cta">
            <div>
              <h3>Need help today?</h3>
              <p>Book a consultation with a qualified mental health professional.</p>
            </div>
            <div className="ed-footer__cta-actions">
              <Link
                className="btn btn-primary btn-lg"
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
                className="btn btn-whatsapp btn-lg"
                href="https://wa.me/917777936367?text=Hi%2C%20I%27d%20like%20to%20book%20a%20session%20with%20Serenest"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="ed-footer__grid">
            <div className="ed-footer__brand">
              <Link to="/" className="ed-footer__logo">
                <img src="/favicon.svg" alt="" width="28" height="28" />
                <span>Serenest</span>
              </Link>
              <p>
                Doctor-led mental healthcare, professional learning, and thoughtful
                resources — connected in one calm platform.
              </p>
              <div className="ed-footer__contact">
                <a href="mailto:support@serenest.in"><EdIcon name="mail" size={16} /> support@serenest.in</a>
                <a href="tel:917777936367"><EdIcon name="phone" size={16} /> +91 77779 36367</a>
              </div>
              <div className="ed-footer__social" aria-label="Social links">
                <a
                  href="https://www.instagram.com/serenest.fit"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4.5" />
                    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/serenest-mind-pvt-ltd/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="4" />
                    <path d="M8 11v5M8 8v.5M12 16v-3a2 2 0 0 1 4 0v3M12 11v5" />
                  </svg>
                </a>
                <a
                  className="ed-footer__wa"
                  href="https://wa.me/917777936367?text=Hi%2C%20I%27d%20like%20to%20book%20a%20session%20with%20Serenest"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                >
                  <EdIcon name="chat" size={18} />
                </a>
              </div>
            </div>

            <div className="ed-footer__cols">
              <div>
                <h3 className="ed-footer__title">Care</h3>
                <nav aria-label="Care links">
                  <Link to="/book">Book appointment</Link>
                  <Link to="/patient/find-professional">Find a professional</Link>
                  <Link to="/screening">Self screening</Link>
                  <Link to="/pricing">Pricing</Link>
                </nav>
              </div>
              <div>
                <h3 className="ed-footer__title">Learn</h3>
                <nav aria-label="Learn links">
                  <Link to="/academy">Serenest Academy</Link>
                  <Link to="/blog">Blog</Link>
                  <Link to="/guides">Guides</Link>
                  <Link to="/faq">FAQ</Link>
                </nav>
              </div>
              <div>
                <h3 className="ed-footer__title">Business</h3>
                <nav aria-label="Business links">
                  <Link to="/corporate">Corporate EAP</Link>
                  <Link to="/partner">Partner with us</Link>
                  <Link to="/careers">Careers</Link>
                  <Link to="/professionals">For professionals</Link>
                </nav>
              </div>
              <div>
                <h3 className="ed-footer__title">Company</h3>
                <nav aria-label="Company">
                  <Link to="/about">About Serenest</Link>
                  <Link to="/team">Our team</Link>
                  <a href="mailto:support@serenest.in">Contact us</a>
                </nav>
              </div>
              <div>
                <h3 className="ed-footer__title">Legal</h3>
                <nav aria-label="Legal links">
                  <Link to="/legal">All policies</Link>
                  <Link to="/privacy">Privacy policy</Link>
                  <Link to="/terms">Terms &amp; conditions</Link>
                  <Link to="/refund-policy">Refund policy</Link>
                  <Link to="/grievance-policy">Grievances</Link>
                  <Link to="/cookie-policy">Cookies</Link>
                  <Link to="/emergency-disclaimer">Emergency disclaimer</Link>
                </nav>
              </div>
            </div>

            <div className="ed-footer__subscribe">
              <h3 className="ed-footer__title">Stay in the loop</h3>
              <p>Occasional updates from Serenest. No spam.</p>
              <EmailCapture source="footer_newsletter" variant="light" />
            </div>
          </div>

          <div className="ed-footer__bottom">
            <p>© {new Date().getFullYear()} Serenest Education Pvt Ltd</p>
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
