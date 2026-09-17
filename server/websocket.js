// =====================================================================
// CogniFlow AI: Real-Time WebSocket & Presence Gateway
// Powers live motivation ticker, peer rooms, and admin telemetry
// =====================================================================

const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.WS_PORT || 4000;

// In-Memory Presence Registry
const activeUsers = new Map(); // socketId -> { userId, username, track, college }
const roomCounts = {
  'dsa-track': 68,
  'sql-track': 45,
  'system-design-track': 29,
};

// Periodic simulated live solves to motivate students in real time
const colleges = ['IET Lucknow', 'BIET Jhansi', 'KNIT Sultanpur', 'AKGEC Ghaziabad', 'Galgotias'];
const mockNames = ['Ankit Sharma', 'Shreya Saxena', 'Mohd. Zeeshan', 'Neha Tiwari', 'Ayush Bajpai', 'Divya Patel'];
const mockChallenges = [
  'Two Sum II (Sorted)',
  'Binary Tree Zigzag Traversal',
  'Inner Join: Students & Courses',
  'Distributed Rate Limiter Design',
  'Postgres Query Index Optimization',
];

io.on('connection', (socket) => {
  console.log(`[WebSocket] New peer connected: ${socket.id}`);

  // 1. Peer Joins Platform / Track
  socket.on('join_track', (data) => {
    const { userId, username, track, college } = data;
    activeUsers.set(socket.id, { userId, username, track, college });
    socket.join(track);

    if (roomCounts[track] !== undefined) {
      roomCounts[track]++;
    }

    // Broadcast updated live presence
    io.emit('presence_update', {
      totalOnline: 142 + activeUsers.size,
      roomCounts,
      latestJoin: { username, college, track, timestamp: new Date().toLocaleTimeString() },
    });
  });

  // 2. Peer Solves a Challenge (Real-Time Motivation Broadcast)
  socket.on('challenge_solved', (solveData) => {
    console.log(`[WebSocket] Solve Event: ${solveData.username} solved ${solveData.challengeTitle}`);
    io.emit('live_solve_broadcast', {
      ...solveData,
      timestamp: 'Just now',
    });
  });

  // 3. Peer Study Room Chat / Interaction
  socket.on('room_message', (msgData) => {
    const { track, text, sender } = msgData;
    io.to(track).emit('room_message_broadcast', {
      sender,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  });

  // 4. Handle Disconnect
  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user && roomCounts[user.track]) {
      roomCounts[user.track] = Math.max(0, roomCounts[user.track] - 1);
    }
    activeUsers.delete(socket.id);
    io.emit('presence_update', {
      totalOnline: 142 + activeUsers.size,
      roomCounts,
    });
    console.log(`[WebSocket] Peer disconnected: ${socket.id}`);
  });
});

// Broadcast periodic peer motivation ticker every 15 seconds
setInterval(() => {
  const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
  const randomCollege = colleges[Math.floor(Math.random() * colleges.length)];
  const randomChallenge = mockChallenges[Math.floor(Math.random() * mockChallenges.length)];
  const randomXp = [40, 50, 60, 100][Math.floor(Math.random() * 4)];
  const randomMs = Math.floor(Math.random() * 15) + 2;

  io.emit('live_solve_broadcast', {
    username: randomName,
    collegeName: randomCollege,
    challengeTitle: randomChallenge,
    xpEarned: randomXp,
    executionTime: `${randomMs}ms`,
    timestamp: 'Just now',
  });
}, 15000);

// Admin health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    activeConnections: activeUsers.size,
    totalSimulatedOnline: 142 + activeUsers.size,
    timestamp: new Date().toISOString(),
  });
});

server.listen(PORT, () => {
  console.log(`🚀 [WebSocket Gateway] Real-Time Engine active on port ${PORT}`);
});
