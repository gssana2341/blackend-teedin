import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes';
import { errorHandler } from './middleware/error-handler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Teedin Backend API',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api', router);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Teedin Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/*',
    },
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Teedin Backend API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/`);
});

export default app;
