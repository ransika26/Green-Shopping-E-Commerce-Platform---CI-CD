import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../server.js";
import { connectTestDB, disconnectTestDB, clearTestProduct } from "./testSetup.js";
import { getTestseller } from "./testseller.js";
import { generateRandomProductData, setTestProduct, getTestProduct } from "./testproduct.js";
import fs from "fs";
import path from "path";

beforeAll(connectTestDB);
afterAll(async () => {
  await disconnectTestDB(); // Disconnect from the test database
});

describe("Unit Test: Add Product", () => {
  it("should allow a seller to add a product successfully", async () => {
    const seller = getTestseller();

    // Simulate logging in as the seller to get the token
    const loginResponse = await request(app)
      .post("/api/sellerauthentication/sellerlogin")
      .send({
        SellerEmail: seller.SellerEmail,
        SellerPassword: seller.SellerPassword,
      });

    expect(loginResponse.status).toBe(200);
    const token = loginResponse.body.token;
    expect(token).toBeDefined();

    // Generate and store random product data
    const productData = generateRandomProductData();
    setTestProduct(productData); 
    global.testProduct = productData; 

    const imagePath = path.resolve(__dirname, "./test_image.jpeg");

    if (!fs.existsSync(imagePath)) {
      throw new Error("Test image file not found: " + imagePath);
    }

    // Add the product
    const addProductResponse = await request(app)
      .post("/api/ecommerceproduct/add")
      .set("Authorization", `Bearer ${token}`)
      .field("SellerID", loginResponse.body.sellerId)
      .field("ProductName", productData.productName)
      .field("ShortDescription", productData.shortDescription)
      .field("LongDescription", productData.longDescription)
      .field("Price", productData.price)
      .field("Discount", productData.discount)
      .field("Quantity", productData.quantity)
      .field("Advertise", productData.advertise)
      .field("ForWho", productData.gender)
      .field("Category", productData.category)
      .attach("productimage", imagePath);

    console.log("Add Product Response:", addProductResponse.body);

    // Assertions
    expect(addProductResponse.status).toBe(200);
    expect(addProductResponse.body.success).toBe(true);
    expect(addProductResponse.body.message).toBe("Product is added");
  });

  it("should fail to add a product with missing required fields", async () => {
    const seller = getTestseller();

    const loginResponse = await request(app)
      .post("/api/sellerauthentication/sellerlogin")
      .send({
        SellerEmail: seller.SellerEmail,
        SellerPassword: seller.SellerPassword,
      });

    expect(loginResponse.status).toBe(200);
    const token = loginResponse.body.token;
    expect(token).toBeDefined();

    const addProductResponse = await request(app)
      .post("/api/ecommerceproduct/add")
      .set("Authorization", `Bearer ${token}`)
      .send({}); // Empty data to simulate missing fields

    console.log("Add Product Failure Response:", addProductResponse.body);

    expect(addProductResponse.status).toBe(200);
    expect(addProductResponse.body.success).toBe(false);
    expect(addProductResponse.body.message).toContain("Failed to add product");
  });
});
