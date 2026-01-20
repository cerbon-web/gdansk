# Mosque of Gdansk

Project organized into `frontend` and `backend` folders.

## Structure

- `frontend/` : Static site files (open `frontend/index.html` in a browser).
- `backend/`  : Node.js backend (API) with Express.

## Quick start

Frontend (static):

```powershell
start frontend\index.html
```

Backend (Node.js):

```powershell
cd backend; npm install; npm start
```

API endpoints:

- `GET http://localhost:3000/api/info` - site metadata
- `GET http://localhost:3000/health` - health check

Feel free to update the frontend content in `frontend/` or extend the backend in `backend/src/`.

## CI / CD: FTP deploy for backend

A GitHub Action workflow has been added at `.github/workflows/deploy-backend-ftp.yml` to upload the `backend/` folder to an FTP server whenever commits are pushed to the `main` branch.

Required repository secrets (set these in the repository Settings → Secrets):

- `FTP_SERVER` — FTP host (e.g. `ftp.example.com`)
- `FTP_USERNAME` — FTP username
- `FTP_PASSWORD` — FTP password
- `FTP_REMOTE_PATH` — Remote path where `backend/` should be uploaded (e.g. `/www/site/backend`)

Optional:

- `FTP_PORT` — if your FTP server uses a non-standard port (configure the workflow to use this secret by uncommenting the `port:` line in the workflow file).

Notes:

- The workflow uses `SamKirkland/FTP-Deploy-Action` to perform the transfer. On push to `main`, it checks out the repo and uploads the local `backend/` directory to the configured `server-dir`.
- If you prefer SFTP or another deploy method, I can change the workflow to use a different action.