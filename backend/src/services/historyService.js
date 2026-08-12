import { RuleHistory } from '../models/RuleHistory.js';

export const historyService = {
  async list({ ruleId, from, to, limit = 100 } = {}) {
    const filter = {};
    if (ruleId) filter.ruleId = ruleId;
    if (from || to) {
      filter.startedAt = {};
      if (from) filter.startedAt.$gte = new Date(from);
      if (to) filter.startedAt.$lte = new Date(to);
    }
    return RuleHistory.find(filter).sort({ startedAt: -1 }).limit(Number(limit)).lean();
  },

  record(entry) {
    return RuleHistory.create(entry);
  },
};
