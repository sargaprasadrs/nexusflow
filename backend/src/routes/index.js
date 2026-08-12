import { Router } from 'express';
import ingestRoutes from './ingest.js';
import telemetryRoutes from './telemetry.js';
import graphRoutes from './graphs.js';
import alertRoutes from './alerts.js';
import webhookRoutes from './webhooks.js';
import historyRoutes from './history.js';
import templateRoutes from './templates.js';

const router = Router();

// API surface (see implementationplan.md §7 for the contract)
router.use('/ingest', ingestRoutes);      // POST /api/ingest
router.use('/telemetry', telemetryRoutes); // GET /api/telemetry
router.use('/graphs', graphRoutes);        // CRUD /api/graphs, POST /api/graphs/:id/compile
router.use('/alerts', alertRoutes);        // CRUD /api/alerts
router.use('/webhooks', webhookRoutes);    // CRUD /api/webhooks
router.use('/history', historyRoutes);     // GET /api/history
router.use('/templates', templateRoutes);  // CRUD /api/templates

export default router;
