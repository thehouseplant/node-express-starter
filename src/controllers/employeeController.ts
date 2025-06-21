import { Request, Response, NextFunction } from 'express';
import { employees, Employee } from '../models/employee';
import { Pool } from 'pg';
import Redis from 'ioredis';

// Helper functions to get the local database pool and Redis client
const getPool = (res: Response): Pool => res.app.locals.dbPool;
const getRedisClient = (res: Response): Redis => res.app.locals.redisClient;

// Define Redis client caching configuration
const ALL_EMPLOYEES_CACHE_KEY = 'employees:all';
const EMPLOYEE_CACHE_KEY_PREFIX = 'employee:id:';
const CACHE_EXPIRATION_SECONDS = 3600; // Cache for 1 hour

// Create an employee
export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, title } = req.body;
    const pool = getPool(res);
    const redisClient = getRedisClient(res);

    const result = await pool.query(
      'INSERT INTO employees (name, title) VALUES ($1, $2) RETURNING id, name, title',
      [name, title]
    );
    const newEmployee: Employee = result.rows[0];

    // Invalidate the cache for all employees and new employee
    await redisClient.del(ALL_EMPLOYEES_CACHE_KEY);
    await redisClient.del(`${EMPLOYEE_CACHE_KEY_PREFIX}${newEmployee.id}`);

    // Return final result
    res.status(201).json(newEmployee);
  } catch (error) {
    next(error);
  }
};

// Read all employees
export const getEmployees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pool = getPool(res);
    const redisClient = getRedisClient(res);

    // Try to get data from cache
    const cachedEmployees = await redisClient.get(ALL_EMPLOYEES_CACHE_KEY);
    if (cachedEmployees) {
      return res.json(JSON.parse(cachedEmployees));
    }

    // If not in the cache, fetch from Postgres
    const result = await pool.query('SELECT id, name, title FROM employees');
    const employees: Employee[] = result.rows;

    // Store results in cache
    await redisClient.setex(
      ALL_EMPLOYEES_CACHE_KEY,
      CACHE_EXPIRATION_SECONDS,
      JSON.stringify(employees)
    );

    // Return final result
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// Read single employee
export const getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const pool = getPool(res);
    const redisClient = getRedisClient(res);
    const cacheKey = `${EMPLOYEE_CACHE_KEY_PREFIX}${id}`;

    // Try to get data from cache
    const cachedEmployee = await redisClient.get(cacheKey);
    if (cachedEmployee) {
      return res.json(JSON.parse(cachedEmployee));
    }

    // If not in the cache, fetch from Postgres
    const result = await pool.query('SELECT id, name, title FROM employees WHERE id = $1', [id]);
    const employee = result.rows[0];

    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }

    // Store result in cache
    await redisClient.setex(
      ALL_EMPLOYEES_CACHE_KEY,
      CACHE_EXPIRATION_SECONDS,
      JSON.stringify(employee)
    );

    // Return final result
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

// Update an employee
export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, title } = req.body;
    const pool = getPool(res);
    const redisClient = getRedisClient(res);

    const result = await pool.query(
      'UPDATE employees SET name = $1, title = $2 WHERE id = $3 RETURNING id, name, title',
      [name, title, id]
    );
    const updatedEmployee = result.rows[0];

    if (!updatedEmployee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }

    // Invalidate relevant cache entries
    await redisClient.del(ALL_EMPLOYEES_CACHE_KEY);
    await redisClient.del(`${EMPLOYEE_CACHE_KEY_PREFIX}${id}`);

    // Return final result
    res.json(updateEmployee);
  } catch (error) {
    next(error);
  }
};

// Delete an employee
export const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const pool = getPool(res);
    const redisClient = getRedisClient(res);

    const result = await pool.query(
      'DELETE FROM employees WHERE id = $1 RETURNING id, name, title',
      [id]
    );
    const deletedEmployee = result.rows[0];

    if (!deletedEmployee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }

    // Invalidate relevant cache entries
    await redisClient.del(ALL_EMPLOYEES_CACHE_KEY);
    await redisClient.del(`${EMPLOYEE_CACHE_KEY_PREFIX}${id}`);

    // Return final result
    res.json(deletedEmployee);
  } catch (error) {
    next(error);
  }
};
