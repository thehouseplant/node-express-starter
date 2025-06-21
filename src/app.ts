import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import employeeRoutes from './routes/employeeRoutes';

const app = express();

// Initialize helmet
app.use(helmet());

// Express JSON parser
app.use(express.json());

// Enable Gzip compression
app.use(compression());

// Import routes
app.use('/api/v1/employees', employeeRoutes);

export default app;
