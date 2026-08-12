// Mock telemetry generator (Week 1, testing).
// Streams fake sensor payloads to the ingest API.
// Run: npm run mock -- http://localhost:4000/api/ingest
import { MONGODB_URI } from '../config/env.js';

const TARGET = process.argv[2] ?? 'http://localhost:4000/api/ingest';
const INTERVAL_MS = 1000;

const devices = [
  { deviceId: 'turbine-001', deviceType: 'turbine' },
  { deviceId: 'sensor-temp-101', deviceType: 'temperature' },
];

function nextPoint() {
  const device = devices[Math.floor(Math.random() * devices.length)];
  return {
    ts: new Date().toISOString(),
    deviceId: device.deviceId,
    deviceType: device.deviceType,
    fields: {
      temperature: 60 + Math.random() * 30,
      pressure: 90 + Math.random() * 20,
      vibration: Math.random() * 10,
      rpm: 2800 + Math.random() * 400,
    },
  };
}

console.log(`[mock] streaming to ${TARGET} every ${INTERVAL_MS}ms (Ctrl+C to stop)`);
console.log(`[mock] MongoDB URI in use: ${MONGODB_URI}`);

setInterval(async () => {
  try {
    const batch = Array.from({ length: 10 }, nextPoint);
    const res = await fetch(TARGET, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points: batch }),
    });
    const json = await res.json();
    console.log(`[mock] sent ${batch.length} points -> ${res.status}`, json);
  } catch (err) {
    console.error('[mock] request failed:', err.message);
  }
}, INTERVAL_MS);
