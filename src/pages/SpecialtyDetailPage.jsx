import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { SPECIALTY_GROUPS, specialtyById } from '../lib/specialties';
import EmergencyNotice from '../components/EmergencyNotice';
import NotFoundPage from './NotFoundPage';
import '../styles/service-detail.css';

export default function SpecialtyDetailPage() {
  const { slug } = useParams();
  const specialty = specialtyById(slug);
  const path = specialty ? `/specialties/${specialty.id}` : '/specialties';
  const seo = ROUTE_SEO[path] || ROUTE_SEO['/specialties'];
  useSEO({ path, ...seo });

  if (!specialty) return <NotFoundPage />;

  const group = SPECIALTY_GROUPS.find((item) => item.id === specialty.groupId);
  const siblings = (group?.specialties || []).filter((item) => item.id !== specialty.id);

  return (
    <div className="svd-page">
      <section className="svd-hero svd-hero--tension">
        <div className="container">
          <div>
            <p className="svd-eyebrow">
              <Link to="/specialties">Teleconsultation</Link>
              {' · '}
              {specialty.groupLabel}
            </p>
            <h1>Online {specialty.label.toLowerCase()} consultation</h1>
            <p className="svd-hero__lead">{specialty.summary}</p>
            <div className="svd-hero__actions">
              <Link className="btn btn-primary btn-lg" to={`/book?specialty=${specialty.id}`}>
                Request this consult
              </Link>
              <Link className="btn btn-ghost btn-lg" to={`/patient/find-professional?role=${specialty.id}`}>
                See clinicians
              </Link>
            </div>
          </div>
          <dl className="svd-hero-tension__pair">
            <div>
              <dt>Works online</dt>
              <dd>{specialty.online[0]}</dd>
            </div>
            <div>
              <dt>Needs a clinic</dt>
              <dd>{specialty.inPerson[0]}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="svd-section">
        <div className="container">
          <p className="svd-sidelabel">Scope</p>
          <h2>What this consult can and cannot do</h2>
          <div className="ed-facing">
            <div>
              <h3>Reasonable online</h3>
              <div className="ed-index">
                {specialty.online.map((item, index) => (
                  <article key={item} className="ed-index__row">
                    <span className="ed-index__num">{String(index + 1).padStart(2, '0')}</span>
                    <span>
                      <h4 className="ed-index__title">{item}</h4>
                    </span>
                    <p className="ed-index__body">Discussed on video, audio, or chat.</p>
                    <span />
                  </article>
                ))}
              </div>
            </div>
            <div>
              <h3>Still in person</h3>
              <div className="ed-index">
                {specialty.inPerson.map((item, index) => (
                  <article key={item} className="ed-index__row">
                    <span className="ed-index__num">{String(index + 1).padStart(2, '0')}</span>
                    <span>
                      <h4 className="ed-index__title">{item}</h4>
                    </span>
                    <p className="ed-index__body">Your clinician will say so if this applies.</p>
                    <span />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="svd-section svd-section--soft">
        <div className="container svd-split svd-split--aside">
          <div>
            <p className="svd-sidelabel">Who you see</p>
          </div>
          <div>
            <h2>A verified {specialty.label.toLowerCase()}</h2>
            <p className="svd-section-lead">
              {specialty.license} If no one in this branch is listed yet, the request still
              reaches the care team. They confirm a clinician or tell you the concern needs a clinic.
            </p>
            <EmergencyNotice />
            <p style={{ marginTop: '1.25rem' }}>
              <Link className="btn btn-primary" to={`/book?specialty=${specialty.id}`}>Request an appointment</Link>
            </p>
          </div>
        </div>
      </section>

      {siblings.length > 0 && (
        <section className="svd-section">
          <div className="container">
            <p className="svd-sidelabel">{specialty.groupLabel}</p>
            <h2>Other branches in {specialty.groupLabel.toLowerCase()}</h2>
            <div className="ed-index">
              {siblings.map((item, index) => (
                <Link key={item.id} className="ed-index__row" to={`/specialties/${item.id}`}>
                  <span className="ed-index__num">{String(index + 1).padStart(2, '0')}</span>
                  <span>
                    <h3 className="ed-index__title">{item.label}</h3>
                  </span>
                  <p className="ed-index__body">{item.summary}</p>
                  <span className="ed-index__go" aria-hidden="true">View →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
