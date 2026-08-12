import mongoose from 'mongoose';

// MongoDB Time-Series collection for high-frequency sensor data (Sowmya, Day 1-2).
//   ts    = measurement timestamp (timeField, indexed automatically)
//   meta  = deviceId + deviceType (metaField, indexed for filtering)
//   fields = sensor readings stored in `fields`
//
// Per MongoDB docs, Time-Series collections are created with db.createCollection;
// Mongoose does not support timeseries options natively, so we create the
// collection explicitly and attach a plain schema for reads.
const { Schema, connection } = mongoose;

const telemetrySchema = new Schema(
  {
    ts: { type: Date, required: true },
    meta: {
      deviceId: { type: String, required: true, index: true },
      deviceType: { type: String, required: true },
    },
    fields: { type: Schema.Types.Mixed, required: true }, // e.g. { temperature, pressure, vibration, rpm }
  },
  { strict: false, versionKey: false }
);

telemetrySchema.index({ 'meta.deviceId': 1, ts: -1 });

// Ensure the Time-Series collection exists before the model is used.
export async function ensureTelemetryCollection() {
  const collections = await connection.db.listCollections({ name: 'telemetry' }).toArray();
  if (collections.length === 0) {
    await connection.db.createCollection('telemetry', {
      timeseries: {
        timeField: 'ts',
        metaField: 'meta',
        granularity: 'seconds',
      },
    });
    console.log('[db] created Time-Series collection "telemetry"');
  }
}

export const Telemetry = mongoose.model('Telemetry', telemetrySchema, 'telemetry');
