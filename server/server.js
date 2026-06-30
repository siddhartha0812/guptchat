/**
 * GuptChat — MERN backend (Express + Socket.IO)
 * No message storage anywhere. In-memory rooms only.
 * Server never decrypts anything — clients send ciphertext, server relays it.
 */
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

const httpLimiter = rateLimit({ windowMs: 60_000, max: 60 });
app.use(httpLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', rooms: rooms.size });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://guptchat.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ---- In-memory room state. Never written to disk or a DB. ----
// rooms: Map<roomCode, Map<socketId, { nickname }>>
const rooms = new Map();

const MAX_NICK_LEN = 24;
const MAX_ROOM_LEN = 32;
const MSG_WINDOW_MS = 10_000;
const MSG_MAX_PER_WINDOW = 30;

function sanitize(str, maxLen) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\u0000-\u001F\u007F<>]/g, '').trim().slice(0, maxLen);
}

function roomParticipants(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return [];
  return [...room.entries()].map(([id, v]) => ({ id, nickname: v.nickname }));
}

function destroyRoomIfEmpty(roomCode) {
  const room = rooms.get(roomCode);
  if (room && room.size === 0) {
    rooms.delete(roomCode);
    console.log(`[room destroyed] ${roomCode}`);
  }
}

io.on('connection', (socket) => {
  let msgTimestamps = [];

  socket.on('join', ({ nickname, roomCode } = {}) => {
    nickname = sanitize(nickname, MAX_NICK_LEN);
    roomCode = sanitize(roomCode, MAX_ROOM_LEN).toUpperCase();

    if (!nickname || !roomCode) {
      socket.emit('error_message', { message: 'Nickname and room passcode are required.' });
      return;
    }
    if (socket.data.roomCode) return; // already in a room

    socket.data.nickname = nickname;
    socket.data.roomCode = roomCode;
    socket.join(roomCode);

    if (!rooms.has(roomCode)) {
      rooms.set(roomCode, new Map());
      console.log(`[room created] ${roomCode}`);
    }
    const room = rooms.get(roomCode);
    room.set(socket.id, { nickname });

    socket.emit('joined', {
      roomCode,
      selfId: socket.id,
      onlineCount: room.size,
      participants: roomParticipants(roomCode),
    });

    socket.to(roomCode).emit('system', {
      event: 'join',
      nickname,
      onlineCount: room.size,
    });

    io.to(roomCode).emit('presence', {
      onlineCount: room.size,
      participants: roomParticipants(roomCode),
    });
  });

  socket.on('message', ({ payload } = {}) => {
    const roomCode = socket.data.roomCode;
    if (!roomCode) return;
    if (!payload || typeof payload.ciphertext !== 'string' || typeof payload.iv !== 'string') return;

    const now = Date.now();
    msgTimestamps = msgTimestamps.filter((t) => now - t < MSG_WINDOW_MS);
    if (msgTimestamps.length >= MSG_MAX_PER_WINDOW) {
      socket.emit('error_message', { message: 'Rate limit exceeded. Please slow down.' });
      return;
    }
    msgTimestamps.push(now);

    socket.to(roomCode).emit('message', {
      senderId: socket.id,
      nickname: socket.data.nickname,
      payload,
      ts: Date.now(),
    });
  });

  socket.on('typing', ({ isTyping } = {}) => {
    const roomCode = socket.data.roomCode;
    if (!roomCode) return;
    socket.to(roomCode).emit('typing', {
      senderId: socket.id,
      nickname: socket.data.nickname,
      isTyping: !!isTyping,
    });
  });

  function leaveRoom() {
    const roomCode = socket.data.roomCode;
    if (!roomCode) return;
    const room = rooms.get(roomCode);
    if (room) {
      room.delete(socket.id);
      socket.to(roomCode).emit('system', {
        event: 'leave',
        nickname: socket.data.nickname,
        onlineCount: room.size,
      });
      io.to(roomCode).emit('presence', {
        onlineCount: room.size,
        participants: roomParticipants(roomCode),
      });
      destroyRoomIfEmpty(roomCode);
    }
    socket.data.roomCode = null;
    socket.data.nickname = null;
  }

  socket.on('leave', leaveRoom);
  socket.on('disconnect', leaveRoom);
});

server.listen(PORT, () => {
  console.log(`GuptChat MERN server running on port ${PORT}`);
  console.log('No database writes. No message storage. In-memory rooms only.');
});
