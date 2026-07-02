# Serenest — Google Play store listing & Data safety

Copy-paste content for the Play Console listing, plus **Data safety** answers
grounded in what the app actually collects (Play rejects health apps whose
form doesn't match reality — these are drawn from the codebase).

> Review with a lawyer before submitting. This is a starting point, not legal advice.

---

## 1. Store listing

- **App name:** Serenest
- **Short description (≤80 chars):**
  `Private online psychiatry, therapy & mental-health screening across India.`
- **Category:** Medical (or Health & Fitness)
- **Tags:** mental health, psychiatry, therapy, counselling, telehealth
- **Contact email:** support@serenest.in
- **Website:** https://www.serenest.in
- **Privacy policy:** https://www.serenest.in/privacy

### Full description (≤4000 chars)

```
Serenest is a clinical telepsychiatry platform built for India. Talk to
verified psychiatrists and psychologists from home — by secure video, audio,
or chat — with structured intake, evidence-based screening, and follow-up
care that continues beyond a single session.

WHAT YOU CAN DO
• Book a consultation with a verified psychiatrist or psychologist
• Choose your consultation mode: video, audio, or chat
• Take confidential self-screening (PHQ-9 for depression, GAD-7 for anxiety)
• Get structured intake and continuity of care across visits
• Manage appointments and view prescriptions from your account

WHY SERENEST
• Verified clinicians — reviewed before they join the platform
• Private by design — encrypted sessions and privacy-first records
• Pan-India access — care wherever you are
• Evidence-based tools, not just chat

FOR PROFESSIONALS
Clinicians can apply to join, manage their profile, and see their bookings
through the professional portal.

IMPORTANT
Serenest is not for emergencies. If you or someone else is in immediate
danger or at risk of harm, contact your local emergency services or a crisis
helpline right away. Self-screening tools are for guidance only and are not a
diagnosis.
```

### "What's new" (first release)

```
Serenest is now an installable app. Book consultations, take mental-health
screenings, and manage your care — faster, with offline-friendly loading.
```

---

## 2. Data safety form

The Play **Data safety** section asks, per data type: is it **collected**,
is it **shared**, is it **processing optional**, and **why**. Below is what
Serenest handles, from the code.

> Play distinction: data sent to a **service provider** that only processes it
> on your behalf (Supabase, Razorpay, Daily.co, Resend) is **collected, not
> "shared."** "Shared" means a transfer to a third party for **their own** use.

### Security practices
- **Encrypted in transit:** **Yes** (HTTPS / TLS everywhere; HSTS enabled).
- **Users can request data deletion:** **Yes** — provide a deletion request
  route/email and a public deletion URL (Play now requires one).
- **Committed to Play Families policy:** only if you target children (you
  likely should **not**; set target audience to 18+ / adults).

### Data types — collected

| Data type | Collected | Purpose | Notes / source |
|-----------|-----------|---------|----------------|
| Name | Yes | App functionality, Account | `appointments.patient_name`, `patients.name`, professional applications |
| Email address | Yes | Account, App functionality, (optional) comms | Supabase Auth + form fields |
| Phone number | Yes | App functionality (booking contact) | `patient_phone`, `signups.mobile` |
| Address — City | Yes | App functionality | `patients.city`, applications |
| Gender | Yes | App functionality (personalized care) | `patients.gender` |
| User IDs | Yes | Account management | Supabase `auth_user_id` |
| **Health info** | **Yes** | **App functionality** | **PHQ-9 / GAD-7 screening responses, appointment reason/notes — sensitive** |
| Payment info | Yes* | Purchases (consultation fees) | via Razorpay; card data handled by Razorpay, not stored by Serenest |
| Messages | Yes | App functionality (assistant chat, consultation notes) | in-app assistant + notes; see §3 |
| App activity | Yes | Analytics | page-view pings (`/api/track/visit`) |
| App info & performance | Possible | Analytics / diagnostics | request logs |
| Device or other IDs | Yes | Analytics / security | server logs **IP address + user-agent** for visit dedupe |
| Audio / Video | Yes | App functionality (live consultation) | real-time via Daily.co; declare if sessions are processed |

### Data types — shared
- Under Play's definition, most transfers here are to **service providers**
  (processors), which count as **collected, not shared**. The one to scrutinize
  is the **AI assistant** (OpenAI / Anthropic) — see §3; if enabled, disclose
  message content processing and confirm it isn't used for model training.

### Deletion URL (required)
Add a public page or endpoint, e.g. `https://www.serenest.in/data-deletion`,
explaining how users request account + data deletion (there is already a
`data-retention` route to build on).

---

## 3. Things to verify before you submit ⚠️

1. **Health app declaration.** Play flags medical apps for extra review.
   Be ready to state you connect users to **licensed professionals**, that
   screening is **not a diagnosis**, and show your clinical/emergency
   disclaimers (you already have `/emergency-disclaimer`, `/consent`).

2. **Payments policy (Razorpay).** Play's billing applies to **digital**
   goods. Consultations are a **real-world service**, which is exempt — so a
   third-party processor (Razorpay) is allowed. Keep the booking copy clear
   that the fee is for a real consultation, not in-app digital content.

3. **AI assistant (OpenAI / Anthropic).** The server can send user messages to
   an external LLM. Either (a) disclose "Messages" processing by a third party
   in Data safety and your privacy policy, or (b) disable the assistant in the
   Play build. Confirm the provider's no-training terms.

4. **Google Fonts.** Fonts load from `fonts.googleapis.com` (shares user IP
   with Google). Fine to keep, but it's part of the privacy-policy disclosure.

5. **Target audience:** set to **adults (18+)**. A mental-health app should not
   target children; avoid the Families program.

---

## 4. Content rating questionnaire — likely answers

- Violence / sexual content / profanity / gambling: **No**
- Controlled substances: only educational references (de-addiction) — answer
  honestly; usually **No** for promotion.
- **Medical / health content: Yes** — references to mental-health conditions
  and treatment.
- User-generated content / messaging: **Yes** if the assistant chat or any
  user messaging ships — enables the UGC follow-ups.
- Expected result: rated for a general/teen+ audience, but **set the app's own
  target audience to 18+** given the clinical nature.

---

## 5. Note on CI / this PR

There is **no CI workflow** in this repo (`.github/workflows` is absent), so
there's nothing for an automated build to "fix." If you'd like, add a minimal
GitHub Actions workflow (install + `npm run build` + `npm run verify:seo`) and
I can wire it up so future PRs get an automatic build check.
