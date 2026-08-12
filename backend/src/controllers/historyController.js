import { historyService } from '../services/historyService.js';

// GET /api/history?ruleId=&from=&to= - rule execution history (Week 4)
export const historyController = {
  async list(req, res, next) {
    try {
      const { ruleId, from, to, limit } = req.query;
      res.json(await historyService.list({ ruleId, from, to, limit }));
    } catch (err) {
      next(err);
    }
  },
};
