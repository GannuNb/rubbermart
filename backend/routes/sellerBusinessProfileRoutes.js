import express from "express";
import { createSellerBusinessProfile } from "../controllers/sellerBusinessProfileController.js";
import uploadBuyerDocuments from "../middlewares/uploadBuyerDocuments.js"; // reuse
import { protectSeller } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/create-seller-business-profile",
  protectSeller,
  uploadBuyerDocuments.fields([
    { name: "gstCertificate", maxCount: 1 },
    { name: "panCertificate", maxCount: 1 },
  ]),
  createSellerBusinessProfile
);

export default router;