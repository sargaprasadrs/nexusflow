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

  // TODO (Week 3): deduplication - avoid creating duplicate alerts for the same
  // ruleId + deviceId within a window.
  create(alertData) {
    return Alert.create(alertData);
  },
};
