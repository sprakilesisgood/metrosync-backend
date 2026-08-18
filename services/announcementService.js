const Announcement = require('../models/Announcement');

// a station's announcements, newest first, with paging + optional filters
async function listByStation(stationId, { page = 1, limit = 20, type, since } = {}) {
  page = Math.max(1, parseInt(page, 10) || 1);
  limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const query = { station: stationId };
  if (type) query.type = type;
  if (since) query.createdAt = { $gte: new Date(since) };

  const [items, total] = await Promise.all([
    Announcement.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Announcement.countDocuments(query),
  ]);

  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

// save it. the socket broadcast happens in the controller, only if this succeeds.
function create(stationId, { text, type }) {
  return Announcement.create({ station: stationId, text, type });
}

module.exports = { listByStation, create };
