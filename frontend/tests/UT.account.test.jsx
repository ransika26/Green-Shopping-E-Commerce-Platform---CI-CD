import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Account from '../src/Pages/account/Account';

// Mock axios to control the API response
vi.mock('axios');

// Utility to generate random data
const generateRandomData = () => {
  const randomId = () => Math.floor(Math.random() * 100000).toString();
  const randomName = () => `User-${Math.random().toString(36).substring(7)}`;
  const randomEmail = () => `${Math.random().toString(36).substring(7)}@example.com`;
  const randomAddress = () => `${Math.floor(Math.random() * 1000)} Random Street`;
  const randomPhone = () => `+1-${Math.floor(Math.random() * 9000000000) + 1000000000}`;

  return {
    customer: {
      _id: randomId(),
      CustomerName: randomName(),
      CustomerEmail: randomEmail(),
      CustomerAddress: randomAddress(),
      CustomerPhoneNumber: randomPhone(),
    },
    orders: Array.from({ length: 3 }, () => ({
      _id: randomId(),
      orderId: randomId(),
      productId: { ProductName: `Product-${randomName()}` },
      quantity: Math.floor(Math.random() * 10) + 1,
      price: (Math.random() * 100).toFixed(2),
      status: ['Pending', 'Shipped', 'Delivered'][Math.floor(Math.random() * 3)],
    })),
    questions: Array.from({ length: 3 }, () => ({
      _id: randomId(),
      ProductID: {
        _id: randomId(),
        ProductName: `Product-${randomName()}`,
        ImageFile: `image${Math.floor(Math.random() * 10)}.png`,
      },
      Question: `Is Product-${randomName()} available?`,
      Answer: ['Yes', 'No', 'Maybe'][Math.floor(Math.random() * 3)],
    })),
  };
};

describe('Account Component', () => {
  let mockData;

  beforeEach(() => {
    mockData = generateRandomData(); // Generate dynamic data for each test run

    // Mock localStorage
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'customerId') return mockData.customer._id;
      return null;
    });

    // Mock API responses
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/customeraccount')) {
        return Promise.resolve({ data: mockData.customer });
      }
      if (url.includes('/api/customerreply/reply')) {
        return Promise.resolve({ data: mockData.questions });
      }
      if (url.includes('/api/customerorder/orders')) {
        return Promise.resolve({ data: mockData.orders });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders customer details, orders, and chat correctly', async () => {
    render(
      <BrowserRouter>
        <Account />
      </BrowserRouter>
    );
  
    // Verify customer details
    await waitFor(() => {
      expect(screen.getByText(/Customer ID/i)).toBeInTheDocument();
      expect(screen.getByText(mockData.customer._id)).toBeInTheDocument();
      expect(screen.getByText(mockData.customer.CustomerName)).toBeInTheDocument();
      expect(screen.getByText(mockData.customer.CustomerEmail)).toBeInTheDocument();
      expect(screen.getByText(mockData.customer.CustomerAddress)).toBeInTheDocument();
      expect(screen.getByText(mockData.customer.CustomerPhoneNumber)).toBeInTheDocument();
    });
  
    // Verify orders table
    await waitFor(() => {
      expect(screen.getByText(/My Orders/i)).toBeInTheDocument();
  
      mockData.orders.forEach((order) => {
        // Use `queryAllByText` or make queries more specific using other attributes
        const orderRow = screen.getByText(order.orderId).closest('tr'); // Find the row containing this Order ID
        expect(orderRow).toHaveTextContent(order.productId.ProductName);
        expect(orderRow).toHaveTextContent(order.quantity.toString());
        expect(orderRow).toHaveTextContent(order.price);
        expect(orderRow).toHaveTextContent(order.status);
      });
    });
  
    // Verify chat table
    await waitFor(() => {
      expect(screen.getByText(/My Chat/i)).toBeInTheDocument();
  
      mockData.questions.forEach((question) => {
        const questionRow = screen.getByText(question.ProductID.ProductName).closest('tr'); // Find the row containing this Product Name
        expect(questionRow).toHaveTextContent(question.Question);
        expect(questionRow).toHaveTextContent(question.Answer);
      });
    });
  });
  
});
