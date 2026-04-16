// backend/routes/orderRoutes.js

import express from "express";
import { protectUser } from "../middlewares/authMiddleware.js";
import { createOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", protectUser, createOrder);

export default router;