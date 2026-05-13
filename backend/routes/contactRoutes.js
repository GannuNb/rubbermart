import express from "express";

import {
  sendContactMessage,
} from "../controllers/contactController.js";

const router = express.Router();

router.post(
  "/send-message",
  sendContactMessage
);

export default router;