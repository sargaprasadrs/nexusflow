import cors from 'cors';
import express from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import { CLIENT_ORIGIN } from './config/env.js';
import { dbStatus } from './config/db.js';
import routes from './routes/index.js';

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '5mb' }));

// API routes - see src/routes/index.js for the full surface
app.use('/api', routes);

// Health check (Chandra's Day 1 deliverable). The server boots even when
// MongoDB is down, so health reports 'degraded' until the DB connects.
app.get('/api/health', (req, res) => {
  const db = dbStatus();
  res.json({ status: db.ready ? 'ok' : 'degraded', db, uptime: process.uptime() });
});

// 404 + central error handler
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

export default app;
