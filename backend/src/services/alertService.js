import { Alert } from '../models/Alert.js';

export const alertService = {
  async list({ status, deviceId, limit = 100 } = {}) {
    const filter = {};
    if (status) filter.status = status;
    if (deviceId) filter.deviceId = deviceId;
    return Alert.find(filter).sort({ triggeredAt: -1 }).limit(Number(limit)).lean();
  },

  updateStatus(id, status) {
    return Alert.findByIdAndUpdate(id, { status }, { new: true }).lean();
  },

  remove(id) {
    return Alert.findByIdAndDelete(id);
  },

  // Deduplication: avoid creating duplicate alerts for the same ruleId + deviceId
  // within a window (default: 10,000ms / 10s).
  async create(alertData) {
    const windowMs = alertData.dedupWindowMs ?? 10000;
    if (windowMs > 0 && alertData.ruleId && alertData.deviceId) {
      const cutoff = new Date(Date.now() - windowMs);
      const existing = await Alert.findOne({
        ruleId: alertData.ruleId,
        deviceId: alertData.deviceId,
        status: alertData.status ?? 'open',
        triggeredAt: { $gte: cutoff },
      }).lean();
      if (existing) {
        return existing;
      }
    }
    return Alert.create(alertData);
  },
};
