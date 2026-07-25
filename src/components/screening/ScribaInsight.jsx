import React from 'react';

/**
 * Scriba Insight — calm, non-diagnostic framing.
 * Template-driven today; replace `insight.body` with model output later.
 */
export default function ScribaInsight({ insight }) {
  if (!insight) return null;
  return (
    <section className="mhc-scriba" aria-labelledby="scriba-title">
      <p className="mhc-scriba-eye">{insight.eyebrow}</p>
      <h2 id="scriba-title">{insight.title}</h2>
      <p>{insight.body}</p>
      <p className="mhc-scriba-note">{insight.disclaimer}</p>
    </section>
  );
}
