import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../server.js"; 
import { connectTestDB, disconnectTestDB } from "./testSetup.js";
import { getTestUser } from "./testcustomer.js";

beforeAll(connectTestDB); // Connect to the database 
afterAll(disconnectTestDB); // Disconnect after test

describe("Customer Login Unit Tests", () => {
  it("should not allow login for an unregistered user", async () => {
    const randomUser = {
      CustomerEmail: "unregistered@example.com",
      CustomerPassword: "randompassword",
    };

    const response = await request(app)
      .post("/api/customerauthentication/customerlogin")
      .send({
        CustomerEmail: randomUser.CustomerEmail,
        CustomerPassword: randomUser.CustomerPassword,
      });

    console.log("Login Response for Unregistered User:", response.body);
    expect(response.status).toBe(410); 
    expect(response.body.message).toBe("Your email is not registered. Please register.");
  });

  it("should successfully log in a signed-up user", async () => {
    const userData = getTestUser(); // Retrieve shared test user data

    const response = await request(app)
      .post("/api/customerauthentication/customerlogin")
      .send({
        CustomerEmail: userData.CustomerEmail,
        CustomerPassword: userData.CustomerPassword,
      });

    console.log("Login Response for Registered User:", response.body);
    expect(response.status).toBe(200); // OK
    expect(response.body.message).toBe("Login successful!");
  });
});
