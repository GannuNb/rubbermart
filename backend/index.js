import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import businessProfileRoutes from "./routes/businessProfileRoutes.js";
import { uploadDocumentsErrorHandler } from "./middlewares/uploadDocumentsErrorHandler.js";
import sellerProductRoutes from "./routes/sellerProductRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import buyerProductRoutes from "./routes/buyerProductRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend server is running successfully",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/business-profile", businessProfileRoutes);
app.use("/api/seller", sellerProductRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", sellerProductRoutes);
app.use("/api/buyer-products", buyerProductRoutes);
app.use("/api/orders", orderRoutes);

app.use(uploadDocumentsErrorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});