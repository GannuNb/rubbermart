import express from "express";
import {
  signupBuyer,
  googleSignupBuyer,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signupbuyer", signupBuyer);
router.post("/google-signupbuyer", googleSignupBuyer);

import {
  signupSeller,
  googleSignupSeller,
} from "../controllers/authController.js";

router.post("/signupseller", signupSeller);
router.post("/google-signupseller", googleSignupSeller);

export default router;