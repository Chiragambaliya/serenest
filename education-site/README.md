# Serenest Education

World-class education site for **Serenest Education Pvt Ltd** — clinical-grade learning for mental health professionals, organisations, and communities.

**Live domain:** [serenest.academy](https://serenest.academy)

## Stack

- React 19 + Vite + React Router
- Static deploy (Render / Netlify / Cloudflare Pages)

## Develop

```bash
npm install
npm run dev
```

## Build & preview

```bash
npm run build
npm run preview
```

Production assets are written to `dist/`.

## Deploy

- **Render:** `render.yaml` publishes `dist/` after `npm install && npm run build`
- **Netlify:** `netlify.toml` builds with Vite and publishes `dist/`
- **Cloudflare:** `npm run deploy:cloudflare` (Pages project `serenest-education`)

## Flagship

**Clinical Excellence** — `/programmes/clinical-excellence`  
Best course for practicing psychiatrists, psychologists, therapists, and counsellors.
