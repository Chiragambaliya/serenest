import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { DRUG_GUIDES, DRUG_GUIDES_BASE, drugGuidePath, guideCountFor } from '../lib/drugGuides/index.js';
import { SPECIALTIES, getSpecialty } from '../lib/specialties.js';
import { ROUTE_SEO } from '../lib/seo';
import { useSEO } from '../lib/useSEO';

function matches(drug, q) {
  if (!q) return true;
  const sp = getSpecialty(drug.specialty);
  const hay = [
    drug.name,
    drug.drugClass,
    drug.group,
    sp ? sp.name : '',
    ...drug.india.brands,
    ...drug.indications.map((i) => i.name),
  ]
    .join(' ')
    .toLowerCase();
  return hay.includes(q);
}

/** Groups in the specialty's declared order, then any undeclared groups alphabetically. */
function orderedGroups(specialty, drugs) {
  const declared = specialty.groups || [];
  const present = [...new Set(drugs.map((d) => d.group))];
  return [...declared.filter((g) => present.includes(g)), ...present.filter((g) => !declared.includes(g)).sort()];
}

export default function DrugGuidesIndexPage() {
  useSEO({ path: DRUG_GUIDES_BASE, ...ROUTE_SEO[DRUG_GUIDES_BASE] });
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const selected = getSpecialty(params.get('specialty') || '') ? params.get('specialty') : 'all';

  function choose(slug) {
    const next = new URLSearchParams(params);
    if (slug === 'all') next.delete('specialty');
    else next.set('specialty', slug);
    setParams(next, { replace: true });
  }

  // Specialties with guides first (in list order), then the rest.
  const chips = useMemo(() => {
    const withGuides = SPECIALTIES.filter((s) => guideCountFor(s.slug) > 0);
    const without = SPECIALTIES.filter((s) => guideCountFor(s.slug) === 0);
    return [...withGuides, ...without];
  }, []);

  const sections = useMemo(() => {
    const pool = SPECIALTIES.filter((s) => selected === 'all' || s.slug === selected);
    return pool
      .map((sp) => {
        const drugs = DRUG_GUIDES.filter((d) => d.specialty === sp.slug && matches(d, q));
        return {
          specialty: sp,
          groups: orderedGroups(sp, drugs).map((g) => ({ group: g, drugs: drugs.filter((d) => d.group === g) })),
          count: drugs.length,
        };
      })
      .filter((s) => s.count > 0);
  }, [selected, q]);

  const selectedSpecialty = selected === 'all' ? null : getSpecialty(selected);
  const selectedEmpty = selectedSpecialty && guideCountFor(selectedSpecialty.slug) === 0;

  return (
    <div className="page dg">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <nav className="dg-crumbs" aria-label="Breadcrumb">
              <Link to="/learn">Learn</Link>
            </nav>
            <p className="kicker">For Professionals</p>
            <h1 className="page-title">Serenest Drug Guides</h1>
            <p className="about-subtext">
              Concise drug references for doctors and postgraduate trainees across specialties — mechanism, dosing,
              adverse effects, monitoring and special populations, with an Indian practice layer: teleconsultation
              prescribing rules, regulation and common brands.
            </p>
          </div>
        </div>
      </section>

      <section className="section dg-library" aria-label="Drug library">
        <div className="container">
          <div className="dg-filters">
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

            <div className="dg-chips" role="group" aria-label="Filter by specialty">
              <button
                type="button"
                className={`dg-chip${selected === 'all' ? ' is-active' : ''}`}
                aria-pressed={selected === 'all'}
                onClick={() => choose('all')}
              >
                All specialties <span className="dg-chip__n">{DRUG_GUIDES.length}</span>
              </button>
              {chips.map((s) => {
                const n = guideCountFor(s.slug);
                return (
                  <button
                    key={s.slug}
                    type="button"
                    className={`dg-chip${selected === s.slug ? ' is-active' : ''}${n === 0 ? ' is-empty' : ''}`}
                    aria-pressed={selected === s.slug}
                    onClick={() => choose(s.slug)}
                  >
                    {s.name}
                    {n > 0 ? <span className="dg-chip__n">{n}</span> : null}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedEmpty ? (
            <div className="dg-coming">
              <h2 className="dg-group__title">{selectedSpecialty.name}</h2>
              <p className="muted">
                {selectedSpecialty.name} guides are in preparation. Tell us which drugs you would like first —{' '}
                <a href={`mailto:support@serenest.in?subject=${encodeURIComponent(`Drug guide request: ${selectedSpecialty.name}`)}`}>
                  support@serenest.in
                </a>
                .
              </p>
            </div>
          ) : sections.length === 0 ? (
            <p className="muted dg-empty">
              No guide matches “{query}”. More drugs are being added — email{' '}
              <a href="mailto:support@serenest.in">support@serenest.in</a> to request one.
            </p>
          ) : (
            sections.map(({ specialty, groups, count }) => (
              <div key={specialty.slug} className="dg-specialty">
                <div className="dg-specialty__head">
                  <h2 className="dg-specialty__title">{specialty.name}</h2>
                  <span className="dg-specialty__count">
                    {count} {count === 1 ? 'guide' : 'guides'}
                  </span>
                </div>
                {groups.map(({ group, drugs }) => (
                  <div key={group} className="dg-group">
                    <h3 className="dg-group__title">{group}</h3>
                    <ul className="dg-grid">
                      {drugs.map((d) => (
                        <li key={d.slug}>
                          <Link className="dg-card" to={drugGuidePath(d.slug)}>
                            <span className="dg-card__class">{d.drugClass}</span>
                            <span className="dg-card__name">{d.name}</span>
                            <span className="dg-card__summary">{d.nutshell.split('. ')[0]}.</span>
                            <span className="dg-card__foot">
                              {d.reviewed ? (
                                <span>Updated {formatDate(d.updated)}</span>
                              ) : (
                                <span className="dg-badge">Pending clinical review</span>
                              )}
                              <span aria-hidden="true">→</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
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
