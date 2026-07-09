import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import ProfessionalsSubNav from '../components/ProfessionalsSubNav';
import EdIcon from '../components/EdIcon';
import { useAuth } from '../lib/useAuth';

/* ── Navigation groups ───────────────────────────────────── */
const NAV_GROUPS = [
  {
    id: 'services',
    label: 'Services',
    items: [
      { to: '/book',                      label: 'Book a Consultation',  desc: 'Same-day online slots available' },
      { to: '/patient/find-professional', label: 'Find a Professional',  desc: 'Browse our verified clinicians' },
      { to: '/screening',                 label: 'Self-Screening',       desc: 'PHQ-9 & GAD-7 in 5 minutes' },
      { to: '/pricing',                   label: 'Pricing',              desc: 'Transparent, no hidden fees' },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    items: [
      { to: '/academy', label: 'Serenest Academy', desc: 'CME & certification programs' },
      { to: '/blog',    label: 'Blog',             desc: 'Clinical insights & patient guides' },
      { to: '/guides',  label: 'Guides',           desc: 'Self-help & condition resources' },
      { to: '/faq',     label: 'FAQ',              desc: 'Common questions answered' },
    ],
  },
  {
    id: 'professionals',
    label: 'Professionals',
    items: [
      { to: '/professionals',            label: 'For Professionals', desc: 'Why practice with us' },
      { to: '/professionals/apply',      label: 'Join Serenest',  desc: 'Apply to practice with us' },
      { to: '/professionals/portal',     label: 'My profile',     desc: 'Sign in to manage your listing' },
      { to: '/professionals/learning',   label: 'Learning Hub',   desc: 'CPD, CME & clinical training' },
      { to: '/academy',                  label: 'Academy · Free', desc: 'Free for Serenest professionals' },
      { to: '/professionals/resources',  label: 'Resources',      desc: 'Clinical tools & templates' },
      { to: '/professionals/guidelines', label: 'Guidelines',     desc: 'Practice standards & compliance' },
    ],
  },
  {
    id: 'business',
    label: 'For Business',
    items: [
      { to: '/corporate', label: 'Corporate EAP',   desc: 'Mental health benefits for your team' },
      { to: '/partner',   label: 'Partner with us', desc: 'Creators, clinics & platforms' },
      { to: '/careers',   label: 'Careers',         desc: 'Join the Serenest team' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    items: [
      { to: '/about', label: 'About Serenest', desc: 'Our mission & approach' },
      { to: '/team',  label: 'Our Team',       desc: 'Meet our clinicians & staff' },
    ],
  },
];

/* ── Desktop dropdown ────────────────────────────────────── */
function NavGroup({ group, onClose }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div
      ref={ref}
      className={`nav-group${open ? ' is-open' : ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="nav-link nav-group-btn"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {group.label}
        <svg className="nav-chevron" viewBox="0 0 12 12" fill="none" aria-hidden="true" width="10" height="10">
          <path d="M2 4.5l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="nav-group-panel" role="menu">
        <div className="nav-group-panel-inner">
          {group.items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-group-item"
              role="menuitem"
              onClick={() => { setOpen(false); onClose?.(); }}
            >
              <span className="nav-group-item-title">{item.label}</span>
              <span className="nav-group-item-desc">{item.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SiteLayout() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const location                   = useLocation();
  const { user }                   = useAuth();

  const isPatient = user?.user_metadata?.role === 'patient';
  const patientFirstName = isPatient
    ? (user.user_metadata?.full_name || user.user_metadata?.name || '').split(' ')[0]
    : '';

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
            {NAV_GROUPS.map((group) => (
              <NavGroup key={group.id} group={group} />
            ))}

            <span className="nav-divider" aria-hidden="true" />

            <NavLink to="/patient/dashboard" className={navClass} style={{ fontWeight: 600 }}>
              {isPatient && patientFirstName ? `Hi, ${patientFirstName}` : 'My account'}
            </NavLink>

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

            {/* Nav links — grouped */}
            <nav className="menu-links" aria-label="Mobile navigation">
              {isPatient && (
                <div className="menu-section">
                  <Link to="/patient/dashboard" className="menu-link menu-link--accent" onClick={() => setMenuOpen(false)}>
                    {patientFirstName ? `Hi, ${patientFirstName}` : 'My account'}
                    <span className="menu-link-arrow">→</span>
                  </Link>
                </div>
              )}

              <div className="menu-section">
                <p className="menu-section-label">Patient Care</p>
                <Link to="/book"                      className="menu-link" onClick={() => setMenuOpen(false)}>Book a Consultation</Link>
                <Link to="/patient/find-professional" className="menu-link" onClick={() => setMenuOpen(false)}>Find a Professional</Link>
                <Link to="/screening"                 className="menu-link" onClick={() => setMenuOpen(false)}>Self-Screening</Link>
                <Link to="/pricing"                   className="menu-link" onClick={() => setMenuOpen(false)}>Pricing</Link>
              </div>

              <div className="menu-section">
                <p className="menu-section-label">Learn</p>
                <Link to="/academy" className="menu-link" onClick={() => setMenuOpen(false)}>Serenest Academy</Link>
                <Link to="/blog"    className="menu-link" onClick={() => setMenuOpen(false)}>Blog</Link>
                <Link to="/guides"  className="menu-link" onClick={() => setMenuOpen(false)}>Guides</Link>
                <Link to="/faq"     className="menu-link" onClick={() => setMenuOpen(false)}>FAQ</Link>
              </div>

              <div className="menu-section">
                <p className="menu-section-label">For Professionals</p>
                <Link to="/professionals"            className="menu-link" onClick={() => setMenuOpen(false)}>For Professionals</Link>
                <Link to="/professionals/apply"      className="menu-link" onClick={() => setMenuOpen(false)}>Join Serenest</Link>
                <Link to="/professionals/portal"     className="menu-link" onClick={() => setMenuOpen(false)}>My profile</Link>
                <Link to="/professionals/learning"   className="menu-link" onClick={() => setMenuOpen(false)}>Learning Hub</Link>
                <Link to="/academy"                  className="menu-link" onClick={() => setMenuOpen(false)}>Academy · Free for professionals</Link>
                <Link to="/professionals/resources"  className="menu-link" onClick={() => setMenuOpen(false)}>Resources</Link>
                <Link to="/professionals/guidelines" className="menu-link" onClick={() => setMenuOpen(false)}>Guidelines</Link>
              </div>

              <div className="menu-section">
                <p className="menu-section-label">For Business</p>
                <Link to="/corporate" className="menu-link" onClick={() => setMenuOpen(false)}>Corporate EAP</Link>
                <Link to="/partner"   className="menu-link" onClick={() => setMenuOpen(false)}>Partner with us</Link>
                <Link to="/careers"   className="menu-link" onClick={() => setMenuOpen(false)}>Careers</Link>
              </div>

              <div className="menu-section">
                <p className="menu-section-label">Company</p>
                <Link to="/about" className="menu-link" onClick={() => setMenuOpen(false)}>About Serenest</Link>
                <Link to="/team"  className="menu-link" onClick={() => setMenuOpen(false)}>Our Team</Link>
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
              <div className="footer-social">
                <a
                  href="https://www.instagram.com/serenest.fit"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Follow Serenest on Instagram"
                  className="footer-social-link"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4.5" />
                    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                  </svg>
                  <span>@serenest.fit</span>
                </a>
                <a
                  href="https://www.linkedin.com/company/serenest-mind-pvt-ltd/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Serenest on LinkedIn"
                  className="footer-social-link"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="4" />
                    <path d="M8 11v5M8 8v.5M12 16v-3a2 2 0 0 1 4 0v3M12 11v5" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            <div className="footer-links">
              <div>
                <div className="footer-title2">Care</div>
                <nav className="footer-nav2" aria-label="Care links">
                  <Link to="/book"><EdIcon name="stethoscope" size={17} /> Book appointment</Link>
                  <Link to="/patient/find-professional"><EdIcon name="search" size={17} /> Find a professional</Link>
                  <Link to="/screening"><EdIcon name="clipboard" size={17} /> Self screening</Link>
                  <Link to="/pricing"><EdIcon name="award" size={17} /> Pricing</Link>
                </nav>
              </div>
              <div>
                <div className="footer-title2">Academy</div>
                <nav className="footer-nav2" aria-label="Academy links">
                  <Link to="/academy"><EdIcon name="cap" size={17} /> Academy · Free for pros</Link>
                  <Link to="/professionals/learning"><EdIcon name="book" size={17} /> Clinician learning</Link>
                  <Link to="/professionals/resources"><EdIcon name="folder" size={17} /> Resources</Link>
                  <Link to="/professionals/guidelines"><EdIcon name="folder" size={17} /> Guidelines</Link>
                </nav>
              </div>
              <div>
                <div className="footer-title2">Business</div>
                <nav className="footer-nav2" aria-label="Business links">
                  <Link to="/corporate"><EdIcon name="building" size={17} /> Corporate EAP</Link>
                  <Link to="/partner"><EdIcon name="chat" size={17} /> Partner with us</Link>
                  <Link to="/careers"><EdIcon name="search" size={17} /> Careers</Link>
                  <Link to="/about"><EdIcon name="award" size={17} /> About Serenest</Link>
                </nav>
              </div>
              <div>
                <div className="footer-title2">Legal</div>
                <nav className="footer-nav2" aria-label="Legal links">
                  <Link to="/legal"><EdIcon name="folder" size={17} /> All policies</Link>
                  <Link to="/privacy"><EdIcon name="folder" size={17} /> Privacy policy</Link>
                  <Link to="/terms"><EdIcon name="folder" size={17} /> Terms &amp; conditions</Link>
                  <Link to="/grievance-policy"><EdIcon name="folder" size={17} /> Grievance policy</Link>
                  <Link to="/refund-policy"><EdIcon name="folder" size={17} /> Refund policy</Link>
                  <Link to="/emergency-disclaimer"><EdIcon name="folder" size={17} /> Emergency disclaimer</Link>
                </nav>
              </div>
            </div>

            <div className="footer-contact-card">
              <a href="mailto:support@serenest.in">
                <EdIcon name="mail" size={17} /> support@serenest.in
              </a>
              <a href="tel:917777936367">
                <EdIcon name="phone" size={17} /> +91 77779 36367
              </a>
              <a
                className="footer-wa"
                href="https://wa.me/917777936367?text=Hi%2C%20I%27d%20like%20to%20book%20a%20session%20with%20Serenest"
                target="_blank"
                rel="noreferrer"
              >
                <EdIcon name="chat" size={17} /> WhatsApp support
              </a>
            </div>
          </div>

          <div className="footer-divider" aria-hidden="true" />

          {/* Bottom bar */}
          <div className="footer-bottom2">
            <p className="footer-legal">
              © {new Date().getFullYear()} Serenest Education Pvt Ltd
            </p>
            <nav className="footer-mini-links" aria-label="Legal links">
              <Link to="/legal">Legal</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/cookie-policy">Cookies</Link>
              <Link to="/grievance-policy">Grievances</Link>
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
