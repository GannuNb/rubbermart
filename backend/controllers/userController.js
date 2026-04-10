// backend/controllers/userController.js

import User from "../models/User.js";

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const formattedUser = {
      ...user._doc,
      profileImage: user.profileImage || "",
      businessProfile: {
        ...user.businessProfile,
      },
    };

    if (user.businessProfile?.gstCertificate?.data) {
      formattedUser.businessProfile.gstCertificate = {
        contentType: user.businessProfile.gstCertificate.contentType,
        originalName: user.businessProfile.gstCertificate.originalName,
        file: `data:${user.businessProfile.gstCertificate.contentType};base64,${user.businessProfile.gstCertificate.data.toString("base64")}`,
      };
    }

    if (user.businessProfile?.panCertificate?.data) {
      formattedUser.businessProfile.panCertificate = {
        contentType: user.businessProfile.panCertificate.contentType,
        originalName: user.businessProfile.panCertificate.originalName,
        file: `data:${user.businessProfile.panCertificate.contentType};base64,${user.businessProfile.panCertificate.data.toString("base64")}`,
      };
    }

    return res.status(200).json({
      success: true,
      user: formattedUser,
    });
  } catch (error) {
    console.log("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};