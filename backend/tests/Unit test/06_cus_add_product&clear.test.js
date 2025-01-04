import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../server.js"; // Adjust the path to your server file
import { connectTestDB, disconnectTestDB } from "./testSetup.js";
import { getTestUser } from "./testcustomer.js";
import ECommerceModel from "../../models/Product_add_platform.js";

beforeAll(connectTestDB); // Connect to the database before all tests
afterAll(disconnectTestDB); // Disconnect after all tests

describe("Customer Clear Cart Unit Tests", () => {
  it("should fail to add a product to the cart without login", async () => {
    // Fetch any product from the database
    const testProduct = await ECommerceModel.findOne();
    expect(testProduct).toBeDefined();

    // Attempt to add a product to the cart without a valid token
    const addToCartResponse = await request(app)
      .post("/api/pendingcart/pendingcartadd")
      .send({
        CustomerID: "dummyCustomerId",
        ProductID: testProduct._id,
        Quantity: 1,
      });

    // Debugging information
    console.log("Add to Cart Failure Response:", addToCartResponse.body);

    // Assertions
    expect(addToCartResponse.status).toBe(500); // Ensure the request fails with unauthorized
    expect(addToCartResponse.body.success).toBe(false); // Ensure success is false
    expect(addToCartResponse.body.message).toBe("Failed to add product to cart.");
  });

  it("should allow a customer login and add product & clear their cart", async () => {
    // Step 1: Login as the customer
    const customer = getTestUser(); // Retrieve the test customer data
    const loginResponse = await request(app)
      .post("/api/customerauthentication/customerlogin")
      .send({
        CustomerEmail: customer.CustomerEmail,
        CustomerPassword: customer.CustomerPassword,
      });

    expect(loginResponse.status).toBe(200); 
    const token = loginResponse.body.token;
    const customerId = loginResponse.body.customerId;
    expect(token).toBeDefined(); 
    expect(customerId).toBeDefined(); 

    // Step 2: Add a product to the cart
    const testProduct = await ECommerceModel.findOne(); // Fetch any product
    expect(testProduct).toBeDefined(); // Ensure a product is found

    const quantity = 2; // Specify the quantity to add
    const addToCartResponse = await request(app)
      .post("/api/pendingcart/pendingcartadd")
      .set("Authorization", `Bearer ${token}`) // Pass the token for authentication
      .send({
        CustomerID: customerId,
        ProductID: testProduct._id,
        Quantity: quantity,
      });

    expect(addToCartResponse.status).toBe(201); 
    expect(addToCartResponse.body.success).toBe(true); // Ensure success is true

    // Step 3: Clear the cart
    const clearCartResponse = await request(app)
      .delete(`/api/pendingcart/pendingcartclear/${customerId}`)
      .set("Authorization", `Bearer ${token}`); // Pass the token for authentication

    // Debugging information
    console.log("Clear Cart Response:", clearCartResponse.body);

    // Assertions
    expect(clearCartResponse.status).toBe(200); 
    expect(clearCartResponse.body.success).toBe(true); // Ensure success is true
    expect(clearCartResponse.body.message).toBe("Cart cleared successfully.");

    // Step 4: Verify the cart is empty
    const fetchCartResponse = await request(app)
      .get(`/api/pendingcart/pendingcartfetch/${customerId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(fetchCartResponse.status).toBe(404); // Ensure the request is successful
    expect(fetchCartResponse.body.cartItems).toEqual(undefined); 
  });

  
});
