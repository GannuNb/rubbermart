// backend/routes/userRoutes.js

import express from "express";
import { 
  getMyProfile,
  getAllUsersForAdmin,
  getUserProfile, 
  addUserAddress,
  verifyUserByAdmin, 
  updateProfile,
  deleteUserAddress // 1. Import the controller here
} from "../controllers/userController.js";
import { protectUser, protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my-profile", protectUser, getMyProfile);
router.get("/admin/all-users", protectUser, protectAdmin, getAllUsersForAdmin);
router.put("/admin/verify-user/:userId", protectUser, protectAdmin, verifyUserByAdmin);

router.get("/profile", protectUser, getUserProfile);
router.post("/add-address", protectUser, addUserAddress);
router.put("/update-profile", protectUser, updateProfile);

// 2. Add the delete address route here
router.delete("/delete-address/:addressId", protectUser, deleteUserAddress);

export default router;