import { Graph } from '../models/Graph.js';

// Whitelisted node types that the compiler knows how to handle.
const VALID_NODE_TYPES = new Set([
  'dataSource', 'mathOp', 'filter', 'conditional', 'aggregation', 'action',
]);

/**
 * Validate that graph data has the correct shape.
 * Throws a 400 error if nodes have unknown types or edges reference
 * non-existent nodes.
 */
function validateGraphData(nodes, edges) {
  if (!Array.isArray(nodes) || !Array.isArray(edges)) return;

  const nodeIds = new Set();
  for (const node of nodes) {
    if (!node.id || !node.type) {
      throw Object.assign(new Error('Each node must have "id" and "type"'), { status: 400 });
    }
    if (!VALID_NODE_TYPES.has(node.type)) {
      throw Object.assign(
        new Error(`Unknown node type "${node.type}". Valid types: ${[...VALID_NODE_TYPES].join(', ')}`),
        { status: 400 }
      );
    }
    nodeIds.add(node.id);
  }

  for (const edge of edges) {
    if (!edge.id || !edge.source || !edge.target) {
      throw Object.assign(new Error('Each edge must have "id", "source", and "target"'), { status: 400 });
    }
    if (!nodeIds.has(edge.source)) {
      throw Object.assign(new Error(`Edge "${edge.id}" references unknown source node "${edge.source}"`), { status: 400 });
    }
    if (!nodeIds.has(edge.target)) {
      throw Object.assign(new Error(`Edge "${edge.id}" references unknown target node "${edge.target}"`), { status: 400 });
    }
  }
}

export const graphService = {
  list() {
    return Graph.find().sort({ updatedAt: -1 }).lean();
  },

  getById(id) {
    return Graph.findById(id).lean();
  },

  async create(body) {
    const { name, nodes = [], edges = [] } = body;
    validateGraphData(nodes, edges);
    const graph = new Graph({ name, nodes, edges });
    await graph.save();
    return graph.toObject();
  },

  update(id, body) {
    const { name, nodes, edges, version } = body;
    if (nodes !== undefined || edges !== undefined) {
      validateGraphData(nodes ?? [], edges ?? []);
    }
    const update = {};
    if (name !== undefined) update.name = name;
    if (nodes !== undefined) update.nodes = nodes;
    if (edges !== undefined) update.edges = edges;
    if (version !== undefined) update.version = version;
    return Graph.findByIdAndUpdate(id, update, { new: true }).lean();
  },

  remove(id) {
    return Graph.findByIdAndDelete(id);
  },
};
