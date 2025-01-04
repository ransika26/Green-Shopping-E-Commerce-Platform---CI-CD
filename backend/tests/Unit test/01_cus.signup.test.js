import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../server.js"; // importing server.js
import { connectTestDB, disconnectTestDB } from "./testSetup.js";
import { generateRandomUserData, setTestUser } from "./testcustomer.js";

beforeAll(connectTestDB); // Connect to the database 
afterAll(disconnectTestDB); // Disconnect database

describe("Customer Signup Unit Tests", () => {
  it("should successfully sign up a new user", async () => {
    const userData = generateRandomUserData(); // Generate test user data
    setTestUser(userData); // Store user data for other tests

    const response = await request(app)
      .post("/api/customerauthentication/customersignup")
      .send({
        CustomerName: userData.CustomerName,
        CustomerEmail: userData.CustomerEmail,
        CustomerPassword: userData.CustomerPassword,
        CustomerAddress: userData.CustomerAddress,
        CustomerPhoneNumber: userData.CustomerPhoneNumber,
      });

    console.log("Signup Response:", response.body);
    expect(response.status).toBe(201); // Created
    expect(response.body.message).toBe("Signup successful!");
  });
});
