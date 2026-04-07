import express from "express";
import {
  signup,
  googleSignup,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/google-signup", googleSignup);

export default router;