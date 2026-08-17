import { graphService } from '../services/graphService.js';
import { compilerService } from '../services/compilerService.js';

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
};
