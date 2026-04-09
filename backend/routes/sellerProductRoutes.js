import express from "express";
import { addProduct,getSellerPendingProducts, } from "../controllers/sellerProductController.js";
import { protectUser } from "../middlewares/authMiddleware.js";
import { uploadProductImages } from "../middlewares/uploadProductImages.js";

const router = express.Router();

router.post(
  "/add-product",
  protectUser,
  uploadProductImages,
  addProduct
);
router.get(
  "/pending-products",
  protectUser,
  getSellerPendingProducts
);

export default router;