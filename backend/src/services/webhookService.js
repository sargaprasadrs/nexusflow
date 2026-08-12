import { Webhook } from '../models/Webhook.js';

export const webhookService = {
  list() {
    return Webhook.find().sort({ createdAt: -1 }).lean();
  },

  create(body) {
    return Webhook.create(body);
  },

  update(id, body) {
    return Webhook.findByIdAndUpdate(id, body, { new: true }).lean();
  },

  remove(id) {
    return Webhook.findByIdAndDelete(id);
  },

  // Fire a webhook - used by the test endpoint and by the rule engine when a
  // rule evaluates to true (Week 3, Sowmya).
  async fire(id) {
    const webhook = await Webhook.findById(id).lean();
    if (!webhook) throw Object.assign(new Error('Webhook not found'), { status: 404 });

    const res = await fetch(webhook.url, {
      method: webhook.method ?? 'POST',
      headers: { 'Content-Type': 'application/json', ...(webhook.headers ?? {}) },
      body: JSON.stringify({ event: 'nexusflow.alert', webhookId: webhook._id, at: new Date() }),
    });

    await Webhook.findByIdAndUpdate(id, {
      lastStatus: res.status,
      lastTriggeredAt: new Date(),
    });
    return { ok: res.ok, status: res.status };
  },
};
