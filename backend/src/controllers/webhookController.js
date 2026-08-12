import { webhookService } from '../services/webhookService.js';

export const webhookController = {
  async list(req, res, next) {
    try {
      res.json(await webhookService.list());
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const webhook = await webhookService.create(req.body);
      res.status(201).json(webhook);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const webhook = await webhookService.update(req.params.id, req.body);
      if (!webhook) return res.status(404).json({ error: 'Webhook not found' });
      res.json(webhook);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await webhookService.remove(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  async test(req, res, next) {
    try {
      const result = await webhookService.fire(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
