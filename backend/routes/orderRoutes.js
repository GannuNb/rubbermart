// backend/routes/orderRoutes.js

import express from "express";
import { protectAdmin, protectUser } from "../middlewares/authMiddleware.js";
import uploadDocuments from "../middlewares/uploadDocuments.js";
import { createOrder,getSellerOrders,  getSellerSingleOrder,  confirmSellerOrder,rejectSellerOrder,addShipmentToOrder,getBuyerOrders,
    getBuyerSingleOrder, uploadBuyerPayment ,getAdminAllOrders,getAdminSingleOrderDetails,approveBuyerPayment, uploadAdminToSellerPayment,
      markShipmentDeliveredByAdmin,downloadProformaInvoice,downloadShippingInvoice,downloadBuyReport,markShipmentDeliveredBySeller, } from "../controllers/orderController.js";

const router = express.Router();


//buyer
router.post("/create", protectUser, createOrder);
router.get("/buyer-orders", protectUser, getBuyerOrders);
router.get("/buyer-orders/:orderId",  protectUser,  getBuyerSingleOrder);
router.post("/buyer-orders/:orderId/payment",  protectUser,  uploadDocuments.single("file"),  uploadBuyerPayment);
router.get(  "/buyer-orders/:orderId/proforma-invoice",  protectUser,  downloadProformaInvoice);
router.get(  "/buyer-orders/:orderId/buy-report",  protectUser,  downloadBuyReport);
router.get(  "/buyer-orders/:orderId/shipment/:shipmentId/invoice",  protectUser,  downloadShippingInvoice);



//seller
router.get("/seller-orders", protectUser, getSellerOrders);
router.get("/seller-orders/:orderId",  protectUser,  getSellerSingleOrder);
router.put("/seller-orders/:orderId/confirm",  protectUser,  confirmSellerOrder);
router.put("/seller-orders/:orderId/reject",  protectUser,  rejectSellerOrder);
router.post("/seller-orders/:orderId/shipment",  protectUser,  uploadDocuments.single("shipmentFile"),  addShipmentToOrder);
router.put("/seller-orders/:orderId/shipment/:shipmentId/delivered",  protectUser,  markShipmentDeliveredBySeller);


//admin
router.get("/admin/all-orders",  protectUser, protectAdmin,  getAdminAllOrders);
router.get("/admin/:orderId",  protectUser,  protectAdmin,  getAdminSingleOrderDetails);
router.put("/admin/:orderId/payment/:paymentId/approve",  protectUser,  protectAdmin,  approveBuyerPayment);
router.post("/admin/:orderId/seller-payment",  protectUser,  protectAdmin,  uploadDocuments.single("file"),  uploadAdminToSellerPayment);
// router.put(  "/admin/:orderId/shipment/:shipmentId/approve",  protectUser,  protectAdmin,  approveShipmentByAdmin);
router.put(  "/admin/:orderId/shipment/:shipmentId/delivered",  protectUser,  protectAdmin,  markShipmentDeliveredByAdmin);

export default router;