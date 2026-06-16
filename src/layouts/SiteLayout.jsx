import React, { useEffect, useState, useCallback } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import ProfessionalsSubNav from '../components/ProfessionalsSubNav';

export default function SiteLayout() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const location                   = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

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
    <div>
      <a className="skip-link" href="#main">Skip to content</a>

      {/* ── Header ─────────────────────────────────────────── */}
      <header className={`header ${scrolled ? 'is-scrolled' : 'is-top'}`}>
        <div className="container header-inner">
          {/* Brand */}
          <Link to="/" className="brand" aria-label="Serenest — Home">
            <span className="brand-wordmark">
              <span className="brand-text">Serenest</span>
              <span className="brand-tagline">Mind care, simplified</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="header-links" aria-label="Main navigation">
            <NavLink to="/about"         className={navClass}>About</NavLink>
            <NavLink to="/team"          className={navClass}>Team</NavLink>
            <NavLink to="/services"      className={navClass}>Services</NavLink>
            <NavLink to="/pricing"       className={navClass}>Pricing</NavLink>
            <NavLink to="/professionals" className={navClass}>Professionals</NavLink>
            <NavLink to="/academy"       className={navClass}>Academy</NavLink>
            <NavLink to="/blog"          className={navClass}>Blog</NavLink>

            {/* Divider */}
            <span className="nav-divider" aria-hidden="true" />

            <Link className="header-cta" to="/book">
              Book now
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

            {/* Nav links */}
            <nav className="menu-links" aria-label="Mobile navigation">
              <Link to="/"                          onClick={() => setMenuOpen(false)}>🏠 Home</Link>
              <Link to="/patient/find-professional" onClick={() => setMenuOpen(false)}>🔍 Find a professional</Link>
              <Link to="/about"                     onClick={() => setMenuOpen(false)}>ℹ️ About us</Link>
              <Link to="/team"                      onClick={() => setMenuOpen(false)}>👥 Team</Link>
              <Link to="/services"                  onClick={() => setMenuOpen(false)}>🎯 Services</Link>
              <Link to="/pricing"                   onClick={() => setMenuOpen(false)}>💳 Pricing</Link>
              <Link to="/professionals"             onClick={() => setMenuOpen(false)}>🩺 For professionals</Link>
              <Link to="/professionals/learning"    onClick={() => setMenuOpen(false)}>📚 Clinician learning</Link>
              <Link to="/professionals/resources"   onClick={() => setMenuOpen(false)}>🗂️ Pro resources</Link>
              <Link to="/professionals/guidelines"  onClick={() => setMenuOpen(false)}>⚖️ Pro guidelines</Link>
              <Link to="/academy" onClick={() => setMenuOpen(false)}>Serenest Academy</Link>
              <Link to="/faq"                       onClick={() => setMenuOpen(false)}>❓ FAQ</Link>
              <Link to="/blog"                      onClick={() => setMenuOpen(false)}>📝 Blog</Link>
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
                Same-day slots often available
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
      <footer className="footer">
        <div className="container">
          {/* Pre-footer CTA */}
          <div className="footer-cta">
            <div className="footer-cta-copy">
              <h3>Need help today?</h3>
              <p>Book a consultation with a qualified mental health professional.</p>
            </div>
            <div className="footer-cta-actions">
              <Link className="btn btn-primary btn-lg" to="/book">Book appointment</Link>
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

          <div className="footer-divider" aria-hidden="true" />

          {/* Main grid: brand · quick links · contact card */}
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-name">Serenest</div>
              <p className="footer-tagline">
                Doctor-led mental healthcare &amp; professional education.
              </p>
            </div>

            <div className="footer-links">
              <div>
                <div className="footer-title2">Care</div>
                <nav className="footer-nav2" aria-label="Care links">
                  <Link to="/book"><span aria-hidden="true">🩺</span> Book appointment</Link>
                  <Link to="/patient/find-professional"><span aria-hidden="true">🔍</span> Find a professional</Link>
                  <Link to="/screening"><span aria-hidden="true">📋</span> Self screening</Link>
                  <Link to="/services"><span aria-hidden="true">🏢</span> Corporate wellness</Link>
                </nav>
              </div>
              <div>
                <div className="footer-title2">Academy</div>
                <nav className="footer-nav2" aria-label="Academy links">
                  <Link to="/academy"><span aria-hidden="true">🎓</span> Courses</Link>
                  <Link to="/professionals/learning"><span aria-hidden="true">📚</span> Clinician learning</Link>
                  <Link to="/professionals/resources"><span aria-hidden="true">📖</span> Resources</Link>
                  <Link to="/academy#offer"><span aria-hidden="true">🏆</span> Certifications</Link>
                </nav>
              </div>
            </div>

            <div className="footer-contact-card">
              <a href="mailto:support@serenest.in">
                <span aria-hidden="true">📧</span> support@serenest.in
              </a>
              <a href="tel:917777936367">
                <span aria-hidden="true">📞</span> +91 77779 36367
              </a>
              <a
                className="footer-wa"
                href="https://wa.me/917777936367?text=Hi%2C%20I%27d%20like%20to%20book%20a%20session%20with%20Serenest"
                target="_blank"
                rel="noreferrer"
              >
                <span aria-hidden="true">🟢</span> WhatsApp support
              </a>
            </div>
          </div>

          {/* Trust strip */}
          <ul className="footer-trust" aria-label="Why Serenest">
            <li>Doctor-led</li>
            <li>Confidential</li>
            <li>Evidence-based</li>
            <li>Online across India</li>
          </ul>

          <div className="footer-divider" aria-hidden="true" />

          {/* Bottom bar */}
          <div className="footer-bottom2">
            <p className="footer-legal">
              © {new Date().getFullYear()} Serenest Education Pvt Ltd
            </p>
            <nav className="footer-mini-links" aria-label="Legal links">
              <Link to="/privacy">Privacy policy</Link>
              <a href="mailto:support@serenest.in?subject=Feedback">Feedback</a>
            </nav>
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
