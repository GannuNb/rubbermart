
import express from "express";
import { createBuyerBusinessProfile } from "../controllers/buyerBusinessProfileController.js";
import uploadBuyerDocuments from "../middlewares/uploadBuyerDocuments.js";
import { protectBuyer } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/create-buyer-business-profile",
  protectBuyer,
  uploadBuyerDocuments.fields([
    {
      name: "gstCertificate",
      maxCount: 1,
    },
    {
      name: "panCertificate",
      maxCount: 1,
    },
  ]),
  createBuyerBusinessProfile
);

export default router;

