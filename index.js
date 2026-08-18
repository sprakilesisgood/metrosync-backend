require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');

const connectDB = require('./db');
const initSockets = require('./sockets');
const stationRoutes = require('./routes/stationRoutes');
const authRoutes = require('./routes/authRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// express app — exported for tests, doesn't listen when just required
const app = express();
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || '*') }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // demo frontend

app.get('/health', (req, res) => res.status(200).json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/v1/stations', stationRoutes);
app.use('/api/v1/stations', announcementRoutes); // handles /:id/announcements
app.use('/api/v1/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);

// boot the server (only when run directly, not under tests)
async function start() {
  await connectDB();
  const server = http.createServer(app);
  const io = initSockets(server);
  app.set('io', io); // controllers grab io off req.app
  const port = process.env.PORT || 4000;
  server.listen(port, () => console.log(`MetroSync API on :${port}`));
  return server;
}

if (require.main === module) {
  start().catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
}

module.exports = app;
module.exports.start = start;
