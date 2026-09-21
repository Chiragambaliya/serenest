import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import {
  CARE_SPECIALTIES,
  CONDITION_SPECIALTIES,
  SPECIALTY_INDEX_PATH,
} from '../lib/specialties';

export default function SpecialtiesPage() {
  useSEO({ path: SPECIALTY_INDEX_PATH, ...ROUTE_SEO[SPECIALTY_INDEX_PATH] });

  return (
    <div className="services-page">
      <section className="svd-hero">
        <div className="container">
          <p className="svd-eyebrow">Specialties</p>
          <h1>Every specialty Serenest can take a patient for.</h1>
          <p className="svd-hero__lead">
            Psychiatry, therapy, and the adult conditions our clinicians assess online.
            If you are not sure which page fits, request a slot and say what is going on.
            You do not pay until we confirm.
          </p>
          <div className="svd-hero__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Request an appointment</Link>
            <Link className="btn btn-ghost btn-lg" to="/screening">Start a free check</Link>
          </div>
          <p className="svd-hero__lead" style={{ marginTop: 16 }}>
            Serenest currently focuses on adult care. Child and adolescent psychiatry needs an in-person specialist we do not provide here.
          </p>
        </div>
      </section>

      <section className="svd-section" aria-labelledby="care-types-title">
        <div className="container">
          <p className="svd-sidelabel">How you are seen</p>
          <h2 id="care-types-title">Ways to start</h2>
          <div className="ed-index">
            {CARE_SPECIALTIES.map((item, index) => (
              <Link key={item.id} className="ed-index__row" to={item.path}>
                <span className="ed-index__num">{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <h3 className="ed-index__title">{item.name}</h3>
                </span>
                <p className="ed-index__body">{item.summary}</p>
                <span className="ed-index__go" aria-hidden="true">View →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="svd-section svd-section--soft" aria-labelledby="condition-specialties-title">
        <div className="container">
          <p className="svd-sidelabel">What you are facing</p>
          <h2 id="condition-specialties-title">Condition specialties</h2>
          <p className="svd-section-lead">
            Each page explains what online care can cover and when you need a hospital instead.
            Booking from a specialty page tells the team what you asked about.
          </p>
          <div className="ed-index">
            {CONDITION_SPECIALTIES.map((item, index) => (
              <Link key={item.id} className="ed-index__row" to={item.path}>
                <span className="ed-index__num">{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <h3 className="ed-index__title">{item.name}</h3>
                  <span className="ed-index__meta">{item.symptoms}</span>
                </span>
                <p className="ed-index__body">{item.summary}</p>
                <span className="ed-index__go" aria-hidden="true">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
