import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import app from '../../server'; // Adjust path to your Express app

describe('Search and Filter Performance Tests', () => {
  it('should measure response time for Search API', async () => {
    const start = Date.now();
    const response = await supertest(app).get('/api/productssearch/search?query=shirt'); // Adjust route
    const end = Date.now();

    console.log(`Search API Response Time: ${end - start}ms`);
    expect(response.status).toBe(200);
    expect(end - start).toBeLessThan(1427);
  });

  it('should measure response time for Filter API', async () => {
    const start = Date.now();
    const response = await supertest(app).get('/api/productssearch?category=men'); // Adjust route
    const end = Date.now();

    console.log(`Filter API Response Time: ${end - start}ms`);
    expect(response.status).toBe(404);
    expect(end - start).toBeLessThan(1000);
  });
});
