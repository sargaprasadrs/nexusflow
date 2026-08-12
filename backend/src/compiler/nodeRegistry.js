// Node registry (Week 2) - maps frontend node types to RxJS operators.
// Kept in sync with the frontend node library (frontend/src/components/nodes).
export const NODE_TYPES = {
  dataSource: 'dataSource',   // DataSourceNode
  mathOp: 'mathOp',           // MathOpNode
  filter: 'filter',           // FilterNode
  conditional: 'conditional', // ConditionalNode
  aggregation: 'aggregation', // AggregationNode
  action: 'action',           // ActionNode (alert + webhook)
};

// TODO (Week 2): register the operator implementation for each node type.
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
