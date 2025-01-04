import AskQuestionsModel from "../models/Ask_questions_platform.js";
import { io } from "../server.js";

// Fetch questions by ProductID
export const getQuestionsByProductId = async (req, res) => {
  const { productId } = req.params;

  try {
    const questions = await AskQuestionsModel.find({
      ProductID: productId,
    }).populate({
      path: "ProductID",
      populate: {
        path: "SellerID",
        select: "LogoImageFile",
      },
    });

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Failed to fetch questions." });
  }
};

// Add a new question
export const addQuestion = async (req, res) => {
  const { productId, questionText } = req.body;

  try {
    const newQuestion = new AskQuestionsModel({
      ProductID: productId,
      Question: questionText,
      Answer: null,
    });

    const savedQuestion = await newQuestion.save();

    io.emit("new-question", {
      productId,
      question: savedQuestion,
    });

    res.status(201).json({
      success: true,
      message: "Question added successfully",
      question: savedQuestion,
    });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Failed to add question." });
  }
};
