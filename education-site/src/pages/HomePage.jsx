import { Link } from 'react-router-dom'
import { ContactCta } from '../components/ContactCta'
import { usePageTitle } from '../hooks/usePageTitle'
import { FLAGSHIP, pillars, stats } from '../data/programs'
import heroImg from '../assets/hero.png'

export function HomePage() {
  usePageTitle(null)

  return (
    <>
      <section className="hero">
        <div className="hero__atmosphere" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">
              <span>Serenest Education</span>
              <span className="eyebrow__dot" aria-hidden="true">·</span>
              <span>Clinical-grade learning</span>
            </p>
            <h1 className="hero__title">
              Learning for mind <em>&amp; practice</em>
            </h1>
            <p className="hero__lede">
              Flagship training for mental health professionals — plus literacy programmes for
              workplaces and campuses. Evidence-led. India-ready. Never hype.
            </p>
            <div className="hero__actions">
              <Link className="btn btn--primary" to="/programmes/clinical-excellence">
                Clinical Excellence
              </Link>
              <Link className="btn btn--ghost" to="/programmes">
                All programmes
              </Link>
            </div>
            <p className="hero__note">Education only — not emergency care. In crisis, dial 112 / 108.</p>
          </div>

          <aside className="hero__visual" aria-label="Serenest Education">
            <div className="hero__frame">
              <img src={heroImg} alt="" />
              <div className="hero__caption">
                <strong>{FLAGSHIP.title}</strong>
                <span>{FLAGSHIP.meta}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="strip" aria-label="Highlights">
        <div className="container strip__grid">
          {stats.map((s) => (
            <div key={s.label} className="strip__item">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="flagship">
            <div className="flagship__copy">
              <p className="eyebrow">Best for practicing professionals</p>
              <h2>{FLAGSHIP.title}</h2>
              <p className="flagship__lede">{FLAGSHIP.overview}</p>
              <ul className="check-list">
                {FLAGSHIP.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <div className="hero__actions">
                <Link className="btn btn--primary" to="/programmes/clinical-excellence">
                  Explore the flagship →
                </Link>
                <Link className="btn btn--ghost" to="/contact">
                  Enrol / partner
                </Link>
              </div>
            </div>
            <div className="flagship__metrics" aria-label="Course snapshot">
              {[
                { top: '12', sub: 'Weeks' },
                { top: '8', sub: 'Modules' },
                { top: 'Live', sub: 'Case rounds' },
                { top: 'Cert', sub: 'Included' },
              ].map((m) => (
                <div key={m.sub} className="metric">
                  <strong>{m.top}</strong>
                  <span>{m.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">Who we serve</p>
            <h2>One education brand. Three clear paths.</h2>
            <p>Choose the path that matches your role — clinicians, organisations, or public literacy.</p>
          </header>
          <div className="path-grid">
            {pillars.map((p) => (
              <article key={p.title} className="path-card">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <Link to={p.href}>{p.cta} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow center">
          <p className="eyebrow eyebrow--center">Why Serenest Education</p>
          <h2>Competence that scales beyond the clinic</h2>
          <p className="prose prose--center">
            We design courses and workshops so clinicians, teams, and communities can grow with
            evidence-backed content — clear language, responsible framing, and teaching that respects
            science and the Indian regulatory context.
          </p>
          <Link className="text-link" to="/about">
            About Serenest Education →
          </Link>
        </div>
      </section>

      <ContactCta />
    </>
  )
}
