import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  database: {
    user?: string;
    host?: string;
    database?: string;
    password?: string;
    port?: number;
  };
  redis: {
    host?: string;
    port?: number;
    password?: string;
  };
  rateLimit: {
    windowMs: number;
    max: number;
    message: string;
  };
  cors: {
    allowedOrigins: string[];
  };
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: Number(process.env.RATE_LIMIT_MAX) || 100, // Limit IP address to 100 requests
    message: process.env.RATE_LIMIT_MESSAGE || 'Too many requests from this IP address, please try again later',
  },
  cors: {
    allowedOrigins: process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
  },
};

export default config;
