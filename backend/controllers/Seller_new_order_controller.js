import mongoose from "mongoose";
import OrderItem from "../models/Order_item_platform.js";
import { io } from "../server.js"; // Assuming io is exported from your server.js

// Fetch order items for a specific seller with status "processing" or "shipped"
export const getOrdersBySeller = async (req, res) => {
  const { sellerId } = req.params;

  try {
    // Validate SellerID
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid SellerID format." });
    }

    const orders = await OrderItem.find({
      SellerID: sellerId,
      status: { $in: ["processing", "shipped"] },
    })
      .populate("customerId", "CustomerAddress CustomerPhoneNumber")
      .populate("productId", "ProductName")
      .lean();

    if (!orders.length) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found." });
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch orders." });
  }
};

// Update order item status
export const updateOrderStatus = async (req, res) => {
  const { orderItemId } = req.params;
  const { status } = req.body;

  try {
    // Validate OrderItemID
    if (!mongoose.Types.ObjectId.isValid(orderItemId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OrderItemID format." });
    }

    if (!["shipped", "delivered"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value." });
    }

    const updatedOrder = await OrderItem.findByIdAndUpdate(
      orderItemId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order item not found." });
    }

    // Emit the updated order to all connected WebSocket clients
    io.emit("order-update", updatedOrder);

    res.status(200).json({ success: true, updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update order status." });
  }
};
