import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../server.js";
import { connectTestDB, disconnectTestDB } from "./testSetup.js";
import { generateRandomUserData, setTestseller } from "./testseller.js";


beforeAll(connectTestDB); // Connect to the database 
afterAll(disconnectTestDB); // Disconnect db

describe("Unit Test: Seller Signup", () => {
  it("should send a signup request but wait for admin approval", async () => {
    const sellerdata = generateRandomUserData(); // Generate test user data
    setTestseller(sellerdata); // Store user data for other tests

    const response = await request(app)
    .post("/api/sellerauthentication/sellersignup")
      .send({
        SellerName: sellerdata.SellerName,
        SellerEmail: sellerdata.SellerEmail,
        SellerPassword: sellerdata. SellerPassword,
        SellerAddress: sellerdata.SellerAddress,
        SellerPhoneNumber: sellerdata.SellerPhoneNumber,
        SellerGeolocation: sellerdata.SellerGeolocation,
        SellerDescription: sellerdata.SellerDescription,
        SellerLogo: ("logoimage", Buffer.from("FakeImageContent"), "logo.jpg"),
      });
      
  
    // Conditionally log the expected message based on the response
    if (response.body.success && response.body.message.includes("Signup successful!")) {
      console.log("Terminal Message: Signup successful! Wait until administration approve your account.");
    } else {
      console.log("Terminal Message: Unexpected response received:", response.body);
    }
  
    // Assertions 
    expect(response.status).toBe(201); // Created
    expect(response.body.message).toContain("Signup successful!"); // Admin approval message
    expect(response.body.success).toBe(true); // Ensure success is true
  });
  

  it("should fail to sign up a seller with missing required fields", async () => {
    const response = await request(app)
      .post("/api/sellerauthentication/sellersignup")
      .send({}); // Send an empty object
    console.log("Signup Failure Response:", response.body);

    
    expect(response.status).toBe(400); // Bad Request
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("All fields are required"); 
  });

  
});
