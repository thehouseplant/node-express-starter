import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Generate a unique request ID for tracing (if not already provided)
  const requestId = req.headers['x-request-id'] || Math.random().toString(36).substring(2, 15);
  (req as any).requestId = requestId; // Attach the ID to the request

  logger.info('Incoming Request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    requestId: requestId,
  });

  // Log response details for request
  res.on('finish', () => {
    logger.info('Request Finished', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      contentLength: res.get('Content-Length'),
      responseTime: res.get('X-Response-Time'),
      requestId: requestId,
    });
  });

  next();
};

export default requestLogger;
