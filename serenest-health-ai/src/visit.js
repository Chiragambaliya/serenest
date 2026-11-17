import { AGENTS } from './agents.js'

const FLAG_RULES = [
  {
    id: 'breathing',
    label: 'trouble breathing',
    stopsVisit: true,
    test: /can(?:not|'t) breathe|cannot breathe|gasping|lips (?:are |turning )?blue|turning blue/i,
  },
  {
    id: 'chest',
    label: 'chest emergency',
    stopsVisit: true,
    test: /crushing chest|chest pain|heart attack|pressure in (?:my )?chest|pain in (?:my )?chest/i,
  },
  {
    id: 'crisis',
    label: 'crisis',
    stopsVisit: true,
    test: /suicid|kill myself|end my life|want to die|self-harm|hurt myself|do not want to (?:be alive|live)|don't want to (?:be alive|live)/i,
  },
  {
    id: 'stroke',
    label: 'stroke signs',
    stopsVisit: true,
    test: /face droop|slurred speech|\bstroke\b|one side (?:of my body )?weak/i,
  },
  {
    id: 'bleeding',
    label: 'serious bleeding',
    stopsVisit: true,
    test: /bleeding (?:heavily|a lot)|won't stop bleeding|vomiting blood|coughing blood/i,
  },
  {
    id: 'unresponsive',
    label: 'unresponsive',
    stopsVisit: true,
    test: /unconscious|unresponsive|not waking|not breathing|\bseizure\b/i,
  },
  {
    id: 'allergy',
    label: 'severe allergy',
    stopsVisit: true,
    test: /anaphyl|throat (?:is )?closing|tongue (?:is )?swelling/i,
  },
]

const CHILD_PATTERN = /\b(baby|infant|toddler|child|children|son|daughter|kid|newborn)\b/i

export function detectFlags(text) {
  return FLAG_RULES.filter((rule) => rule.test.test(text)).map(({ id, label, stopsVisit }) => ({
    id,
    label,
    stopsVisit,
  }))
}

export function isChildConcern(text) {
  return CHILD_PATTERN.test(text)
}

export function orderAgents(ids) {
  const want = new Set(ids)
  return AGENTS.filter((agent) => want.has(agent.id))
}

export function runVisit({ concern, seatedIds }) {
  const text = (concern || '').replace(/\s+/g, ' ').trim()
  if (!text) {
    return { error: 'Describe what is going on before you ask the bench.' }
  }
  if (text.length > 2000) {
    return { error: 'Keep this pass under 2000 characters.' }
  }
  const seated = orderAgents(seatedIds || [])
  if (seated.length === 0) {
    return { error: 'Seat at least one agent.' }
  }

  const flags = detectFlags(text)
  const child = isChildConcern(text)
  const base = { concern: text, flags, seated, child, notes: [] }

  const spoken = new Map()
  for (const agent of seated) {
    if (agent.id === 'scribe') continue
    spoken.set(agent.id, agent.speak(base))
  }

  const preliminary = seated
    .filter((agent) => agent.id !== 'scribe')
    .map((agent) => toNote(agent, spoken.get(agent.id)))

  const notes = seated.map((agent) => {
    if (agent.id !== 'scribe') return toNote(agent, spoken.get(agent.id))
    return toNote(agent, agent.speak({ ...base, notes: preliminary }))
  })

  return {
    concern: text,
    flags,
    child,
    stopped: flags.some((flag) => flag.stopsVisit),
    notes,
    summary: composeSummary({ concern: text, flags, child, notes }),
  }
}

function toNote(agent, spoken) {
  return {
    id: agent.id,
    number: agent.number,
    name: agent.name,
    role: agent.role,
    kind: agent.kind,
    inLane: spoken.inLane,
    paragraphs: spoken.paragraphs,
  }
}

function composeSummary({ concern, flags, child, notes }) {
  const stopped = flags.some((flag) => flag.stopsVisit)
  const heard = notes.filter((note) => note.inLane && note.kind === 'clinical')
  const abstained = notes.filter((note) => !note.inLane)
  let handoff = 'This is not a diagnosis or a prescription. Take it to a licensed clinician if you still need care.'
  if (stopped) {
    handoff = `Visit stopped. Call 112 or 108. Signs noted: ${flags.map((flag) => flag.label).join(', ')}.`
  } else if (child) {
    handoff = 'A child needs a licensed pediatric clinician. This desk does not give care steps for children.'
  } else if (heard.length === 0) {
    handoff = 'No clinical agent added a medical note. Seat a clinical specialty if you want one to listen.'
  }
  return {
    concern,
    stopped,
    child,
    flagLabels: flags.map((flag) => flag.label),
    heard: heard.map((note) => ({
      id: note.id,
      name: note.name,
      role: note.role,
      text: note.paragraphs[0],
    })),
    abstained: abstained.map((note) => ({
      id: note.id,
      name: note.name,
      role: note.role,
    })),
    handoff,
  }
}
