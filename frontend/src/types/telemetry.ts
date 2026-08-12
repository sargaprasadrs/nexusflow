// Telemetry types shared by charts, WebSocket streams, and the REST API.
export interface TelemetryPoint {
  ts: string; // ISO timestamp
  deviceId: string;
  deviceType: string;
  fields: Record<string, number>;
}

export interface TelemetryQueryResult {
  count: number;
  rows: Array<{
    ts: string;
    meta: { deviceId: string; deviceType: string };
    fields: Record<string, number>;
  }>;
}

export interface AlertEvent {
  id?: string;
  ruleId: string;
  deviceId: string;
  value: unknown;
  status: 'open' | 'resolved' | 'deduped';
  triggeredAt: string;
}
