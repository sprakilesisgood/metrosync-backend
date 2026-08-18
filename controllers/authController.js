const authService = require('../services/authService');

// POST /api/v1/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
