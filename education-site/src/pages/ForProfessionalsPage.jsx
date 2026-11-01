import { Link } from 'react-router-dom'
import { ContactCta } from '../components/ContactCta'
import { PageHero } from '../components/PageHero'
import { ProgramGrid } from '../components/ProgramGrid'
import { usePageTitle } from '../hooks/usePageTitle'

export function ForProfessionalsPage() {
  usePageTitle('For clinicians')

  return (
    <>
      <PageHero
        eyebrow="For clinicians"
        title="Professional programmes that respect your time"
        lede="Clinical Excellence and telepractice modules built for psychiatrists, psychologists, therapists, and counsellors — competence you can apply the same week."
        actions={
          <>
            <Link className="btn btn--primary" to="/programmes/clinical-excellence">
              Open flagship course
            </Link>
            <Link className="btn btn--ghost" to="/contact">
              Talk to us
            </Link>
          </>
        }
      />
      <section className="section">
        <div className="container narrow">
          <p className="prose">
            Clinician-facing programmes emphasise assessment, documentation, telehealth literacy,
            measurement-based care, and safe communication — aligned with Indian telemedicine norms
            where relevant. Formats range from intensives to multi-week cohorts.
          </p>
        </div>
      </section>
      <section className="section section--alt">
        <div className="container">
          <h2 className="section-title">Programmes for professionals</h2>
          <ProgramGrid filter="professionals" />
        </div>
      </section>
      <ContactCta lede="Share your specialty, cohort size, and preferred format — we will suggest a tailored outline." />
    </>
  )
}
