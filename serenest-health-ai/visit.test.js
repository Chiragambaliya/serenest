import assert from 'node:assert/strict'
import test from 'node:test'
import { AGENTS } from './src/agents.js'
import { runVisit } from './src/visit.js'

const ALL = AGENTS.map((agent) => agent.id)

test('the bench is ten fixed specialists with no prompt slot', () => {
  assert.equal(AGENTS.length, 10)
  assert.equal(new Set(ALL).size, 10)
  for (const agent of AGENTS) {
    assert.equal(agent.prompt, undefined)
    assert.equal(typeof agent.speak, 'function')
    assert.ok(agent.role)
    assert.ok(agent.name)
  }
  assert.deepEqual(
    AGENTS.map((agent) => agent.kind),
    ['desk', 'desk', 'clinical', 'clinical', 'clinical', 'clinical', 'clinical', 'clinical', 'clinical', 'desk'],
  )
})

test('a skin concern stays in the skin lane', () => {
  const visit = runVisit({
    concern: 'I have an itchy rash on my arm for three weeks.',
    seatedIds: ['skin', 'heart', 'gut', 'scribe'],
  })
  assert.equal(visit.stopped, false)
  const skin = visit.notes.find((note) => note.id === 'skin')
  const heart = visit.notes.find((note) => note.id === 'heart')
  const gut = visit.notes.find((note) => note.id === 'gut')
  assert.equal(skin.inLane, true)
  assert.match(skin.paragraphs.join(' '), /Skin lane/)
  assert.equal(heart.inLane, false)
  assert.equal(gut.inLane, false)
  assert.equal(visit.summary.concern.includes('itchy rash'), true)
  assert.equal(visit.summary.heard.some((note) => note.id === 'skin'), true)
  assert.equal(visit.summary.abstained.some((note) => note.id === 'heart'), true)
  assert.doesNotMatch(skin.paragraphs.join(' '), /\b\d+\s?mg\b/)
})

test('agents answer in bench order even if seats were picked out of order', () => {
  const visit = runVisit({
    concern: 'I feel tightness in my chest when I climb stairs.',
    seatedIds: ['scribe', 'heart', 'reception'],
  })
  assert.deepEqual(
    visit.notes.map((note) => note.id),
    ['reception', 'heart', 'scribe'],
  )
  const heart = visit.notes.find((note) => note.id === 'heart')
  assert.equal(heart.inLane, true)
  assert.match(heart.paragraphs.join(' '), /not read this as a diagnosis/)
  assert.equal(visit.stopped, false)
})

test('chest emergencies stop the routine consult', () => {
  const visit = runVisit({
    concern: 'I have crushing chest pain and I cannot breathe.',
    seatedIds: ALL,
  })
  assert.equal(visit.stopped, true)
  assert.match(visit.summary.handoff, /112 or 108/)
  const heart = visit.notes.find((note) => note.id === 'heart')
  assert.match(heart.paragraphs.join(' '), /112 or 108/)
  assert.doesNotMatch(heart.paragraphs.join(' '), /clinician would ask/)
})

test('a crisis note hands off instead of counselling', () => {
  const visit = runVisit({
    concern: 'I want to die and I do not feel safe tonight.',
    seatedIds: ['mind', 'scribe', 'reception'],
  })
  assert.equal(visit.stopped, true)
  const mind = visit.notes.find((note) => note.id === 'mind')
  assert.match(mind.paragraphs.join(' '), /AASRA is 9820466726/)
  assert.doesNotMatch(mind.paragraphs.join(' '), /you could|method|pills/i)
})

test('a child concern gets no specialty care steps', () => {
  const visit = runVisit({
    concern: 'My toddler has a fever and a rash.',
    seatedIds: ['general', 'skin', 'scribe'],
  })
  assert.equal(visit.child, true)
  assert.equal(visit.stopped, false)
  const skin = visit.notes.find((note) => note.id === 'skin')
  const general = visit.notes.find((note) => note.id === 'general')
  assert.equal(skin.inLane, false)
  assert.match(general.paragraphs.join(' '), /pediatric/)
  assert.doesNotMatch(general.paragraphs.join(' '), /Skin lane|what to apply/)
  assert.match(visit.summary.handoff, /pediatric/)
})

test('tech explains the session and does not diagnose', () => {
  const visit = runVisit({
    concern: 'My stomach has been bloated since yesterday.',
    seatedIds: ['tech', 'gut'],
  })
  const tech = visit.notes.find((note) => note.id === 'tech')
  assert.match(tech.paragraphs.join(' '), /no prompt/i)
  assert.doesNotMatch(tech.paragraphs.join(' '), /diagnos/i)
  assert.equal(visit.notes.find((note) => note.id === 'gut').inLane, true)
})

test('empty concern and empty bench are refused', () => {
  assert.match(runVisit({ concern: '   ', seatedIds: ALL }).error, /Describe/)
  assert.match(runVisit({ concern: 'headache', seatedIds: [] }).error, /Seat/)
})
