const rateLimit = require("express-rate-limit");

// General API rate limit
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Default rate limit from environment variables
const defaultLimit = createRateLimit(
  (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes default
  process.env.RATE_LIMIT_MAX_REQUESTS || 100, // 100 requests default
  "Too many requests from this IP, please try again later."
);

// Strict rate limit for authentication endpoints
const authLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts per window
  "Too many authentication attempts, please try again later."
);

// Looser rate limit for file uploads
const uploadLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  20, // 20 uploads per hour
  "Too many file uploads, please try again later."
);

module.exports = {
  defaultLimit,
  authLimit,
  uploadLimit,
  createRateLimit,
};
