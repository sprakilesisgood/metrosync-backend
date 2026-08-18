const express = require('express');
const { login } = require('../controllers/authController');
const { loginRules } = require('../middleware/validators');
const { loginLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// POST /api/v1/auth/login  — validate + rate-limit, then authenticate.
router.post('/login', loginLimiter, loginRules, login);

module.exports = router;
