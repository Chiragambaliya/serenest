import React from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  DRUG_GUIDES,
  DRUG_GUIDES_BASE,
  INDICATION_STATUS_LABEL,
  drugGuidePath,
  getDrugGuide,
} from '../lib/drugGuides/index.js';
import { ROUTE_SEO } from '../lib/seo';
import { useSEO } from '../lib/useSEO';
import { formatDate } from './DrugGuidesIndexPage';

const SECTIONS = [
  ['overview', 'Overview'],
  ['indications', 'Indications & dosing'],
  ['pharmacology', 'Pharmacology'],
  ['interactions', 'Interactions'],
  ['adverse', 'Adverse effects'],
  ['monitoring', 'Monitoring'],
  ['populations', 'Special populations'],
  ['india', 'India practice notes'],
  ['pearls', 'Clinical pearls'],
  ['references', 'References'],
];

function List({ items, className }) {
  return (
    <ul className={className || 'dg-list'}>
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

function Rows({ rows }) {
  return (
    <dl className="dg-rows">
      {rows.map(([k, v]) => (
        <div key={k} className="dg-rows__row">
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function DrugGuidePage() {
  const { slug } = useParams();
  const drug = getDrugGuide(slug);
  const path = drugGuidePath(slug);

  useSEO(drug ? { path, ...ROUTE_SEO[path], noindex: !drug.reviewed } : { path, title: 'Drug guide not found | Serenest', noindex: true });

  if (!drug) {
    return (
      <div className="page">
        <section className="section about-hero">
          <div className="container">
            <div className="section-head about-hero-head">
              <p className="kicker">Drug Guides</p>
              <h1 className="page-title">Guide not found.</h1>
              <div className="hero-actions" style={{ marginTop: 14 }}>
                <Link className="btn btn-primary" to={DRUG_GUIDES_BASE}>
                  All drug guides
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const idx = DRUG_GUIDES.findIndex((d) => d.slug === drug.slug);
  const next = DRUG_GUIDES[(idx + 1) % DRUG_GUIDES.length];

  return (
    <div className="page dg">
      <section className="section about-hero dg-hero">
        <div className="container">
          <nav className="dg-crumbs" aria-label="Breadcrumb">
            <Link to="/professionals">Professionals</Link>
            <span aria-hidden="true">/</span>
            <Link to={DRUG_GUIDES_BASE}>Drug Guides</Link>
          </nav>
          <p className="kicker">{drug.group}</p>
          <h1 className="page-title">{drug.name}</h1>
          <p className="dg-hero__class">{drug.drugClass}</p>
          <div className="dg-hero__meta">
            <span>Updated {formatDate(drug.updated)}</span>
            <button type="button" className="dg-print" onClick={() => window.print()}>
              Print / save as PDF
            </button>
          </div>
          {!drug.reviewed ? (
            <p className="dg-draft" role="note">
              Draft — pending clinical review by the Serenest medical team. Verify against the current product label
              before relying on any dose.
            </p>
          ) : null}
        </div>
      </section>

      <div className="container dg-layout">
        <nav className="dg-toc" aria-label="On this page">
          <p className="dg-toc__title">On this page</p>
          <ol>
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="dg-body">
          <section id="overview" className="dg-section">
            <h2>In a nutshell</h2>
            <p className="dg-lede">{drug.nutshell}</p>

            <div className="dg-split">
              <div className="dg-panel dg-panel--pro">
                <h3>Strengths</h3>
                <List items={drug.pros} />
              </div>
              <div className="dg-panel dg-panel--con">
                <h3>Limitations</h3>
                <List items={drug.cons} />
              </div>
            </div>

            <div className="dg-split">
              <div className="dg-panel">
                <h3>When to consider</h3>
                <List items={drug.whenToUse} />
              </div>
              <div className="dg-panel">
                <h3>Prefer an alternative when</h3>
                <List items={drug.preferAlternatives} />
              </div>
            </div>
          </section>

          <section id="indications" className="dg-section">
            <h2>Indications & dosing</h2>
            <div className="dg-indications">
              {drug.indications.map((ind) => (
                <div key={ind.name} className="dg-ind">
                  <div className="dg-ind__head">
                    <h3>{ind.name}</h3>
                    <span className={`dg-status dg-status--${ind.status}`}>{INDICATION_STATUS_LABEL[ind.status]}</span>
                  </div>
                  {ind.detail ? <p className="dg-ind__detail">{ind.detail}</p> : null}
                  {ind.dosing ? <List items={ind.dosing} className="dg-list dg-list--dose" /> : null}
                </div>
              ))}
            </div>
          </section>

          <section id="pharmacology" className="dg-section">
            <h2>Pharmacology</h2>
            <h3>Mechanism of action</h3>
            <List items={drug.pharmacodynamics} />
            <h3>Pharmacokinetics</h3>
            <Rows rows={drug.pharmacokinetics} />
          </section>

          <section id="interactions" className="dg-section">
            <h2>Interactions</h2>
            <List items={drug.interactions} />
          </section>

          <section id="adverse" className="dg-section">
            <h2>Adverse effects</h2>
            <div className="dg-split">
              <div className="dg-panel">
                <h3>Common</h3>
                <List items={drug.commonEffects} />
              </div>
              <div className="dg-panel dg-panel--con">
                <h3>Serious or important</h3>
                <List items={drug.seriousEffects} />
              </div>
            </div>
          </section>

          <section id="monitoring" className="dg-section">
            <h2>Monitoring</h2>
            <List items={drug.monitoring} />
          </section>

          <section id="populations" className="dg-section">
            <h2>Special populations</h2>
            <Rows rows={drug.special} />
            {drug.discontinuation ? (
              <>
                <h3>Stopping and switching</h3>
                <p>{drug.discontinuation}</p>
              </>
            ) : null}
          </section>

          <section id="india" className="dg-section dg-india">
            <h2>India practice notes</h2>
            <Rows
              rows={[
                ['Telepsychiatry', drug.india.telepsychiatry],
                ['Regulatory status', drug.india.regulatory],
                ['Example brands', drug.india.brands.join(', ')],
                ...(drug.india.notes ? [['Practice note', drug.india.notes]] : []),
              ]}
            />
          </section>

          <section id="pearls" className="dg-section">
            <h2>Clinical pearls</h2>
            <List items={drug.pearls} className="dg-list dg-list--pearls" />
          </section>

          <section id="references" className="dg-section">
            <h2>References</h2>
            <ol className="dg-refs">
              {drug.references.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ol>
            <p className="dg-disclaimer">
              Educational content for qualified clinicians. It does not replace the current product label, local
              guidelines or clinical judgment. Brand names are illustrative; Serenest has no commercial relationship
              with any manufacturer.
            </p>
          </section>

          <div className="dg-next">
            <Link className="btn btn-ghost" to={DRUG_GUIDES_BASE}>
              ← All drug guides
            </Link>
            <Link className="btn btn-primary" to={drugGuidePath(next.slug)}>
              Next: {next.name} →
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
