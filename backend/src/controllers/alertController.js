import { alertService } from '../services/alertService.js';

export const alertController = {
  async list(req, res, next) {
    try {
      const { status, deviceId, limit } = req.query;
      res.json(await alertService.list({ status, deviceId, limit }));
    } catch (err) {
      next(err);
    }
  },

  // POST /api/alerts - create an alert (manual entry; the rule engine also
  // creates alerts via alertService when a rule fires - Week 3).
  async create(req, res, next) {
    try {
      const { ruleId, deviceId, value, status, meta } = req.body ?? {};
      if (!ruleId || !deviceId) {
        return res.status(400).json({ error: '"ruleId" and "deviceId" are required' });
      }
      const alert = await alertService.create({ ruleId, deviceId, value, status, meta });
      res.status(201).json(alert);
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const alert = await alertService.updateStatus(req.params.id, req.body.status);
      if (!alert) return res.status(404).json({ error: 'Alert not found' });
      res.json(alert);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await alertService.remove(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};
