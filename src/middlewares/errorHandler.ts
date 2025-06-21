import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'An unexpected error has occurred.';

  logger.error('API Error', {
    statusCode: statusCode,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack, // Hide stack trace in production
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    requestId: (req as any).requestId, // Use request ID from other middleware
  });

  res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An internal server error occurred.'
      : message,
  });
};

export default errorHandler;
