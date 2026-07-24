import React from 'react';

/** Consistent section title block for editorial pages. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  titleId,
}) {
  return (
    <header className={`ed-heading ed-heading--${align}`}>
      {eyebrow && <p className="ds-eyebrow">{eyebrow}</p>}
      <h2 id={titleId} className="ds-display ed-heading__title">{title}</h2>
      {description && <p className="ds-lead">{description}</p>}
    </header>
  );
}
