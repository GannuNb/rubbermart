// backend/routes/sellerProductRoutes.js

import express from "express";
import {  addProduct,  getSellerProducts,  getAllPendingProductsForAdmin,  approveProduct,  rejectProduct,updateSellerProduct,} from "../controllers/sellerProductController.js";
import {  protectUser,  protectAdmin,} from "../middlewares/authMiddleware.js";
import { uploadProductImages } from "../middlewares/uploadProductImages.js";

const router = express.Router();

router.post(  "/add-product",  protectUser,  uploadProductImages,  addProduct);

router.get(  "/products",  protectUser,  getSellerProducts);

router.get(  "/admin/pending-products",  protectUser,  protectAdmin,  getAllPendingProductsForAdmin);

router.put(  "/admin/approve-product/:productId",  protectUser,  protectAdmin,  approveProduct);

router.put(  "/admin/reject-product/:productId",  protectUser,  protectAdmin,  rejectProduct);

router.put(  "/update-product/:productId",  protectUser,  updateSellerProduct);

export default router;