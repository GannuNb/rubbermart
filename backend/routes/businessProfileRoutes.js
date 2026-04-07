// backend/routes/businessProfileRoutes.js

import express from "express";
import { createBusinessProfile } from "../controllers/businessProfileController.js";
import { protectUser } from "../middlewares/authMiddleware.js";
import uploadDocuments from "../middlewares/uploadDocuments.js";

const router = express.Router();

router.post(
  "/create-business-profile",
  protectUser,
  uploadDocuments.fields([
    {
      name: "gstCertificate",
      maxCount: 1,
    },
    {
      name: "panCertificate",
      maxCount: 1,
    },
  ]),
  createBusinessProfile
);

export default router;