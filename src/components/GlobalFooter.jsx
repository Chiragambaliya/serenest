import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Editorial site footer — real contact details only.
 */
export default function GlobalFooter({ homeTo = '/preview' }) {
  const year = new Date().getFullYear();

  return (
    <footer className="gf" aria-label="Site footer">
      <div className="ds-shell ds-shell--wide">
        <div className="gf__grid">
          <div className="gf__brand">
            <Link to={homeTo} className="gf__logo">
              <img src="/favicon.svg" alt="" width="28" height="28" />
              <span>Serenest</span>
            </Link>
            <p>
              Doctor-led mental healthcare, professional learning, and thoughtful
              resources — connected with clinical responsibility.
            </p>
            <div className="gf__contact">
              <a href="mailto:support@serenest.in">support@serenest.in</a>
              <a href="tel:+917777936367">+91 77779 36367</a>
              <a
                href="https://wa.me/917777936367?text=Hi%2C%20I%27d%20like%20to%20speak%20with%20Serenest"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp support
              </a>
            </div>
          </div>

          <div className="gf__cols">
            <div>
              <h3 className="gf__title">Services</h3>
              <nav aria-label="Services">
                <Link to="/services#psychiatry">Psychiatry</Link>
                <Link to="/services#therapy">Therapy &amp; counselling</Link>
                <Link to="/services#addiction">Addiction &amp; recovery</Link>
                <Link to="/services#digital">Digital mental health</Link>
                <Link to="/book">Book an appointment</Link>
              </nav>
            </div>
            <div>
              <h3 className="gf__title">Academy</h3>
              <nav aria-label="Academy">
                <Link to="/academy">Serenest Academy</Link>
                <Link to="/professionals/learning">Clinical learning</Link>
                <Link to="/professionals/resources">Resources</Link>
                <Link to="/professionals/guidelines">Guidelines</Link>
              </nav>
            </div>
            <div>
              <h3 className="gf__title">Company</h3>
              <nav aria-label="Company">
                <Link to="/about">About</Link>
                <Link to="/team">Our team</Link>
                <Link to="/careers">Careers</Link>
                <Link to="/professionals">For professionals</Link>
                <a href="mailto:support@serenest.in">Contact</a>
              </nav>
            </div>
            <div>
              <h3 className="gf__title">Resources</h3>
              <nav aria-label="Resources">
                <Link to="/guides">Guides</Link>
                <Link to="/blog">Articles</Link>
                <Link to="/screening">Screening tools</Link>
                <Link to="/faq">Help centre</Link>
              </nav>
            </div>
          </div>

          <div>
            <h3 className="gf__title">Important</h3>
            <p className="gf__disclaimer">
              Serenest is not an emergency service. If there is an immediate risk of
              harm to yourself or others, contact local emergency services or a crisis
              helpline. Online care does not replace in-person emergency medicine.
            </p>
          </div>
        </div>

        <div className="gf__bottom">
          <p>© {year} Serenest Education Pvt Ltd</p>
          <nav className="gf__legal" aria-label="Legal">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/emergency-disclaimer">Emergency disclaimer</Link>
            <Link to="/grievance-policy">Grievances</Link>
            <Link to="/legal">All policies</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
