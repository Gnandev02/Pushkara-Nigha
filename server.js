import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error in request handling:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Attach Socket.IO to the HTTP server
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Store Socket.IO instance globally so Next.js API Routes can access it
  global.io = io;

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join room for specific camera feeds if needed
    socket.on('join_camera', (cameraId) => {
      socket.join(cameraId);
      console.log(`📹 Client ${socket.id} joined feed: ${cameraId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  server.listen(port, () => {
    console.log(`\n🚀 AI Crowd Analytics Platform Running on http://${hostname}:${port}`);
    console.log(`📡 WebSocket / Socket.IO Server bound to port ${port}\n`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
