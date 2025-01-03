import express from "express";
import { createOrder } from "../controllers/Order_Controller.js";
import Order from "../models/Order_platform.js";
const OrderRouter = express.Router();

// order Route
OrderRouter.post("/orderdatasend", createOrder);


OrderRouter.get("/", async (req, res) => {
    try {
      const orders= await Order.find(); 
      res.json(orders); // Send order data as JSON response
    } catch (err) {
      console.error("Error fetching Customer order data: ", err);
      res.status(500).json({ message: "Error fetching  Customer order data" });
    }
  });

  // Get total orders
  OrderRouter.get("/total-orders", async (req, res) => {
    try {
      const totalOrders = await Order.countDocuments(); 
      res.json({ totalOrders });
    } catch (err) {
      console.error("Error fetching total sellers:", err);
      res.status(500).json({ message: "Error fetching total sellers" });
    }
  });

export default OrderRouter;
