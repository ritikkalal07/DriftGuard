import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/supabase.js';
import errorHandler from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import suggestionRoutes from './routes/suggestionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Test Supabase connection
testConnection().catch(err => {
  console.error('Failed to connect to Supabase:', err);
});

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'DriftGuard API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'Supabase PostgreSQL'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to DriftGuard API',
    version: '1.0.0',
    database: 'Supabase PostgreSQL',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      projects: '/api/projects',
      scans: '/api/scans',
      reports: '/api/reports',
      suggestions: '/api/suggestions',
      dashboard: '/api/dashboard',
      settings: '/api/settings'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server only if not in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database: Supabase PostgreSQL`);
  });
}

export default app;

// Made with Bob
