import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../server.js"; // Adjust the path to your server file
import { connectTestDB, disconnectTestDB } from "./testSetup.js";
import { getTestUser, setTestUser, generateRandomUserData } from "./testcustomer.js";

beforeAll(async () => {
  await connectTestDB(); // Connect to the database before all tests
});

afterAll(disconnectTestDB); // Disconnect after all tests

describe("Admin unit test", () => {
  const adminCredentials = {
    AdminEmail: "admin@gmail.com",
    AdminPassword: "adminpassword",
  };

  it("should log in as admin and ensure valid credentials", async () => {
    const response = await request(app)
      .post("/api/admin/login")
      .send(adminCredentials);

    console.log("Admin Login Response:", response.body);

    
    expect(response.status).toBe(200);
     // Ensure the admin is found
    expect(response.body.message).toBe("Login successful!");
  });

  it("should allow admin to remove the customer", async () => {
    const testUser = getTestUser();

    //  Login as the customer
    const loginResponse = await request(app)
      .post("/api/customerauthentication/customerlogin")
      .send({
        CustomerEmail: testUser.CustomerEmail,
        CustomerPassword: testUser.CustomerPassword,
      });

    expect(loginResponse.status).toBe(200); // Ensure login is successful
    const token = loginResponse.body.token;
    const customerId = loginResponse.body.customerId;
    expect(token).toBeDefined(); // Ensure the token is returned
    expect(customerId).toBeDefined();

 

   //  Admin removes the customer using the customerId
  const response = await request(app)
  .delete(`/api/customerauthentication/${customerId}`) // Endpoint to remove customer by ID
  .send({
    AdminEmail: adminCredentials.AdminEmail,
    AdminPassword: adminCredentials.AdminPassword,
  });

console.log("Admin Remove Customer Response:", response.body);
expect(response.status).toBe(200); // Request successful

expect(response.body.message).toBe("Customer deleted successfully");
});

it("should not allow the removed customer to log in", async () => {
    const testUser = getTestUser();

    const response = await request(app)
      .post("/api/customerauthentication/customerlogin")
      .send({
        CustomerEmail: testUser.CustomerEmail,
        CustomerPassword: testUser.CustomerPassword,
      });

    console.log("Removed Customer Login Attempt Response:", response.body);

    expect(response.status).toBe(410); // Not Found
    expect(response.body.message).toBe("Your email is not registered. Please register.");
  });
});
