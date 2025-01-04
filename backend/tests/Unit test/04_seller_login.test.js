import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../server.js"; 
import { connectTestDB, disconnectTestDB } from "./testSetup.js";
import { getTestseller } from "./testseller.js";

beforeAll(connectTestDB); 
afterAll(disconnectTestDB); 

describe("Unit Test: Seller Approval and Login", () => {
  it("should approve the registered seller", async () => {
    const seller = getTestseller(); // Retrieve the test seller registered in the signup test
  
    // Fetch the seller from the database by email
    const fetchResponse = await request(app)
      .get(`/api/sellerauthentication?sellerEmail=${seller.SellerEmail}`);
    
    console.log("Fetch Response Body:", fetchResponse.body); 
    expect(fetchResponse.status).toBe(200);
  
    const sellerInDb = fetchResponse.body.find(
      (s) => s.SellerEmail === seller.SellerEmail
    );
  
    expect(sellerInDb).toBeDefined(); // Ensure the seller exists in the DB
    expect(sellerInDb.Status).toBe("pending"); 
  
    // Approve the seller (update the status to "accepted")
    const approvalResponse = await request(app)
      .put(`/api/sellerauthentication/${sellerInDb._id}`)
      .send({ status: "accepted" });
  
    console.log("Approval Response Body:", approvalResponse.body); 
    expect(approvalResponse.status).toBe(200); // Ensure the status update was successful
    expect(approvalResponse.body.Status).toBe("accepted"); // Verify the new status
  });
  

  it("should allow the approved seller to log in", async () => {
    const seller = getTestseller(); // Retrieve the test seller

    // Attempt to log in with the approved seller's credentials
    const loginResponse = await request(app)
      .post("/api/sellerauthentication/sellerlogin")
      .send({
        SellerEmail: seller.SellerEmail,
        SellerPassword: seller.SellerPassword,
      });

    expect(loginResponse.status).toBe(200); // Ensure the login was successful
    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.message).toBe("Login successful!");
    expect(loginResponse.body.token).toBeDefined(); // Ensure a token is returned
  });
});
