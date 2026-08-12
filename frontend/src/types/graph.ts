// Shared graph types - must stay in sync with backend Graph model + compiler.
import type { Edge, Node } from '@xyflow/react';

export type NodeType =
  | 'dataSource'
  | 'mathOp'
  | 'filter'
  | 'conditional'
  | 'aggregation'
  | 'action';

// Data carried by each node (shown in the property panel, used by the compiler).
// NOTE: must stay a type alias (not an interface) so it satisfies React Flow's
// `NodeData extends Record<string, unknown>` constraint.
export type GraphNodeData = {
  label?: string;
  // dataSource
  deviceId?: string;
  deviceType?: string;
  // mathOp
  op?: 'add' | 'subtract' | 'multiply' | 'divide';
  field?: string;
  value?: number;
  // filter / conditional
  operator?: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
  threshold?: number;
  // aggregation
  windowMs?: number;
  // action
  actionType?: 'alert' | 'webhook';
  webhookId?: string;
  message?: string;
};

export type GraphNode = Node<GraphNodeData, NodeType>;
export type GraphEdge = Edge;

export interface SerializedGraph {
  name: string;
  version?: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
}
