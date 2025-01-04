import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../../config/db.js"; // Path to your connectDB function
import { getTestProduct } from "./testproduct.js"; // Import getTestProduct

// Load environment variables from .env file
dotenv.config();
const product = getTestProduct(); // Retrieve the seller from global test data


export const connectTestDB = async () => {
  try {
    if (process.env.NODE_ENV === "test") {
      console.log("Connecting to test database with URI:", process.env.MONGO_URI);
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to the test database successfully.");
    } else {
      await connectDB();
    }
  } catch (error) {
    console.error("Error connecting to the test database:", error.message);
  }
};

export const disconnectTestDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from the test database.");
  } catch (error) {
    console.error("Error disconnecting from the test database:", error.message);
  }
};

export const clearTestDB = async () => {
  try {
    if (!global.testUser) {
      console.log("No test user to delete.");
      return;
    }

    // Delete the test user based on the dynamic data
    const result = await mongoose.connection
      .collection("customerauthentications") // Use the correct collection name
      .deleteMany({
        CustomerEmail: global.testUser.CustomerEmail,
      });

    console.log(`Deleted ${result.deletedCount} test users from the database.`);
  } catch (error) {
    console.error("Error clearing test data:", error.message);
  }
};
export const clearTestProduct = async () => {
  try {
    const product = global.testProduct; // Retrieve the test product saved in global
    if (!product) {
      console.log("No test product to delete.");
      return;
    }

    // Delete the test product based on the saved data
    const result = await mongoose.connection
      .collection("ecommerceproducts") // Use the correct collection name
      .deleteMany({
        ProductName: product.productName, // Match the test product's unique name
      });

    console.log(`Deleted ${result.deletedCount} test products from the database.`);
  } catch (error) {
    console.error("Error clearing test product data:", error.message);
  }
};


