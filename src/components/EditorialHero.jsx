import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Split editorial hero — text and image as separate planes (no text in image).
 */
export default function EditorialHero({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  image,
}) {
  return (
    <section className="ed-hero" aria-labelledby="ed-hero-title">
      <div className="ds-shell ds-shell--wide ed-hero__grid">
        <div className="ed-hero__copy">
          {eyebrow && <p className="ds-eyebrow">{eyebrow}</p>}
          <h1 id="ed-hero-title" className="ds-display ed-hero__title">
            {title}
          </h1>
          {description && <p className="ds-lead ed-hero__desc">{description}</p>}
          <div className="ds-actions">
            {primary && (
              <Link className="ds-btn ds-btn--primary" to={primary.to}>
                {primary.label}
              </Link>
            )}
            {secondary && (
              <Link className="ds-btn ds-btn--secondary" to={secondary.to}>
                {secondary.label}
              </Link>
            )}
          </div>
        </div>

        <div className="ed-hero__media">
          <picture>
            {image.webp && <source srcSet={image.webp} type="image/webp" />}
            <img
              src={image.jpg || image.src}
              alt={image.alt || ''}
              width={image.width || 960}
              height={image.height || 1080}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>
      </div>
    </section>
  );
}
