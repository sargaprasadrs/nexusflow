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

export default mongoose;
