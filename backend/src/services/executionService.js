import { Subject, filter } from 'rxjs';

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
    // If the rule is already running, cleanly restart it with updated pipeline logic.
    if (activeRules.has(graphId)) {
      await this.stop(graphId);
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
        const targetDevice = stage.config?.deviceId?.trim();
        if (targetDevice) {
          pipeline = pipeline.pipe(
            filter((point) => {
              const devId = point.meta?.deviceId ?? point.deviceId;
              return devId === targetDevice;
            })
          );
        }
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

        // Create an alert record if an action stage is in the pipeline or as default fallback.
        const actionStage = stages.find((s) => s.type === 'action');
        const actionConfig = actionStage?.config ?? {};
        alertService.create({
          ruleId: graphId,
          deviceId: point.meta?.deviceId ?? point.deviceId ?? 'unknown',
          value: point.fields,
          status: 'open',
          meta: { actionType: actionConfig.actionType ?? 'alert', message: actionConfig.message ?? 'Alert condition met' },
        }).catch((err) => console.error('[exec] alert create failed:', err.message));

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
    let active = activeRules.get(graphId);
    if (!active) {
      if (activeRules.size === 1) {
        const [onlyId] = activeRules.keys();
        active = activeRules.get(onlyId);
        graphId = onlyId;
      } else {
        return { graphId, stoppedAt: new Date(), durationMs: 0, message: 'Rule was not running' };
      }
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

  /** Stop all currently running rules. */
  async stopAll() {
    const results = [];
    for (const [id] of activeRules) {
      results.push(await this.stop(id));
    }
    return results;
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

