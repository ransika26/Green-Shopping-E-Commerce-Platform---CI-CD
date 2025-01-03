import express from "express";
import {
  getOrdersByCustomerId,
  updateOrderAndBroadcast,
} from "../controllers/Customer_order_controller.js";

const Orderscustomer = express.Router();

Orderscustomer.get("/orders", getOrdersByCustomerId);

Orderscustomer.put("/orders/update", updateOrderAndBroadcast);

export default Orderscustomer;
