import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
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

// Configure CORS
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (`curl` requests)
    if (!origin) return callback(null, true);
    if (config.cors.allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'], // Allowed headers
  credentials: true, // Allow cookies to be sent with requests
};

// Initialize helmet
app.use(helmet());

// Express JSON parser
app.use(express.json());

// Enable Gzip compression
app.use(compression());

// Enable rate limiting for all requests
app.use(apiLimiter);

// Enable CORS middleware
app.use(cors(corsOptions));

// Add request logging middleware
app.use(requestLogger);

// Import routes
app.use('/api/v1/employees', employeeRoutes);

// Add error handling middleware
app.use(errorHandler);

export default app;
