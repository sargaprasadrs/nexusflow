import mongoose from 'mongoose';

// Audit log (Week 4, Sowmya) - track who changed what (graphs, webhooks, rules).
const { Schema } = mongoose;

const auditLogSchema = new Schema(
  {
    actor: String,
    action: { type: String, required: true }, // create | update | delete | compile | execute
    target: { type: String, required: true }, // graph | webhook | rule | template
    targetId: String,
    details: Schema.Types.Mixed,
    at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

auditLogSchema.index({ at: -1, actor: 1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
