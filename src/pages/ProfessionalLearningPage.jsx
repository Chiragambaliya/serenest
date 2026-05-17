import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import ProfessionalHubCard from '../components/ProfessionalHubCard';
import { loadProgressIds, toggleProgressId } from '../lib/proLearningProgress';
import {
  PROFESSIONAL_LEARNING_MODULES,
  isProLearningProgressTrackable,
} from '../lib/professionalLearning';

export default function ProfessionalLearningPage() {
  const [doneIds, setDoneIds] = useState(() => loadProgressIds());
  const doneSet = useMemo(() => new Set(doneIds), [doneIds]);

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
            <p className="kicker">For Professionals</p>
            <h1 className="page-title">Learning hub — clinical practice &amp; platform skills</h1>
            <p className="about-subtext">
              Articles, PDFs, and videos you can use in practice — plus{' '}
              <strong>Mark done</strong> to track your place (saved in this browser). Account sync across devices
              is next once professional sign-in ships.
            </p>
            {trackableCount > 0 ? (
              <p className="fineprint" style={{ marginTop: 10, maxWidth: '52ch' }}>
                Progress: {doneCount} / {trackableCount} items marked complete on this device.
              </p>
            ) : null}
            <div className="hero-actions" style={{ marginTop: 20, flexWrap: 'wrap' }}>
              <Link className="btn btn-primary" to="/professionals/apply">
                Apply to join →
              </Link>
              <Link className="btn btn-ghost" to="/professionals/resources">
                Resources →
              </Link>
              <Link className="btn btn-ghost" to="/professionals/guidelines">
                Guidelines →
              </Link>
              <Link className="btn btn-ghost" to="/professionals">
                ← Overview
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Learning modules">
        <div className="container">
          <div className="section-head">
            <p className="section-label">Curriculum-style picks</p>
            <h2>Start with what fits your practice</h2>
            <p>
              Blog posts open on this site; PDFs and videos open in a new tab. Replace demo URLs in{' '}
              <code style={{ fontSize: '0.9em' }}>professionalLearning.js</code> with your Supabase Storage or Loom
              links when ready.
            </p>
          </div>

          <div className="feature-grid">
            {PROFESSIONAL_LEARNING_MODULES.map((m) => (
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
      </section>

      <section className="section alt">
        <div className="container">
          <div className="cta about-cta">
            <div>
              <h2 className="h2" style={{ margin: 0 }}>
                Want something covered here?
              </h2>
              <p className="muted" style={{ margin: '6px 0 0' }}>
                Tell us which topics or formats (PDF, webinar, Loom) would help your team — we prioritise by demand.
              </p>
            </div>
            <div className="stack about-cta-actions">
              <a className="btn btn-primary btn-full" href="mailto:support@serenest.fit?subject=Learning%20hub%20suggestion">
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
