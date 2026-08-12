// Seed telemetry data (Sowmya, Day 1-2).
// Run: npm run seed
import { connectDB } from '../config/db.js';
import { telemetryService } from '../services/telemetryService.js';

const DEVICES = [
  { deviceId: 'turbine-001', deviceType: 'turbine' },
  { deviceId: 'turbine-002', deviceType: 'turbine' },
  { deviceId: 'sensor-temp-101', deviceType: 'temperature' },
];

function randomPoint(device, ts) {
  return {
    ts,
    deviceId: device.deviceId,
    deviceType: device.deviceType,
    fields: {
      temperature: 60 + Math.random() * 30, // °C
      pressure: 90 + Math.random() * 20,    // kPa
      vibration: Math.random() * 10,        // mm/s
      rpm: 2800 + Math.random() * 400,
    },
  };
}

async function main() {
  await connectDB();
  const points = [];
  const now = Date.now();
  for (let i = 0; i < 1000; i++) {
    const device = DEVICES[i % DEVICES.length];
    points.push(randomPoint(device, new Date(now - i * 1000)));
  }
  const inserted = await telemetryService.insertBatch(points);
  console.log(`[seed] inserted ${inserted} telemetry points`);
  process.exit(0);
}

main().catch((err) => {
  console.error('[seed] failed:', err.message);
  process.exit(1);
});
