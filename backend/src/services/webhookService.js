import { Webhook } from '../models/Webhook.js';

// Blocked URL patterns — prevent SSRF against internal/private networks.
const BLOCKED_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);
const BLOCKED_PROTOCOLS = new Set(['file:', 'data:', 'javascript:']);

/**
 * Validate a webhook URL to prevent SSRF attacks.
 * Rejects localhost, private IPs, non-http(s) protocols.
 */
function validateWebhookUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw Object.assign(new Error('Invalid webhook URL'), { status: 400 });
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw Object.assign(new Error('Webhook URL must use http or https'), { status: 400 });
  }

  if (BLOCKED_HOSTNAMES.has(parsed.hostname)) {
    throw Object.assign(new Error('Webhook URL cannot target localhost'), { status: 400 });
  }

  // Block private RFC 1918 IPs and loopback.
  if (/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|0\.|169\.254\.|\[::1\])/.test(parsed.hostname)) {
    throw Object.assign(new Error('Webhook URL cannot target private/internal IPs'), { status: 400 });
  }
}

export const webhookService = {
  list() {
    return Webhook.find().sort({ createdAt: -1 }).lean();
  },

  create(body) {
    if (body.url) validateWebhookUrl(body.url);
    return Webhook.create(body);
  },

  update(id, body) {
    if (body.url) validateWebhookUrl(body.url);
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
