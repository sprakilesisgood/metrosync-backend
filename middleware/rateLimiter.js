const rateLimit = require('express-rate-limit');

// slow down brute-force: cap login tries per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, try again later' },
});

module.exports = { loginLimiter };
