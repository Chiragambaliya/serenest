# Sleep Check — Step 1 Clinical Research (no implementation)

**Status:** Research only. Do not build until instrument + copyright + web-use permission + scoring + interpretation + evidence are confirmed and approved.

**Date:** 2026-07-11

---

## Candidate A — Insomnia Severity Index (ISI) — preferred clinically, restricted legally

| Field | Detail |
| --- | --- |
| Official name | Insomnia Severity Index (ISI) |
| Authors | Charles M. Morin (et al.) |
| Years | © Morin 1993, 1996, 2000, 2006 (ISI-3 also 2021) |
| Primary validation | Morin et al. validation literature for insomnia severity (self-report) |
| Official distributor | Mapi Research Trust — ePROVIDE |
| Official website | https://eprovide.mapi-trust.org/instruments/insomnia-severity-index |
| Licensing status | **Proprietary / copyrighted.** Mapi is exclusive official distributor. |
| Commercial / public web | **Not freely allowed.** Commercial users, healthcare orgs, funded academic, and IT companies must submit a request; **fees may apply**; commercial users typically need license + **screenshot review agreement**. |
| Permission required | **Yes** |
| Exact wording | May only reproduce official wording under license; examination copies cannot be used in clinical practice or redistributed. |
| Recommendation for Serenest | **Do not implement ISI** until a signed Mapi/ePROVIDE commercial license covering public-web individual feedback is obtained. |

---

## Candidate B — Pittsburgh Sleep Quality Index (PSQI)

| Field | Detail |
| --- | --- |
| Official name | Pittsburgh Sleep Quality Index (PSQI) |
| Authors | Buysse, Reynolds, Monk, Berman, Kupfer (University of Pittsburgh) |
| Year | 1989 |
| Primary paper | Buysse et al., *Psychiatry Research*, 28:193–213, 1989 |
| Official info | https://www.sleep.pitt.edu/research/measures-and-study-instruments |
| Licensing | Free for **non-commercial** research/education only (unmodified). **Commercial / commercially sponsored use requires University of Pittsburgh OTM license** (published fee schedules for commercial use can be substantial). |
| Recommendation | **Not suitable** as Serenest’s default open-web Sleep Check without a paid commercial license. |

---

## Candidate C — PROMIS Sleep Disturbance (short forms)

| Field | Detail |
| --- | --- |
| System | PROMIS® Sleep Disturbance (HealthMeasures / Northwestern) |
| Licensing | Free for individual research / individual clinical use; **Commercial Users must seek permission at all times** (HealthMeasures Terms of Use). Electronic administration often needs HEAP-style permission. |
| Recommendation | Strong psychometrics, but **not “drop-in free for a commercial digital product”**. Would require written HealthMeasures commercial permission before Serenest web use. |

---

## Candidate D — Jenkins Sleep Evaluation Questionnaire / Jenkins Sleep Scale (JSS / JSEQ)

| Field | Detail |
| --- | --- |
| Official name | Jenkins Sleep Evaluation Questionnaire (JSEQ) / Jenkins Sleep Scale |
| Authors | Jenkins, Stanton, Niemcryk, Rose (1988 area of original work) |
| Items | Brief **4-item** sleep disturbance frequency scale |
| Official distributor listing | Mapi ePROVIDE: https://eprovide.mapi-trust.org/instruments/jenkins-sleep-evaluation-questionnaire |
| Licensing (per Mapi listing) | Stated as **public domain** on ePROVIDE; existing translations via Mapi/ICON; **all requests still submitted through ePROVIDE**; “fees may apply” language still appears for some project types — **must confirm commercial IT/web screening terms in writing before shipping**. |
| Scoring / interpretation | Sum/frequency scoring used in research; cut-offs vary by population — need official form + published guidance before product bands. |
| Recommendation | **Strongest legally usable short alternative to research further** — but Serenest must still: (1) obtain official English item stems via ePROVIDE, (2) get written confirmation for commercial public-web individual results, (3) lock scoring/bands from primary papers before build. |

---

## Candidate E — Athens Insomnia Scale (AIS)

| Field | Detail |
| --- | --- |
| Authors | Soldatos, Dikeos, Paparrigopoulos (2000) |
| Strength | ICD-10-aligned insomnia severity; short (8 or 5 items); published cut-off (e.g. ≥6) |
| Licensing | Copyrighted (Elsevier publication reprints require permission). Commercial digital reproduction is **not clearly free**. |
| Recommendation | Clinically attractive, but **not confirmed open for Serenest commercial web** without developer/publisher permission. |

---

## Founder recommendation (Step 1 verdict)

1. **Do not ship ISI** without Mapi commercial license + screenshot approval.  
2. **Do not ship PSQI or PROMIS Sleep Disturbance** without commercial permission (PSQI OTM / HealthMeasures).  
3. **Next research action (still no code):** Submit ePROVIDE request for **Jenkins Sleep Evaluation Questionnaire** official English form + written confirmation that Serenest (commercial healthcare IT, public website, individual educational results) may reproduce exact items and score online. In parallel, optionally request ISI commercial quote for comparison.  
4. Only after written permission + scoring/bands locked → Step 2 product design.

**No Sleep Check implementation until that confirmation exists.**
