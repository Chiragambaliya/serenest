import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';

export default function NotFoundPage() {
  // Fallback noindex when the server can't intercept (e.g. static hosting).
  useSEO({
    path: '/404',
    title: 'Page not found | Serenest',
    description: 'The page you are looking for could not be found.',
    noindex: true,
  });
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">404</p>
            <h1 className="page-title">Page not found.</h1>
            <p className="about-subtext">
              The page you&apos;re looking for doesn&apos;t exist. Use the links below to get back on track.
            </p>

            <div className="hero-actions" style={{ marginTop: 14 }}>
              <Link className="btn btn-primary" to="/book">
                Book a Consultation
              </Link>
              <Link className="btn btn-ghost" to="/">
                Go to Home
              </Link>
              <Link className="btn btn-ghost" to="/services">
                View Services
              </Link>
              <Link className="btn btn-ghost" to="/screening">
                Take a Self-Screening
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

