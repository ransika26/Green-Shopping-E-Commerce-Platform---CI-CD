import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://greenshoppingnsbm:CyBlNMfQgr1QxqmX@cluster0.db20l.mongodb.net/GreenShopping?retryWrites=true&w=majority"
    
    );
    console.log("Connected_dbjs");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};
