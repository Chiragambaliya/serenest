export const EMERGENCY_NUMBERS = '112 or 108'
export const CRISIS_LINE =
  'If you might act on thoughts of suicide or self-harm, call 112 now. In India, AASRA is 9820466726.'

function speakClinical(id, note) {
  return (ctx) => clinicalSpeak(AGENTS.find((agent) => agent.id === id), ctx, note)
}

export const AGENTS = [
  {
    id: 'reception',
    number: '01',
    name: 'Mira',
    role: 'Reception',
    kind: 'desk',
    lane: 'Opens the visit and names who is in the room.',
    speak: receptionSpeak,
  },
  {
    id: 'tech',
    number: '02',
    name: 'Naveen',
    role: 'Tech',
    kind: 'desk',
    lane: 'Keeps the session on this device. No prompt to write.',
    speak: techSpeak,
  },
  {
    id: 'general',
    number: '03',
    name: 'Asha',
    role: 'General medicine',
    kind: 'clinical',
    lane: 'Hears the whole concern and lists questions for a clinician.',
    terms: [],
    speak: speakClinical('general', generalNote),
  },
  {
    id: 'heart',
    number: '04',
    name: 'Ishan',
    role: 'Heart',
    kind: 'clinical',
    lane: 'Chest, pulse, exertion, circulation.',
    terms: ['chest', 'heart$', 'pulse', 'palpitat', 'blood pressure', 'bp', 'faint', 'dizzy', 'exertion', 'stairs', 'tightness'],
    speak: speakClinical('heart', heartNote),
  },
  {
    id: 'skin',
    number: '05',
    name: 'Leela',
    role: 'Skin',
    kind: 'clinical',
    lane: 'Rashes, itch, and changes on the skin.',
    terms: ['rash', 'itch', 'skin', 'acne', 'mole', 'hives', 'hive', 'eczema', 'blister', 'scalp'],
    speak: speakClinical('skin', skinNote),
  },
  {
    id: 'mind',
    number: '06',
    name: 'Rohan',
    role: 'Mind',
    kind: 'clinical',
    lane: 'Mood, sleep, worry, and a crisis handoff.',
    terms: ['anxiety', 'anxious', 'depress', 'panic', 'sleep', 'insomnia', 'mood', 'stress', 'worry', 'hopeless', 'sad', 'overwhelm'],
    speak: speakClinical('mind', mindNote),
  },
  {
    id: 'breath',
    number: '07',
    name: 'Kavya',
    role: 'Breath',
    kind: 'clinical',
    lane: 'Cough, wheeze, and breathing.',
    terms: ['cough', 'breath', 'wheez', 'asthma', 'lung', 'oxygen', 'phlegm'],
    speak: speakClinical('breath', breathNote),
  },
  {
    id: 'gut',
    number: '08',
    name: 'Farid',
    role: 'Gut',
    kind: 'clinical',
    lane: 'Stomach, nausea, and digestion.',
    terms: ['stomach', 'nausea', 'vomit', 'diarr', 'constipat', 'abdomen', 'bloat', 'heartburn', 'gut', 'bowel', 'belly'],
    speak: speakClinical('gut', gutNote),
  },
  {
    id: 'movement',
    number: '09',
    name: 'Ananya',
    role: 'Movement',
    kind: 'clinical',
    lane: 'Joints, injury, and how the body moves.',
    terms: ['knee', 'back pain', 'joint', 'sprain', 'shoulder', 'fracture', 'muscle', 'stiff', 'ankle', 'wrist', 'neck pain', 'limp'],
    speak: speakClinical('movement', movementNote),
  },
  {
    id: 'scribe',
    number: '10',
    name: 'Kiran',
    role: 'Scribe',
    kind: 'desk',
    lane: 'Writes the one shared visit note from the seats that spoke.',
    speak: scribeSpeak,
  },
]

