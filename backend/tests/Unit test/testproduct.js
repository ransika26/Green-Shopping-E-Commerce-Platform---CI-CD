let testProduct = null;

export const generateRandomProductData = () => {
  const timestamp = Date.now(); // Unique value for each product
  return {
    productName: `Test Product ${timestamp}`,
    shortDescription: `Short Desc ${timestamp}`,
    longDescription: `This is a detailed description for product ${timestamp}.`,
    price: Math.floor(Math.random() * 1000) + 1, // Random price between 1 and 1000
    discount: Math.floor(Math.random() * 50), // Random discount between 0 and 50%
    quantity: Math.floor(Math.random() * 100) + 1, // Random quantity between 1 and 100
    advertise: "Hot",
    gender: "Unisex",
    category: "Clothes",
  };
};

export const setTestProduct = (product) => {
  console.log("Setting test product:", product); // Debug log
  testProduct = product;
};

export const getTestProduct = () => {
  console.log("Retrieved test product:", testProduct); // Debug log
  return testProduct;
};

