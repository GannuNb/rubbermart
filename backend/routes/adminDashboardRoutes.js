import express from "express";

import {
  getDashboardOverview,
  getOrdersOverview,
  getRecentOrders,
  getPendingProducts,
} from "../controllers/adminDashboardController.js";

import {
  protectUser,
  protectAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();



/*
|--------------------------------------------------------------------------
| DASHBOARD OVERVIEW
|--------------------------------------------------------------------------
*/

router.get(
  "/overview",
  protectUser,
  protectAdmin,
  getDashboardOverview
);



/*
|--------------------------------------------------------------------------
| ORDERS OVERVIEW
|--------------------------------------------------------------------------
*/

router.get(
  "/orders-overview",
  protectUser,
  protectAdmin,
  getOrdersOverview
);



/*
|--------------------------------------------------------------------------
| RECENT ORDERS
|--------------------------------------------------------------------------
*/

router.get(
  "/recent-orders",
  protectUser,
  protectAdmin,
  getRecentOrders
);



/*
|--------------------------------------------------------------------------
| PENDING PRODUCTS
|--------------------------------------------------------------------------
*/

router.get(
  "/pending-products",
  protectUser,
  protectAdmin,
  getPendingProducts
);

export default router;