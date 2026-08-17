// Node registry (Week 2) - maps frontend node types to RxJS operators.
// Kept in sync with the frontend node library (frontend/src/components/nodes).
import { operators } from './operators.js';

export const NODE_TYPES = {
  dataSource: 'dataSource',   // DataSourceNode
  mathOp: 'mathOp',           // MathOpNode
  filter: 'filter',           // FilterNode
  conditional: 'conditional', // ConditionalNode
  aggregation: 'aggregation', // AggregationNode
  action: 'action',           // ActionNode (alert + webhook)
};

export const nodeRegistry = new Map();

export function registerNode(type, operatorFactory) {
  nodeRegistry.set(type, operatorFactory);
}

export function getOperator(type) {
  const factory = nodeRegistry.get(type);
  if (!factory) {
    throw new Error(`No operator registered for node type "${type}"`);
  }
  return factory;
}

// Pass-through operator for nodes that are stream sources or terminal actions.
// Rule execution (WebSocket emit / alert / webhook firing) lands in Week 3.
const identity = () => (source) => source;

registerNode(NODE_TYPES.dataSource, identity);                    // stream source
registerNode(NODE_TYPES.mathOp, operators.math);
registerNode(NODE_TYPES.filter, operators.filterCondition);
// Conditional nodes split into true/false outputs in Week 3 (execution layer);
// until then they behave like a filter so pipelines compile and run.
registerNode(NODE_TYPES.conditional, operators.filterCondition);
registerNode(NODE_TYPES.aggregation, operators.aggregation);
registerNode(NODE_TYPES.action, identity);                        // terminal action

