import express from 'express';
import employeeRoutes from './routes/employeeRoutes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/v1/employees', employeeRoutes);

export default app;
