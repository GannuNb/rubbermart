
// backend/routes/userRoutes.js

import express from "express";
import { getMyProfile,getAllUsersForAdmin,getUserProfile,  addUserAddress, } from "../controllers/userController.js";
import {  protectUser,  protectAdmin,} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my-profile", protectUser, getMyProfile);
router.get(  "/admin/all-users",  protectUser,  protectAdmin,  getAllUsersForAdmin);


router.get("/profile", protectUser, getUserProfile);
router.post("/add-address", protectUser, addUserAddress);


export default router;