import { Link } from 'react-router-dom'
import { ContactCta } from '../components/ContactCta'
import { PageHero } from '../components/PageHero'
import { ProgramGrid } from '../components/ProgramGrid'
import { usePageTitle } from '../hooks/usePageTitle'

export function ForOrganisationsPage() {
  usePageTitle('For organisations')

  return (
    <>
      <PageHero
        eyebrow="For organisations"
        title="Mental health literacy for workplaces & campuses"
        lede="Talks, manager sessions, and student wellbeing orientations — education and awareness with clear boundaries. Not remote diagnosis."
        actions={
          <Link className="btn btn--primary" to="/contact">
            Plan a workshop
          </Link>
        }
      />
      <section className="section">
        <div className="container narrow">
          <p className="prose">
            We help corporates, schools, and colleges build shared language around distress, support,
            and escalation — so teams know when to listen, when to refer, and how to protect dignity.
          </p>
        </div>
      </section>
      <section className="section section--alt">
        <div className="container">
          <h2 className="section-title">Organisation programmes</h2>
          <ProgramGrid filter="organisations" />
        </div>
      </section>
      <ContactCta lede="Tell us your audience size, industry, and goals. We will propose a session series." />
    </>
  )
}
