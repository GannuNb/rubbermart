// backend/routes/orderRoutes.js

import express from "express";
import { protectUser } from "../middlewares/authMiddleware.js";
import { createOrder,getSellerOrders,  getSellerSingleOrder,  confirmSellerOrder,rejectSellerOrder, } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", protectUser, createOrder);
router.get("/seller-orders", protectUser, getSellerOrders);
router.get("/seller-orders/:orderId",  protectUser,  getSellerSingleOrder);
router.put("/seller-orders/:orderId/confirm",  protectUser,  confirmSellerOrder);
router.put("/seller-orders/:orderId/reject",  protectUser,  rejectSellerOrder);

export default router;