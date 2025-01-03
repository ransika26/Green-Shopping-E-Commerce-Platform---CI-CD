import express from "express";
import {
    deleteSelleraccount,
    getSelleraccountbyId,
    updateSelleraccount,
} from "../controllers/Seller_account_controller.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

const Sellerdetails = express.Router();

Sellerdetails.get("/:id", getSelleraccountbyId);
Sellerdetails.put("/:id", upload.single("LogoImageFile"), updateSelleraccount);
Sellerdetails.delete("/:id", deleteSelleraccount);

export default Sellerdetails;
