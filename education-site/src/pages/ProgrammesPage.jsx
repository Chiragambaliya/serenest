import { Link } from 'react-router-dom'
import { ContactCta } from '../components/ContactCta'
import { PageHero } from '../components/PageHero'
import { ProgramGrid } from '../components/ProgramGrid'
import { usePageTitle } from '../hooks/usePageTitle'

export function ProgrammesPage() {
  usePageTitle('Programmes')

  return (
    <>
      <PageHero
        eyebrow="Programmes"
        title="Learning paths with clinical clarity"
        lede="From flagship clinician training to workplace and campus literacy — every programme states its audience, format, and boundaries."
        actions={
          <Link className="btn btn--primary" to="/programmes/clinical-excellence">
            Clinical Excellence
          </Link>
        }
      />
      <section className="section">
        <div className="container">
          <ProgramGrid />
        </div>
      </section>
      <ContactCta lede="Need a custom cohort or organisational series? Share your goals and we will design a fit." />
    </>
  )
}
