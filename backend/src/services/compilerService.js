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
      stageCount: stages.length,
      // Strip operator functions so the response is JSON-serializable; the
      // execution layer re-resolves operators via getOperator(stage.type).
      stages: stages.map(({ nodeId, type, config }) => ({ nodeId, type, config })),
      compiledAt: new Date(),
    };
  },
};
