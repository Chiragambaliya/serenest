import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { getCheckEvidence } from '../lib/checkEvidence';
import { getTool } from '../lib/screeningTools';
import '../styles/screening.css';

/** Per-instrument evidence report (auto from registry). */
export default function EvidenceDetailPage() {
  const { slug } = useParams();
  const ev = getCheckEvidence(slug);
  const tool = ev ? getTool(ev.toolId) : null;

  useSEO({
    path: ev ? `/evidence/${ev.evidenceSlug}` : '/evidence',
    title: ev ? `${ev.productTitle} — Evidence Report | Serenest` : 'Evidence | Serenest',
    description: ev
      ? `Validation, licensing, scoring, and limitations for the Serenest ${ev.productTitle} (${ev.officialName}).`
      : undefined,
    noindex: !ev,
  });

  if (!ev) {
    return (
      <div className="mhc">
        <div className="mhc-wrap">
          <h1>Evidence report not found</h1>
          <Link to="/evidence" className="btn btn-primary">
            Evidence Center
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mhc">
      <div className="mhc-wrap">
        <Link to="/evidence" className="mhc-back">
          ← Evidence Center
        </Link>
        <header className="mhc-hero">
          <p className="mhc-eyebrow">Evidence report</p>
          <h1>{ev.productTitle}</h1>
          <p className="mhc-hero-lead">{ev.officialName}</p>
        </header>

        <div className="mhc-edu">
          <h2>Instrument</h2>
          <ul>
            <li>
              <strong>Authors:</strong> {ev.authors}
            </li>
            <li>
              <strong>Year:</strong> {ev.year} (short form {ev.shortFormYear}; cut-offs {ev.cutoffYear})
            </li>
            <li>
              <strong>Official website:</strong>{' '}
              <a href={ev.officialWebsite} target="_blank" rel="noreferrer">
                {ev.officialWebsite}
              </a>
            </li>
            <li>
              <strong>User manual:</strong>{' '}
              <a href={ev.userManual} target="_blank" rel="noreferrer">
                BAT User Manual (PDF)
              </a>
            </li>
          </ul>

          <h2>Validation</h2>
          <ul>
            <li>
              <a href={ev.primaryPaper.url} target="_blank" rel="noreferrer">
                {ev.primaryPaper.citation}
              </a>
            </li>
            <li>
              <a href={ev.shortFormPaper.url} target="_blank" rel="noreferrer">
                {ev.shortFormPaper.citation}
              </a>
            </li>
            <li>
              <a href={ev.cutoffPaper.url} target="_blank" rel="noreferrer">
                {ev.cutoffPaper.citation}
              </a>
            </li>
          </ul>

          <h2>Licensing &amp; copyright</h2>
          <ul>
            <li>{ev.licensingStatus}</li>
            <li>
              <strong>Commercial / public web:</strong> {ev.commercialPublicWebAllowed ? 'Allowed' : 'Restricted'}
            </li>
            <li>
              <strong>Permission required:</strong> {ev.permissionRequired ? 'Yes' : 'No'}
            </li>
            <li>
              <strong>Wording:</strong> {ev.wordingStatus === 'exact' ? 'Exact reproduction' : 'Adapted'} —{' '}
              {ev.wordingNotes}
            </li>
          </ul>

          <h2>Scoring &amp; interpretation</h2>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{ev.scoringMethod}</p>
          <ul>
            {ev.interpretationBands.map((b) => (
              <li key={b.label}>
                <strong>{b.label}</strong> ({b.range}): {b.meaning}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{ev.clinicalInterpretation}</p>

          <h2>Why Serenest selected this instrument</h2>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{ev.whySelected}</p>

          <h2>Why it is not a diagnosis</h2>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{ev.whyNotDiagnosis}</p>

          <h2>Limitations</h2>
          <ul>
            {ev.limitations.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>

          <h2>Differential considerations</h2>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{ev.differentialDiagnosis}</p>

          <h2>Supporting evidence for educational statements</h2>
          <ul>
            {ev.educationalEvidence.map((c) => (
              <li key={c.statement}>
                <em>{c.statement}</em>
                <br />
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                  {c.source}
                  {c.url ? (
                    <>
                      {' '}
                      —{' '}
                      <a href={c.url} target="_blank" rel="noreferrer">
                        source
                      </a>
                    </>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>

          <h2>References</h2>
          <ul>
            {ev.references.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          <h2>Clinical review</h2>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>
            {ev.clinicalReviewNotice ||
              'Evidence summary based on official instrument sources and peer-reviewed literature. Clinical review pending.'}
          </p>
        </div>

        <div className="mhc-care-actions" style={{ marginTop: '1.5rem' }}>
          {ev.landingPath ? (
            <Link className="btn btn-primary" to={ev.landingPath}>
              Product page
            </Link>
          ) : null}
          {tool ? (
            <Link className="btn btn-ghost" to={`/screening/tool/${tool.slug}`}>
              Take the check
            </Link>
          ) : null}
          <Link className="btn btn-ghost" to="/screening">
            Mental Health Center
          </Link>
        </div>
      </div>
    </div>
  );
}
