import { Link } from 'react-router-dom'
import { ContactCta } from '../components/ContactCta'
import { PageHero } from '../components/PageHero'
import { usePageTitle } from '../hooks/usePageTitle'
import { FLAGSHIP } from '../data/programs'

export function ClinicalExcellencePage() {
  usePageTitle('Clinical Excellence')

  return (
    <>
      <PageHero
        eyebrow="Flagship course · For clinicians"
        title={FLAGSHIP.title}
        lede={FLAGSHIP.tagline}
        actions={
          <>
            <Link className="btn btn--primary" to="/contact">
              Request a seat
            </Link>
            <Link className="btn btn--ghost" to="/programmes">
              All programmes
            </Link>
          </>
        }
      />

      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">Overview</p>
            <h2>Built for real-world practice</h2>
            <p className="prose">{FLAGSHIP.overview}</p>
            <ul className="check-list">
              {FLAGSHIP.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
          <aside className="side-card">
            <p className="side-card__label">Format</p>
            <p>{FLAGSHIP.format}</p>
            <p className="side-card__label">Who it&apos;s for</p>
            <ul>
              {FLAGSHIP.forWho.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
            <Link className="btn btn--primary btn--full" to="/contact">
              Enrol / ask a question
            </Link>
          </aside>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">Curriculum</p>
            <h2>What you will learn</h2>
          </header>
          <ol className="learn-grid">
            {FLAGSHIP.learn.map((item, i) => (
              <li key={item}>
                <span className="learn-grid__num">{String(i + 1).padStart(2, '0')}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ContactCta
        title="Claim your place in Clinical Excellence"
        lede="Tell us your role and cohort preference. We will confirm seats and next steps."
      />
    </>
  )
}
