import { telemetryService } from '../services/telemetryService.js';

// GET /api/telemetry?from=&to=&deviceId=
export const telemetryController = {
  async query(req, res, next) {
    try {
      const { from, to, deviceId, limit } = req.query;
      const rows = await telemetryService.query({ from, to, deviceId, limit });
      res.json({ count: rows.length, rows });
    } catch (err) {
      next(err);
    }
  },
};
