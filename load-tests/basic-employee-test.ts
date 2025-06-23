import http from 'k6/http';
import { check, sleep } from 'k6';
import { Options } from 'k6/options';

// Set test configuration
export const options: Options = {
  stages: [
    { duration: '30s', target: 20 },  // Scale to 20 users over 30 seconds
    { duration: '1m', target: 20 },   // Stay at 20 uesrs for 1 minute
    { duration: '20s', target: 0 },   // Scale down to 0 users over 20 seconds
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete within 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of HTTP requests should fail
  },
};

// Define Employee interface
interface Employee {
  id: number;
  name: string;
  title: string;
}

// Default user journey function
export default function (): void {
  // GET all employees
  let res = http.get('http://localhost:3000/api/v1/employees');
  check(res, {
    'GET /employees status is 200': (r) => r.status === 200,
    'GET /employees response body contains array': (r) => Array.isArray(r.json() as Employee[]),
  });

  sleep(1); // Simulate some user pauses

  // POST a new employee
  const payload = JSON.stringify({
    name: `Test Employee ${__VU}-${__ITER}`, // Unique name using virtual ID / Iteration ID
    title: 'Load Tester',
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  res = http.post('http://localhost:3000/api/v1/employees', payload, params);
  check(res, {
    'POST /employees status is 201': (r) => r.status === 201,
    'POST /employees response has id': (r) => (r.json() as Employee).id !== undefined,
  });

  sleep(1);
}
