import mongoose from 'mongoose';
import { MONGODB_URI } from './env.js';

// MongoDB connection. Telemetry uses a Time-Series collection (MongoDB 5.0+),
// created via the Telemetry model - see src/models/Telemetry.js.
export async function connectDB(uri = MONGODB_URI) {
  mongoose.connection.on('error', (err) => {
    console.error('[db] connection error:', err.message);
  });
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log(`[db] connected to ${uri}`);
  return mongoose.connection;
}

// Snapshot of the current connection state, used by GET /api/health so the
// server can report 'degraded' while MongoDB is unreachable (server boots
// regardless - see server.js).
export function dbStatus() {
  const state = mongoose.connection.readyState; // 0..3
  const names = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return { ready: state === 1, state: names[state] ?? 'unknown' };
}

export default mongoose;
