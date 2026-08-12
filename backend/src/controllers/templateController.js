import { templateService } from '../services/templateService.js';

// Template library (Week 4) - reusable starter graphs
export const templateController = {
  async list(req, res, next) {
    try {
      res.json(await templateService.list());
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const template = await templateService.create(req.body);
      res.status(201).json(template);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await templateService.remove(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};
