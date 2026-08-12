import mongoose from 'mongoose';

// Alert history + deduplication (Week 3, Sowmya).
const { Schema } = mongoose;

const alertSchema = new Schema(
  {
    ruleId: { type: String, required: true, index: true },
    deviceId: { type: String, required: true },
    value: Schema.Types.Mixed,
    status: {
      type: String,
      enum: ['open', 'resolved', 'deduped'],
      default: 'open',
    },
    meta: { type: Schema.Types.Mixed, default: {} },
    triggeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

alertSchema.index({ status: 1, triggeredAt: -1 });

export const Alert = mongoose.model('Alert', alertSchema);
