import { graphService } from '../services/graphService.js';
import { compilerService } from '../services/compilerService.js';
import { executionService } from '../services/executionService.js';

export const graphController = {
  async list(req, res, next) {
    try {
      res.json(await graphService.list());
    } catch (err) {
      next(err);
    }
  },

  async get(req, res, next) {
    try {
      const graph = await graphService.getById(req.params.id);
      if (!graph) return res.status(404).json({ error: 'Graph not found' });
      res.json(graph);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const graph = await graphService.create(req.body);
      res.status(201).json(graph);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const graph = await graphService.update(req.params.id, req.body);
      if (!graph) return res.status(404).json({ error: 'Graph not found' });
      res.json(graph);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      // Stop execution if running before deleting.
      if (executionService.isRunning(req.params.id)) {
        await executionService.stop(req.params.id);
      }
      await graphService.remove(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  // POST /api/graphs/:id/compile - compile stored graph into an RxJS pipeline (Week 2)
  async compile(req, res, next) {
    try {
      const graph = await graphService.getById(req.params.id);
      if (!graph) return res.status(404).json({ error: 'Graph not found' });
      const pipeline = compilerService.compile(graph);
      res.json({ ok: true, ...pipeline });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/graphs/:id/execute - start live execution against telemetry stream
  async execute(req, res, next) {
    try {
      const result = await executionService.start(req.params.id);
      res.json({ ok: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/graphs/:id/stop - stop a running rule
  async stop(req, res, next) {
    try {
      const result = await executionService.stop(req.params.id);
      res.json({ ok: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/graphs/running - list all running rules
  async running(req, res, next) {
    try {
      res.json(executionService.list());
    } catch (err) {
      next(err);
    }
  },
};
