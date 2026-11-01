import { Link } from 'react-router-dom'
import { ContactCta } from '../components/ContactCta'
import { PageHero } from '../components/PageHero'
import { usePageTitle } from '../hooks/usePageTitle'

export function AboutPage() {
  usePageTitle('About')

  return (
    <>
      <PageHero
        eyebrow="About"
        title="Education with clinical standards"
        lede="Serenest Education Pvt Ltd designs professional learning and mental health literacy — the education arm of the Serenest ecosystem."
      />
      <section className="section">
        <div className="container narrow">
          <p className="prose">
            We believe mental health skills should scale beyond the clinic. Our programmes combine
            evidence-backed content, responsible framing, and practical tools for Indian contexts —
            for clinicians, organisations, and communities.
          </p>
          <p className="prose">
            Clinical care remains on{' '}
            <a href="https://www.serenest.in" target="_blank" rel="noreferrer">
              serenest.in
            </a>
            . Education here never replaces a consultation with a verified professional.
          </p>
          <p className="home-teaser">
            <Link to="/programmes/clinical-excellence">See our flagship course →</Link>
          </p>
        </div>
      </section>
      <ContactCta />
    </>
  )
}
