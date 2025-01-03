import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://sahanransika0226:R87Js2i2W8pHMake@cluster0.evexf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    
    );
    console.log("Connected_dbjs");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};
