// Small structured logger (Week 1, Chandra). Swap for pino/winston later if needed.
const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };

function log(level, message, meta) {
  const entry = {
    level,
    ts: new Date().toISOString(),
    message,
    ...(meta ?? {}),
  };
  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (m, meta) => log('debug', m, meta),
  info: (m, meta) => log('info', m, meta),
  warn: (m, meta) => log('warn', m, meta),
  error: (m, meta) => log('error', m, meta),
  level: (name) => LEVELS[name] ?? 20,
};
