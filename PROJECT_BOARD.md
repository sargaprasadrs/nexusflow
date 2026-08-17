# NexusFlow — Project Board

> **Owner:** Sarga · **Purpose:** Single source of truth for who is doing what, and when.
> Status legend: ⬜ not started · 🔄 in progress · ✅ done · 🚧 blocked
> Update this board on your own branch at the end of each day; Sarga merges status
> updates into `main` at the weekly review.

## Sprint Overview

| Week | Dates | Theme | Owner focus |
|------|-------|-------|-------------|
| 1 | Aug 11–17 | Foundation: MongoDB + Express + React Flow | Project setup, core components, connections, integration |
| 2 | Aug 18–24 | RxJS + Graph Compiler + Node Library | Graph → RxJS compilation, custom node library |
| 3 | Aug 25–31 | Live Execution + WebSockets + Dashboards + Alerts | Live telemetry, real-time rules, alerts, webhooks |
| 4 | Sep 1–7 | Full-Stack Rotation + Final Product | History, templates, security, docs, final release |

## Roles

| Person | Branch | Primary area |
|--------|--------|--------------|
| Sarga | `sarga` | Coordination, GitHub/DevOps, documentation, UI polish |
| Chandra | `chandra` | Node.js/Express backend, RxJS compiler, rule execution |
| Praveen | `praveen` | React/React Flow canvas, node library, dashboards |
| Sowmya | `sowmya` | MongoDB (Time-Series), persistence, webhooks, security |

---

## Week 1 — Aug 11–17 · Foundation

### Day 1 — Aug 11 · Project Setup

| Owner | Task | Status | Notes |
|-------|------|--------|-------|
| Sarga | Set up GitHub repository and branch structure | ✅ | `main`, `sarga`, `chandra`, `praveen`, `sowmya` created on GitHub |
| Sarga | Create project board/tasks | ✅ | This board; see `PROJECT_BOARD.md` |
| Sarga | Set up README and development guidelines | ✅ | `README.md`, `docs/DEVELOPMENT.md` |
| Sarga | Coordinate everyone getting the project running | ✅ | `docs/SETUP.md` published |
| Chandra | Initialize Node.js/Express backend | ✅ | `backend/` with `package.json` |
| Chandra | Create backend folder structure | ✅ | `routes/`, `controllers/`, `services/`, `models/`, `config/` |
| Chandra | Configure environment variables | ✅ | `.env.example` with `PORT`, `MONGODB_URI`; `src/config/env.js` |
| Chandra | Create basic server | ✅ | Express app + `GET /api/health` |
| Praveen | Initialize React application | ✅ | `frontend/` via Vite + TS |
| Praveen | Set up React Flow | ✅ | `@xyflow/react` installed |
| Praveen | Create initial canvas | ✅ | `GraphCanvas` renders `ReactFlow` with custom nodes |
| Praveen | Establish frontend folder structure | ✅ | `components/`, `nodes/`, `hooks/`, `store/` |
| Sowmya | Set up MongoDB | 🔄 | Needs local `mongod` running (per `docs/SETUP.md`) |
| Sowmya | Design telemetry document structure | ✅ | `Telemetry` model: `ts`, `meta`, `fields` |
| Sowmya | Plan MongoDB Time-Series collection | ✅ | `telemetry` TS collection via `ensureTelemetryCollection` |
| Sowmya | Prepare seed telemetry data | ✅ | `npm run seed` inserts 1,000 points |
| Everyone | Clone and run the complete project | 🔄 | Verify per `docs/SETUP.md` |
| Everyone | Understand the architecture | 🔄 | See `docs/DEVELOPMENT.md` → Architecture |
| Everyone | Make first Git commit | ✅ | Scaffold committed on `main` |

### Day 2 — Aug 12 · Core Components

