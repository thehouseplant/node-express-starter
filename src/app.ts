import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import employeeRoutes from './routes/employeeRoutes';
import requestLogger from './middlewares/requestLogger';
import errorHandler from './middlewares/errorHandler';
import config from './config/config';

const app = express();

// Configure rate limiting
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: config.rateLimit.message,
  standardHeaders: true, // Enable `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Initialize helmet
app.use(helmet());

// Express JSON parser
app.use(express.json());

// Enable Gzip compression
app.use(compression());

// Enable rate limiting for all requests
app.use(apiLimiter);

// Add request logging middleware
app.use(requestLogger);

// Import routes
app.use('/api/v1/employees', employeeRoutes);

// Add error handling middleware
app.use(errorHandler);

export default app;
