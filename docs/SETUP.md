# NexusFlow — Setup Guide

> **Owner:** Sarga · **Goal:** get every teammate from clone to a running project.
> Follow this top to bottom; if something is missing or broken, tell Sarga in the
> standup so this guide stays accurate.

## 1. Prerequisites

| Tool | Version | Why |
|------|---------|-----|
| Git | 2.30+ | Version control |
| Node.js | 18.x or 20.x LTS | Backend & frontend tooling |
| npm | 9+ (ships with Node) | Package management |
| MongoDB Community | 6.0+ | Database (Time-Series support) |
| GitHub account | — | Access to `sargaprasadrs/nexusflow` |

Verify with:

```bash
git --version
node --version
npm --version
mongod --version
```

## 2. Clone the repository

```bash
git clone https://github.com/sargaprasadrs/nexusflow.git
cd nexusflow
```

## 3. Check out your branch

Each person works on their own branch. **Never commit directly to `main`.**

```bash
git checkout sarga      # Sarga  (coordination, docs, DevOps)
git checkout chandra    # Chandra (Express backend, RxJS)
git checkout praveen    # Praveen (React, React Flow)
git checkout sowmya     # Sowmya (MongoDB, persistence)
```

Keep your branch in sync with `main`:

```bash
git checkout main && git pull
git checkout <your-branch> && git merge main
```

## 4. Repository layout (target)

```
nexusflow/
├── backend/          # Express API + RxJS engine (Chandra)
├── frontend/         # React + React Flow app (Praveen)
├── docs/             # Setup, development guidelines, API docs
├── PROJECT_BOARD.md  # Task tracking
└── README.md
```

> **Aug 11 note:** `backend/` and `frontend/` do not exist yet — Chandra and
> Praveen create them today. If you cloned before they pushed, `git pull` on
> their branches (or `main` after the weekly merge) to get them.

## 5. MongoDB setup

1. Install MongoDB Community (6.0+) for your OS.
2. Start the server:

   ```bash
   mongod --dbpath <your-data-dir>   # e.g. C:\data\db on Windows, /data/db on macOS/Linux
   ```

   On macOS with Homebrew: `brew services start mongodb-community`.
3. Confirm it is reachable:

   ```bash
   mongosh --eval "db.runCommand({ ping: 1 })"
   # or connect with a driver — default URI: mongodb://localhost:27017
   ```

4. The app database is `nexusflow`. Collections will be created by the backend
   (see [Development Guidelines](DEVELOPMENT.md#mongo-time-series)).
5. Time-Series note: NexusFlow uses a MongoDB Time-Series collection for
   telemetry, so run MongoDB **6.0 or newer**.

## 6. Backend (`backend/`)

```bash
cd backend
npm install
cp .env.example .env        # create local env file
npm run dev                 # starts the Express server (nodemon)
```

Minimal `.env` (final keys land with Chandra's work):

```bash
PORT=4000
MONGODB_URI=mongodb://localhost:27017/nexusflow
NODE_ENV=development
```

Health check: open `http://localhost:4000/api/health` in a browser.

## 7. Frontend (`frontend/`)

```bash
cd frontend
npm install
npm run dev                 # Vite dev server
```

Open the printed URL (usually `http://localhost:5173`).

## 8. Daily workflow

1. `git pull` your branch and `main`, then `git merge main`.
2. Do your task from [PROJECT_BOARD.md](../PROJECT_BOARD.md).
3. Commit small, focused changes (see commit standards in
   [DEVELOPMENT.md](DEVELOPMENT.md#commit-standards)).
4. Push your branch at the end of the day:

   ```bash
   git push origin <your-branch>
   ```

5. Update `PROJECT_BOARD.md` status on your branch.
6. Share progress + blockers in the 5 PM IST standup.

## 9. Troubleshooting

| Problem | Fix |
|---------|-----|
| `mongodb://localhost:27017` connection refused | Start `mongod` (section 5) |
| `node: command not found` | Install Node 18/20 LTS and reopen the terminal |
| Port already in use | Backend uses 4000, frontend 5173 — change in `.env` / Vite config |
| `npm install` errors | Clear cache: `npm cache clean --force`, then retry |
| Wrong Node version | Use `nvm` (macOS/Linux) or nvm-windows to switch to 18/20 |
| Stuck or confused | Ask in the standup — do not block silently |

## 10. Getting help

- **Standup:** 5 PM IST daily — blockers first.
- **Docs:** this guide, `DEVELOPMENT.md`, `PROJECT_BOARD.md`.
- **Coordinator:** Sarga for repo/branch/docs issues.
