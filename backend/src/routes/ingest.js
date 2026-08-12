import { Router } from 'express';
import { ingestController } from '../controllers/ingestController.js';
import { validateIngestPayload } from '../middleware/validate.js';

const router = Router();

// POST /api/ingest - batch telemetry ingest (Chandra, Day 2-3)
router.post('/', validateIngestPayload, ingestController.create);

export default router;
