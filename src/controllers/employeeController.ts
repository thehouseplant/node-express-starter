import { Request, Response, NextFunction } from 'express';
import { employees, Employee } from '../models/employee';

// Create an employee
export const createEmployee = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, title } = req.body;
    const newEmployee: Employee = { id: Date.now(), name, title };
    employees.push(newEmployee);
    res.status(201).json(newEmployee);
  } catch (error) {
    next(error);
  }
};

// Read all employees
export const getEmployees = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

// Read single employee
export const getEmployeeById = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const employee = employees.find((i) => i.id === id);
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
export const updateEmployee = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, title } = req.body;
    const employeeIndex = employees.findIndex((i) => i.id === id);
    if (employeeIndex === -1) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }
    employees[employeeIndex].name = name;
    employees[employeeIndex].title = title;
    res.json(employees[employeeIndex]);
  } catch (error) {
    next(error);
  }
};

// Delete an employee
export const deleteEmployee = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const employeeIndex = employees.findIndex((i) => i.id === id);
    if (employeeIndex === -1) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }
    const deletedEmployee = employees.splice(employeeIndex, 1)[0];
    res.json(deletedEmployee);
  } catch (error) {
    next(error);
  }
};
