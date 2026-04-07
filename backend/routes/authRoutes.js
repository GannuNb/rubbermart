import express from "express";
import {
  signupBuyer,
  googleSignupBuyer,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signupbuyer", signupBuyer);
router.post("/google-signupbuyer", googleSignupBuyer);

export default router;