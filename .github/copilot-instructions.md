# Copilot instructions for Mosque of Gdańsk (gdansk)

This file gives focused, actionable guidance to AI coding agents working in this repository.

1) Big-picture
- Monorepo: root workspace references `frontend-raw` (Angular source). Built artifacts live in `frontend/` (static).
- Backend: minimal Express API in [backend/app.js](backend/app.js#L1). It exposes `/test` and `/` and supports mounting under `BASE_PATH`.
- Frontend: Angular 21 app in [frontend-raw/src/](frontend-raw/src). The Angular build writes output to `../frontend` (see [frontend-raw/angular.json](frontend-raw/angular.json#L1)).

2) Common developer workflows (explicit commands)
- Start backend (PowerShell):
  - `cd backend` then `npm install` and `npm start` (runs `node app.js`).
  - To run under a path prefix: set `BASE_PATH` and optionally `PORT`. Example in PowerShell:
    ```powershell
    $env:BASE_PATH='gdansk'; $env:PORT='8080'; npm start
    ```
- Frontend (dev):
  - `cd frontend-raw` then `npm install` and `npm start` (runs `ng serve` on port 4200).
- Frontend (build for production):
  - `cd frontend-raw` then `npm run build` — output is placed into `frontend/` (used for static hosting).
  - `npm run deploy` runs `gh-pages -d frontend -b gh-pages` (deploys `frontend/` to the `gh-pages` branch).

3) Project-specific patterns and conventions
- Angular standalone components are used (see `LoginComponent` and `HeaderComponent` in `frontend-raw/src/app`). Look for `standalone: true`.
- i18n: translations live in `frontend-raw/src/assets/i18n/*.json` and `@ngx-translate` is used.
- `AuthService` is a scaffold — `login()` throws NotImplemented and `_setRoles()` is provided for dev/testing. Use `_setRoles()` in tests or dev flows when simulating roles ([frontend-raw/src/app/auth.service.ts](frontend-raw/src/app/auth.service.ts#L1)).
- Build output path: the Angular `outputPath` is `../frontend` (so building will overwrite files used for simple static hosting). Keep that in mind when running `ng build`.

4) Integration points & environment
- Backend and frontend communicate over simple REST; backend exposes small endpoints. Backend supports `BASE_PATH` to mount under a prefix (useful for static hosting paths). See [backend/app.js](backend/app.js#L1).
- Node engine for backend is pinned in [backend/package.json](backend/package.json#L1) (engine: `22.18.0`).

5) Known inaccuracies & gotchas (avoid wasting time)
- The top-level README claims the backend listens on port `3000`; actual default in `backend/app.js` is `80` unless `PORT` is set. Trust `backend/app.js` for runtime behavior.
- `login()` is intentionally unimplemented. Don't assume authentication flows are complete — add backend endpoints or mock behavior when implementing login.

6) Useful files to inspect for context
- [frontend-raw/angular.json](frontend-raw/angular.json#L1) — build/serve config and `outputPath`.
- [frontend-raw/package.json](frontend-raw/package.json#L1) — dev scripts: `start`, `build`, `build:dev`, `deploy`.
- [frontend-raw/src/app/*] — main UI components (`app.component.ts`, `header.component.ts`, `login.component.ts`, `auth.service.ts`).
- [backend/app.js](backend/app.js#L1) and [backend/package.json](backend/package.json#L1).

7) When changing code, minimal PR guidance for AI agents
- If you modify Angular build config, verify `outputPath` still points to `../frontend` or update README/deploy scripts accordingly.
- If you add backend routes, keep CORS middleware consistent with the simple permissive policy in `app.js`.
- For auth-related work, document whether you updated `AuthService.login()` or added JWT flow; tests should mock `_setRoles()` if needed.

If anything in these notes is unclear or you want me to expand a section (for example: CI, tests, or deployment details), tell me which area to elaborate.
