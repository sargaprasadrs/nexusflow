import { buildPipeline } from '../compiler/pipelineBuilder.js';

// Graph compiler service (Week 2, Chandra).
// Takes a saved graph (nodes + edges) and returns an RxJS pipeline description
// that executionService can run against live telemetry streams.
export const compilerService = {
  compile(graph) {
    const stages = buildPipeline(graph);
    return {
      graphId: graph._id,
      name: graph.name,
      stages,
      compiledAt: new Date(),
    };
  },
};