function clip(text, max = 180) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trimEnd()}…`
}

export function matchedTerms(text, terms) {
  return terms.filter((term) => {
    const exact = term.endsWith('$')
    const raw = exact ? term.slice(0, -1) : term
    if (exact || raw.length <= 2) return new RegExp(`\\b${raw}\\b`, 'i').test(text)
    return text.toLowerCase().includes(raw.toLowerCase())
  })
}

function stops(ctx) {
  return ctx.flags.some((flag) => flag.stopsVisit)
}

function receptionSpeak(ctx) {
  const names = ctx.seated.map((agent) => `${agent.name} · ${agent.role}`).join(', ')
  if (stops(ctx)) {
    return {
      inLane: true,
      paragraphs: [
        `I am closing the room. Call ${EMERGENCY_NUMBERS} before you continue on this screen.`,
      ],
    }
  }
  const childLine = ctx.child
    ? ' You mentioned a child. I will not treat this as an adult visit.'
    : ''
  return {
    inLane: true,
    paragraphs: [
      `Visit opened. In your words: “${clip(ctx.concern)}”.`,
      `Seated for this pass: ${names}.`,
      `I run the room, not the medicine. Serenest Health AI is not emergency care and not the Serenest clinician service.${childLine}`,
    ],
  }
}

function techSpeak(ctx) {
  if (stops(ctx)) {
    return {
      inLane: true,
      paragraphs: ['I have stopped the routine session. Emergency signs are in what you wrote.'],
    }
  }
  return {
    inLane: true,
    paragraphs: [
      'This consult is running in your browser. Each agent answers from a fixed role, so there is no prompt to write.',
      'Only seats you turn on will speak. This note stays on this device. I do not interpret symptoms.',
    ],
  }
}

function clinicalSpeak(agent, ctx, note) {
  if (stops(ctx)) {
    if (agent.id === 'mind' && ctx.flags.some((flag) => flag.id === 'crisis')) {
      return {
        inLane: true,
        paragraphs: [`I am not a crisis counselor. ${CRISIS_LINE}`],
      }
    }
    return {
      inLane: true,
      paragraphs: [`${agent.role} is not assessing this. Call ${EMERGENCY_NUMBERS}.`],
    }
  }
  if (ctx.child && agent.id !== 'general') {
    return {
      inLane: false,
      paragraphs: [
        'This visit mentions a child. I do not advise on children. A licensed pediatric clinician should take it.',
      ],
    }
  }
  const hits = matchedTerms(ctx.concern, agent.terms || [])
  if (agent.id !== 'general' && hits.length === 0) {
    return {
      inLane: false,
      paragraphs: ['This does not sit in my lane, so I am not adding a medical note.'],
    }
  }
  return { inLane: true, paragraphs: note(ctx, hits) }
}

function generalNote(ctx) {
  if (ctx.child) {
    return [
      'This note mentions a child. I will not give care steps for a child.',
      `Please speak to a licensed pediatric clinician. If the child is hard to wake, struggling to breathe, or limp, call ${EMERGENCY_NUMBERS}.`,
      'Questions to take with you: when it started, how the child is drinking, and whether they are hard to wake.',
    ]
  }
  const questions = []
  if (!/hour|day|week|month|year|yesterday|today/i.test(ctx.concern)) {
    questions.push('when it started and whether it is getting worse')
  }
  if (!/mild|severe|worst|bearable|constant|comes and goes/i.test(ctx.concern)) {
    questions.push('how strong it is and whether it comes and goes')
  }
  questions.push('what a clinician should know that is not already in your words')
  return [
    `I am the general-medicine agent. I do not diagnose. I heard: “${clip(ctx.concern)}”.`,
    `A licensed clinician would still need ${questions.join('; ')}.`,
    'I cannot examine you or prescribe. Take this note to a clinician.',
  ]
}

function heartNote(ctx, hits) {
  return [
    `Heart lane. The words that brought me in: ${hits.join(', ')}.`,
    'I do not read this as a diagnosis. A heart clinician would ask when it starts, how long it lasts, whether it spreads to the arm, neck, or jaw, and whether you feel sweaty, sick, or faint with it.',
    `If it is happening now, or you cannot breathe, leave this visit and call ${EMERGENCY_NUMBERS}.`,
  ]
}

function skinNote(ctx, hits) {
  return [
    `Skin lane. The words that brought me in: ${hits.join(', ')}.`,
    'I do not identify a rash from a description. A skin clinician would ask where it started, whether it is spreading, whether there is fever, and whether anything new touched the skin.',
    'I will not tell you what to apply.',
  ]
}

function mindNote(ctx, hits) {
  return [
    `Mind lane. The words that brought me in: ${hits.join(', ')}.`,
    'I do not diagnose a mood, anxiety, or sleep condition. A mind clinician would ask how sleep, appetite, and daily tasks are, and whether you feel unsafe.',
    CRISIS_LINE,
  ]
}

function breathNote(ctx, hits) {
  return [
    `Breath lane. The words that brought me in: ${hits.join(', ')}.`,
    'I do not judge how well you are breathing from text. A breath clinician would ask if you can speak full sentences, if there is wheeze or fever, and if this is new.',
    `If breathing is hard right now, call ${EMERGENCY_NUMBERS}.`,
  ]
}

function gutNote(ctx, hits) {
  return [
    `Gut lane. The words that brought me in: ${hits.join(', ')}.`,
    'I do not name a stomach condition. A gut clinician would ask where the discomfort sits, whether food changes it, and whether there is persistent vomiting or blood.',
    'I will not tell you what to take.',
  ]
}

function movementNote(ctx, hits) {
  return [
    `Movement lane. The words that brought me in: ${hits.join(', ')}.`,
    'I do not clear an injury. A movement clinician would ask what set it off, whether you can bear weight, and whether the limb looks different from the other side.',
    'I will not tell you to train through it.',
  ]
}

function scribeSpeak(ctx) {
  if (stops(ctx)) {
    const labels = ctx.flags.map((flag) => flag.label).join(', ')
    const crisis = ctx.flags.some((flag) => flag.id === 'crisis') ? ` ${CRISIS_LINE}` : ''
    return {
      inLane: true,
      paragraphs: [
        `I closed the routine note. The visit stopped because of emergency signs: ${labels}. Call ${EMERGENCY_NUMBERS}.${crisis}`,
      ],
    }
  }
  const heard = (ctx.notes || []).filter((note) => note.inLane && note.kind === 'clinical')
  const quiet = (ctx.notes || []).filter((note) => !note.inLane)
  const heardLine = heard.length
    ? `Clinical notes came from ${heard.map((note) => note.role).join(', ')}.`
    : 'No clinical agent added a medical note.'
  const quietLine = quiet.length
    ? ` Stayed in their lane and did not add medicine: ${quiet.map((note) => note.role).join(', ')}.`
    : ''
  return {
    inLane: true,
    paragraphs: [
      `Shared visit note. Concern: “${clip(ctx.concern)}”.`,
      `${heardLine}${quietLine}`,
      'This is not a diagnosis, a prescription, or emergency care. Take it to a licensed clinician if you still need care.',
    ],
  }
}
