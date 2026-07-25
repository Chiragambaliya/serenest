import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import ProfessionalHubCard from '../components/ProfessionalHubCard';
import { loadProgressIds, toggleProgressId } from '../lib/proLearningProgress';
import {
  LEARNING_TRACK_LABELS,
  learningModulesForTrack,
  isProLearningProgressTrackable,
  PROFESSIONAL_LEARNING_MODULES,
} from '../lib/professionalLearning';

const PHARM = learningModulesForTrack('pharmacology');
const PSYCH = learningModulesForTrack('psychology');

export default function ProfessionalLearningPage() {
  const location = useLocation();
  const [doneIds, setDoneIds] = useState(() => loadProgressIds());
  const doneSet = useMemo(() => new Set(doneIds), [doneIds]);

  useEffect(() => {
    const id = location.hash.replace(/^#/, '');
    if (id === 'learning-pharmacology' || id === 'learning-psychology') {
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.hash, location.pathname]);

  const trackableCount = useMemo(
    () => PROFESSIONAL_LEARNING_MODULES.filter(isProLearningProgressTrackable).length,
    [],
  );
  const doneCount = useMemo(
    () =>
      PROFESSIONAL_LEARNING_MODULES.filter(
        (m) => isProLearningProgressTrackable(m) && doneSet.has(m.id),
      ).length,
    [doneSet],
  );

  const handleToggle = (id) => {
    setDoneIds(toggleProgressId(id));
  };

  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Serenest Academy</p>
            <h1 className="page-title">Learning hub — pharmacology &amp; psychology tracks</h1>
            <p className="about-subtext">
              Part of Serenest Academy. Materials are grouped into two tracks:{' '}
              <strong>{LEARNING_TRACK_LABELS.pharmacology}</strong> (prescribing, documentation, telemedicine
              norms, continuity) and <strong>{LEARNING_TRACK_LABELS.psychology}</strong> (assessment tools,
              psychoeducation, behavioural health topics). Use <strong>Mark done</strong> to track progress on
              this device.
            </p>
            {trackableCount > 0 ? (
              <p className="fineprint" style={{ marginTop: 10, maxWidth: '52ch' }}>
                Progress: {doneCount} / {trackableCount} items marked complete on this device.
              </p>
            ) : null}
            <div className="hero-actions" style={{ marginTop: 20, flexWrap: 'wrap' }}>
              <a className="btn btn-primary" href="#learning-pharmacology">
                {LEARNING_TRACK_LABELS.pharmacology} →
              </a>
              <a className="btn btn-ghost" href="#learning-psychology">
                {LEARNING_TRACK_LABELS.psychology} →
              </a>
              <Link className="btn btn-ghost" to="/academy">
                ← Academy home
              </Link>
              <Link className="btn btn-ghost" to="/professionals/apply">
                Apply to join →
              </Link>
              <Link className="btn btn-ghost" to="/professionals/resources">
                Resources →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Learning modules">
        <div className="container">
          <div className="section-head">
            <p className="section-label">Curriculum-style picks</p>
            <h2>Start with the track that fits today</h2>
            <p>
              Blog posts open on this site; PDFs and videos open in a new tab. Replace demo URLs in{' '}
              <code style={{ fontSize: '0.9em' }}>professionalLearning.js</code> with your Supabase Storage or Loom
              links when ready. Each module has a <code style={{ fontSize: '0.9em' }}>track</code> field (
              <code style={{ fontSize: '0.9em' }}>pharmacology</code> or{' '}
              <code style={{ fontSize: '0.9em' }}>psychology</code>).
            </p>
          </div>

          <div id="learning-pharmacology" className="learning-track-block">
            <div className="section-head" style={{ marginBottom: '1.25rem' }}>
              <p className="section-label">{LEARNING_TRACK_LABELS.pharmacology}</p>
              <h3 style={{ marginTop: 8, fontSize: 'clamp(1.05rem, 2vw, 1.35rem)', fontWeight: 700 }}>
                Telemedicine, prescribing conversations, documentation &amp; continuity
              </h3>
            </div>
            <div className="feature-grid">
              {PHARM.map((m) => (
                <ProfessionalHubCard
                  key={m.id}
                  module={m}
                  enableProgress
                  completedIds={doneSet}
                  onToggleComplete={handleToggle}
                />
              ))}
            </div>
          </div>

          <div
            id="learning-psychology"
            className="learning-track-block"
            style={{ marginTop: 'clamp(2.5rem, 5vw, 3.5rem)' }}
          >
            <div className="section-head" style={{ marginBottom: '1.25rem' }}>
              <p className="section-label">{LEARNING_TRACK_LABELS.psychology}</p>
              <h3 style={{ marginTop: 8, fontSize: 'clamp(1.05rem, 2vw, 1.35rem)', fontWeight: 700 }}>
                Scales, psychoeducation, wellbeing skills &amp; therapeutic framing
              </h3>
            </div>
            <div className="feature-grid">
              {PSYCH.map((m) => (
                <ProfessionalHubCard
                  key={m.id}
                  module={m}
                  enableProgress
                  completedIds={doneSet}
                  onToggleComplete={handleToggle}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="cta about-cta">
            <div>
              <h2 className="h2" style={{ margin: 0 }}>
                Want something covered here?
              </h2>
              <p className="muted" style={{ margin: '6px 0 0' }}>
                Tell us which track (pharmacology or psychology), topics, or formats (PDF, webinar, Loom) would
                help your team — we prioritise by demand.
              </p>
            </div>
            <div className="stack about-cta-actions">
              <a className="btn btn-primary btn-full" href="mailto:support@serenest.in?subject=Learning%20hub%20suggestion">
                Suggest a topic →
              </a>
              <Link className="btn btn-ghost btn-full" to="/blog">
                Browse all blog posts
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
