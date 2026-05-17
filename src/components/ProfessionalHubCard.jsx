import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Shared card for professional learning & resource grids.
 * kind: blog | link | pdf | video | email | soon
 * When enableProgress + onToggleComplete + completedIds, shows "Mark done" for trackable kinds.
 */
export default function ProfessionalHubCard({
  module: m,
  enableProgress = false,
  completedIds = null,
  onToggleComplete,
}) {
  const pill = <span className="faq-pill">{m.pill}</span>;
  const completed = completedIds instanceof Set && completedIds.has(m.id);
  const trackable =
    enableProgress &&
    onToggleComplete &&
    (m.kind === 'blog' || m.kind === 'link' || m.kind === 'pdf' || m.kind === 'video');

  const inner = (
    <>
      <div className="blog-meta" style={{ marginBottom: 10 }}>
        {pill}
        {m.icon ? (
          <span className="blog-date" aria-hidden>
            {m.icon}
          </span>
        ) : null}
      </div>
      <h3 className="blog-title" style={{ fontSize: 'clamp(1.05rem, 1.3vw, 1.15rem)' }}>
        {m.title}
      </h3>
      <p className="muted" style={{ marginTop: 8, flex: 1, lineHeight: 1.65 }}>
        {m.summary}
      </p>
    </>
  );

  const auxBlog = <span className="learning-card-aux" style={{ marginTop: 14 }}>Read on blog →</span>;
  const auxLink = <span className="learning-card-aux" style={{ marginTop: 14 }}>Open link →</span>;
  const auxPdf = <span className="learning-card-aux" style={{ marginTop: 14 }}>Open PDF →</span>;
  const auxVideo = <span className="learning-card-aux" style={{ marginTop: 14 }}>Watch video →</span>;
  const auxEmail = <span className="learning-card-aux" style={{ marginTop: 14 }}>Email support →</span>;

  const progressBtn =
    trackable ? (
      <button
        type="button"
        className={`pro-learning-done-btn${completed ? ' is-done' : ''}`}
        aria-pressed={completed}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleComplete(m.id);
        }}
      >
        {completed ? 'Done ✓' : 'Mark done'}
      </button>
    ) : null;

  const articleClass =
    'tile feature-card pro-learning-card' + (completed && trackable ? ' is-complete' : '');

  if (m.kind === 'blog' && m.to) {
    return (
      <article className={articleClass} style={{ display: 'flex', flexDirection: 'column' }}>
        <Link
          to={m.to}
          className="block-link"
          style={{ color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}
        >
          {inner}
          {auxBlog}
        </Link>
        {progressBtn}
      </article>
    );
  }

  if (m.kind === 'link' && m.href) {
    return (
      <article className={articleClass} style={{ display: 'flex', flexDirection: 'column' }}>
        <a
          href={m.href}
          className="block-link"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}
        >
          {inner}
          {auxLink}
        </a>
        {progressBtn}
      </article>
    );
  }

  if (m.kind === 'pdf' && m.href) {
    return (
      <article className={articleClass} style={{ display: 'flex', flexDirection: 'column' }}>
        <a
          href={m.href}
          className="block-link"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}
        >
          {inner}
          {auxPdf}
        </a>
        {progressBtn}
      </article>
    );
  }

  if (m.kind === 'video' && m.href) {
    return (
      <article className={articleClass} style={{ display: 'flex', flexDirection: 'column' }}>
        <a
          href={m.href}
          className="block-link"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}
        >
          {inner}
          {auxVideo}
        </a>
        {progressBtn}
      </article>
    );
  }

  if (m.kind === 'email') {
    const q = m.emailSubject ? `?subject=${m.emailSubject}` : '?subject=Professional%20inquiry';
    return (
      <article className="tile feature-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <a
          href={`mailto:support@serenest.fit${q}`}
          className="block-link"
          style={{ color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}
        >
          {inner}
          {auxEmail}
        </a>
      </article>
    );
  }

  return (
    <article className="tile feature-card" style={{ display: 'flex', flexDirection: 'column', opacity: 0.92 }}>
      {inner}
      <span className="learning-card-aux learning-card-soon" style={{ marginTop: 14 }}>
        Coming soon
      </span>
    </article>
  );
}
