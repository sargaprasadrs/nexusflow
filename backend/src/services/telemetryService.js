import { Telemetry, ensureTelemetryCollection } from '../models/Telemetry.js';

export const telemetryService = {
  // Batch insert telemetry points into the Time-Series collection using bulkWrite for high-throughput performance.
  async insertBatch(points) {
    if (!points || !points.length) return 0;
    await ensureTelemetryCollection();
    const ops = points.map((p) => ({
      insertOne: {
        document: {
          ts: new Date(p.ts ?? Date.now()),
          meta: {
            deviceId: p.deviceId ?? p.meta?.deviceId ?? 'unknown',
            deviceType: p.deviceType ?? p.meta?.deviceType ?? 'unknown',
          },
          fields: p.fields && typeof p.fields === 'object' ? p.fields : {},
        },
      },
    }));
    const result = await Telemetry.bulkWrite(ops, { ordered: false });
    return result.insertedCount ?? points.length;
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
