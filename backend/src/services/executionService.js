import { Subject } from 'rxjs';
import { buildPipeline } from '../compiler/pipelineBuilder.js';
import { graphService } from './graphService.js';
import { alertService } from './alertService.js';
import { historyService } from './historyService.js';
import { broker } from '../websocket/broker.js';

// In-memory registry of active rule executions.
// key = graphId, value = { subject, subscription, stages, startedAt }
const activeRules = new Map();

// Telemetry bus — the mock generator and ingest endpoint push points here;
// active rules subscribe to it.
export const telemetryBus = new Subject();

export const executionService = {
  /** Start executing a compiled graph against the live telemetry stream. */
  async start(graphId) {
    if (activeRules.has(graphId)) {
      throw Object.assign(new Error('Rule is already running'), { status: 409 });
    }

    const graph = await graphService.getById(graphId);
    if (!graph) {
      throw Object.assign(new Error('Graph not found'), { status: 404 });
    }

    let stages;
    try {
      stages = buildPipeline(graph);
    } catch (err) {
      throw Object.assign(
        new Error(`Compilation failed: ${err.message}`),
        { status: 422 }
      );
    }

    // Build the RxJS pipeline by piping operators in topological order.
    // dataSource nodes are stream sources; action nodes are terminal.
    // We connect the pipeline to the shared telemetryBus.
    let pipeline = telemetryBus.asObservable();

    for (const stage of stages) {
      if (stage.type === 'dataSource') {
        // Skip — dataSource is the stream source, not a transform.
        continue;
      }
      if (typeof stage.operator === 'function') {
        pipeline = pipeline.pipe(stage.operator(stage.config));
      }
    }

    let inputCount = 0;
    let outputCount = 0;
    const startedAt = new Date();

    const subscription = pipeline.subscribe({
      next: (point) => {
        outputCount++;
        // Broadcast to /ws/alerts so the frontend sees live results.
        broker.publish('/ws/alerts', {
          type: 'rule.result',
          payload: {
            graphId,
            name: graph.name,
            point,
          },
          at: new Date().toISOString(),
        });

        // If the final stage is an action node, create an alert.
        const lastStage = stages[stages.length - 1];
        if (lastStage?.type === 'action') {
          const actionConfig = lastStage.config ?? {};
          alertService.create({
            ruleId: graphId,
            deviceId: point.meta?.deviceId ?? point.deviceId ?? 'unknown',
            value: point.fields,
            status: 'open',
            meta: { actionType: actionConfig.actionType ?? 'alert', message: actionConfig.message },
          }).catch((err) => console.error('[exec] alert create failed:', err.message));
        }
      },
      error: (err) => {
        console.error(`[exec] rule "${graph.name}" (${graphId}) error:`, err.message);
        executionService.stop(graphId).catch(() => {});
      },
    });

    // Count incoming points for the history record.
    const inputSub = telemetryBus.subscribe({ next: () => { inputCount++; } });

    activeRules.set(graphId, {
      subject: telemetryBus,
      subscription,
      inputSub,
      stages,
      startedAt,
      graphName: graph.name,
    });

    // Record the execution start.
    historyService.record({
      ruleId: graphId,
      graphId,
      status: 'running',
      inputCount: 0,
      outputCount: 0,
      startedAt,
    }).catch(() => {});

    console.log(`[exec] started rule "${graph.name}" (${graphId}) with ${stages.length} stage(s)`);
    return {
      graphId,
      name: graph.name,
      stageCount: stages.length,
      startedAt,
    };
  },

  /** Stop a running rule. */
  async stop(graphId) {
    const active = activeRules.get(graphId);
    if (!active) {
      throw Object.assign(new Error('Rule is not running'), { status: 404 });
    }

    active.subscription.unsubscribe();
    active.inputSub.unsubscribe();
    activeRules.delete(graphId);

    const durationMs = Date.now() - active.startedAt.getTime();
    historyService.record({
      ruleId: graphId,
      graphId,
      status: 'success',
      inputCount: active.inputSub.closed ? 0 : undefined,
      outputCount: undefined,
      durationMs,
      startedAt: active.startedAt,
    }).catch(() => {});

    console.log(`[exec] stopped rule "${active.graphName}" (${graphId}) after ${durationMs}ms`);
    return { graphId, stoppedAt: new Date(), durationMs };
  },

  /** List all currently running rules. */
  list() {
    const running = [];
    for (const [graphId, active] of activeRules) {
      running.push({
        graphId,
        name: active.graphName,
        stageCount: active.stages.length,
        startedAt: active.startedAt,
      });
    }
    return running;
  },

  /** Check if a specific rule is running. */
  isRunning(graphId) {
    return activeRules.has(graphId);
  },
};
