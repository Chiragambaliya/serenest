import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { SCREENING_TOOLS, getTool, scoreTool, maxScore } from '../lib/screeningTools';
import { buildBookPath } from '../lib/bookingHandoff';

export default function ScreeningToolPage() {
  const { toolId } = useParams();
  const tool = getTool(toolId);

  // Tools with their own ROUTE_SEO entry are indexable landing pages;
  // the PHQ-9/GAD-7 tool duplicates stay noindex (their dedicated
  // /phq-9-depression-screening pages own that search intent).
  const seoEntry = tool ? ROUTE_SEO[`/screening/tool/${tool.slug}`] : null;
  useSEO({
    path: tool ? `/screening/tool/${tool.slug}` : `/screening/tool/${toolId}`,
    title: seoEntry?.title ?? (tool ? `${tool.title} — Free Self-Check | Serenest` : 'Self-screening | Serenest'),
    description: seoEntry?.description ?? (tool ? `${tool.blurb} A confidential self-screening — not a diagnosis.` : undefined),
    noindex: !seoEntry,
  });

  const [answers, setAnswers] = useState(() => (tool ? Array(tool.questions.length).fill(undefined) : []));
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => (tool ? scoreTool(tool, answers) : null), [tool, answers]);

  if (!tool) {
    return (
      <div className="page">
        <section className="section">
          <div className="container" style={{ maxWidth: 620, textAlign: 'center' }}>
            <h1 style={{ fontWeight: 800, marginBottom: 10 }}>Screening tool not found</h1>
            <p className="muted" style={{ marginBottom: 20 }}>That self-check doesn&rsquo;t exist or has moved.</p>
            <Link to="/screening" className="btn btn-primary">See all screening tools</Link>
          </div>
        </section>
      </div>
    );
  }

  const answered = answers.filter((a) => a !== undefined && a !== null).length;
  const total = tool.questions.length;
  const minutes = Math.max(1, Math.round((total * 10) / 60));
  const canSubmit = result?.complete;
  const crisisFlag = tool.crisisItem !== undefined && (answers[tool.crisisItem] ?? 0) >= 1;

  function pick(qi, value) {
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = value;
      // Gently bring the next unanswered question into view (app-like flow).
      if (typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const nextIdx = next.findIndex((a, j) => j > qi && (a === undefined || a === null));
        if (nextIdx !== -1) {
          requestAnimationFrame(() => {
            document.querySelector(`[data-q="${nextIdx}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        }
      }
      return next;
    });
  }

  return (
    <div className="page">
      <section className="section" style={{ paddingBottom: '2.5rem' }}>
        <div className="container" style={{ maxWidth: 720 }}>

          {/* Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <Link to="/screening" className="muted" style={{ fontSize: '0.85rem' }}>← All self-checks</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
              <span style={{ fontSize: '2rem' }} aria-hidden>{tool.icon}</span>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.2 }}>{tool.title}</h1>
                <p className="muted" style={{ fontSize: '0.82rem', margin: 0 }}>{tool.source}</p>
              </div>
            </div>
          </div>

          {!submitted ? (
            <>
              <div style={{ background: '#f4eee4', borderRadius: 12, padding: '0.9rem 1.1rem', marginBottom: '0.9rem' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{tool.timeframe}</p>
                <p className="muted" style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>
                  {total} questions · about {minutes} min · confidential
                </p>
                {tool.note && <p className="muted" style={{ margin: '6px 0 0', fontSize: '0.82rem' }}>{tool.note}</p>}
              </div>

              {/* Sticky progress bar — stays visible under the site header */}
              <div style={{ position: 'sticky', top: 76, zIndex: 5, padding: '6px 0 10px', background: 'linear-gradient(180deg, var(--bg, #f8f6f0) 70%, transparent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                  <span>{answered} of {total} answered</span>
                  <span>{Math.round((answered / total) * 100)}%</span>
                </div>
                <div style={{ height: 6, background: '#f1ebe1', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(answered / total) * 100}%`, background: 'linear-gradient(90deg, #7a9a5a, #46552f)', borderRadius: 99, transition: 'width 0.25s ease' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tool.questions.map((q, i) => {
                  const opts = q.options || tool.options;
                  const done = answers[i] !== undefined && answers[i] !== null;
                  return (
                    <div key={i} data-q={i} style={{
                      background: done ? '#f4eee4' : 'var(--bg-subtle, #fafafa)',
                      border: `1px solid ${done ? 'var(--brand-300, #9bb481)' : 'var(--border)'}`,
                      borderRadius: 12, padding: '12px 14px', transition: 'all 0.15s',
                    }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                        <span style={{ background: 'var(--brand-500, #7a9a5a)', color: '#fff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                        <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 500 }}>{q.text}</p>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(110px, 1fr))`, gap: 6 }}>
                        {opts.map((opt) => {
                          const selected = answers[i] === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => pick(i, opt.value)}
                              style={{
                                padding: '7px 8px', borderRadius: 8,
                                border: selected ? '2px solid var(--brand-500, #7a9a5a)' : '1px solid var(--border)',
                                background: selected ? 'var(--brand-500, #7a9a5a)' : '#fff',
                                color: selected ? '#fff' : 'var(--text)',
                                fontSize: '0.8rem', fontWeight: selected ? 700 : 500,
                                cursor: 'pointer', transition: 'all 0.12s', lineHeight: 1.2,
                              }}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ position: 'sticky', bottom: 0, paddingTop: 14 }}>
                <button
                  type="button"
                  className="btn btn-primary btn-full"
                  disabled={!canSubmit}
                  onClick={() => { setSubmitted(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  {canSubmit ? 'See my result' : `Answer all questions (${answered}/${tool.questions.length})`}
                </button>
              </div>
            </>
          ) : (
            <Result tool={tool} result={result} crisisFlag={crisisFlag} onRetake={() => { setAnswers(Array(tool.questions.length).fill(undefined)); setSubmitted(false); }} />
          )}

          <p className="muted" style={{ fontSize: '0.78rem', textAlign: 'center', marginTop: '2rem', lineHeight: 1.5 }}>
            This is a screening aid, not a diagnosis. Only a qualified professional can diagnose a condition.
            In a crisis, call <strong>112</strong> or a helpline — see our{' '}
            <Link to="/emergency-disclaimer" style={{ color: 'var(--brand-700)' }}>Emergency page</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}

function Result({ tool, result, crisisFlag, onRetake }) {
  const { band } = result;
  const isCount = tool.scoring === 'threshold_count';
  const max = isCount ? tool.questions.length : maxScore(tool);
  const value = isCount ? result.count : result.score;
  const pct = Math.round((value / max) * 100);

  return (
    <div>
      {crisisFlag && (
        <div style={{ background: '#fdecea', border: '1px solid #f5c2c0', color: '#a02622', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
          <strong>You mentioned thoughts of self-harm.</strong> You deserve support right now. Please talk to someone today —
          call <strong>iCall 9152987821</strong> or <strong>112</strong> in an emergency. You don&rsquo;t have to wait for an appointment.
        </div>
      )}

      <div style={{ background: '#fff', border: `2px solid ${band.color}`, borderRadius: 16, padding: '1.5rem', marginBottom: '1.25rem', textAlign: 'center' }}>
        <p className="muted" style={{ fontSize: '0.8rem', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Your result</p>
        {!isCount ? (
          <>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: band.color, lineHeight: 1 }}>
              {value}<span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}> / {max}</span>
            </div>
            <BandScale tool={tool} value={value} max={max} band={band} />
          </>
        ) : (
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: band.color, lineHeight: 1.2, marginBottom: 6 }}>
            {result.count} of {tool.questions.length} key items
          </div>
        )}
        <div style={{ display: 'inline-block', background: band.color, color: '#fff', borderRadius: 99, padding: '4px 16px', fontSize: '0.9rem', fontWeight: 700, marginTop: 6 }}>
          {band.label}
        </div>
        <p className="muted" style={{ fontSize: '0.92rem', lineHeight: 1.6, margin: '14px auto 0', maxWidth: 460 }}>{band.desc}</p>
      </div>

      {/* Next steps */}
      <div style={{ background: 'var(--bg-subtle, #f7f7f4)', borderRadius: 14, padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 8 }}>What next?</h2>
        <p className="muted" style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 14 }}>
          A short conversation with a verified professional can help you make sense of this and decide what — if anything — to do.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link
            to={buildBookPath({
              tool: tool.slug,
              score: isCount ? `${result.count}/${tool.questions.length}` : value,
              band: band.label,
              prole: (Number(value) >= 15 || (isCount && result.count >= 3)) ? 'psychiatrist' : 'psychologist',
            })}
            className="btn btn-primary"
          >
            Book a consultation
          </Link>
          <a
            href={`https://wa.me/917777936367?text=${encodeURIComponent(`Hi, I just did the ${tool.name} self-check on Serenest (result: ${band.label}). I'd like to talk to someone.`)}`}
            target="_blank" rel="noreferrer"
            className="btn btn-ghost" style={{ background: '#25D366', color: '#fff', borderColor: '#25D366' }}
          >
            💬 WhatsApp us
          </a>
          <button type="button" onClick={onRetake} className="btn btn-ghost">Retake</button>
        </div>
      </div>

      <OtherTools currentId={tool.id} />
    </div>
  );
}

function OtherTools({ currentId }) {
  const others = SCREENING_TOOLS.filter((t) => t.id !== currentId);
  return (
    <div>
      <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '1.25rem 0 10px' }}>
        Other self-checks
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
        {others.map((t) => (
          <Link key={t.id} to={`/screening/tool/${t.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.1rem' }} aria-hidden>{t.icon}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.short}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Full severity spectrum with a marker at the user's score — shows where the
 * result sits relative to every band, not just a single filled bar.
 */
function BandScale({ tool, value, max, band }) {
  if (!tool.bands || tool.bands.length < 2) {
    const pct = Math.round((value / max) * 100);
    return (
      <div style={{ height: 8, background: 'var(--bg-subtle, #eee)', borderRadius: 99, overflow: 'hidden', margin: '12px auto', maxWidth: 340 }}>
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
        {/* marker */}
        <div aria-hidden style={{
          position: 'absolute', top: 0, left: `${markerPct}%`, transform: 'translateX(-50%)',
          width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
          borderTop: `8px solid ${band.color}`,
        }} />
        <div style={{ display: 'flex', height: 10, borderRadius: 99, overflow: 'hidden' }}>
          {segments.map((s) => (
            <div key={s.label} title={s.label} style={{ width: `${s.width}%`, background: s.color, opacity: s.label === band.label ? 1 : 0.32 }} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>
        <span>{segments[0].label}</span>
        <span>{segments[segments.length - 1].label}</span>
      </div>
    </div>
  );
}
