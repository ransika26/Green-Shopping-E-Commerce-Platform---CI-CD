import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import app from '../../server'; // Adjust path to your Express app

describe('Payment and Checkout Performance Tests', () => {
  it('should measure response time for Payment API', async () => {
    const start = Date.now();
    const response = await supertest(app)
      .post('/api/payment')
      .send({ amount: 100, paymentMethod: 'credit_card' }); // Adjust payload
    const end = Date.now();

    console.log(`Payment API Response Time: ${end - start}ms`);
    expect(response.status).toBe(404);
    expect(end - start).toBeLessThan(500);
  });
});
