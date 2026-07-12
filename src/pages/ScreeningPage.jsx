import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { CHECK_CATEGORIES, GUIDED_PATHWAYS, CRISIS_RESOURCES } from '../lib/mentalHealthCenter';
import { toolsForCategory } from '../lib/screeningTools';
import CheckCard from '../components/screening/CheckCard';
import MentalHealthSnapshot from '../components/screening/MentalHealthSnapshot';
import '../styles/screening.css';

/**
 * Mental Health Center — Care front door.
 * Route stays /screening for SEO; experience is understand → choose → learn → help.
 */
export default function ScreeningPage() {
  useSEO({ path: '/screening', ...ROUTE_SEO['/screening'] });
  const [category, setCategory] = useState('all');
  const tools = useMemo(() => toolsForCategory(category), [category]);
  const pathway = GUIDED_PATHWAYS[0];

  return (
    <div className="mhc">
      <div className="mhc-wrap">
        <header className="mhc-hero">
          <p className="mhc-eyebrow">Serenest Care · Mental Health Center</p>
          <h1>Understand how you’ve been feeling</h1>
          <p className="mhc-hero-lead">
            Short, evidence-based screening checks in plain language. You’ll learn what your answers may suggest —
            and what they do not mean — before any care options appear.
          </p>

          <Link to={pathway.href} className="mhc-pathway mhc-pathway-hero">
            <h2>{pathway.title}</h2>
            <p>{pathway.blurb}</p>
            <span className="mhc-card-cta">Start here · {pathway.minutes} →</span>
          </Link>

          <p className="mhc-disclaimer">
            <strong>Private by default · not a diagnosis.</strong> Checks run in your browser. Contact details are
            optional and only after results. If you are in immediate danger, call{' '}
            <a href={CRISIS_RESOURCES.emergency.href}>{CRISIS_RESOURCES.emergency.number}</a>. For free
            mental-health support in India, call Tele-MANAS at{' '}
            <a href={CRISIS_RESOURCES.telemanas.href}>{CRISIS_RESOURCES.telemanas.number}</a> or{' '}
            <a href={CRISIS_RESOURCES.telemanasAlt.href}>{CRISIS_RESOURCES.telemanasAlt.number}</a>, or see our{' '}
            <Link to={CRISIS_RESOURCES.emergencyPage}>emergency guidance</Link>.
          </p>
        </header>

        <section className="mhc-section" aria-labelledby="snap-title">
          <div className="mhc-section-head">
            <h2 id="snap-title">Your mental health snapshot</h2>
            <p>
              Explore one dimension at a time. Session results stay on this device unless you later choose to share
              them.
            </p>
          </div>
          <MentalHealthSnapshot />
        </section>

        <section className="mhc-section" aria-labelledby="browse-title">
          <div className="mhc-section-head">
            <h2 id="browse-title">Or choose a specific check</h2>
            <p>Each uses a published, evidence-based scale. Pick what matches what you’re wondering about.</p>
          </div>

          <ul className="mhc-cats" aria-label="Filter by concern">
            {CHECK_CATEGORIES.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={`mhc-cat${category === c.id ? ' is-active' : ''}`}
                  aria-pressed={category === c.id}
                  onClick={() => setCategory(c.id)}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="mhc-grid">
            {tools.map((t) => (
              <CheckCard key={t.id} tool={t} />
            ))}
          </div>
        </section>

        <section className="mhc-section" aria-labelledby="how-title">
          <div className="mhc-section-head">
            <h2 id="how-title">What you’ll leave with</h2>
            <p>Every check is designed to answer four questions — never to push you into booking.</p>
          </div>
          <ul className="mhc-four" aria-label="What this center helps you answer">
            <li>
              <strong>What am I experiencing?</strong>
              <span>Name patterns in mood, worry, stress, and more</span>
            </li>
            <li>
              <strong>Why might this be happening?</strong>
              <span>Calm context — not labels that define you</span>
            </li>
            <li>
              <strong>What can I do next?</strong>
              <span>Self-care, learning, and clear options</span>
            </li>
            <li>
              <strong>Where can I get help?</strong>
              <span>Crisis resources or verified clinicians when needed</span>
            </li>
          </ul>
        </section>

        <section className="mhc-section" aria-labelledby="eco-title">
          <div className="mhc-section-head">
            <h2 id="eco-title">Part of the Serenest ecosystem</h2>
            <p>Understanding connects to learning and care — nothing here is meant to stand alone.</p>
          </div>
          <div className="mhc-grid">
            <Link to="/evidence" className="mhc-card">
              <h3 className="mhc-card-title">Evidence Center</h3>
              <p className="mhc-card-blurb">Instruments, validation papers, licensing, and limitations for every launched check.</p>
              <span className="mhc-card-cta">Open evidence →</span>
            </Link>
            <Link to="/blog" className="mhc-card">
              <h3 className="mhc-card-title">Articles</h3>
              <p className="mhc-card-blurb">Plain-language guides on mood, anxiety, sleep, and seeking help.</p>
              <span className="mhc-card-cta">Browse guides →</span>
            </Link>
            <Link to="/academy" className="mhc-card">
              <h3 className="mhc-card-title">Academy</h3>
              <p className="mhc-card-blurb">Literacy and learning programmes from Serenest Education.</p>
              <span className="mhc-card-cta">Explore Academy →</span>
            </Link>
            <Link to="/book" className="mhc-card">
              <h3 className="mhc-card-title">Professional care</h3>
              <p className="mhc-card-blurb">Verified psychiatrists and psychologists when you want guided help.</p>
              <span className="mhc-card-cta">Book when ready →</span>
            </Link>
            <div className="mhc-card mhc-card-muted">
              <h3 className="mhc-card-title">Community &amp; Research</h3>
              <p className="mhc-card-blurb">Peer support and research participation — coming as Serenest grows.</p>
              <span className="mhc-card-cta">Planned</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
