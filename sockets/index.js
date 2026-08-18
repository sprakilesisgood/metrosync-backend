const { Server } = require('socket.io');
const { registerStationHandlers } = require('./stationSocket');

// wrap the http server, wire up handlers on each connection
function initSockets(httpServer) {
  const origin = process.env.CLIENT_ORIGIN || '*';
  const io = new Server(httpServer, {
    cors: { origin: origin === '*' ? '*' : origin.split(','), methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    registerStationHandlers(io, socket);
  });

  return io;
}

module.exports = initSockets;
