// backend/routes/buyerProductRoutes.js

import express from "express";
import {
  getApprovedProducts,
  getSingleApprovedProduct,
} from "../controllers/buyerProductController.js";

const router = express.Router();

router.get("/approved", getApprovedProducts);
router.get("/approved/:productId", getSingleApprovedProduct);

export default router;