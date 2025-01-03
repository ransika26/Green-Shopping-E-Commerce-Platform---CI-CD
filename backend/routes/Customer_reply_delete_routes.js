import express from "express";
import { deleteReply } from "../controllers/Customer_reply_delete_controller.js";

const router = express.Router();

// Delete a customer reply
router.delete("/:questionId", deleteReply);

export default router;
