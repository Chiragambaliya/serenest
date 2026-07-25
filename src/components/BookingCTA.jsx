import React from 'react';
import { Link } from 'react-router-dom';

/** Closing booking / services call to action. */
export default function BookingCTA({
  title = 'Start with the kind of support you need.',
  primary = { label: 'Explore Services', to: '/services' },
  secondary = { label: 'Book an Appointment', to: '/book' },
  image,
}) {
  return (
    <section className="ed-cta" aria-labelledby="ed-cta-title">
      {image && (
        <div className="ed-cta__art" aria-hidden="true">
          <picture>
            {image.webp && <source srcSet={image.webp} type="image/webp" />}
            <img
              src={image.jpg || image.src}
              alt=""
              width={image.width || 1400}
              height={image.height || 788}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
      )}
      <div className="ds-shell ed-cta__inner">
        <p className="ed-cta__brand">Serenest</p>
        <h2 id="ed-cta-title" className="ds-display">{title}</h2>
        <div className="ds-actions">
          <Link className="ds-btn ds-btn--primary" to={primary.to}>{primary.label}</Link>
          <Link className="ds-btn ds-btn--ghost" to={secondary.to}>{secondary.label}</Link>
        </div>
      </div>
    </section>
  );
}
