import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { DRUG_GROUPS, DRUG_GUIDES, DRUG_GUIDES_BASE, drugGuidePath } from '../lib/drugGuides/index.js';
import { ROUTE_SEO } from '../lib/seo';
import { useSEO } from '../lib/useSEO';

function matches(drug, q) {
  if (!q) return true;
  const hay = [drug.name, drug.drugClass, drug.group, ...drug.india.brands, ...drug.indications.map((i) => i.name)]
    .join(' ')
    .toLowerCase();
  return hay.includes(q);
}

export default function DrugGuidesIndexPage() {
  useSEO({ path: DRUG_GUIDES_BASE, ...ROUTE_SEO[DRUG_GUIDES_BASE] });
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const grouped = useMemo(
    () =>
      DRUG_GROUPS.map((group) => ({
        group,
        drugs: DRUG_GUIDES.filter((d) => d.group === group && matches(d, q)),
      })).filter((g) => g.drugs.length > 0),
    [q],
  );

  return (
    <div className="page dg">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">For Professionals</p>
            <h1 className="page-title">Serenest Drug Guides</h1>
            <p className="about-subtext">
              Concise psychopharmacology references for psychiatrists and residents — mechanism, dosing, adverse
              effects, monitoring and special populations, with an Indian practice layer: telepsychiatry
              prescribing lists, regulation and common brands.
            </p>
          </div>
        </div>
      </section>

      <section className="section dg-library" aria-label="Drug library">
        <div className="container">
          <label className="dg-search">
            <span className="dg-search__label">Search drugs, classes, indications or brands</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. lithium, bipolar depression, Oleanz"
              autoComplete="off"
            />
          </label>

          {grouped.length === 0 ? (
            <p className="muted dg-empty">
              No guide matches “{query}”. More drugs are being added — email{' '}
              <a href="mailto:support@serenest.in">support@serenest.in</a> to request one.
            </p>
          ) : (
            grouped.map(({ group, drugs }) => (
              <div key={group} className="dg-group">
                <h2 className="dg-group__title">{group}</h2>
                <ul className="dg-grid">
                  {drugs.map((d) => (
                    <li key={d.slug}>
                      <Link className="dg-card" to={drugGuidePath(d.slug)}>
                        <span className="dg-card__class">{d.drugClass}</span>
                        <span className="dg-card__name">{d.name}</span>
                        <span className="dg-card__summary">{d.nutshell.split('. ')[0]}.</span>
                        <span className="dg-card__foot">
                          {d.reviewed ? <span>Updated {formatDate(d.updated)}</span> : <span className="dg-badge">Pending clinical review</span>}
                          <span aria-hidden="true">→</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="callout">
            <div className="callout-title">How to use these guides</div>
            <p className="muted" style={{ margin: 0 }}>
              Educational summaries for qualified clinicians, written from prescribing information, trials and
              guidelines. They do not replace the current product label, local guidelines or clinical judgment.
              Brand names are illustrative; Serenest has no commercial relationship with any manufacturer.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
