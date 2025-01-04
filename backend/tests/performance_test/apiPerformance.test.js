import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import app from '../../server'; // Adjust the path to your Express app

describe('API Performance Tests', () => {
  it('should measure response time for Product Search API', async () => {
    const start = Date.now();
    const response = await supertest(app).get('/api/productssearch?search=shoes'); // Adjust route
    const end = Date.now();

    console.log(`Product Search Response Time: ${end - start}ms`);
    expect(response.status).toBe(404);
    expect(end - start).toBeLessThan(300); // Set threshold
  });

  it('should measure response time for Cart API', async () => {
    const start = Date.now();
    const response = await supertest(app)
      .post('/api/pendingcart/pendingcartadd')
      .send({ productId: '123', quantity: 1 }); // Adjust payload
    const end = Date.now();

    console.log(`Cart API Response Time: ${end - start}ms`);
    expect(response.status).toBe(400);
    expect(end - start).toBeLessThan(363);
  });

  it('should measure response time for Checkout API', async () => {
    const start = Date.now();
    const response = await supertest(app)
      .post('/api/customerorder/orders')
      .send({ cartId: '456', paymentInfo: { card: '1234' } }); // Adjust payload
    const end = Date.now();

    console.log(`Checkout API Response Time: ${end - start}ms`);
    expect(response.status).toBe(404);
    expect(end - start).toBeLessThan(500);
  });
});
