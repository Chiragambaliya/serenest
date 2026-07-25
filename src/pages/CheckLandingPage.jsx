import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { getTool, getAllTools } from '../lib/screeningTools';
import { getCheckEvidence, listCheckEvidence } from '../lib/checkEvidence';
import { CRISIS_RESOURCES } from '../lib/mentalHealthCenter';
import CheckPrivacyPanel from '../components/screening/CheckPrivacyPanel';
import '../styles/screening.css';

/**
 * Reusable Mental Health Check product landing.
 * Driven by checkEvidence + tool registry — no per-check page forks.
 */
export default function CheckLandingPage({ toolId }) {
  const tool = getTool(toolId);
  const ev = getCheckEvidence(toolId);

  const path = ev?.landingPath || `/screening/tool/${tool?.slug}`;
  useSEO({
    path,
    title: ev
      ? `${ev.productTitle} Online India | Serenest Mental Health Center`
      : 'Mental health check | Serenest',
    description: ev
      ? `Free ${ev.productTitle} using a validated instrument (${ev.officialName}). Education first — not a diagnosis. Private by default.`
      : undefined,
    ogTitle: ev ? `${ev.productTitle} | Serenest` : undefined,
    ogDescription: ev
      ? 'Clinically responsible mental health check with evidence, privacy, and clear next steps — never a sales funnel.'
      : undefined,
    jsonLd: ev
      ? {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'MedicalWebPage',
              name: ev.productTitle,
              url: `https://www.serenest.in${ev.landingPath}`,
              description: `${ev.productTitle} with educational results. Screening aid — not a diagnosis.`,
              isAccessibleForFree: true,
              about: { '@type': 'Thing', name: ev.officialName },
            },
            {
              '@type': 'FAQPage',
              mainEntity: (ev.faqs || []).map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            },
          ],
        }
      : undefined,
  });

  if (!tool || !ev) {
    return (
      <div className="mhc">
        <div className="mhc-wrap">
          <h1>Check not found</h1>
          <Link to="/screening" className="btn btn-primary">
            Mental Health Center
          </Link>
        </div>
      </div>
    );
  }

  const related = getAllTools()
    .filter((t) => t.id !== tool.id && ['pss10', 'phq9', 'who5', 'gad7'].includes(t.id))
    .slice(0, 4);
  const otherLaunches = listCheckEvidence().filter((e) => e.toolId !== tool.id);

  return (
    <div className="mhc">
      <div className="mhc-wrap">
        <Link to="/screening" className="mhc-back">
          ← Mental Health Center
        </Link>
        <header className="mhc-hero">
          <p className="mhc-eyebrow">Serenest Care · Mental Health Check</p>
          <h1>{ev.productTitle}</h1>
          <p className="mhc-hero-lead">
            A short, validated way to notice exhaustion, mental distance, and cognitive or emotional strain — then
            learn what that may mean before any care options appear.
          </p>
          <Link className="btn btn-primary" to={`/screening/tool/${tool.slug}`}>
            Begin the check · ~{tool.minutes} min
          </Link>
          <p className="mhc-disclaimer" style={{ marginTop: '1rem' }}>
            <strong>Screening aid, not a diagnosis.</strong> If you are in immediate danger, call{' '}
            <a href={CRISIS_RESOURCES.emergency.href}>{CRISIS_RESOURCES.emergency.number}</a> or see{' '}
            <Link to={CRISIS_RESOURCES.emergencyPage}>emergency guidance</Link>.
          </p>
        </header>

        <section className="mhc-section" aria-labelledby="measures-title">
          <div className="mhc-section-head">
            <h2 id="measures-title">What this check measures</h2>
            <p>{tool.whatItChecks}</p>
          </div>
          <div className="mhc-edu">
            <ul>
              <li>Instrument: {ev.officialName}</li>
              <li>Authors: {ev.authors}</li>
              <li>~{tool.minutes} minutes · {tool.questions.length} questions</li>
            </ul>
          </div>
        </section>

        <section className="mhc-section" aria-labelledby="who-title">
          <div className="mhc-section-head">
            <h2 id="who-title">Who should take it</h2>
            <p>{tool.audience}</p>
          </div>
        </section>

        <section className="mhc-section" aria-labelledby="learn-title">
          <div className="mhc-section-head">
            <h2 id="learn-title">What you will learn</h2>
            <p>Understanding before recommendations — never a score-to-book funnel.</p>
          </div>
          <ul className="mhc-four">
            <li>
              <strong>What am I experiencing?</strong>
              <span>A calm reading of your response pattern</span>
            </li>
            <li>
              <strong>What it does not mean</strong>
              <span>Not a diagnosis; limits of European cut-offs</span>
            </li>
            <li>
              <strong>What I can try</strong>
              <span>Evidence-linked self-care when appropriate</span>
            </li>
            <li>
              <strong>Where to get help</strong>
              <span>Crisis resources or clinicians when needed</span>
            </li>
          </ul>
        </section>

        <section className="mhc-section" aria-labelledby="limits-title">
          <div className="mhc-section-head">
            <h2 id="limits-title">Clinical limitations</h2>
          </div>
          <div className="mhc-edu">
            <ul>
              {ev.limitations.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mhc-section" aria-labelledby="ev-sum-title">
          <div className="mhc-section-head">
            <h2 id="ev-sum-title">Evidence summary</h2>
            <p>Why Serenest selected this instrument — and why it is not a diagnosis.</p>
          </div>
          <div className="mhc-edu">
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>
              {ev.whySelected}
            </p>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>
              {ev.whyNotDiagnosis}
            </p>
            <p style={{ margin: '0.85rem 0 0', fontSize: '0.88rem' }}>
              <Link to={`/evidence/${ev.evidenceSlug}`}>Full evidence report →</Link>
            </p>
          </div>
        </section>

        <CheckPrivacyPanel toolId={tool.id} />

        {ev.faqs?.length ? (
          <section className="mhc-section" aria-labelledby="faq-title">
            <div className="mhc-section-head">
              <h2 id="faq-title">Common questions</h2>
            </div>
            <div className="mhc-edu">
              {ev.faqs.map((f) => (
                <div key={f.q} style={{ marginBottom: '1rem' }}>
                  <strong style={{ display: 'block', marginBottom: 4 }}>{f.q}</strong>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mhc-section" aria-labelledby="related-title">
          <div className="mhc-section-head">
            <h2 id="related-title">Related Mental Health Checks</h2>
          </div>
          <div className="mhc-grid">
            {related.map((t) => (
              <Link key={t.id} to={`/screening/tool/${t.slug}`} className="mhc-card">
                <h3 className="mhc-card-title">{t.humanTitle}</h3>
                <p className="mhc-card-scale">{t.name}</p>
                <span className="mhc-card-cta">Open check →</span>
              </Link>
            ))}
          </div>
          {otherLaunches.length ? (
            <p style={{ marginTop: '1rem', fontSize: '0.88rem' }}>
              {otherLaunches.map((e) => (
                <Link key={e.toolId} to={e.landingPath} style={{ marginRight: 12 }}>
                  {e.productTitle}
                </Link>
              ))}
            </p>
          ) : null}
        </section>

        <section className="mhc-section" aria-labelledby="articles-title">
          <div className="mhc-section-head">
            <h2 id="articles-title">Related Serenest articles</h2>
          </div>
          <div className="mhc-edu">
            <ul>
              {(tool.learnLinks || [])
                .filter((l) => l.to.startsWith('/blog'))
                .map((l) => (
                  <li key={l.to}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
            </ul>
          </div>
        </section>

        <div style={{ marginTop: '2rem' }}>
          <Link className="btn btn-primary" to={`/screening/tool/${tool.slug}`}>
            Begin {ev.productTitle}
          </Link>
        </div>
      </div>
    </div>
  );
}
