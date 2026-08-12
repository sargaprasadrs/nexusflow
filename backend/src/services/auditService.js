import { AuditLog } from '../models/AuditLog.js';

export const auditService = {
  async log({ actor, action, target, targetId, details }) {
    try {
      await AuditLog.create({ actor, action, target, targetId, details });
    } catch (err) {
      console.error('[audit] failed to write log:', err.message);
    }
  },
};
