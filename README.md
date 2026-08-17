# NexusFlow

NexusFlow is a visual rule engine for building, compiling, and running telemetry-driven workflows. The system combines a React Flow canvas, a Node.js and Express backend, MongoDB Time-Series storage, RxJS-based stream processing, and WebSocket-powered live updates.

This README captures the project direction, team workflow, and the August 11 – September 7, 2026 delivery plan.

## Documentation

- [Setup Guide](docs/SETUP.md) — prerequisites, clone, branches, MongoDB, running backend/frontend
- [Development Guidelines](docs/DEVELOPMENT.md) — architecture, git workflow, commit standards, definition of done
- [Project Board](PROJECT_BOARD.md) — who is doing what, day by day

## Project Goals

- Build a visual rule authoring experience with reusable node types.
- Support high-throughput telemetry ingestion and real-time processing.
- Compile graph logic into executable backend behavior.
- Provide live dashboards, alerts, history, audit logs, and export tools.
- Ship with documentation, testing, performance benchmarks, and deployment guidance.

## Core Stack

- Frontend: React, React Flow, dashboard and canvas UI components
- Backend: Node.js, Express, RxJS, WebSocket services
- Database: MongoDB Time-Series collections
- Integrations: telemetry ingestion, webhook execution, alert delivery
- Quality: validation, testing, performance tuning, security review

## Repository Layout

```
nexusflow/
├── backend/                # Express API, RxJS compiler, WebSocket broker (Chandra)
│   └── src/
│       ├── config/         # env + MongoDB connection
│       ├── models/         # Telemetry (Time-Series), Graph, Alert, Webhook, RuleHistory, AuditLog
│       ├── routes/         # /api/ingest, /telemetry, /graphs, /alerts, /webhooks, /history, /templates
│       ├── controllers/    # request handlers
│       ├── services/       # business logic (telemetry, graph, compiler, execution, webhooks, ...)
│       ├── compiler/       # graph parser -> RxJS pipeline builder (nodeRegistry, operators)
│       ├── websocket/      # channel broker (/ws/telemetry, /ws/alerts)
│       ├── seed/           # seed telemetry (npm run seed)
│       ├── scripts/        # mock telemetry generator (npm run mock)
│       └── utils/          # logger, csv export
├── frontend/               # React + Vite + React Flow app (Praveen)
│   └── src/
│       ├── components/
│       │   ├── canvas/     # GraphCanvas (React Flow wrapper)
│       │   ├── nodes/      # DataSource, MathOp, Filter, Conditional, Aggregation, Action
│       │   ├── panels/     # NodePropertyPanel, AlertPanel
│       │   ├── charts/     # LiveChart (Recharts)
│       │   └── ui/         # Toolbar, Sidebar, StatusBar, Toasts
│       ├── store/          # Zustand graph store
│       ├── hooks/          # useWebSocket
│       ├── lib/            # graphSerializer, ws client
│       └── types/          # graph + telemetry types
├── docs/                   # setup + development guidelines
├── PROJECT_BOARD.md        # task tracking
└── README.md
```

Each file starts as a minimal placeholder with a TODO pointing to its owner and
week - everyone fills in their files on their own branch.

## Team Roles

- Sarga: coordination, GitHub management, DevOps, documentation, UI polish
- Chandra: backend streams, compiler, rule execution, performance work
- Praveen: React canvas, node components, dashboards, animations, component docs
- Sowmya: MongoDB, persistence, webhooks, audit logging, security

## Branch Strategy

- main: integration branch; merge target at weekly reviews
- sarga: coordination, docs, DevOps, UI polish — owned by Sarga
- chandra: backend (Express, RxJS, rule execution) — owned by Chandra
- praveen: frontend (React, React Flow, dashboards) — owned by Praveen
- sowmya: database (MongoDB Time-Series), persistence, webhooks — owned by Sowmya

Daily work is developed on the owner branches (and short-lived feature branches off them), then merged into main on weekly reviews. See [Development Guidelines](docs/DEVELOPMENT.md#2-git-workflow) for the full workflow.

## Delivery Roadmap

### Week 1: August 11-17, 2026

Focus: project kickoff, database foundation, API scaffolding, and canvas setup.

- MongoDB Time-Series schema design and seed data
- Express server setup and ingest endpoint skeleton
- React app scaffold and React Flow integration
- Canvas scaffolding, node creation, edge logic, and save/load flow
- Weekly review, documentation updates, and main branch merge

### Week 2: August 18-24, 2026

Focus: compiler foundation, operator library, and live execution support.

- RxJS setup and graph compiler parser
- Operator builder, filter logic, logical operators, and aggregations
- Live compilation, execution status UI, and error handling
- Performance audit, demo preparation, and mid-review merge

### Week 3: August 25-31, 2026

Focus: live dashboards, webhooks, alert management, and resilience.

- WebSocket broadcasting and live telemetry charts
- Subscription management and alert panel UI
- Webhook executor and configuration UI
- Concurrent execution, alert deduplication, execution logging
- Performance optimization, edge case testing, and merge to main

### Week 4: September 1-7, 2026

Focus: refinement, history, templates, audits, documentation, and final review.

- Rule history service, viewer, and API endpoints
- Template library and audit logging
- CSV export, dark mode, and responsive/security testing
- Setup guide, component API docs, backend docs, and deployment notes
- Final bug fixes, benchmarks, full merge, and verification

## Quick Start

1. Clone: `git clone https://github.com/sargaprasadrs/nexusflow.git && cd nexusflow`
2. Check out your branch (see [Branch Strategy](#branch-strategy))
3. Start MongoDB, then run the backend and frontend per the [Setup Guide](docs/SETUP.md)

## Daily Standup Format

Time: 5 PM IST

- Chandra: completed work, next task, blockers
- Praveen: completed work, next task, blockers
- Sowmya: completed work, next task, blockers
- Sarga: summary and action items

Standup outcome: capture blockers, confirm dependencies, and align the next day’s work.

## Key Deliverables

1. Fully functional NexusFlow visual rule engine
2. MongoDB Time-Series schema with optimized ingestion
3. Express and Node.js backend with RxJS compilation pipeline
4. React Flow canvas with node library and graph editing
5. Real-time WebSocket telemetry streaming
6. Rule templates, audit logs, and history tracking
7. Complete API and component documentation
8. Setup, deployment, and local development guides
9. Performance benchmarks, load tests, and security review
10. Final demo-ready main branch

## Commit Standards

- Use meaningful conventional commit messages.
- Keep commits small and focused.
- Ensure every feature, fix, test, or doc update is traceable.
- Avoid long gaps in activity during the project window.

## Suggested README Additions During Execution

As the project evolves, this README can also include:

- architecture diagrams
- screenshots or canvas previews
- API endpoint references
- setup instructions
- development scripts
- deployment steps
- testing notes

## Project Summary

NexusFlow is planned as a complete end-to-end platform for designing, compiling, and executing telemetry-driven rules with live visual feedback. The roadmap above is organized to move from infrastructure and ingestion, to compilation and execution, and finally to hardening, documentation, and release preparation.
