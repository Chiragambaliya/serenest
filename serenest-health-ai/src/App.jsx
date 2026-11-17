import { useEffect, useId, useState } from 'react'
import { AGENTS, EMERGENCY_NUMBERS } from './agents.js'
import { runVisit } from './visit.js'

const DRAFT_KEY = 'serenest-health-ai-draft'
const EMERGENCY_LINE = `Serenest Health AI is not emergency care. If this is urgent, call ${EMERGENCY_NUMBERS}.`
const OPENING = ['reception', 'general', 'scribe']

function readDraft() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null')
    const known = new Set(AGENTS.map((agent) => agent.id))
    const seated = Array.isArray(saved?.seated) ? saved.seated.filter((id) => known.has(id)) : []
    return {
      seated: seated.length ? seated : OPENING,
      concern: typeof saved?.concern === 'string' ? saved.concern : '',
    }
  } catch {
    return { seated: OPENING, concern: '' }
  }
}

export default function App() {
  const draft = readDraft()
  const [seated, setSeated] = useState(() => new Set(draft.seated))
  const [concern, setConcern] = useState(draft.concern)
  const [visit, setVisit] = useState(null)
  const [error, setError] = useState('')
  const fieldId = useId()

  useEffect(() => {
    sessionStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ seated: [...seated], concern }),
    )
  }, [seated, concern])

  function toggle(id) {
    setSeated((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function seatOpening() {
    setSeated(new Set(OPENING))
  }

  function onSubmit(event) {
    event.preventDefault()
    const result = runVisit({ concern, seatedIds: [...seated] })
    if (result.error) {
      setError(result.error)
      setVisit(null)
      return
    }
    setError('')
    setVisit(result)
  }

  return (
    <div className="desk">
      <a className="skip" href="#visit">Skip to the visit</a>
      <header className="mast">
        <div className="brand-block">
          <p className="eyebrow">Serenest</p>
          <h1>Health AI</h1>
        </div>
        <p className="lede">Ten agents sit this bench. Each one already knows a single role. You seat who should listen. There is no prompt to write.</p>
        <p className="emergency" role="note">{EMERGENCY_LINE}</p>
      </header>

      <div className="split">
        <section className="bench" aria-labelledby="bench-title">
          <div className="bench-head">
            <h2 id="bench-title">The bench</h2>
            <p>{seated.size} of 10 seated</p>
            <button type="button" className="text-btn" onClick={seatOpening}>
              Seat opening trio
            </button>
          </div>
          <div className="seats">
            {AGENTS.map((agent) => {
              const on = seated.has(agent.id)
              return (
                <button
                  key={agent.id}
                  type="button"
                  className={on ? 'seat on' : 'seat'}
                  aria-pressed={on}
                  onClick={() => toggle(agent.id)}
                >
                  <span className="num">{agent.number}</span>
                  <span className="who">
                    <span className="agent-name">{agent.name}</span>
                    <span className="role">{agent.role}</span>
                  </span>
                  <span className="kind">{agent.kind === 'clinical' ? 'Clinical' : 'Desk'}</span>
                  <span className="lane">{agent.lane}</span>
                </button>
              )
            })}
          </div>
        </section>

        <main className="sheet" id="visit">
          <form onSubmit={onSubmit}>
            <label htmlFor={fieldId}>What is going on</label>
            <textarea
              id={fieldId}
              value={concern}
              maxLength={2000}
              rows={5}
              placeholder="In your own words. The agents do not take a prompt."
              onChange={(event) => setConcern(event.target.value)}
            />
            <div className="form-row">
              <button type="submit" className="ask">Ask the bench</button>
              <p>{concern.trim().length}/2000</p>
            </div>
          </form>
          {error ? <p className="error" role="alert">{error}</p> : null}
          {visit ? <VisitResult visit={visit} /> : (
            <p className="waiting">Seat one or more agents, then ask. Reception, general medicine, and the scribe start seated.</p>
          )}
          <footer className="colophon">
            This visit stays in this browser. Accounts and history are not on this screen.
            Serenest Health AI is a separate desk from the Serenest clinician service.
          </footer>
        </main>
      </div>
    </div>
  )
}

function VisitResult({ visit }) {
  return (
    <div className="result" aria-live="polite">
      {visit.stopped ? (
        <p className="stopped" role="alert">
          This pass stopped. Call {EMERGENCY_NUMBERS}. The bench will not give a routine consult for what you wrote.
        </p>
      ) : null}
      <ol className="notes">
        {visit.notes.map((note) => (
          <li key={note.id} className={note.inLane ? 'note' : 'note quiet'}>
            <header>
              <span className="num">{note.number}</span>
              <span>
                <strong>{note.name}</strong>
                <em>{note.role}</em>
              </span>
              <span className="mark">{note.inLane ? 'Spoke' : 'Stayed quiet'}</span>
            </header>
            {note.paragraphs.map((paragraph, index) => (
              <p key={`${note.id}-${index}`}>{paragraph}</p>
            ))}
          </li>
        ))}
      </ol>
      <section className="summary" aria-label="Shared visit note">
        <p className="eyebrow">Shared visit note</p>
        <h2>What the bench heard</h2>
        <p className="echo">{visit.summary.concern}</p>
        {visit.summary.heard.length > 0 ? (
          <ul>
            {visit.summary.heard.map((note) => (
              <li key={note.id}>
                <strong>{note.role}.</strong> {note.text}
              </li>
            ))}
          </ul>
        ) : (
          <p>No clinical specialty added a medical note on this pass.</p>
        )}
        {visit.summary.abstained.length > 0 ? (
          <p className="quiet-line">
            Stayed quiet: {visit.summary.abstained.map((note) => note.role).join(', ')}.
          </p>
        ) : null}
        <p className="handoff">{visit.summary.handoff}</p>
      </section>
    </div>
  )
}
