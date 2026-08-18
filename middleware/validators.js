const { body, param, validationResult } = require('express-validator');

// bail out with 400 before we hit the controller/db if input is bad
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }
  next();
}

const loginRules = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isString().notEmpty().withMessage('Password required'),
  handleValidation,
];

const createAnnouncementRules = [
  param('id').isMongoId().withMessage('Invalid station id'),
  body('text').isString().trim().notEmpty().withMessage('Announcement text required'),
  body('type').optional().isIn(['info', 'delay', 'alert']).withMessage('Invalid type'),
  handleValidation,
];

const stationIdParam = [
  param('id').isMongoId().withMessage('Invalid station id'),
  handleValidation,
];

module.exports = { handleValidation, loginRules, createAnnouncementRules, stationIdParam };
