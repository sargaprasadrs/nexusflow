import { Telemetry, ensureTelemetryCollection } from '../models/Telemetry.js';

export const telemetryService = {
  // Batch insert telemetry points into the Time-Series collection.
  // TODO (Chandra/Sowmya, Week 1): batch with bulkWrite + buffering to reach
  // the 5,000 writes/sec audit target.
  async insertBatch(points) {
    await ensureTelemetryCollection();
    const docs = points.map((p) => ({
      ts: new Date(p.ts ?? Date.now()),
      meta: {
        deviceId: p.deviceId ?? p.meta?.deviceId ?? 'unknown',
        deviceType: p.deviceType ?? p.meta?.deviceType ?? 'unknown',
      },
      fields: p.fields ?? p,
    }));
    const result = await Telemetry.insertMany(docs, { ordered: false });
    return result.length;
  },

  // Query telemetry for charts: GET /api/telemetry?from=&to=&deviceId=&limit=
  async query({ from, to, deviceId, limit = 1000 } = {}) {
    const filter = {};
    if (from || to) {
      filter.ts = {};
      if (from) filter.ts.$gte = new Date(from);
      if (to) filter.ts.$lte = new Date(to);
    }
    if (deviceId) filter['meta.deviceId'] = deviceId;

    return Telemetry.find(filter).sort({ ts: -1 }).limit(Number(limit)).lean();
  },
};
