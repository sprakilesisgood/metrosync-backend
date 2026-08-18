const express = require('express');
const { getForStation, createForStation } = require('../controllers/announcementController');
const requireAdmin = require('../middleware/requireAdmin');
const { createAnnouncementRules, stationIdParam } = require('../middleware/validators');

// Mounted at /api/v1/stations
const router = express.Router();

// GET  /api/v1/stations/:id/announcements  (public, paginated/filtered)
router.get('/:id/announcements', stationIdParam, getForStation);

// POST /api/v1/stations/:id/announcements  (admin only)
router.post('/:id/announcements', requireAdmin, createAnnouncementRules, createForStation);

module.exports = router;
