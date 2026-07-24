import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Editorial text + image band (not a card grid).
 * On mobile, text precedes the image.
 */
export default function ImageTextSection({
  eyebrow,
  title,
  titleId,
  description,
  points,
  actions,
  image,
  imagePosition = 'right',
  tone = 'default',
}) {
  return (
    <section
      className={`ed-split ed-split--${tone} ed-split--media-${imagePosition}`}
      aria-labelledby={titleId}
    >
      <div className="ds-shell ds-shell--wide ed-split__grid">
        <div className="ed-split__copy">
          {eyebrow && <p className="ds-eyebrow">{eyebrow}</p>}
          <h2 id={titleId} className="ds-display ed-split__title">{title}</h2>
          {description && <p className="ds-lead">{description}</p>}
          {points?.length > 0 && (
            <ul className="ed-split__points">
              {points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
          {actions?.length > 0 && (
            <div className="ds-actions">
              {actions.map((a) => (
                <Link
                  key={a.label}
                  className={`ds-btn ${a.variant === 'secondary' ? 'ds-btn--secondary' : 'ds-btn--primary'}`}
                  to={a.to}
                >
                  {a.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {image && (
          <div className="ed-split__media">
            <picture>
              {image.webp && <source srcSet={image.webp} type="image/webp" />}
              <img
                src={image.jpg || image.src}
                alt={image.alt || ''}
                width={image.width || 900}
                height={image.height || 900}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
        )}
      </div>
    </section>
  );
}
