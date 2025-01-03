import mongoose from "mongoose";
import AskQuestionsModel from "../models/Ask_questions_platform.js";

// Delete a customer reply
export const deleteReply = async (req, res) => {
  const { questionId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid question ID." });
    }

    const deletedReply = await AskQuestionsModel.findByIdAndDelete(questionId);

    if (!deletedReply) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Reply deleted successfully." });
  } catch (error) {
    console.error("Error deleting reply:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete reply." });
  }
};
