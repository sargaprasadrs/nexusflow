import 'dotenv/config';

export const PORT = Number(process.env.PORT ?? 4000);
export const MONGODB_URI =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nexusflow';
export const NODE_ENV = process.env.NODE_ENV ?? 'development';
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';
export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ?? '';
