// Request validation helpers (Chandra, Day 2).
// Usage:
//   router.post('/ingest', validateIngestPayload, ingestController.create);

export function validateIngestPayload(req, res, next) {
  const payload = req.body;
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'Body must be a JSON object' });
  }
  if (!Array.isArray(payload.points) || payload.points.length === 0) {
    return res.status(400).json({ error: '"points" must be a non-empty array' });
  }
  next();
}
