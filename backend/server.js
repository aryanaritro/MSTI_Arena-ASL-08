import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { connectDatabase, getDatabaseStatus } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

export function createApp() {
  const app = express();
  const allowedOrigins = (process.env.CLIENT_URL ?? '').split(',').map((origin) => origin.trim()).filter(Boolean);
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin is not allowed by CORS'));
    }
  }));
  app.use(express.json({ limit: '100kb' }));
  app.get('/api/health', (_req, res) => {
    const database = getDatabaseStatus();
    const connected = database === 'connected';
    res.status(connected ? 200 : 503).json({ status: connected ? 'ok' : 'unavailable', server: 'running', database });
  });
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

export async function startServer() {
  const port = Number(process.env.PORT) || 5000;
  try {
    await connectDatabase();
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    process.exitCode = 1;
    return null;
  }
  const app = createApp();
  const server = app.listen(port, () => console.log(`WAQT API listening on port ${port}`));
  const shutdown = async () => {
    server.close();
    await mongoose.disconnect();
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
  return server;
}

if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1]) {
  await startServer();
}
