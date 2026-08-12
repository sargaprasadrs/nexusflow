import { telemetryService } from '../services/telemetryService.js';

// POST /api/ingest - insert batch telemetry into the Time-Series collection.
// TODO (Chandra, Day 2-3): bulkWrite batching for the 5,000 writes/sec audit.
export const ingestController = {
  async create(req, res, next) {
    try {
      const { points } = req.body;
      const inserted = await telemetryService.insertBatch(points);
      res.status(201).json({ inserted, received: points.length });
    } catch (err) {
      next(err);
    }
  },
};
