import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../server.js"; // Adjust the path to your server file
import { connectTestDB, disconnectTestDB } from "./testSetup.js";
import { getTestseller } from "./testseller.js";

beforeAll(async () => {
  await connectTestDB(); // Connect to the database before all tests
});

afterAll(disconnectTestDB); // Disconnect after all tests

describe("Admin unit test for seller deletion", () => {
  const adminCredentials = {
    AdminEmail: "admin@gmail.com",
    AdminPassword: "adminpassword",
  };

  it("should log in as admin and ensure valid credentials", async () => {
    const response = await request(app)
      .post("/api/admin/login")
      .send(adminCredentials);

    console.log("Admin Login Response:", response.body);

    // Check the response
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful!");
  });

  it("should allow admin to remove the seller", async () => {
    const testSeller = getTestseller();

    // Login as the seller
    const loginResponse = await request(app)
      .post("/api/sellerauthentication/sellerlogin")
      .send({
        SellerEmail: testSeller.SellerEmail,
        SellerPassword: testSeller.SellerPassword,
      });

    expect(loginResponse.status).toBe(200); // Ensure login is successful
    const token = loginResponse.body.token;
    const sellerId = loginResponse.body.sellerId;
    expect(token).toBeDefined(); // Ensure the token is returned
    expect(sellerId).toBeDefined();

    //  Admin removes the seller using the sellerId
    const response = await request(app)
      .delete(`/api/sellerauthentication/${sellerId}`) // Endpoint to remove seller by ID
      .send({
        AdminEmail: adminCredentials.AdminEmail,
        AdminPassword: adminCredentials.AdminPassword,
      });

    console.log("Admin Remove Seller Response:", response.body);
    expect(response.status).toBe(200); // Request successful
    expect(response.body.message).toBe("Seller deleted successfully");
  });

  it("should not allow the removed seller to log in", async () => {
    const testSeller = getTestseller();

    const response = await request(app)
      .post("/api/sellerauthentication/sellerlogin")
      .send({
        SellerEmail: testSeller.SellerEmail,
        SellerPassword: testSeller.SellerPassword,
      });

    console.log("Removed Seller Login Attempt Response:", response.body);

    expect(response.status).toBe(410); // Resource no longer available
    expect(response.body.message).toBe("Your email is not registered. Please register.");
  });
});
