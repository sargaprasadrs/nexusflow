// Security middleware (Week 2 hardening).
// Lightweight rate limiter, security headers, input sanitization, and
// NoSQL injection prevention — no external dependencies needed.

/**
 * Express middleware factory. Limits `max` requests per `windowMs` for each
 * client IP. Returns 429 when exceeded.
 */
export function rateLimit({ windowMs = 60_000, max = 100 } = {}) {
  const rateLimitBuckets = new Map(); // ip -> { count, resetAt } per limiter instance

  return (req, res, next) => {
    const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    const now = Date.now();
    let bucket = rateLimitBuckets.get(ip);

    if (!bucket || now > bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      rateLimitBuckets.set(ip, bucket);
    }

    bucket.count++;

    // Set standard rate-limit headers.
    res.set('X-RateLimit-Limit', String(max));
    res.set('X-RateLimit-Remaining', String(Math.max(0, max - bucket.count)));
    res.set('X-RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > max) {
      return res.status(429).json({ error: 'Too many requests, slow down' });
    }

    next();
  };
}


// ---------------------------------------------------------------------------
// 2. Security headers — sets common protective headers.
// ---------------------------------------------------------------------------
export function securityHeaders(_req, res, next) {
  // Prevent MIME sniffing.
  res.set('X-Content-Type-Options', 'nosniff');
  // Clickjacking protection.
  res.set('X-Frame-Options', 'DENY');
  // XSS filter (legacy browsers).
  res.set('X-XSS-Protection', '1; mode=block');
  // Referrer policy.
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Prevent embedding in iframes on other origins.
  res.set('X-Permitted-Cross-Domain-Policies', 'none');
  // HSTS (only meaningful over HTTPS, but harmless over HTTP).
  res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // Remove X-Powered-By.
  res.removeHeader('X-Powered-By');
  next();
}

// ---------------------------------------------------------------------------
// 3. NoSQL injection guard — rejects request bodies / query params that
//    contain MongoDB operators ($where, $gt, $regex, etc.) in string values.
// ---------------------------------------------------------------------------
const MONGO_OPERATORS = /^\$/;

function containsMongoOperator(value) {
  if (typeof value === 'string' && MONGO_OPERATORS.test(value)) return true;
  if (Array.isArray(value)) return value.some(containsMongoOperator);
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      if (MONGO_OPERATORS.test(key)) return true;
      if (containsMongoOperator(value[key])) return true;
    }
  }
  return false;
}

export function noSqlInjectionGuard(req, _res, next) {
  // Check body.
  if (req.body && containsMongoOperator(req.body)) {
    return res.status(400).json({ error: 'Invalid input: MongoDB operators not allowed' });
  }
  // Check query params.
  if (req.query && containsMongoOperator(req.query)) {
    return res.status(400).json({ error: 'Invalid query: MongoDB operators not allowed' });
  }
  next();
}

// ---------------------------------------------------------------------------
// 4. Input size limiter — rejects oversized request bodies beyond the
//    Express json() limit, providing a clearer error message.
// ---------------------------------------------------------------------------
export function bodySizeGuard(maxBytes = 5 * 1024 * 1024) {
  return (req, res, next) => {
    const contentLength = Number(req.headers['content-length'] ?? 0);
    if (contentLength > maxBytes) {
      return res.status(413).json({
        error: `Payload too large (max ${Math.round(maxBytes / 1024)} KB)`,
      });
    }
    next();
  };
}

// ---------------------------------------------------------------------------
// 5. Field validation helpers — reusable checkers for common patterns.
// ---------------------------------------------------------------------------
export function requireFields(...fields) {
  return (req, res, next) => {
    const missing = fields.filter((f) => {
      const val = req.body?.[f];
      return val === undefined || val === null || val === '';
    });
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }
    next();
  };
}

/**
 * Validate that a string parameter looks like a valid MongoDB ObjectId.
 * Prevents CastError noise from invalid IDs.
 */
export function validateObjectId(paramName = 'id') {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (id && !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ error: `Invalid ${paramName}: must be a 24-character hex string` });
    }
    next();
  };
}
