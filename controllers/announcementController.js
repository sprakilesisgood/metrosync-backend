const announcementService = require('../services/announcementService');
const { broadcastAnnouncement } = require('../sockets/stationSocket');

// GET /api/v1/stations/:id/announcements
async function getForStation(req, res, next) {
  try {
    const { page, limit, type, since } = req.query;
    const result = await announcementService.listByStation(req.params.id, { page, limit, type, since });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/stations/:id/announcements  (requireAdmin)
async function createForStation(req, res, next) {
  try {
    const { text, type } = req.body;
    // save first, broadcast only if the write went through
    const announcement = await announcementService.create(req.params.id, { text, type });
    const io = req.app.get('io');
    if (io) broadcastAnnouncement(io, req.params.id, announcement);
    res.status(201).json(announcement);
  } catch (err) {
    next(err);
  }
}

module.exports = { getForStation, createForStation };
