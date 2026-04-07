import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Buyer from "../models/Buyer.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signupBuyer = async (req, res) => {
  try {
    const { fullName, email, password, location } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required",
      });
    }

    const existingBuyer = await Buyer.findOne({ email });

    if (existingBuyer) {
      return res.status(400).json({
        success: false,
        message: "Buyer already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const buyer = await Buyer.create({
      fullName,
      email,
      password: hashedPassword,
      location,
      authProvider: "manual",
      role: "buyer",
    });

    const token = jwt.sign(
      {
        id: buyer._id,
        email: buyer.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Buyer signup successful",
      token,
      buyer: {
        id: buyer._id,
        fullName: buyer.fullName,
        email: buyer.email,
        location: buyer.location,
        authProvider: buyer.authProvider,
        role: buyer.role,
      },
    });
  } catch (error) {
    console.log("Signup Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during signup",
    });
  }
};

export const googleSignupBuyer = async (req, res) => {
  try {
    const { fullName, email, profileImage } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google email is required",
      });
    }

    let buyer = await Buyer.findOne({ email });

    if (!buyer) {
      buyer = await Buyer.create({
        fullName,
        email,
        profileImage,
        authProvider: "google",
        isVerified: true,
        role: "buyer",
      });
    }

    const token = jwt.sign(
      {
        id: buyer._id,
        email: buyer.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Google signup successful",
      token,
      buyer: {
        id: buyer._id,
        fullName: buyer.fullName,
        email: buyer.email,
        profileImage: buyer.profileImage,
        authProvider: buyer.authProvider,
        role: buyer.role,
      },
    });
  } catch (error) {
    console.log("Google Signup Error:", error);

    return res.status(500).json({
      success: false,
      message: "Google signup failed",
    });
  }
};