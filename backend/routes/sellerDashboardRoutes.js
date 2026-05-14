import express from "express";

import { protectUser } from "../middlewares/authMiddleware.js";

import {
  getSellerDashboardStats,
  getSellerOrdersOverview,
  getRecentSellerOrders,
  getSellerPendingProducts,
  getTopSellingProducts,
} from "../controllers/sellerDashboardController.js";

const router = express.Router();

/* =========================
   DASHBOARD STATS
========================= */

router.get(  "/stats",  protectUser,  getSellerDashboardStats);
router.get(  "/orders-overview",  protectUser,  getSellerOrdersOverview);
router.get(  "/recent-orders",  protectUser,  getRecentSellerOrders);
router.get(  "/pending-products",  protectUser,  getSellerPendingProducts);

router.get(
  "/top-selling-products",
  protectUser,
  getTopSellingProducts
);

export default router;