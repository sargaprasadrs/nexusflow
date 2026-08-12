import { webhookService } from './webhookService.js';
import { alertService } from './alertService.js';

// Rule execution service (Week 3).
// Runs compiled RxJS pipelines against incoming WebSocket telemetry and emits
// rule results to the alert/WebSocket layer.
export const executionService = {
  // TODO (Week 2-3): subscribe a compiled pipeline to the telemetry stream,
  // evaluate rules in memory, then:
  //   - emit results over the WebSocket broker
  //   - persist alerts via alertService
  //   - fire matching webhooks via webhookService.fire
  async execute(compiled) {
    const { stages } = compiled;
    console.log(`[exec] running rule "${compiled.name}" with ${stages.length} stage(s)`);
    return { startedAt: new Date(), stages: stages.length };
  },
};
