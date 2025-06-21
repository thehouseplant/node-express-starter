import { Request, Response, NextFunction } from 'express';
import { employees, Employee } from '../models/employee';
import { Pool } from 'pg';

// Helper function to get the local database pool
const getPool = (res: Response): Pool => res.app.locals.dbPool;

// Create an employee
export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, title } = req.body;
    const pool = getPool(res);
    const result = await pool.query(
      'INSERT INTO employees (name, title) VALUES ($1, $2) RETURNING id, name, title',
      [name, title]
    );
    const newEmployee: Employee = result.rows[0];
    res.status(201).json(newEmployee);
  } catch (error) {
    next(error);
  }
};

// Read all employees
export const getEmployees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pool = getPool(res);
    const result = await pool.query('SELECT id, name, title FROM employees');
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
    const result = await pool.query('SELECT id, name, title FROM employees WHERE id = $1', [id]);
    const employee = result.rows[0];
    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }
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
    const result = await pool.query(
      'UPDATE employees SET name = $1, title = $2 WHERE id = $3 RETURNING id, name, title',
      [name, title, id]
    );
    const updatedEmployee = result.rows[0];
    if (!updatedEmployee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }
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
    const result = await pool.query(
      'DELETE FROM employees WHERE id = $1 RETURNING id, name, title',
      [id]
    );
    const deletedEmployee = result.rows[0];
    if (!deletedEmployee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }
    res.json(deletedEmployee);
  } catch (error) {
    next(error);
  }
};
