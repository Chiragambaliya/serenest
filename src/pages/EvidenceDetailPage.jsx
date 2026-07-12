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
              <strong>Name and version:</strong> {ev.officialName}
            </li>
            <li>
              <strong>Authors / issuing organisation:</strong> {ev.authors}
            </li>
            <li>
              <strong>Year:</strong> {ev.year}
              {ev.shortFormYear ? ` (short form ${ev.shortFormYear}; cut-offs ${ev.cutoffYear})` : ''}
            </li>
            {ev.ageGroup ? (
              <li>
                <strong>Age group:</strong> {ev.ageGroup}
              </li>
            ) : null}
            {ev.officialWebsite ? (
              <li>
                <strong>Official website:</strong>{' '}
                <a href={ev.officialWebsite} target="_blank" rel="noreferrer">
                  {ev.officialWebsite}
                </a>
              </li>
            ) : null}
            {ev.userManual ? (
              <li>
                <strong>User manual:</strong>{' '}
                <a href={ev.userManual} target="_blank" rel="noreferrer">
                  Official user manual (PDF)
                </a>
              </li>
            ) : null}
          </ul>

          <h2>Source citation</h2>
          <ul>
            {[ev.primaryPaper, ev.shortFormPaper, ev.cutoffPaper]
              .filter(Boolean)
              .map((p) => (
                <li key={p.citation}>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer">
                      {p.citation}
                    </a>
                  ) : (
                    p.citation
                  )}
                </li>
              ))}
          </ul>

          <h2>Licensing &amp; copyright</h2>
          <ul>
            <li>{ev.licensingStatus}</li>
            {ev.copyrightNotice ? <li>{ev.copyrightNotice}</li> : null}
            <li>
              <strong>Permission verified for this use:</strong>{' '}
              {ev.permissionVerified
                ? 'Yes — based on the official distribution statement cited above.'
                : 'Not independently verified — flagged for Serenest review.'}
            </li>
            <li>
              <strong>Wording:</strong> {ev.wordingStatus === 'exact' ? 'Exact reproduction' : 'Adapted'}
              {ev.wordingNotes ? <> — {ev.wordingNotes}</> : null}
            </li>
          </ul>

          <h2>Scoring &amp; interpretation</h2>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{ev.scoringMethod}</p>
          {ev.thresholdSource ? (
            <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>
              <strong>Source for thresholds:</strong> {ev.thresholdSource}
            </p>
          ) : null}
          {ev.interpretationBands?.length ? (
            <ul>
              {ev.interpretationBands.map((b) => (
                <li key={b.label}>
                  <strong>{b.label}</strong> ({b.range}): {b.meaning}
                </li>
              ))}
            </ul>
          ) : null}
          {ev.clinicalInterpretation ? (
            <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{ev.clinicalInterpretation}</p>
          ) : null}

          {ev.indianNorms ? (
            <>
              <h2>Indian norms</h2>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{ev.indianNorms}</p>
            </>
          ) : null}

          {ev.whySelected ? (
            <>
              <h2>Why Serenest selected this instrument</h2>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{ev.whySelected}</p>
            </>
          ) : null}

          <h2>Why it is not a diagnosis</h2>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{ev.whyNotDiagnosis}</p>

          <h2>Limitations</h2>
          <ul>
            {(ev.limitations || []).map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>

          {ev.differentialDiagnosis ? (
            <>
              <h2>Differential considerations</h2>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{ev.differentialDiagnosis}</p>
            </>
          ) : null}

          {ev.educationalEvidence?.length ? (
            <>
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
            </>
          ) : null}

          {ev.references?.length ? (
            <>
              <h2>References</h2>
              <ul>
                {ev.references.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </>
          ) : null}

          <h2>Clinical review</h2>
          <ul>
            <li>
              <strong>Review status:</strong> {ev.clinicalReviewStatus || 'pending'}
            </li>
            <li>
              <strong>Last clinical review:</strong> {ev.lastClinicalReview || 'Not yet formally reviewed'}
            </li>
            <li>
              <strong>Reviewer:</strong> {ev.reviewer || 'Not yet assigned'}
            </li>
          </ul>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>
            {ev.clinicalReviewNotice ||
              'Evidence summary prepared from published and official instrument sources. Formal Serenest clinical review pending.'}
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
