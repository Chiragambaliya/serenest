/**
 * Seeds 4 weeks of social media posts into the social_posts table.
 * Run once after your .env is configured:
 *   node scripts/seed-social-posts.mjs
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);

// ─── Strategy ────────────────────────────────────────────────────────────────
// Platform rhythm: Instagram Mon/Wed/Fri @ 9 AM IST · LinkedIn Tue/Thu/Sat @ 8 AM IST
// 4 weekly themes:
//   W1: First Step     — lower the barrier to seeking help
//   W2: Know Yourself  — conditions, screening tools, pricing transparency
//   W3: Not Alone      — destigmatize, community, supporting others
//   W4: Grow           — academy, career, professional recruitment
// ─────────────────────────────────────────────────────────────────────────────

const IST_OFFSET = '+05:30';
const IG_TAGS = {
  core: '#MentalHealth #MentalHealthIndia #SerenestMind',
  care: '#OnlineTherapy #TelepsychiatryIndia #AnxietyAwareness #DepressionSupport',
  pro:  '#PsychologyIndia #MentalHealthProfessionals #ClinicalPsychology',
  acad: '#PsychologyStudents #MentalHealthEducation #CounsellingIndia',
  corp: '#WorkplaceWellness #EmployeeMentalHealth #HRIndia',
};

function igt(...keys) { return keys.map((k) => IG_TAGS[k]).join(' '); }

const POSTS = [
  // ══════════════════════════════════════════════════════════
  // WEEK 1 — FIRST STEP
  // ══════════════════════════════════════════════════════════
  {
    platform: 'instagram',
    scheduled_at: '2026-06-29T09:00:00+05:30',
    caption: `5 signs it might be time to talk to someone — and not just "wait it out" 🧠

1️⃣ You feel exhausted but can't sleep
2️⃣ Things you used to enjoy feel pointless
3️⃣ Small things trigger reactions you can't explain
4️⃣ You've been "fine" for so long you've forgotten what fine actually feels like
5️⃣ You're reading this and recognising yourself

None of these mean something is "wrong" with you. They mean your mind is asking for support — the same way a body asks for rest when it's unwell.

Serenest connects you with verified psychiatrists and therapists online. Pay per session. No subscription. Completely private.

Start with a free mental health screening at serenest.in 💚`,
    hashtags: `${igt('core','care')} #YouAreNotAlone #MindMatters #SelfCare`,
  },
  {
    platform: 'linkedin',
    scheduled_at: '2026-06-30T08:00:00+05:30',
    caption: `India is facing a silent mental health crisis in its urban workforce — and most organisations are responding with a wellness day and a free gym membership.

A 2024 Deloitte India survey found 47% of urban professionals report moderate-to-severe anxiety. Burnout costs Indian companies an estimated ₹1.1 lakh crore annually in lost productivity and attrition.

The treatment gap tells the harder story: over 85% of people who need care in India never receive it. Not because they don't want help — because access is broken.

At Serenest, we're building the infrastructure that closes this gap:
→ Online psychiatry and therapy at ₹800–₹2,500/session
→ No waitlists. No commute. No stigma of walking into a clinic.
→ Evidence-based care from verified clinicians, available across India.

The workforce that performs is the one that's well. Mental health is not a benefit — it's business continuity.

If you lead a team or an organisation and want to talk about structured support, reach out.`,
    hashtags: null,
  },
  {
    platform: 'instagram',
    scheduled_at: '2026-07-01T09:00:00+05:30',
    caption: `We don't tell someone with diabetes to "just think positive."
We don't tell someone with a broken arm to "push through."

Mental illness deserves the same respect as physical illness.

Getting help is not weakness. Asking for support is not "too much." Taking your mental health seriously is the most responsible thing you can do — for yourself and for everyone who depends on you.

If you've been waiting for a sign to reach out: this is it.

Serenest. Doctor-led mental healthcare, entirely online. 💚
serenest.in`,
    hashtags: `${igt('core','care')} #BreakTheStigma #MentalHealthMatters #YouMatter`,
  },
  {
    platform: 'linkedin',
    scheduled_at: '2026-07-02T08:00:00+05:30',
    caption: `Serenest Academy now has 4 certificate programs open for enrollment.

📚 Certificate in Counselling Skills — 6 weeks, 12 modules
🧠 Certificate in Clinical Psychology — 8 weeks, 16 modules
💻 Certificate in Digital Mental Health — 4 weeks, 8 modules
🏅 Fellowship in Telepsychiatry — 12 weeks, 24 modules

Every program is:
→ Designed and delivered by practicing mental health professionals
→ Case-based — real clinical scenarios, not just theory
→ Flexible — self-paced with live sessions
→ Credential-bearing — recognised across India's mental health sector

Whether you're a psychology student, a fresh graduate, or a licensed professional seeking CPD, there's a track for you.

Who is this for? Counsellors seeking structure. Psychiatry residents building digital skills. Clinical psychologists wanting a fellowship. HR professionals who want to understand the clinical reality.

Enrollment is open. DM or visit serenest.in/academy.`,
    hashtags: null,
  },
  {
    platform: 'instagram',
    scheduled_at: '2026-07-03T09:00:00+05:30',
    caption: `First time seeing a psychiatrist online? Here's exactly what happens 👇

Step 1 — You book a slot on serenest.in. Takes 3 minutes.
Step 2 — You get a confirmation with your clinician's name and session link.
Step 3 — At the time, you join on video, audio, or chat — your choice.
Step 4 — Your clinician spends the first session understanding you. No rush.
Step 5 — You leave with a clear sense of next steps.

No waiting room. No judgment. No "it's all in your head."
Just a qualified clinician and a private conversation.

₹800–₹2,500 per session. Pay-per-session. Cancel anytime.
Start at serenest.in 💚`,
    hashtags: `${igt('core','care')} #OnlinePsychiatrist #TelepsychiatryIndia #MentalHealthHelp`,
  },
  {
    platform: 'linkedin',
    scheduled_at: '2026-07-04T08:00:00+05:30',
    caption: `The ROI of employee mental health support is not a soft metric.

WHO data: for every $1 invested in treatment for depression and anxiety, there's a $4 return in productivity and health outcomes.

What that looks like in practice for Indian organisations:
• Reduced attrition (mental health is the #1 reason high performers go quiet before they leave)
• Fewer sick days (stress-related absenteeism costs Indian companies more than physical illness)
• Better focus (anxiety impairs working memory and decision-making)
• Team culture (psychological safety correlates directly with team performance)

We work with organisations to provide structured, confidential, clinically-guided mental health support — not a helpline number, not a chatbot, but actual care.

If your organisation wants to do this properly, let's talk.`,
    hashtags: null,
  },

  // ══════════════════════════════════════════════════════════
  // WEEK 2 — KNOW YOURSELF
  // ══════════════════════════════════════════════════════════
  {
    platform: 'instagram',
    scheduled_at: '2026-07-06T09:00:00+05:30',
    caption: `The PHQ-9 is a 9-question test that takes 3 minutes and can tell you more about your mood than months of guessing. 🧠

It measures:
→ How often you feel hopeless or down
→ Sleep and appetite changes
→ Energy and concentration
→ How these feelings affect your daily life

It's used by psychiatrists worldwide. It's clinically validated. It's completely free.

We've put it on serenest.in so you can take it right now — no login, no signup.

The result doesn't diagnose you. But it gives you language for what you're experiencing. And that's where everything starts.

Take the free PHQ-9 → link in bio 💚`,
    hashtags: `${igt('core','care')} #PHQ9 #MentalHealthScreening #DepressionAwareness`,
  },
  {
    platform: 'linkedin',
    scheduled_at: '2026-07-07T08:00:00+05:30',
    caption: `PHQ-9 and GAD-7 are two of the most widely used clinical screening tools in the world.

PHQ-9 measures depression severity. GAD-7 measures anxiety. Both take under 5 minutes. Both are free. Both are validated in hundreds of clinical studies.

Most Indian companies have never heard of them.

Annual health check-ups test blood sugar, cholesterol, and blood pressure. They don't test the organ that determines whether employees show up, focus, make decisions, and stay.

Universal mental health screening at the workplace is not a radical idea. It's just overdue.

For organisations that want to implement it: we offer group screening, clinician-reviewed results, and a confidential pathway to care for anyone who needs it.

The data might surprise you. It usually does.`,
    hashtags: null,
  },
  {
    platform: 'instagram',
    scheduled_at: '2026-07-08T09:00:00+05:30',
    caption: `Work stress goes away when the deadline passes.
Anxiety doesn't.

Here's how to tell the difference 👇

Work stress:
✓ Tied to a specific situation
✓ Eases when the stressor is gone
✓ You can still enjoy other parts of life
✓ Sleep returns to normal on weekends

Anxiety:
✗ Present even when nothing is "wrong"
✗ Worry jumps to the next thing before the last thing resolves
✗ Physical symptoms: tight chest, racing heart, trouble breathing
✗ Affects sleep even when things are fine

Both are real. Both deserve attention.
But one is a signal to rest. The other is a signal to get support.

If you're not sure which one you're experiencing — the free GAD-7 screening on serenest.in takes 3 minutes and gives you a clinical picture.

Link in bio. 💚`,
    hashtags: `${igt('core','care')} #AnxietyAwareness #WorkStress #BurnoutPrevention`,
  },
  {
    platform: 'linkedin',
    scheduled_at: '2026-07-09T08:00:00+05:30',
    caption: `If you're a psychiatrist, psychologist, or counsellor considering online practice — here's what we offer at Serenest:

✓ A fully built platform — video, audio, chat, session notes
✓ Booking and calendar management handled for you
✓ Secure, encrypted patient communication
✓ Prescription tools that comply with India's telemedicine guidelines
✓ No admin overhead — you focus on clinical work

We're expanding our network across India. Psychiatrists, clinical psychologists, counselling psychologists, therapists, and licensed counsellors are all welcome.

You keep your independence. We provide the infrastructure.

If this is relevant to you or someone you know — DM us or visit serenest.in/professionals.`,
    hashtags: null,
  },
  {
    platform: 'instagram',
    scheduled_at: '2026-07-10T09:00:00+05:30',
    caption: `Transparent pricing. Because mental healthcare shouldn't feel like a negotiation.

💙 Counselling & Therapy — from ₹800/session
💙 Clinical Psychology — from ₹900/session
💙 Psychiatry — from ₹1,000/session
💙 Specialist Psychiatry — from ₹1,200/session

What this includes:
✓ A full clinical session with a verified professional
✓ Assessment, guidance, and a clear plan
✓ Video, audio, or chat — your choice
✓ Follow-up care coordination where needed

No subscription. No hidden fees. You see the exact cost before you confirm.

Pay via UPI, credit card, debit card, net banking, or wallet.

Serenest. Mental healthcare that doesn't make you guess. 💚
serenest.in/pricing`,
    hashtags: `${igt('core','care')} #AffordableMentalHealth #OnlinePsychiatrist #SerenestIndia`,
  },
  {
    platform: 'linkedin',
    scheduled_at: '2026-07-11T08:00:00+05:30',
    caption: `Depression is the second-leading cause of disability in India.

56 million Indians live with depression. 38 million live with anxiety disorders. The treatment gap — the percentage of people who need care and don't receive it — exceeds 85%.

These aren't abstract statistics. They show up in your organisation as:
• The star employee who quietly disengages
• The manager who becomes short-tempered under pressure
• The high performer whose work quality suddenly drops
• The person who just disappears one day

The infrastructure to change this exists. Validated screening tools. Online clinical care. Flexible, confidential access. The question is whether organisations are willing to make it as normal as health insurance.

Serenest is building that infrastructure. We'd like to build it with you.`,
    hashtags: null,
  },

  // ══════════════════════════════════════════════════════════
  // WEEK 3 — NOT ALONE
  // ══════════════════════════════════════════════════════════
  {
    platform: 'instagram',
    scheduled_at: '2026-07-13T09:00:00+05:30',
    caption: `What people think therapy is vs. what it actually is 👇

❌ "It's just talking about your childhood"
✅ It's structured, evidence-based work on specific patterns and goals

❌ "You just vent and the therapist listens"
✅ Your therapist actively guides the conversation with clinical frameworks

❌ "It's only for people in crisis"
✅ Most people in therapy are high-functioning individuals who want to function better

❌ "It'll take years to see results"
✅ Many people notice change within 6–12 sessions

❌ "It means something is seriously wrong with you"
✅ It means you take your mental health as seriously as your physical health

Therapy is a skill you build, not a crutch you lean on.
And it's available right now, online, from anywhere in India.

serenest.in 💚`,
    hashtags: `${igt('core','care')} #TherapyWorks #BreakTheStigma #MentalHealthFacts`,
  },
  {
    platform: 'linkedin',
    scheduled_at: '2026-07-14T08:00:00+05:30',
    caption: `High performers go quiet before they quit.

It's one of the most consistent patterns in burnout — the person who used to drive the room suddenly stops contributing in meetings. Stops sending the late-night ideas. Stops pushing back on decisions they disagree with.

By the time a manager notices, the employee has already mentally resigned.

6 signals to watch for in your team:

1. Drop in quality or pace of work with no clear cause
2. Increased irritability or withdrawal in team settings
3. More sick days, especially on Mondays and Fridays
4. Disengagement from projects they previously led
5. Stops advocating for themselves in performance conversations
6. Physical complaints — headaches, fatigue, gut issues

These are not attitude problems. They are symptoms.

The right response is not a performance improvement plan. It's a confidential, clinical conversation with someone qualified to help.

We can set that up for your team. DM us.`,
    hashtags: null,
  },
  {
    platform: 'instagram',
    scheduled_at: '2026-07-15T09:00:00+05:30',
    caption: `When someone tells you they're struggling, what you say next matters more than you think.

❌ "Just think positive"
❌ "So many people have it worse"
❌ "You need to snap out of it"
❌ "Have you tried exercise / yoga / meditation?"
❌ "You don't look depressed"

✅ "I'm really glad you told me"
✅ "That sounds really hard. I'm here."
✅ "What do you need from me right now?"
✅ "Would it help to talk to someone professionally? I can help you find someone."
✅ Just sitting with them. In silence. Without trying to fix it.

You don't need to have the answers. You just need to not make it worse — and not make them feel alone.

If you want to support someone you love and don't know where to start, we're here. 💚`,
    hashtags: `${igt('core')} #SupportingLovedOnes #MentalHealthSupport #YouAreNotAlone`,
  },
  {
    platform: 'linkedin',
    scheduled_at: '2026-07-16T08:00:00+05:30',
    caption: `Telepsychiatry grew 400% in India between 2019 and 2023.

In that same period, the number of clinicians trained in digital delivery of mental healthcare stayed almost flat.

The gap is real. Video sessions are not just "regular sessions over a screen." The clinical considerations are different:
• Risk assessment protocols change in a remote setting
• Therapeutic alliance building requires different techniques
• Documentation and continuity have new standards under India's telemedicine guidelines
• Crisis protocols need to account for geographic distance

Serenest Academy's Certificate in Digital Mental Health — 4 weeks, 8 modules, clinician-led — addresses exactly this gap.

If you're practicing or training in mental health and have not yet built formal skills in digital delivery, this program is for you.

Enrollment open → serenest.in/academy`,
    hashtags: null,
  },
  {
    platform: 'instagram',
    scheduled_at: '2026-07-17T09:00:00+05:30',
    caption: `Before you book anything — start here. It's free. 🧠

PHQ-9: 9 questions, 3 minutes, tells you how depression may be affecting you
GAD-7: 7 questions, 3 minutes, measures anxiety levels

Both are clinically validated tools used by psychiatrists globally. Both are available free on serenest.in — no login, no signup, instant results.

Your score won't diagnose you. But it will give you language for what you're feeling. And that language makes the conversation with a clinician 10x more productive.

Take the free screening → link in bio 💚

(If you're in crisis or experiencing thoughts of self-harm, please call iCall: 9152987821)`,
    hashtags: `${igt('core','care')} #FreeScreening #MentalHealthTest #PHQ9 #GAD7`,
  },
  {
    platform: 'linkedin',
    scheduled_at: '2026-07-18T08:00:00+05:30',
    caption: `India has 0.3 psychiatrists per 100,000 people.
The global average is 4.15.
The United States: 16.
The United Kingdom: 12.

This isn't a commentary on training quality — India produces excellent clinicians. It's a commentary on deployment. Most clinical talent is concentrated in 8–10 cities. Most of India is left with whatever is available locally.

Telepsychiatry is the only structural solution that makes sense at the scale of India's need. Not as a replacement for in-person care, but as the primary access layer — the thing that catches the 85% who would otherwise receive nothing.

Serenest is that layer. We're 100% online. Available across every state. And we're actively expanding our clinician network.

If you believe access is infrastructure — build with us.`,
    hashtags: null,
  },

  // ══════════════════════════════════════════════════════════
  // WEEK 4 — GROW
  // ══════════════════════════════════════════════════════════
  {
    platform: 'instagram',
    scheduled_at: '2026-07-20T09:00:00+05:30',
    caption: `Study mental health from anywhere in India. 🎓

Serenest Academy offers clinician-led certificate programs in:

🎓 Counselling Skills (6 weeks)
🧠 Clinical Psychology (8 weeks)
💻 Digital Mental Health (4 weeks)
🏅 Telepsychiatry Fellowship (12 weeks)

Every program is:
→ Fully online — study from Mumbai, Mysore, or Manipur
→ Case-based — real clinical scenarios, not just theory
→ Flexible — learn at your own pace
→ Credential-bearing — recognised across India's mental health sector

Plus: 1:1 mentorship, CV review, placement guidance, and access to a growing professional network.

Whether you're a student, a fresh graduate, or a clinician seeking CPD — there's a track for you.

serenest.in/academy 💚`,
    hashtags: `${igt('core','acad','pro')} #MentalHealthCareers #PsychologyCourse #CounsellingCertificate`,
  },
  {
    platform: 'linkedin',
    scheduled_at: '2026-07-21T08:00:00+05:30',
    caption: `A certificate tells an employer you completed a course.
A mentor tells them you can think clinically.

At Serenest Academy, every program includes both.

1:1 clinical mentorship is not an add-on. It's a core part of our learning model. Here's what it actually provides:

→ Weekly or bi-weekly sessions with an experienced clinician in your specialty
→ Case discussion — bring real cases (anonymised) and work through them
→ Career guidance — specialty choices, practice models, geographic considerations
→ Interview preparation — case-based discussion skills and how to present clinically
→ A long-term professional relationship, not a transactional course completion

The difference between a graduate who can recite DSM criteria and a clinician who can assess a patient is supervision. We make that accessible.

If you're building your career in mental health, DM us or visit serenest.in/academy.`,
    hashtags: null,
  },
  {
    platform: 'instagram',
    scheduled_at: '2026-07-22T09:00:00+05:30',
    caption: `Poor sleep causes anxiety.
Anxiety causes poor sleep.
Welcome to the loop. 🌙

Here's what actually happens in your brain:
→ Anxiety activates your nervous system — your body thinks it's in danger
→ A body in "danger mode" cannot sleep deeply
→ Sleep deprivation reduces emotional regulation
→ A dysregulated nervous system is more easily triggered into anxiety
→ Repeat

Breaking this loop is one of the first things good psychiatrists address — because you can't do the deeper work when your brain hasn't slept.

Practical first steps:
1. Same wake time every day (more powerful than a set bedtime)
2. No screens for 45 minutes before bed
3. If you can't sleep, get up — don't lie there fighting it
4. Address the anxiety directly, with professional support

Struggling with sleep and anxiety? We can help.
serenest.in 💚`,
    hashtags: `${igt('core','care')} #SleepAndMentalHealth #AnxietyRelief #BetterSleep`,
  },
  {
    platform: 'linkedin',
    scheduled_at: '2026-07-23T08:00:00+05:30',
    caption: `We're expanding the Serenest clinician network.

We're looking for:
→ Psychiatrists (MD/DPM/DNB)
→ Clinical Psychologists (MPhil/PhD)
→ Counselling Psychologists
→ Licensed Counsellors
→ Therapists with structured training

What you get:
✓ 100% remote — consult from your clinic, home, or anywhere
✓ Flexible scheduling — you set your hours
✓ Platform handles booking, billing, reminders, and records
✓ Prescription tools compliant with India's telemedicine guidelines
✓ Clinical supervision and peer learning available
✓ Growing patient base with verified, serious patients

What we don't do: micromanage your clinical practice.

You are the expert. We are the infrastructure.

If this is relevant to you, DM us with your specialty and location. Or visit serenest.in/professionals.

Please share if you know someone who'd be a fit. 🙏`,
    hashtags: null,
  },
  {
    platform: 'instagram',
    scheduled_at: '2026-07-24T09:00:00+05:30',
    caption: `Not ready for a face-to-face session? That's completely okay. 💚

At Serenest you choose how you talk:

🎥 Video call — See your clinician. Most like an in-person session.
🎧 Audio only — Just voices. No camera required.
💬 Chat — Type it out. Some people find it easier to write.

You can change format anytime — even mid-session if you need to.

There's no "right way" to get support. There's just the way that works for you right now.

Start wherever you're comfortable.
serenest.in 💚`,
    hashtags: `${igt('core','care')} #OnlineMentalHealth #TeletherapyIndia #MentalHealthHelp`,
  },
  {
    platform: 'linkedin',
    scheduled_at: '2026-07-25T08:00:00+05:30',
    caption: `"Evidence-based" gets thrown around a lot in mental healthcare. Here's what it actually means.

It means the treatment approach has been studied in randomised controlled trials, published in peer-reviewed journals, and replicated across populations. It means we know — not believe, know — that it works for specific conditions.

Examples:
• CBT (Cognitive Behavioural Therapy) — strongest evidence base for depression and anxiety
• DBT (Dialectical Behaviour Therapy) — specifically validated for emotional dysregulation and borderline presentations
• Motivational Interviewing — validated for addiction and behaviour change
• Pharmacotherapy — antidepressants, anxiolytics, antipsychotics with specific indications and protocols

What it doesn't mean: the clinician is rigid or follows a script. It means the framework they use has been tested, and they adapt it to the person in front of them.

At Serenest, every clinician practices evidence-based care. Not because we require it — because we hire clinicians who do.

That's what "doctor-led" actually looks like.`,
    hashtags: null,
  },
];

async function seed() {
  console.log(`Inserting ${POSTS.length} posts…`);

  // Convert IST timestamps to UTC for Supabase
  const formatted = POSTS.map((p) => ({
    ...p,
    status: 'scheduled',
  }));

  const { data, error } = await supabase.from('social_posts').insert(formatted).select();

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  console.log(`✅ Inserted ${data.length} posts successfully.`);
  console.log('\nSchedule summary:');
  data.forEach((p) => {
    const d = new Date(p.scheduled_at).toLocaleString('en-IN', {
      weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    });
    console.log(`  ${p.platform.padEnd(12)} ${d}  ${p.caption.slice(0, 55)}…`);
  });
}

seed();
