// backend/routes/sellerProductRoutes.js

import express from "express";
import { 
  addProduct,
  getSellerProducts,
  getAllPendingProductsForAdmin,
  approveProduct,
  rejectProduct,
  updateSellerProduct,
  getAllApprovedProductsForAdmin,
  getAllRejectedProductsForAdmin ,
  getAllProductsForAdmin// <-- 1. Imported the new controller method
} from "../controllers/sellerProductController.js";
import { protectUser, protectAdmin } from "../middlewares/authMiddleware.js";
import { uploadProductImages } from "../middlewares/uploadProductImages.js";

const router = express.Router();

router.post("/add-product", protectUser, uploadProductImages, addProduct);
router.get("/products", protectUser, getSellerProducts);
router.put("/update-product/:productId", protectUser, updateSellerProduct);

// --- ADMIN CONTROL ROUTES ---
router.get("/admin/pending-products", protectUser, protectAdmin, getAllPendingProductsForAdmin);
router.get("/admin/approved-products", protectUser, protectAdmin, getAllApprovedProductsForAdmin);

// 2. REGISTERED THE NEW REJECTED PRODUCTS DATA STREAM
router.get("/admin/rejected-products", protectUser, protectAdmin, getAllRejectedProductsForAdmin);

router.put("/admin/approve-product/:productId", protectUser, protectAdmin, approveProduct);
router.put("/admin/reject-product/:productId", protectUser, protectAdmin, rejectProduct);

router.get("/admin/all-products", protectUser, protectAdmin, getAllProductsForAdmin);

export default router;