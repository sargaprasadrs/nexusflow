# NexusFlow — Development Guidelines

> **Owner:** Sarga · These are the working rules for the whole team.
> Read this before your first commit and keep it updated as the project evolves.

## 1. Project architecture (target state)

```
Telemetry sources (sensors/devices)
        │  JSON payloads
        ▼
Express ingestion API ──► MongoDB Time-Series collection
        │
        ▼
Graph compiler (React Flow JSON → RxJS pipeline)
        │
        ▼
Rule execution (RxJS streams)
        │
        ├──► WebSocket broadcast ──► Live dashboards (React)
        ├──► Alerts / webhooks
        └──► History / audit logs
```

The core Week 1 data flow everyone must understand:

```text
Sensor → Express → MongoDB
```

- **Frontend (`frontend/`)**: React + React Flow. Canvas where users build
  graphs of nodes (data source, math ops, triggers) connected by edges.
  Graphs serialize to JSON.
- **Backend (`backend/`)**: Node.js + Express. Ingests telemetry, later compiles
  graph JSON into executable RxJS pipelines and broadcasts live results over
  WebSockets.
- **Database**: MongoDB Time-Series collection for telemetry (high write
  throughput, time-based queries) plus regular collections for graphs,
  users, alerts, and history.

## 2. Git workflow

### Branches

| Branch | Purpose | Owner |
|--------|---------|-------|
| `main` | Integration + stable code. Merge target at weekly reviews | Everyone |
| `sarga` | Coordination, docs, DevOps, UI polish | Sarga |
| `chandra` | Backend, RxJS compiler, rule execution | Chandra |
| `praveen` | Frontend, React Flow, node library, dashboards | Praveen |
| `sowmya` | MongoDB, persistence, webhooks, security | Sowmya |

### Rules

1. **Never push directly to `main`.** `main` only receives merges at weekly
   reviews (Aug 17, Aug 24, Aug 31, Sep 7) after review.
2. Do daily work on your own branch. For a feature spanning several days, use a
   short-lived feature branch off your branch, e.g. `day3-chandra-ingest`,
   then merge back into your branch.
3. Keep your branch current: regularly merge `main` into your branch so
   conflicts stay small.
4. Pull before you push; rebase/merge cleanly. If you get conflicts, resolve
   them carefully and ask for a second pair of eyes on anything you are unsure
   about.
5. Push your branch at the end of each day so teammates can review and so the
   weekly merge is painless.
6. Review someone else's code at least once a week (Day 5 & Day 7 style days).

## 3. Commit standards

Use **Conventional Commits** — small, focused, traceable.

```
<type>(<scope>): <short summary>

[optional body — why, not just what]
```

| Type | Use for |
|------|---------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `chore` | Tooling, config, repo hygiene |
| `test` | Adding/fixing tests |
| `refactor` | Code change with no behavior change |
| `perf` | Performance improvement |

Examples:

```
feat(backend): add telemetry ingestion endpoint with validation
fix(canvas): prevent node deletion when edge is selected
docs(setup): document MongoDB Time-Series requirements
chore: add root .gitignore for node_modules and .env
```

Rules:

- One logical change per commit.
- Imperative mood, ≤ 72 chars in the summary.
- Reference the task from `PROJECT_BOARD.md` in the body when relevant.
- Never commit `.env` files, `node_modules`, or build output (see `.gitignore`).

## 4. Code standards

- **Backend**: ES modules or CommonJS consistently; validate inputs before
  trusting them; central error handler; log meaningful messages.
- **Frontend**: functional components + hooks; keep nodes and graph state
  separate from UI chrome; no inline styles for shared components.
- **Database**: schema changes documented in `docs/` before applied; seed data
  reproducible via a script; prefer Time-Series for telemetry writes.
- **General**: no dead code, no commented-out code in commits, no secrets in
  code or docs.

## 5. Definition of done

Every task from `PROJECT_BOARD.md` is done when it:

- [ ] Is implemented on the owner's branch
- [ ] Runs locally without errors
- [ ] Is tested (happy path + at least one failure case where applicable)
- [ ] Was reviewed by a teammate or discussed in standup
- [ ] Has its `PROJECT_BOARD.md` status updated
- [ ] Uses a meaningful commit message

## 6. Cross-learning expectations

Everyone is expected to understand the full stack by the end of the project:

- Days explicitly labeled **Cross-Learning** (Aug 15, Aug 29, Week 4) require
  working outside your primary area.
- Each week, explain your module to another teammate — teaching is the best way
  to verify understanding.
- Don't hoard knowledge: pair with someone on a different module at least once
  per week.

## 7. Communication

- **Standup:** 5 PM IST daily. Format: completed work → next task → blockers,
  per person; Sarga summarizes and captures action items.
- **Blockers:** raise them in standup the same day. Do not sit on a blocker
  silently.
- **Docs:** keep `README.md`, `SETUP.md`, `DEVELOPMENT.md`, and
  `PROJECT_BOARD.md` truthful — if a doc is wrong, fix it in the same commit
  that makes it wrong.
