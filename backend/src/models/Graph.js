import mongoose from 'mongoose';

// Saved rule graphs - the JSON that the compiler consumes (Sowmya, Week 1).
const { Schema } = mongoose;

const nodeSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true }, // dataSource | mathOp | filter | conditional | aggregation | action
    position: { x: Number, y: Number },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const edgeSchema = new Schema(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    sourceHandle: String,
    targetHandle: String,
  },
  { _id: false }
);

const graphSchema = new Schema(
  {
    name: { type: String, required: true },
    version: { type: Number, default: 1 },
    nodes: { type: [nodeSchema], default: [] },
    edges: { type: [edgeSchema], default: [] },
    // Free-form flags (e.g. { isTemplate: true } for the template library)
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Graph = mongoose.model('Graph', graphSchema);
