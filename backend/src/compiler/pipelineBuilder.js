import { parseGraph } from './graphParser.js';
import { getOperator } from './nodeRegistry.js';

// Pipeline builder (Week 2, Chandra).
// Topological-sorts the graph and returns the ordered list of stages that
// executionService wires into a single RxJS pipeline.
export function buildPipeline(graph) {
  const { nodes, edges } = parseGraph(graph);

  // If there are edges and data sources, only compile nodes reachable from a dataSource node.
  const dataSources = nodes.filter((n) => n.type === 'dataSource');
  if (dataSources.length > 0 && edges.length > 0) {
    const reachableNodeIds = new Set();
    const queue = dataSources.map((n) => n.id);
    queue.forEach((id) => reachableNodeIds.add(id));

    const adjacency = new Map(nodes.map((n) => [n.id, []]));
    for (const edge of edges) {
      if (adjacency.has(edge.source)) {
        adjacency.get(edge.source).push(edge.target);
      }
    }

    while (queue.length > 0) {
      const currId = queue.shift();
      const targets = adjacency.get(currId) ?? [];
      for (const targetId of targets) {
        if (!reachableNodeIds.has(targetId)) {
          reachableNodeIds.add(targetId);
          queue.push(targetId);
        }
      }
    }

    const activeNodes = nodes.filter((n) => reachableNodeIds.has(n.id));
    const activeNodeIds = new Set(activeNodes.map((n) => n.id));
    const activeEdges = edges.filter(
      (e) => activeNodeIds.has(e.source) && activeNodeIds.has(e.target)
    );

    const sorted = topologicalSort(activeNodes, activeEdges);
    return sorted.map((node) => ({
      nodeId: node.id,
      type: node.type,
      operator: getOperator(node.type),
      config: node.data ?? {},
    }));
  }

  const sorted = topologicalSort(nodes, edges);

  return sorted.map((node) => ({
    nodeId: node.id,
    type: node.type,
    operator: getOperator(node.type), // throws if the node type has no operator
    config: node.data ?? {},
  }));
}


// Kahn's algorithm: order nodes so every edge points source -> target.
// Throws 400 on cycles so a broken graph never reaches the execution layer.
export function topologicalSort(nodes, edges) {
  const inDegree = new Map(nodes.map((n) => [n.id, 0]));
  const adjacency = new Map(nodes.map((n) => [n.id, []]));

  for (const edge of edges) {
    adjacency.get(edge.source).push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  const queue = nodes.filter((n) => inDegree.get(n.id) === 0).map((n) => n.id);
  const order = [];

  while (queue.length > 0) {
    const id = queue.shift();
    order.push(id);
    for (const target of adjacency.get(id)) {
      const next = inDegree.get(target) - 1;
      inDegree.set(target, next);
      if (next === 0) queue.push(target);
    }
  }

  if (order.length !== nodes.length) {
    throw Object.assign(new Error('Graph contains a cycle and cannot be compiled'), { status: 400 });
  }

  const byId = new Map(nodes.map((n) => [n.id, n]));
  return order.map((id) => byId.get(id));
}
