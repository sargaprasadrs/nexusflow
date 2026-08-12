// Graph parser (Week 2, Chandra).
// Validates a saved graph (nodes + edges) and normalizes it for compilation.
export function parseGraph(graph) {
  const errors = [];

  if (!Array.isArray(graph.nodes)) errors.push('nodes must be an array');
  if (!Array.isArray(graph.edges)) errors.push('edges must be an array');

  if (errors.length > 0) {
    throw Object.assign(new Error(errors.join('; ')), { status: 400 });
  }

  const nodeIds = new Set(graph.nodes.map((n) => n.id));

  // Every edge must reference existing nodes.
  for (const edge of graph.edges) {
    if (!nodeIds.has(edge.source)) errors.push(`edge ${edge.id} references missing source node ${edge.source}`);
    if (!nodeIds.has(edge.target)) errors.push(`edge ${edge.id} references missing target node ${edge.target}`);
  }

  if (errors.length > 0) {
    throw Object.assign(new Error(errors.join('; ')), { status: 400 });
  }

  return { nodes: graph.nodes, edges: graph.edges };
}
