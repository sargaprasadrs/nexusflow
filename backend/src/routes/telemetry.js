import { Router } from 'express';
import { telemetryController } from '../controllers/telemetryController.js';

const router = Router();

// GET /api/telemetry?from=&to=&deviceId= - query stored telemetry for charts
router.get('/', telemetryController.query);

export default router;
