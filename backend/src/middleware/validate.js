// Request validation helpers (Chandra, Day 2).
// Usage:
//   router.post('/ingest', validateIngestPayload, ingestController.create);

/**
 * Validate that the ingest payload has the correct shape.
 * Accepts: { points: [ { deviceId, deviceType, fields, ts? } ] }
 */
export function validateIngestPayload(req, res, next) {
  const payload = req.body;
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'Body must be a JSON object' });
  }
  if (!Array.isArray(payload.points) || payload.points.length === 0) {
    return res.status(400).json({ error: '"points" must be a non-empty array' });
  }

  // Cap batch size to prevent abuse.
  if (payload.points.length > 1000) {
    return res.status(400).json({ error: 'Batch size limited to 1000 points' });
  }

  // Validate each point has the minimum required shape.
  for (let i = 0; i < payload.points.length; i++) {
    const p = payload.points[i];
    if (!p || typeof p !== 'object') {
      return res.status(400).json({ error: `Point at index ${i} must be an object` });
    }
    // deviceId can be top-level or nested in meta
    const deviceId = p.deviceId ?? p.meta?.deviceId;
    if (!deviceId || typeof deviceId !== 'string') {
      return res.status(400).json({
        error: `Point at index ${i} missing required "deviceId" (top-level or meta.deviceId)`,
      });
    }
  }

  next();
}

/**
 * Validate that a graph creation/update body has the minimum required shape.
 */
export function validateGraphBody(req, res, next) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Body must be a JSON object' });
  }
  if (body.name !== undefined && typeof body.name !== 'string') {
    return res.status(400).json({ error: '"name" must be a string' });
  }
  if (body.nodes !== undefined && !Array.isArray(body.nodes)) {
    return res.status(400).json({ error: '"nodes" must be an array' });
  }
  if (body.edges !== undefined && !Array.isArray(body.edges)) {
    return res.status(400).json({ error: '"edges" must be an array' });
  }
  next();
}
