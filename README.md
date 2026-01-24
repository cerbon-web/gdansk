# Mosque of Gdańsk Contest

Project organized into `frontend` and `backend` folders.

## Structure

- `frontend/` : Static site files (open `frontend/index.html` in a browser).
- `backend/`  : Node.js backend (API) with Express.

## Quick start

Frontend (static):

```powershell
start frontend\index.html
```

# Ramadan Contests — Mosque of Gdańsk

This project powers two community contests that will run during Ramadan:

- Quran Contest — a team-based memorization contest focused on steady progress and fair scoring.
- Daily Taraweeh Contest — a short daily challenge held after the Taraweeh prayer.

## Project Purpose

The goal is to provide an easy-to-use platform for running community competitions during Ramadan that track participant progress, compute fair team scores, and present daily challenges.

## Contests Overview

- **Quran Contest (team-based memorization)**
	- Teams are formed of multiple members.
	- Each member reports memorization progress (chapters, verses, or percentage).
	- Team score is computed from members' progress while taking into account individual ability so stronger memorizers don't overshadow beginners — the scoring aims to reward inclusive improvement and consistent progress.
	- Administrators can create teams, add/remove members, and record/approve progress entries.

- **Daily Taraweeh Contest (after Taraweeh)**
	- A short daily contest or quiz held after Taraweeh prayer (e.g., short Qur'anic questions, tajweed challenges, or recitation checks).
	- Results are recorded daily and leaderboards updated.

## Key Features

- Team management (create teams, invite/add members)
- Individual progress tracking and approval workflow
- Fair scoring mechanics that weight improvement and member ability
- Daily contest scheduling and result capture
- Leaderboards and per-team/per-member summaries

## Repo Structure

- `backend/` — Node.js API and admin endpoints (see `backend/app.js`).
- `frontend/` — Built static frontend assets (for simple hosting).
- `frontend-raw/` — Angular source used to develop the frontend UI (`src/` contains app code and assets).

See the folders for implementation details and to continue development.

## Run locally (quick)

Backend (Windows / PowerShell):

```powershell
cd backend
npm install
npm start
```

Frontend (development using `frontend-raw` Angular):

```powershell
cd frontend-raw
npm install
npm start
```

Or open the built static frontend from `frontend/index.html` in a browser for a simple preview.

## Configuration notes

- The backend typically listens on `http://localhost:3000` by default; check `backend/app.js`.
- For production deployments, host the static `frontend/` files on any static hosting and run the `backend/` API on a server accessible to the clients.

## Next steps / To do

- Finalize scoring algorithm details and document them in `/docs` (recommended).
- Add admin UI pages for team management and progress approvals in `frontend-raw/src/app`.
- Add tests for scoring rules in `backend/`.

## Contributing

If you'd like help improving features or deployment, please open an issue or submit a PR. For quick local testing, update progress entries via the backend API and use the Angular dev server in `frontend-raw`.