import { parseGraph } from './graphParser.js';
import { getOperator } from './nodeRegistry.js';

// Pipeline builder (Week 2, Chandra).
// Topological-sorts the graph and returns the ordered list of stages that
// executionService wires into a single RxJS pipeline.
export function buildPipeline(graph) {
  const { nodes, edges } = parseGraph(graph);

  // TODO (Week 2): topological sort from edges (source -> target), then map each
  // node to its operator via nodeRegistry and assemble the observable chain.
  const sorted = nodes; // placeholder: replace with real topological order

  return sorted.map((node) => ({
    nodeId: node.id,
    type: node.type,
    operator: getOperator(node.type), // throws until operators are registered
    config: node.data ?? {},
  }));
}
