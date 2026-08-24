import { telemetryService } from '../services/telemetryService.js';
import { telemetryBus } from '../services/executionService.js';

// POST /api/ingest - insert batch telemetry into the Time-Series collection
// and push to the execution bus for live rule processing.
export const ingestController = {
  async create(req, res, next) {
    try {
      const { points } = req.body;
      const inserted = await telemetryService.insertBatch(points);

      // Push each point to the live execution bus so running rules evaluate it.
      for (const p of points) {
        telemetryBus.next({
          ts: p.ts ? new Date(p.ts) : new Date(),
          meta: {
            deviceId: p.deviceId ?? p.meta?.deviceId ?? 'unknown',
            deviceType: p.deviceType ?? p.meta?.deviceType ?? 'unknown',
          },
          fields: p.fields && typeof p.fields === 'object' ? p.fields : {},
        });
      }

      res.status(201).json({ inserted, received: points.length });
    } catch (err) {
      next(err);
    }
  },
};
