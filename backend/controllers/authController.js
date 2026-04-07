import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, location, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      location,
      authProvider: "manual",
      role: role || "buyer",
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        location: user.location,
        profileImage: user.profileImage,
        authProvider: user.authProvider,
        role: user.role,
        isVerified: user.isVerified,
        businessProfileCompleted: user.businessProfileCompleted,
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

export const googleSignup = async (req, res) => {
  try {
    const { fullName, email, profileImage, role } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google email is required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName,
        email,
        profileImage,
        authProvider: "google",
        isVerified: true,
        role: role || "buyer",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
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
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        location: user.location,
        profileImage: user.profileImage,
        authProvider: user.authProvider,
        role: user.role,
        isVerified: user.isVerified,
        businessProfileCompleted: user.businessProfileCompleted,
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