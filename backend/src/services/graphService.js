import { Graph } from '../models/Graph.js';

export const graphService = {
  list() {
    return Graph.find().sort({ updatedAt: -1 }).lean();
  },

  getById(id) {
    return Graph.findById(id).lean();
  },

  async create(body) {
    const { name, nodes = [], edges = [] } = body;
    const graph = new Graph({ name, nodes, edges });
    await graph.save();
    return graph.toObject();
  },

  update(id, body) {
    const { name, nodes, edges, version } = body;
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
