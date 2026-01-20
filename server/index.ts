// server/index.ts
import express from 'express';
import { registerRoutes } from './routes';
import { createServer } from 'http';
import { db } from './db';
import taskRoutes from './routes/tasks';
import authRoutes from './routes/auth';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { serveStatic } from './static';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5000', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Serve built client in production
serveStatic(app);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start the server
const PORT = parseInt(process.env.PORT || '5001', 10);
httpServer.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
  console.log(`API Documentation: http://127.0.0.1:${PORT}/api-docs`);
});
