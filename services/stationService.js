const Station = require('../models/Station');

// db access lives here, not in the controller.
// stations sorted by line, then by order along the line.
function getAllStations() {
  return Station.find().sort({ line: 1, order: 1 }).lean();
}

module.exports = { getAllStations };
