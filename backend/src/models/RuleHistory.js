import mongoose from 'mongoose';

// Rule execution history (Week 4) - one document per rule evaluation/run.
const { Schema } = mongoose;

const ruleHistorySchema = new Schema(
  {
    ruleId: { type: String, required: true, index: true },
    graphId: { type: String, index: true },
    status: { type: String, enum: ['running', 'success', 'error'], default: 'running' },
    inputCount: Number,
    outputCount: Number,
    durationMs: Number,
    error: String,
    startedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ruleHistorySchema.index({ startedAt: -1 });

export const RuleHistory = mongoose.model('RuleHistory', ruleHistorySchema);
