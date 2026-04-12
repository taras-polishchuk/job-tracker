# JobTracker

A Kanban-style app for tracking job applications — where you applied, what stage it's at, and what happens next.

**Live demo:** https://taras-polishchuk.github.io/job-tracker/

---

## Features

- **Kanban board** — 9 columns: Wishlist, Applied, HR Screen, Tech Interview, Test Task, Final Interview, Offer, Rejected, Ghosted
- **Add & edit jobs** — company, position, link, platform, priority, tags, notes, cover letter, resume upload
- **Search & filters** — full-text search with highlight, filter by status / priority / tags
- **Drag & drop** — move cards between columns
- **Stats panel** — total, active, offers, response rate, bar chart by status
- **Dark mode** — toggle with persistence
- **Export / Import** — backup and restore your data as JSON
- **localStorage** — data persists between sessions, no backend needed

## Tech stack

- [Svelte 5](https://svelte.dev/) with runes (`$state`, `$derived`, `$effect`)
- [Vite](https://vite.dev/)
- Pure CSS — no UI framework
- Deployed via GitHub Actions → GitHub Pages

## Local development

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173/`

## Build & deploy

```bash
npm run build   # outputs to /dist
npm run preview # preview the production build locally
```

Deployment to GitHub Pages happens automatically on every push to `main` via `.github/workflows/deploy.yml`.

## Data export & import

All data is stored in `localStorage` — no account, no server. To back up or transfer your data:

- **Export** — click the ↓ icon in the header to download a `.json` file with all your jobs
- **Import** — click the ↑ icon and select a previously exported `.json` file to restore

This lets you move data between browsers/devices or keep local backups.

