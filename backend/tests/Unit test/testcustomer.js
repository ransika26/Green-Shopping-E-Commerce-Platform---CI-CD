let testUser = null;

export const generateRandomUserData = () => {
  const timestamp = Date.now(); // Unique value for each test
  return {
    CustomerName: `Test User ${timestamp}`,
    CustomerEmail: `testuser${timestamp}@example.com`,
    CustomerPassword: `password${timestamp}`,
    CustomerAddress: `123 Test Street ${timestamp}`,
    CustomerPhoneNumber: `123456${timestamp}`,
  };
};

export const setTestUser = (user) => {
  testUser = user;
};

export const getTestUser = () => testUser;
