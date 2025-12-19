import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { config } from './config/env';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import routes from './routes';
import { logger } from './utils/logger';

const app: Application = express();

/**
 * Security Middleware
 */
app.use(helmet());
app.use(corsMiddleware);

/**
 * Body Parsing Middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

/**
 * Compression Middleware
 */
app.use(compression());

/**
 * Logging Middleware
 */
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    skip: (req: Request) => req.url === '/health',
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }));
}

/**
 * Rate Limiting
 */
app.use('/api/', rateLimiter);

/**
 * Health Check Endpoint
 */
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
  });
});

/**
 * API Routes
 */
app.use(`/api/${config.apiVersion}`, routes);

/**
 * Root Endpoint
 */
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'AGM Store Builder API',
    version: config.apiVersion,
    status: 'running',
    documentation: `${config.frontendUrl}/docs`,
  });
});

/**
 * 404 Handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      path: req.originalUrl,
      method: req.method,
    },
  });
});

/**
 * Global Error Handler (must be last)
 */
app.use(errorHandler);

export default app;
