
// backend/routes/userRoutes.js

import express from "express";
import { getMyProfile,getAllUsersForAdmin, } from "../controllers/userController.js";
import {  protectUser,  protectAdmin,} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my-profile", protectUser, getMyProfile);
router.get(  "/admin/all-users",  protectUser,  protectAdmin,  getAllUsersForAdmin);


export default router;