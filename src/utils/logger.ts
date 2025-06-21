import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, align } = format;

// Custom format for console putput
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} ${level}: ${message}`;
  if (Object.keys(metadata).length) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp(),
    // Log JSON in production for easier parsing
    process.env.NODE_ENV === 'production' ? format.json() : logFormat
  ),
  transports: [
    new transports.Console({
      // For development, use pretty printing. For production, use raw JSON for parsing
      format: process.env.NODE_ENV === 'production' ? format.json() : combine(colorize(), align(), logFormat),
    }),
  ],
  exceptionHandlers: [
    new transports.Console(),
  ],
  rejectionHandlers: [
    new transports.Console(),
  ],
});

export default logger;
