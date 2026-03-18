import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function SiteLayout() {
  return (
    <div>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <img src="/assets/logo.png" alt="Serenest" className="brand-mark" />
            <span className="brand-text">Serenest</span>
          </Link>

          <nav className="header-links" aria-label="Header">
            <Link className="header-cta" to="/book">
              Book
            </Link>
            <Link to="/services">Services</Link>
            <Link to="/professionals">Professionals</Link>
            <Link to="/about">About us</Link>
          </nav>
        </div>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-shell">
            <div className="footer-top">
              <div className="footer-brandline">
                <img src="/assets/logo.png" alt="Serenest" className="footer-mark" />
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

