// backend/routes/buyerProductRoutes.js

import express from "express";
import {
  getBuyerProducts,
  getApprovedProducts,
  getSingleApprovedProduct,
} from "../controllers/buyerProductController.js";

const router = express.Router();

router.get("/products", getBuyerProducts);
router.get("/approved", getApprovedProducts);
router.get("/approved/:productId", getSingleApprovedProduct);

export default router;