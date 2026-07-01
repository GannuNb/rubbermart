// backend/routes/orderRoutes.js

import express from "express";
import { protectAdmin, protectUser } from "../middlewares/authMiddleware.js";
import uploadDocuments from "../middlewares/uploadDocuments.js";
import { uploadDocumentsErrorHandler } from "../middlewares/uploadDocumentsErrorHandler.js";

import { createOrder,getSellerOrders,  getSellerSingleOrder,  confirmSellerOrder,rejectSellerOrder,addShipmentToOrder,getBuyerOrders,
    getBuyerSingleOrder, uploadBuyerPayment ,getAdminAllOrders,getAdminSingleOrderDetails,approveBuyerPayment, uploadAdminToSellerPayment,
    markShipmentDeliveredByAdmin,downloadProformaInvoice,downloadShippingInvoice,downloadBuyReport,markShipmentDeliveredBySeller,
    cancelBuyerOrder,getOpenTransportShipments,submitTransportQuote,getTransporterQuotes,getShipmentQuotes,
    assignTransporterToShipment,adminDirectAssignTransporter,getAllTransporters,getTransporterPendingAssignments,
     transporterAcceptAssignment,transporterRejectAssignment,markShipmentShippedBySeller,   
    getTransporterAssignedShipments,getTransporterCompletedDeliveries, markShipmentShippedByTransporter,markShipmentShippedByAdmin,
    uploadTransportPaymentReceipt,uploadAdminTransportPayment,verifyBuyerTransportPayment,getTransporterPaymentHistory ,
     uploadShipmentProofs, } from "../controllers/orderController.js";

import { submitOrderReview } from "../controllers/reviewController.js";

const router = express.Router();


//buyer
router.post("/create", protectUser, createOrder);
router.get("/buyer-orders", protectUser, getBuyerOrders);
router.get("/buyer-orders/:orderId",  protectUser,  getBuyerSingleOrder);
router.post("/buyer-orders/:orderId/payment",  protectUser,  uploadDocuments.single("file"),  uploadBuyerPayment);
router.get("/buyer-orders/:orderId/proforma-invoice",  protectUser,  downloadProformaInvoice);
router.get("/buyer-orders/:orderId/buy-report",  protectUser,  downloadBuyReport);
router.get("/buyer-orders/:orderId/shipment/:shipmentId/invoice",  protectUser,  downloadShippingInvoice);
router.post("/buyer-orders/:orderId/review",  protectUser,  uploadDocuments.single("image"),  uploadDocumentsErrorHandler,  submitOrderReview);
router.put("/buyer-orders/:orderId/cancel", protectUser, cancelBuyerOrder);
router.post("/buyer/:orderId/shipment/:shipmentId/upload-transport-payment", protectUser, uploadDocuments.single("receipt"), uploadTransportPaymentReceipt,);


//seller
router.get("/seller-orders", protectUser, getSellerOrders);
router.get("/seller-orders/:orderId",  protectUser,  getSellerSingleOrder);
router.put("/seller-orders/:orderId/confirm",  protectUser,  confirmSellerOrder);
router.put("/seller-orders/:orderId/reject",  protectUser,  rejectSellerOrder);
router.post("/seller-orders/:orderId/shipment",protectUser,addShipmentToOrder);
router.put(  "/seller-orders/:orderId/shipment/:shipmentId/upload-proofs",  protectUser,
  uploadDocuments.fields([{ name: "packedItemPhoto", maxCount: 1, },{ name: "weightTicket", maxCount: 1,  },]),uploadShipmentProofs,);
router.put("/seller-orders/:orderId/shipment/:shipmentId/delivered",  protectUser,  markShipmentDeliveredBySeller);
router.put( "/seller-orders/:orderId/shipment/:shipmentId/shipped", protectUser, markShipmentShippedBySeller,);


//admin
router.get("/admin/all-orders",  protectUser, protectAdmin,  getAdminAllOrders);
router.get(  "/admin/transporters",  protectUser,  protectAdmin,  getAllTransporters,);//alltransporters
router.get("/admin/:orderId",  protectUser,  protectAdmin,  getAdminSingleOrderDetails);
router.put("/admin/:orderId/payment/:paymentId/approve",  protectUser,  protectAdmin,  approveBuyerPayment);
router.post("/admin/:orderId/seller-payment",  protectUser,  protectAdmin,  uploadDocuments.single("file"),  uploadAdminToSellerPayment);
// router.put(  "/admin/:orderId/shipment/:shipmentId/approve",  protectUser,  protectAdmin,  approveShipmentByAdmin);
router.put(  "/admin/:orderId/shipment/:shipmentId/delivered",  protectUser,  protectAdmin,  markShipmentDeliveredByAdmin);
router.get(  "/admin/shipment/:shipmentId/quotes",  protectUser,  protectAdmin,  getShipmentQuotes,); //transporters
router.put(  "/admin/:orderId/shipment/:shipmentId/assign-transporter/:quoteId",  protectUser,  protectAdmin,  assignTransporterToShipment,); //assigning transporter
router.put(  "/admin/:orderId/shipment/:shipmentId/direct-assign",  protectUser,  protectAdmin,  adminDirectAssignTransporter,); //directassign
router.put(  "/admin/:orderId/shipment/:shipmentId/shipped",  protectUser,  protectAdmin,  markShipmentShippedByAdmin,);
router.put(  "/admin/orders/:orderId/shipment/:shipmentId/transport-payment/:receiptId/verify",  protectUser,  protectAdmin,  verifyBuyerTransportPayment,);
router.post(  "/admin/orders/:orderId/shipment/:shipmentId/transport-payment", protectUser,protectAdmin,  uploadDocuments.single("receipt"),  uploadAdminTransportPayment,);


//transporter
router.get( "/transporter/open-shipments",protectUser, getOpenTransportShipments);
router.post("/transporter/:orderId/shipment/:shipmentId/quote", protectUser, submitTransportQuote);
router.get( "/transporter/my-quotes",protectUser,getTransporterQuotes,);
router.get(  "/transporter/pending-assignments",  protectUser,  getTransporterPendingAssignments,);
router.get(  "/transporter/payment-history",  protectUser,  getTransporterPaymentHistory,);
router.get(  "/transporter/assigned-shipments",  protectUser,  getTransporterAssignedShipments,);
router.get(  "/transporter/completed-deliveries",  protectUser,  getTransporterCompletedDeliveries,);
router.put(  "/transporter/:orderId/shipment/:shipmentId/accept-assignment",  protectUser,  transporterAcceptAssignment,);
router.put(  "/transporter/:orderId/shipment/:shipmentId/reject-assignment",  protectUser,  transporterRejectAssignment,);
router.put(  "/transporter/:orderId/shipment/:shipmentId/shipped",  protectUser,  markShipmentShippedByTransporter,);






export default router;