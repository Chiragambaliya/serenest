# Serenest — Google Play listing assets

Assets for publishing the Serenest PWA to Google Play as an Android app
(Trusted Web Activity). All images are opaque (no alpha) as Play requires.

## What's here

| File | Play field | Spec | Status |
|------|-----------|------|--------|
| `feature-graphic-1024x500.png` | Feature graphic | 1024×500 PNG/JPEG | ✅ ready |
| `screenshots/01-home.png` … `06-pricing.png` | Phone screenshots | 1080×1920 PNG | ✅ ready (min 2, max 8) |
| App icon | High-res icon | 512×512 PNG | ⚠️ generate from `/public/icon-1024.jpg` (see below) |

The screenshots are real captures of the live app in a phone viewport
(360 CSS px × 3 = 1080×1920), with the cookie banner and promo modals
suppressed. Regenerate any time from the scripts used to build them.

## Still needed (you)

1. **512×512 app icon** — Play wants a 512×512 PNG. `public/icon-1024.jpg`
   is a 1024×1024 source; downscale it to 512×512 PNG (any image editor, or
   PWABuilder generates this for you automatically from the manifest).
2. **Short description** (≤80 chars) and **full description** (≤4000 chars).
3. **Privacy policy URL** — https://www.serenest.in/privacy (already live).
4. **Content rating, Data safety, Target audience** questionnaires in Play
   Console (expect a health/medical disclosure section).

## Suggested store text

**Short:** Private online psychiatry, therapy & mental-health screening across India.

**Full (starter):**
Serenest is a clinical telepsychiatry platform for India. Talk to verified
psychiatrists and psychologists by secure video, audio, or chat — with
structured intake, evidence-based screening (PHQ-9 / GAD-7), and follow-up
care that continues beyond a single session. Private by design, with
encrypted sessions and privacy-first records.

Not for emergencies. If you or someone else is in immediate danger, contact
your local emergency services or a crisis helpline.

## Publishing path (summary)

1. Deploy so `/manifest.json`, `/sw.js`, `/.well-known/assetlinks.json` are live.
2. Build the Android package at [pwabuilder.com](https://www.pwabuilder.com/)
   → Android → Generate. Keep the signing key (`.keystore`) backed up forever.
3. Put the generated package name + SHA-256 fingerprint into the host env vars
   `ANDROID_PACKAGE_NAME` / `ANDROID_SHA256_CERT_FINGERPRINTS`, redeploy, and
   confirm `/.well-known/assetlinks.json` shows the real fingerprint.
4. In Play Console ($25 one-time): create the app, upload the `.aab`, add the
   assets in this folder, complete the questionnaires, and submit for review.