| Owner | Task | Status |
|-------|------|--------|
| Sarga | Establish Git workflow | ✅ |
| Sarga | Review everyone's initial code | 🔄 |
| Sarga | Start connecting frontend/backend project structure | ✅ |
| Chandra | Build Express telemetry ingestion endpoint | ✅ |
| Chandra | Implement request parsing | ✅ |
| Chandra | Add basic validation | ✅ |
| Praveen | Build React Flow canvas | ✅ |
| Praveen | Add basic nodes | ✅ |
| Praveen | Implement node movement | ✅ |
| Sowmya | Create MongoDB Time-Series collection | ✅ |
| Sowmya | Configure timestamp/metadata fields | ✅ |
| Sowmya | Insert seed telemetry | ✅ |
| Everyone | Pair with someone on a different module; understand their module | 🔄 |

### Day 3 — Aug 13 · Connections

| Owner | Task | Status |
|-------|------|--------|
| Sarga | Integration testing | 🔄 |
| Sarga | Define API/data contracts between frontend and backend | ✅ |
| Chandra | Connect Express ingestion endpoint to MongoDB | ✅ |
| Chandra | Add error handling | ✅ |
| Chandra | Test telemetry requests | 🔄 |
| Praveen | Implement edges/connections between nodes | ✅ |
| Praveen | Add node deletion | ✅ |
| Praveen | Improve canvas interaction | 🔄 |
| Sowmya | Test telemetry queries | 🔄 |
| Sowmya | Verify stored sensor data | 🔄 |
| Sowmya | Work with Chandra on database/API integration | ✅ |
| Everyone | Test another person's work | 🔄 |

### Day 4 — Aug 14 · Graph + Data Integration

| Owner | Task | Status |
|-------|------|--------|
| Sarga | Integrate current frontend and backend branches | 🔄 |
| Sarga | Resolve merge conflicts | 🔄 |
| Sarga | Update documentation | ✅ |
| Chandra | Improve telemetry ingestion | 🔄 |
| Chandra | Test multiple sensor/device payloads | 🔄 |
| Chandra | Add basic logging | ✅ |
| Praveen | Implement graph save/load | ✅ |
| Praveen | Convert React Flow graph into JSON | ✅ |
| Sowmya | Optimize telemetry storage structure | 🔄 |
| Sowmya | Document MongoDB schema | 🔄 |
| Sowmya | Test larger batches of telemetry | 🔄 |
| Everyone | Understand the complete `Sensor → Express → MongoDB` flow | ✅ |

### Day 5 — Aug 15 · Cross-Learning Day

| Owner | Task | Status |
|-------|------|--------|
| Sarga | Learn Express API structure; make a small backend change | 🔄 |
| Chandra | Learn MongoDB Time-Series operations; make a DB query/change | 🔄 |
| Praveen | Learn Express/API communication; connect a frontend action to the backend | ✅ |
| Sowmya | Learn React Flow structure; make a small frontend change | 🔄 |
| Everyone | Review each other's code | 🔄 |
| Everyone | Explain your assigned module to another teammate | 🔄 |

### Day 6 — Aug 16 · Testing & Bug Fixing

| Owner | Task | Status |
|-------|------|--------|
| Everyone | Test the complete Week 1 system | 🔄 |
| Everyone | Fix bugs | 🔄 |
| Everyone | Test invalid telemetry, missing fields, multiple devices | 🔄 |
| Everyone | Test React Flow connections and graph serialization | 🔄 |
| Everyone | Clean up code; update documentation | 🔄 |
| Sarga | Coordinate final integration | 🔄 |
| Chandra + Sowmya | Verify API → MongoDB pipeline | 🔄 |
| Praveen | Verify canvas → JSON pipeline | ✅ |

### Day 7 — Aug 17 · Week 1 Review

| Owner | Task | Status |
|-------|------|--------|
| Everyone | Merge completed work into `main` | 🔄 |
| Everyone | Review the entire codebase | 🔄 |
| Everyone | Prepare demo (MongoDB Time-Series, Express API, React Flow canvas, graph save/load) | 🔄 |
| Everyone | Document what was completed and what remains | 🔄 |

---

## Week 2 — Aug 18–24 · RxJS + Graph Compiler + Node Library

