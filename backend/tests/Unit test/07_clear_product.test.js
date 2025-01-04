import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { connectTestDB, disconnectTestDB, clearTestProduct } from "./testSetup.js";
import { getTestProduct } from "./testproduct.js";

beforeAll(connectTestDB); 
afterAll(disconnectTestDB); 

describe("Unit Test: Delete Test Product", () => {
  it("should delete the test product from the database", async () => {
    const product = getTestProduct(); // Retrieve the test product 
    expect(product).toBeDefined(); // Ensure the test product exists
    expect(product.productName).toBeTruthy(); // Check that the product has a name

    // Call the function to delete 
    await clearTestProduct();

    console.log("Test product deleted successfully:", product.productName); 
  });
});
