import express from "express";
import {
  getQuestionsByProductId,
  addQuestion,
} from "../controllers/Show_questions_controller.js";

const Questions = express.Router();

Questions.get("/:productId", getQuestionsByProductId);

Questions.post("/", addQuestion);

export default Questions;
