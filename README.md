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