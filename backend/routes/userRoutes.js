
// backend/routes/userRoutes.js

import express from "express";
import { getMyProfile } from "../controllers/userController.js";
import { protectUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my-profile", protectUser, getMyProfile);

export default router;