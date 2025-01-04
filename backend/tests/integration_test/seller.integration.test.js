import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../server.js"; // Adjust the path to your server file
import { connectTestDB, disconnectTestDB} from "./testSetup.js";
import { generateRandomUserData, setTestseller, getTestseller,} from "./testseller.js";
import { generateRandomProductData, setTestProduct} from "./testproduct.js";
import fs from "fs";
import path from "path";

beforeAll(connectTestDB); // Connect to the database before all tests
afterAll(disconnectTestDB); // Disconnect after all tests


describe("Integration Test: Seller Signup, Approval, Login, and Add Product", () => {
  let token, sellerId;

  it("should allow a seller to sign up and await admin approval", async () => {
    const sellerData = generateRandomUserData();
    setTestseller(sellerData);

    const response = await request(app)
      .post("/api/sellerauthentication/sellersignup")
      .send({
        SellerName: sellerData.SellerName,
        SellerEmail: sellerData.SellerEmail,
        SellerPassword: sellerData.SellerPassword,
        SellerAddress: sellerData.SellerAddress,
        SellerPhoneNumber: sellerData.SellerPhoneNumber,
        SellerGeolocation: sellerData.SellerGeolocation,
        SellerDescription: sellerData.SellerDescription,
        SellerLogo: ("logoimage", Buffer.from("FakeImageContent"), "logo.jpg"),
      });

    console.log("Signup Response:", response.body);
    expect(response.status).toBe(201);
    expect(response.body.message).toContain("Signup successful!");
  });

  it("should approve the registered seller and allow login", async () => {
    const seller = getTestseller();

    const fetchResponse = await request(app)
      .get(`/api/sellerauthentication?sellerEmail=${seller.SellerEmail}`);

    console.log("Fetch Seller Response:", fetchResponse.body);
    expect(fetchResponse.status).toBe(200);

    const sellerInDb = fetchResponse.body.find(
      (s) => s.SellerEmail === seller.SellerEmail
    );
    expect(sellerInDb).toBeDefined();
    expect(sellerInDb.Status).toBe("pending");

    const approvalResponse = await request(app)
      .put(`/api/sellerauthentication/${sellerInDb._id}`)
      .send({ status: "accepted" });

    console.log("Approval Response:", approvalResponse.body);
    expect(approvalResponse.status).toBe(200);
    expect(approvalResponse.body.Status).toBe("accepted");

    const loginResponse = await request(app)
      .post("/api/sellerauthentication/sellerlogin")
      .send({
        SellerEmail: seller.SellerEmail,
        SellerPassword: seller.SellerPassword,
      });

    console.log("Login Response:", loginResponse.body);
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.success).toBe(true);
    token = loginResponse.body.token;
    sellerId = loginResponse.body.sellerId;
    expect(token).toBeDefined();
  });
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
    setTestProduct(productData); // Save the product in test scope
    global.testProduct = productData; // Save globally for cleanup

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
    const seller = getTestseller(); // Retrieve the seller from global test data

    // Simulate logging in as the seller to get the token
    const loginResponse = await request(app)
      .post("/api/sellerauthentication/sellerlogin")
      .send({
        SellerEmail: seller.SellerEmail,
        SellerPassword: seller.SellerPassword,
      });

    expect(loginResponse.status).toBe(200); // Ensure login is successful
    const token = loginResponse.body.token;
    expect(token).toBeDefined(); // Ensure the token is returned

    // Attempt to add a product with missing fields
    const addProductResponse = await request(app)
      .post("/api/ecommerceproduct/add")
      .set("Authorization", `Bearer ${token}`) // Pass the token for authentication
      .send({}); // Send an empty object to simulate missing fields

    console.log("Add Product Failure Response:", addProductResponse.body); // Debug response

    // Assertions
    expect(addProductResponse.status).toBe(200); // Ensure the request fails
    expect(addProductResponse.body.success).toBe(false); // Ensure success is false
    expect(addProductResponse.body.message).toContain("Failed to add product");
  });

  
});
