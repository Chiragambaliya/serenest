# Evidence Report — Burnout Check (BAT-12)

**Product:** Serenest Burnout Check  
**Route:** `/burnout-check` → assessment `/screening/tool/burnout-bat-12`  
**Evidence Center:** `/evidence/bat-12`  
**Clinical review:** Evidence summary based on official instrument sources and peer-reviewed literature. Clinical review pending.  
**Named clinician sign-off:** Not completed — do not claim “clinically reviewed” in product UI.

---

## Official instrument

| Field | Detail |
| --- | --- |
| Name | Burnout Assessment Tool — short form (BAT-12), general (context-free) version |
| Authors | Wilmar B. Schaufeli, Steffie Desart, Hans De Witte |
| Development year | 2020 (BAT); short form 2022; cut-offs 2023 |
| Official website | https://burnoutassessmenttool.be |
| User manual | https://burnoutassessmenttool.be/wp-content/uploads/2020/08/User-Manual-BAT-version-2.0.pdf |

## Primary validation papers

1. Schaufeli, W. B., Desart, S., & De Witte, H. (2020). Burnout Assessment Tool (BAT)—Development, validity, and reliability. *IJERPH*, 17(24), 9495. https://doi.org/10.3390/ijerph17249495
2. Hadžibajramović, E., Schaufeli, W., & De Witte, H. (2022). Shortening of the BAT—from 23 to 12 items. *BMC Public Health*, 22, 560. https://doi.org/10.1186/s12889-022-12946-y
3. Schaufeli, W. B., et al. (2023). How to assess severe burnout? Cutoff points for the BAT. *Scand J Work Environ Health*. https://doi.org/10.5271/sjweh.4093

## Licensing & copyright

- **Status:** Non-proprietary. Free to use without permission if items are **not modified** and Schaufeli et al. (2020) is cited.
- **Commercial / public web:** Allowed under those conditions.
- **Permission required:** No (for unmodified use).
- **Exact wording:** **Yes** — Serenest reproduces official English general BAT-12 stems and 1–5 Never–Always labels without paraphrase.
- **UI-only language:** Product title, band labels (“Lower concern” / “Elevated” / “Higher concern”), and educational copy are Serenest — not instrument adaptations.

## Scoring method

Mean of 12 items scored 1 (Never) to 5 (Always). Four subscales (3 items each): exhaustion, mental distance, cognitive impairment, emotional impairment.

## Interpretation bands (Serenest product labels)

Aligned to Schaufeli et al. (2023) pooled BAT-12 employed-sample cut-offs:

| Band | Mean | Meaning |
| --- | --- | --- |
| Lower concern | ≤ 2.53 | Below published “at risk” cut-off |
| Elevated | 2.54 – 2.95 | At/above “at risk”; below higher cut-off |
| Higher concern | ≥ 2.96 | At/above higher cut-off used to flag severe burnout risk in research samples |

**Disclosure:** User Manual notes that a total-score cut-off table for the shortened **general** (non-work) BAT-12 is not available; Serenest discloses use of published BAT-12 employed-sample cut-offs.

## Why Serenest selected this instrument

Modern multi-dimensional burnout screening, free for public web use, general version supports people not in traditional jobs. Unlike MBI, does not require Mind Garden license restricting open-web individual feedback.

## Why it is not a diagnosis

WHO classifies burn-out as an occupational phenomenon in ICD-11, not a medical condition. BAT scores are screening aids requiring clinical context. Cut-offs are European employed samples — not India-specific norms.

## Limitations

- Cut-offs from NL / Flanders / Finland employed samples — provisional elsewhere.
- General BAT-12 total cut-off table not in manual (disclosed above).
- Mental distance items retain work/job wording in the official general form.
- Cannot replace anamnesis, medical fatigue workup, or mood/anxiety assessment.
- No built-in crisis item; Serenest crisis resources remain available separately.

## Differential considerations

Elevated exhaustion/cognitive strain can overlap with depression, anxiety, sleep disorders, medical illness, grief, and adjustment stress. A high BAT score does not distinguish these.

## Supporting evidence for educational statements

See `src/lib/checkEvidence.js` → `educationalEvidence` (WHO ICD-11 FAQ; Schaufeli 2020/2022/2023; Van Dam 2021; sleep–burnout literature cited with sources).

## Product architecture notes

- Landing: `CheckLandingPage` + `BurnoutCheckLandingPage`
- Assessment: shared `ScreeningToolPage` + `screeningTools` registry
- Results: `ScreeningResultPanel` (education before consultation)
- Evidence Center: `/evidence` auto-lists `CHECK_EVIDENCE`
- Session drafts: `checkSession.js` (browser sessionStorage only)

## Clinical review

Evidence summary based on official instrument sources and peer-reviewed literature. Clinical review pending.

Named clinician sign-off has **not** been completed. Product UI must not claim “clinically reviewed” or attribute review to a named clinician until that sign-off is recorded.
