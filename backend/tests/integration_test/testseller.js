let testseller = null;

export const generateRandomUserData = () => {
  const timestamp = Date.now(); // Unique value for each test
  return {
    SellerName: `Test Seller ${timestamp}`,
    SellerEmail: `testseller${timestamp}@example.com`,
    SellerPassword: `password${timestamp}`,
    SellerAddress: `123 Test Lane ${timestamp}`,
    SellerPhoneNumber: `1234567890`,
    SellerGeolocation: "Global",
    SellerDescription: `This is a test seller description for ${timestamp}`,
  };
};

export const setTestseller = (seller) => {
  testseller = seller;
};

export const getTestseller = () => testseller;
