// station rooms: joins, viewer counts, presence + announcement broadcasts.

const viewers = new Map(); // stationId -> count
const roomName = (stationId) => `station:${stationId}`;

function setCount(stationId, delta) {
  const next = Math.max(0, (viewers.get(stationId) || 0) + delta); // don't go negative
  viewers.set(stationId, next);
  return next;
}

function emitPresence(io, stationId) {
  io.to(roomName(stationId)).emit('presenceUpdate', {
    stationId,
    viewers: viewers.get(stationId) || 0,
  });
}

// push a saved announcement to everyone in that station's room
function broadcastAnnouncement(io, stationId, announcement) {
  io.to(roomName(stationId)).emit('announcement', announcement);
}

// hook up one connected socket
function registerStationHandlers(io, socket) {
  let current = null; // station this socket is watching right now

  socket.on('joinStation', (stationId) => {
    if (!stationId || stationId === current) return;

    if (current) {
      socket.leave(roomName(current));
      setCount(current, -1);
      emitPresence(io, current);
    }

    current = String(stationId);
    socket.join(roomName(current));
    setCount(current, +1);
    emitPresence(io, current);
  });

  socket.on('disconnect', () => {
    if (current) {
      setCount(current, -1);
      emitPresence(io, current);
      current = null;
    }
  });
}

module.exports = { registerStationHandlers, broadcastAnnouncement, viewers };
