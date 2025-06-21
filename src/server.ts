import app from './app';
import config from './config/config';
import { Pool } from 'pg';

const pool = new Pool({
  user: config.database.user,
  host: config.database.host,
  database: config.database.database,
  password: config.database.password,
  port: config.database.port,
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

// Make the database pool accessible to controllers
app.locals.dbPool = pool;
