import mongoose from 'mongoose';

// Registered webhook triggers (Week 3, Sowmya) - fires external APIs / mock SMS
// when a rule evaluates to true.
const { Schema } = mongoose;

const webhookSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    ruleId: { type: String, index: true },
    method: { type: String, enum: ['GET', 'POST', 'PUT'], default: 'POST' },
    headers: { type: Schema.Types.Mixed, default: {} },
    enabled: { type: Boolean, default: true },
    lastStatus: Number,
    lastTriggeredAt: Date,
  },
  { timestamps: true }
);

export const Webhook = mongoose.model('Webhook', webhookSchema);
