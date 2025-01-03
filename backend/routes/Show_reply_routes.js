import express from "express";
import {
  getQuestionsByCustomerId,
  addReplyAndBroadcast,
} from "../controllers/Show_reply_controller.js";

const Reply = express.Router();

Reply.get("/reply", getQuestionsByCustomerId);

Reply.post("/reply", addReplyAndBroadcast);

export default Reply;
