// backend/routes/buyerProductRoutes.js

import express from "express";
import {  getBuyerProducts,  getApprovedProducts,  getSingleApprovedProduct,getRecommendedProducts ,getFeaturedProducts} from "../controllers/buyerProductController.js";
import { protectUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/products", getBuyerProducts);
router.get("/approved", getApprovedProducts);
router.get("/approved/:productId", getSingleApprovedProduct);
router.get(  "/recommended",  protectUser,  getRecommendedProducts);
router.get(  "/featured",  getFeaturedProducts);

export default router;