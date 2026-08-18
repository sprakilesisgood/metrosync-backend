const express = require('express');
const { getStations } = require('../controllers/stationController');

const router = express.Router();

// GET /api/v1/stations  (public)
router.get('/', getStations);

module.exports = router;
