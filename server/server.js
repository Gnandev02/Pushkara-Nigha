import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Route imports
import authRoutes from './routes/authRoutes.js';
import ghatRoutes from './routes/ghatRoutes.js';
import userRoutes from './routes/userRoutes.js';
import monitoringRoutes from './routes/monitoringRoutes.js';
import officerRoutes from './routes/officerRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import cameraRoutes from './routes/cameraRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json());

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/ghats', ghatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/officers', officerRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/cameras', cameraRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------
app.use((err, _req, res, _next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n🚀 Pushkara Nigha Backend API Server`);
  console.log(`   Listening on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
