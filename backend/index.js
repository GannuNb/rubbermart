import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import buyerBusinessProfileRoutes from "./routes/buyerBusinessProfileRoutes.js";
import { uploadBuyerDocumentsErrorHandler } from "./middlewares/uploadBuyerDocumentsErrorHandler.js";


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
app.use("/api/buyer-business-profile", buyerBusinessProfileRoutes);

app.use(uploadBuyerDocumentsErrorHandler);



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});