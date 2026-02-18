# Forty — A Lent Companion

A spiritual discipline system for Lent. Track fasting, prayer, and daily reflections through 40 days.

## Features

- **Onboarding** — Set start date, commitments (giving up / adding), your “why,” and tone preference
- **Dashboard** — Day counter, streak, daily scripture, quick log
- **Daily Check-In** — Log fast, prayer, scripture, mood, and reflection
- **Analytics** — Discipline score, streak history, weekly completion, mood trends
- **Reflection Journal** — Timeline of entries with expandable full text
- **Emergency Mode** — Scripture, “why” reminder, 60-second breathing timer
- **Settings** — Edit commitments, dark mode, tone, export, reset

## Tech

- HTML, CSS, vanilla JavaScript
- LocalStorage persistence
- PWA (installable, offline-capable)
- No frameworks or build step

## Local development

```bash
# From project root
python3 -m http.server 8080
# Open http://localhost:8080
```

## Deploy to GitHub Pages

1. Push to GitHub
2. **Settings → Pages → Source**: Deploy from branch `main`, folder `/ (root)`
3. Site will be at `https://<username>.github.io/forty/`

If your repo name is different, update paths in `manifest.json` and `sw.js` accordingly.

## Icons

The app uses `assets/icons/icon.svg`. For broader PWA support (especially iOS), open `assets/icons/generate-icons.html` in a browser, click the buttons to download PNGs, and place `icon-192.png` and `icon-512.png` in `assets/icons/`. Then update `manifest.json` and `index.html` to reference the PNGs.

## License

MIT