| Day | Owner | Tasks |
|-----|-------|-------|
| Aug 18 | Sarga | Learn RxJS/backend architecture |
| | Chandra | Set up RxJS and compiler foundation |
| | Praveen | Begin reusable node architecture |
| | Sowmya | Learn compiler/data-flow requirements |
| | Everyone | Understand how React Flow JSON becomes backend logic |
| Aug 19 | Sarga | Backend API integration |
| | Chandra | Build graph parser |
| | Praveen | Build Data Source nodes |
| | Sowmya | Support graph/persistence requirements |
| Aug 20 | Sarga | Testing/compiler documentation |
| | Chandra | Build graph compiler |
| | Praveen | Build Math Operation nodes |
| | Sowmya | Build database-related operator support |
| Aug 21 | Sarga | Integration |
| | Chandra | Convert graph into RxJS pipeline |
| | Praveen | Build Action Trigger nodes |
| | Sowmya | Add validation/error handling |
| Aug 22 | Everyone | Pair programming; modify code outside primary area; test compiler behavior, invalid graphs, node combinations |
| Aug 23 | Everyone | Performance testing, bug fixing, documentation, code review, prepare mid-project demo |
| Aug 24 | Everyone | Demonstrate graph serialization, compilation, RxJS pipeline creation; review performance; merge stable work into `main` |

## Week 3 — Aug 25–31 · Live Execution + WebSockets + Dashboards + Alerts

| Day | Owner | Tasks |
|-----|-------|-------|
| Aug 25 | Sarga | WebSocket integration |
| | Chandra | Live RxJS execution |
| | Praveen | Live dashboard foundation |
| | Sowmya | Alert/persistence design |
| Aug 26 | Sarga | Frontend/backend integration |
| | Chandra | Connect telemetry to compiled rules |
| | Praveen | Build live telemetry charts |
| | Sowmya | Build alert management |
| Aug 27 | Sarga | WebSocket testing |
| | Chandra | Concurrent rule execution |
| | Praveen | Real-time UI updates |
| | Sowmya | Webhook executor |
| Aug 28 | Sarga | Deployment/integration work |
| | Chandra | Execution logging |
| | Praveen | Alert dashboard |
| | Sowmya | Webhook configuration UI |
| Aug 29 | Sarga | Cross-learning: rule execution |
| | Chandra | Cross-learning: dashboard |
| | Praveen | Cross-learning: backend/WebSocket |
| | Sowmya | Cross-learning: frontend/integration |
| Aug 30 | Everyone | Test real-time telemetry, rule execution, alerts, webhooks, concurrent users; fix bugs |
| Aug 31 | Everyone | Performance optimization, edge-case testing, documentation, merge Week 3 work into `main` |

## Week 4 — Sep 1–7 · Full-Stack Rotation + Final Product

| Day | Owner | Tasks |
|-----|-------|-------|
| Sep 1 | Everyone | Learn and modify a module someone else built; review unfamiliar code; fix at least one issue outside primary area |
| Sep 2 | Everyone | Rule history, history viewer, history APIs, persistence |
| Sep 3 | Everyone | Template library, audit logging, CSV export, error handling |
| Sep 4 | Everyone | Security review, responsive UI, dark mode, API/component testing |
| Sep 5 | Everyone | Full system testing, performance benchmarks, load testing, bug fixing |
| Sep 6 | Everyone | Final documentation, setup/API/component/deployment docs, clean GitHub repository |
| Sep 7 | Everyone | Final review: every person explains and demonstrates React, React Flow, Node.js, Express, MongoDB Time-Series, RxJS, graph compiler, WebSockets, rule execution, webhooks, dashboards, testing, Git/GitHub, deployment, overall architecture |

---

## Definition of Done (every item)

- [ ] Implemented on the owner's branch
- [ ] Runs locally without errors
- [ ] Basic testing done (happy path + at least one failure case where applicable)
- [ ] Code reviewed by at least one teammate (or discussed in standup)
- [ ] `PROJECT_BOARD.md` status updated
