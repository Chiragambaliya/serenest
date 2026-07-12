import React from 'react';
import { Link } from 'react-router-dom';
import { careTier, maxScore, getAllTools } from '../../lib/screeningTools';
import { getCheckEvidence, getLandingPathForTool } from '../../lib/checkEvidence';
import ScribaInsight from './ScribaInsight';
import CheckPrivacyPanel from './CheckPrivacyPanel';
import CheckEvidencePanel from './CheckEvidencePanel';
import { buildScribaInsight } from '../../lib/mentalHealthCenter';

function BandScale({ tool, value, max, band }) {
  if (!tool.bands || tool.bands.length < 2) {
    const pct = Math.round((value / max) * 100);
    return (
      <div style={{ height: 8, background: 'rgba(148,166,132,0.25)', borderRadius: 99, overflow: 'hidden', margin: '12px auto', maxWidth: 340 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: band.color, borderRadius: 99 }} />
      </div>
    );
  }
  const markerPct = Math.min(100, Math.max(0, (value / max) * 100));
  let prev = 0;
  const segments = tool.bands.map((b) => {
    const width = ((b.max - prev) / max) * 100;
    prev = b.max;
    return { ...b, width };
  });
  return (
    <div style={{ margin: '16px auto 4px', maxWidth: 360 }}>
      <div style={{ position: 'relative', paddingTop: 10 }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: `${markerPct}%`,
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `8px solid ${band.color}`,
          }}
        />
        <div style={{ display: 'flex', height: 10, borderRadius: 99, overflow: 'hidden' }} role="img" aria-label={`Score ${value} of ${max}, ${band.label}`}>
          {segments.map((s) => (
            <div key={s.label} title={s.label} style={{ width: `${s.width}%`, background: s.color, opacity: s.label === band.label ? 1 : 0.32 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Education-first result: understand → learn → then care options.
 */
export default function ScreeningResultPanel({
  tool,
  result,
  crisisFlag,
  crisisAcknowledged,
  onRetake,
  onClearAnswers,
  hideCareUntilReady = false,
  includeCareOptions = true,
}) {
  const { band } = result;
  const isCount = tool.scoring === 'threshold_count';
  const max = isCount ? tool.questions.length : maxScore(tool);
  const value = isCount ? result.count : result.score;
  const tier = careTier(tool, result);
  const careText = tool.careGuidance?.[tier] || band.desc;
  const insight = buildScribaInsight(tool, { ...result, crisisFlag });
  const showCare = includeCareOptions && (!hideCareUntilReady || !crisisFlag || crisisAcknowledged);
  const showSelfCare = tier !== 'high' && !crisisFlag && tool.selfCare?.length;
  const evidence = getCheckEvidence(tool.id);
  const differential = evidence?.differentialDiagnosis || tool.differentialNote;
  const relatedChecks = getAllTools()
    .filter((t) => t.id !== tool.id)
    .slice(0, 4);

  return (
    <div>
      <div className="mhc-result-score" style={{ '--band': band.color }}>
        <p className="mhc-eyebrow" style={{ marginBottom: 6 }}>Your result · not a diagnosis</p>
        {!isCount ? (
          <>
            <div className="mhc-score-num">
              {tool.scoring === 'mean' ? Number(value).toFixed(2) : value}
              <span style={{ fontSize: '1.1rem', color: 'var(--muted)', fontWeight: 600 }}>
                {' '}
                / {tool.scoring === 'mean' ? Number(max).toFixed(1) : max}
              </span>
            </div>
            <BandScale tool={tool} value={value} max={max} band={band} />
          </>
        ) : (
          <div className="mhc-score-num" style={{ fontSize: '1.35rem' }}>
            {result.count} of {tool.questions.length} key items
          </div>
        )}
        <div className="mhc-band-pill">{band.label}</div>
        <p style={{ margin: '12px auto 0', maxWidth: 440, fontSize: '0.92rem', lineHeight: 1.55, color: 'var(--muted)' }}>
          {band.desc}
        </p>
        {tool.limitationNote ? (
          <p style={{ margin: '12px auto 0', maxWidth: 440, fontSize: '0.88rem', lineHeight: 1.55, color: 'var(--muted)' }}>
            <strong>Important limitation:</strong> {tool.limitationNote}
          </p>
        ) : null}
        {tool.attribution ? (
          <p style={{ margin: '12px auto 0', maxWidth: 440, fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--muted)' }}>
            {tool.attribution}
            {tool.copyrightNotice ? <> {tool.copyrightNotice}</> : null}
          </p>
        ) : null}
      </div>

      <ScribaInsight insight={insight} />

      <section className="mhc-edu" aria-labelledby="suggests-title">
        <h2 id="suggests-title">What this suggests</h2>
        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>
          {tool.whatItChecks} Your responses fall in the “{band.label}” range for this evidence-based screening check ({tool.name}).
        </p>
      </section>

      <section className="mhc-edu" aria-labelledby="not-mean-title">
        <h2 id="not-mean-title">What this does not mean</h2>
        <ul>
          {(tool.whatItDoesNotMean || ['A medical diagnosis', 'A replacement for clinical judgment']).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {tool.commonSigns?.length ? (
        <section className="mhc-edu" aria-labelledby="signs-title">
          <h2 id="signs-title">Experiences people often notice</h2>
          <ul>
            {tool.commonSigns.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {differential ? (
        <section className="mhc-edu" aria-labelledby="diff-title">
          <h2 id="diff-title">What else might be going on</h2>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{differential}</p>
        </section>
      ) : null}

      {showSelfCare ? (
        <section className="mhc-edu" aria-labelledby="care-title">
          <h2 id="care-title">Practical steps you can try</h2>
          <ul>
            {tool.selfCare.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {tool.learnLinks?.length ? (
        <section className="mhc-edu" aria-labelledby="learn-title">
          <h2 id="learn-title">Learn more on Serenest</h2>
          <ul>
            {tool.learnLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {relatedChecks.length ? (
        <section className="mhc-edu" aria-labelledby="related-checks-title">
          <h2 id="related-checks-title">Related Mental Health Checks</h2>
          <ul>
            {relatedChecks.map((t) => (
              <li key={t.id}>
                <Link to={getLandingPathForTool(t.id) || `/screening/tool/${t.slug}`}>{t.humanTitle}</Link>
                <span style={{ color: 'var(--muted)' }}> · {t.name}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mhc-edu" aria-labelledby="when-help-title">
        <h2 id="when-help-title">When professional help is worth considering</h2>
        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{careText}</p>
      </section>

      <CheckEvidencePanel toolId={tool.id} />
      <CheckPrivacyPanel toolId={tool.id} />

      {showCare ? (
        <section className="mhc-care" aria-labelledby="next-care-title">
          <h2 id="next-care-title">If you want guided help</h2>
          <p>
            Talk with a clinician — when you are ready. Understanding yourself comes first.
          </p>
          <div className="mhc-care-actions">
            <Link className="btn btn-primary" to="/book">
              Talk to a clinician
            </Link>
            <Link className="btn btn-ghost" to="/patient/find-professional">
              Find a professional
            </Link>
            <button type="button" className="btn btn-ghost" onClick={onRetake}>
              Retake this check
            </button>
            {onClearAnswers ? (
              <button type="button" className="btn btn-ghost" onClick={onClearAnswers}>
                Clear my answers
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      {!showCare && onClearAnswers ? (
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button type="button" className="btn btn-ghost" onClick={onClearAnswers}>
            Clear my answers
          </button>
        </p>
      ) : null}
    </div>
  );
}
