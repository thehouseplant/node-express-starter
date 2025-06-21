import app from './app';
import config from './config/config';
import { Pool } from 'pg';
import Redis from 'ioredis';

// Initialize PostgreSQL pool
const pool = new Pool({
  user: config.database.user,
  host: config.database.host,
  database: config.database.database,
  password: config.database.password,
  port: config.database.port,
});

// Initialize Redis client
const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
});

// Handle Redis connection errors
redisClient.on('error', (error) => {
  console.error('Redis client error', error);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

app.listen(config.port, async () => {
  console.log(`Server running on port ${config.port}`);
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL database');

    // Create employees table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL
      );
    `);

    console.log('Employees table exists');
  } catch (error) {
    console.error('Database connection error', error);
    process.exit(1); // Exit if database connection fails
  }
});

// Make the database pool and Redis client accessible to controllers
app.locals.dbPool = pool;
app.locals.redisClient = redisClient;
