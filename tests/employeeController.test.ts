import { Request, Response } from 'express';
import { getEmployees } from '../src/controllers/employeeController';
import { employees } from '../src/models/employee';

describe('Employee controller', () => {
  it('should return an empty array when no employees exist', () => {
    // Create mock objects for Request and Response
    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    // Ensure that our in-memory store is empty
    employees.length = 0;

    // Execute our controller function
    getEmployees(req, res, jest.fn());

    // Expect that res.json was called with an empty array
    expect(res.json).toHaveBeenCalledWith([]);
  });
});
