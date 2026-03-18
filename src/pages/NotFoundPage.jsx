import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
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
              <Link className="btn btn-primary" to="/">
                Go to Home
              </Link>
              <Link className="btn btn-ghost" to="/services">
                View Services
              </Link>
              <Link className="btn btn-ghost" to="/professionals">
                For Professionals
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

