import cors from 'cors';
import express from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import {
  securityHeaders,
  rateLimit,
  noSqlInjectionGuard,
  bodySizeGuard,
} from './middleware/security.js';
import { CLIENT_ORIGIN } from './config/env.js';
import { dbStatus } from './config/db.js';
import routes from './routes/index.js';

const app = express();

// --- Security layer (applied before any routes) ---
app.use(securityHeaders);
app.use(rateLimit({ windowMs: 60_000, max: 300 })); // 300 req/min general
app.use(cors({
  origin: CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
}));
app.use(express.json({ limit: '5mb' }));
app.use(noSqlInjectionGuard);
app.use(bodySizeGuard(5 * 1024 * 1024));

// High-throughput rate limit for the ingest endpoint (allows telemetry streams).
app.use('/api/ingest', rateLimit({ windowMs: 60_000, max: 1200 }));


// API routes
app.use('/api', routes);

// Health check — reports 'degraded' while MongoDB is unreachable.
app.get('/api/health', (req, res) => {
  const db = dbStatus();
  res.json({ status: db.ready ? 'ok' : 'degraded', db, uptime: process.uptime() });
});

// 404 + central error handler
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

export default app;
