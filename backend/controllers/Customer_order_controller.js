import mongoose from "mongoose";
import OrderItem from "../models/Order_item_platform.js";
import { io } from "../server.js";

// Get order items by Customer ID
export const getOrdersByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.query;

    // Validate CustomerID format
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid CustomerID format.",
      });
    }

    const orders = await OrderItem.find({ customerId })
      .populate({
        path: "productId",
        select: "ProductName",
      })
      .exec();

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this customer.",
      });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by customer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
};

// Update an order and broadcast the update via WebSocket
export const updateOrderAndBroadcast = async (req, res) => {
  try {
    const { orderId, status, updatedBy } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID format.",
      });
    }

    const order = await OrderItem.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Update order status
    order.status = status;
    order.updatedBy = updatedBy;
    order.updatedAt = new Date();
    await order.save();

    io.emit("order-update", {
      orderId: order._id,
      status: order.status,
      updatedBy: order.updatedBy,
      updatedAt: order.updatedAt,
    });

    res.status(200).json({
      success: true,
      message: "Order updated and broadcast successfully.",
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order.",
    });
  }
};
