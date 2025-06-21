import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import employeeRoutes from './routes/employeeRoutes';
import requestLogger from './middlewares/requestLogger';

const app = express();

// Initialize helmet
app.use(helmet());

// Express JSON parser
app.use(express.json());

// Enable Gzip compression
app.use(compression());

// Add request logging middleware
app.use(requestLogger);

// Import routes
app.use('/api/v1/employees', employeeRoutes);

export default app;
