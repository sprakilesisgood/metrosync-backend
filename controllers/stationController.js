const stationService = require('../services/stationService');

// GET /api/v1/stations
async function getStations(req, res, next) {
  try {
    const stations = await stationService.getAllStations();
    res.status(200).json(stations);
  } catch (err) {
    next(err);
  }
}

module.exports = { getStations };
