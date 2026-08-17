import { NODE_ENV } from '../config/env.js';

// Central Express error handler - return JSON errors, log server-side.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error('[error]', err.message);
  // Mongoose validation / bad-id errors are client mistakes, not server bugs.
  let status = err.status ?? 500;
  if (err.name === 'ValidationError' || err.name === 'CastError') status = 400;
  res.status(status).json({
    error: err.message ?? 'Internal server error',
    ...(NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
}
