import nodemailer from "nodemailer";
import express from "express";

const gmailController = express.Router();

gmailController.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;
  console.log("Request Payload:", { to, subject, text });
  if (!to || !subject || !text) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "green.shopping.nsbm@gmail.com", 
        pass: "qpnv zyto oagy bquz", 
      },
    });

    const mailOptions = {
      from: "green.shopping.nsbm@gmail.com",
      to: to,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
});


export default gmailController;