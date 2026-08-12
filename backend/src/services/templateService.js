import { Graph } from '../models/Graph.js';

// Template library (Week 4) - reusable starter graphs stored in the graphs
// collection with a `template: true` flag.
const TEMPLATE_FILTER = { 'meta.isTemplate': true };

export const templateService = {
  list() {
    return Graph.find(TEMPLATE_FILTER).sort({ updatedAt: -1 }).lean();
  },

  async create(body) {
    const graph = new Graph({
      name: body.name,
      nodes: body.nodes ?? [],
      edges: body.edges ?? [],
      meta: { isTemplate: true },
    });
    await graph.save();
    return graph.toObject();
  },

  remove(id) {
    return Graph.findByIdAndDelete(id);
  },
};
