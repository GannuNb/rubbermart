// backend/routes/orderRoutes.js

import express from "express";
import { protectUser } from "../middlewares/authMiddleware.js";
import uploadDocuments from "../middlewares/uploadDocuments.js";
import { createOrder,getSellerOrders,  getSellerSingleOrder,  confirmSellerOrder,rejectSellerOrder,addShipmentToOrder,getBuyerOrders,getBuyerSingleOrder,uploadBuyerPayment } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", protectUser, createOrder);
router.get("/seller-orders", protectUser, getSellerOrders);
router.get("/seller-orders/:orderId",  protectUser,  getSellerSingleOrder);
router.put("/seller-orders/:orderId/confirm",  protectUser,  confirmSellerOrder);
router.put("/seller-orders/:orderId/reject",  protectUser,  rejectSellerOrder);
router.post("/seller-orders/:orderId/shipment",  protectUser,  uploadDocuments.single("shipmentFile"),  addShipmentToOrder);
router.get("/buyer-orders", protectUser, getBuyerOrders);
router.get(  "/buyer-orders/:orderId",  protectUser,  getBuyerSingleOrder);
router.post(  "/buyer-orders/:orderId/payment",  protectUser,  uploadDocuments.single("file"),  uploadBuyerPayment);

export default router;