// backend/routes/authRoutes.js

import express from "express";
import {  signup,  googleSignup,  login,  googleLogin,  forgotPassword,resetPassword,} from "../controllers/authController.js";

const router = express.Router();

//signup
router.post("/signup", signup);
router.post("/google-signup", googleSignup);

//logins
router.post("/login", login);
router.post("/google-login", googleLogin);

//resetpwd
router.post(  "/forgot-password",  forgotPassword);
router.put(  "/reset-password/:token",  resetPassword);

export default router;