import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoOk, setLogoOk] = useState(true);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <div>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            {logoOk ? (
              <img
                src="/assets/logo.png"
                alt="Serenest"
                className="brand-mark"
                loading="eager"
                decoding="async"
                onError={() => setLogoOk(false)}
              />
            ) : (
              <span className="brand-badge" aria-hidden="true">
                S
              </span>
            )}
            <span className="brand-text">Serenest</span>
          </Link>

          <nav className="header-links" aria-label="Header">
            <Link to="/about">About us</Link>
            <Link to="/services">Services</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/professionals">Professionals</Link>
            <Link className="header-cta" to="/book">
              Book
            </Link>
          </nav>

          <button
            type="button"
            className={`menu-btn ${menuOpen ? 'is-open' : ''}`}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="menu-bars" aria-hidden="true" />
          </button>
        </div>

        {menuOpen && (
          <div
            className="menu-overlay"
            role="presentation"
            onClick={() => setMenuOpen(false)}
            onKeyDown={() => {}}
          >
            <div className="menu-sheet tile" role="dialog" aria-label="Mobile navigation" onClick={(e) => e.stopPropagation()}>
              <div className="menu-head">
                <div className="menu-title">Menu</div>
                <button type="button" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>
                  Close
                </button>
              </div>
              <nav className="menu-links" aria-label="Mobile header">
                <Link to="/patient/find-professional" onClick={() => setMenuOpen(false)}>
                  Find a professional
                </Link>
                <Link to="/about" onClick={() => setMenuOpen(false)}>
                  About us
                </Link>
                <Link to="/services" onClick={() => setMenuOpen(false)}>
                  Services
                </Link>
                <Link to="/pricing" onClick={() => setMenuOpen(false)}>
                  Pricing
                </Link>
                <Link to="/professionals" onClick={() => setMenuOpen(false)}>
                  Professionals
                </Link>
                <Link to="/book" onClick={() => setMenuOpen(false)}>
                  Book an appointment
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-shell">
            <div className="footer-top">
              <div className="footer-brandline">
                {logoOk ? (
                  <img src="/assets/logo.png" alt="Serenest" className="footer-mark" loading="lazy" decoding="async" />
                ) : (
                  <span className="footer-badge" aria-hidden="true">
                    S
                  </span>
                )}
                <div className="footer-brandstack">
                  <div className="footer-name">Serenest</div>
                  <div className="footer-tagline">
                    Premium, privacy-first mental health care — built for continuity.
                  </div>
                </div>
              </div>

              <div className="footer-ctas" aria-label="Quick actions">
                <Link className="btn btn-primary" to="/book">
                  Book
                </Link>
                <Link className="btn btn-ghost" to="/professionals">
                  Join as a professional
                </Link>
              </div>
            </div>

            <div className="footer-divider" aria-hidden="true" />

            <div className="footer-cols">
              <div className="footer-col2">
                <div className="footer-title2">Explore</div>
                <nav className="footer-nav2" aria-label="Explore">
                  <Link to="/services">Services</Link>
                  <Link to="/pricing">Pricing</Link>
                  <Link to="/faq">FAQ</Link>
                  <Link to="/blog">Blog</Link>
                  <Link to="/about">About</Link>
                </nav>
              </div>

              <div className="footer-col2">
                <div className="footer-title2">Care</div>
                <nav className="footer-nav2" aria-label="Care">
                  <Link to="/book">Book an appointment</Link>
                  <Link to="/privacy">Privacy policy</Link>
                  <a href="mailto:support@serenest.fit?subject=Support%20Request">Contact support</a>
                </nav>
              </div>

              <div className="footer-col2">
                <div className="footer-title2">Contact</div>
                <div className="footer-contact">
                  <a className="footer-pill" href="mailto:support@serenest.fit">
                    support@serenest.fit
                  </a>
                  <a className="footer-pill" href="tel:9152987821">
                    iCall: 9152987821
                  </a>
                  <div className="footer-note">
                    Not for emergencies. If you are in immediate danger, contact your nearest emergency service.
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-divider" aria-hidden="true" />

            <div className="footer-bottom2">
              <div className="footer-legal">
                © {new Date().getFullYear()} Serenest. All rights reserved.
              </div>
              <div className="footer-mini-links" aria-label="Legal">
                <Link to="/privacy">Privacy</Link>
                <a href="mailto:support@serenest.fit?subject=Feedback">Feedback</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

