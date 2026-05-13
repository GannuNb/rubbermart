// backend/controllers/authController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

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

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email: normalizedEmail,
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

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

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

    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({
      email: normalizedEmail,
    });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    user = await User.create({
      fullName,
      email: normalizedEmail,
      profileImage,
      authProvider: "google",
      isVerified: true,
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

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Google signup failed",
    });
  }
};


// backend/controllers/authController.js
// Replace only login and googleLogin with this

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.authProvider !== "manual") {
      return res.status(400).json({
        success: false,
        message: "Please login with Google",
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
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
      message: "Login successful",
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
    console.log("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this Google email",
      });
    }

    if (user.authProvider !== "google") {
      return res.status(400).json({
        success: false,
        message: "Please login using password",
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
      message: "Google login successful",
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
    console.log("Google Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Google login failed",
    });
  }
};



export const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    /* =========================
        CREATE RESET TOKEN
    ========================= */

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    /* =========================
        RESET URL
    ========================= */

    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    /* =========================
        MAIL TRANSPORT
    ========================= */

    const transporter =
      nodemailer.createTransport({

        host: "smtp.hostinger.com",

        port: 465,

        secure: true,

        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },

      });

    /* =========================
        SEND MAIL
    ========================= */

    await transporter.sendMail({

      from: `"Rubber Scrap Mart" <${process.env.EMAIL_USER}>`,

      to: user.email,

      subject: "Reset Your Password",

      html: `
        <div style="font-family: Arial; padding: 20px;">

          <h2>Password Reset Request</h2>

          <p>
            Click the button below to reset your password.
          </p>

          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#2563eb;
              color:#fff;
              text-decoration:none;
              border-radius:8px;
              margin-top:15px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top:20px;">
            This link expires in 15 minutes.
          </p>

        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });

  } catch (error) {

    console.log("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send reset email",
    });

  }
};

export const resetPassword = async (req, res) => {
  try {

    const { token } = req.params;

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,

      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Reset link is invalid or expired",
      });
    }

    /* =========================
        HASH NEW PASSWORD
    ========================= */

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    /* =========================
        CLEAR RESET FIELDS
    ========================= */

    user.resetPasswordToken = undefined;

    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successful",
    });

  } catch (error) {

    console.log(
      "Reset Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reset password",
    });

  }
};