# Serenest Health AI

A new teleconsultation desk, separate from the Serenest clinician website. Ten AI agents sit a fixed bench. Three run the desk (reception, tech, scribe). Seven listen in a clinical lane (general medicine, heart, skin, mind, breath, gut, movement). Each agent already knows that one role. The visit screen has no prompt to write.

This is not emergency care and not a licensed clinical service. If someone is in danger, the visit stops and points to 112, 108, and, for a crisis, AASRA.

## This milestone

The visit screen, for a browser and a phone:

- Seat one or more of the ten agents.
- Describe what is going on.
- Read each agent's note, then one shared visit note.

Accounts and past visits are not on this screen. The same web app is the phone app for now: a narrow layout, and a home-screen manifest. There is no separate app-store binary yet.

## Run

```bash
cd serenest-health-ai
npm install
npm test
npm run dev
```

Open `http://localhost:5174`.
