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


// backend/controllers/userController.js

export const getAllUsersForAdmin = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["buyer", "seller"] },
    })
      .select("-password")
      .sort({ createdAt: -1 });

    const formattedUsers = users.map((user) => {
      const formattedUser = {
        ...user._doc,

        profileImage: user.profileImage || "",

        businessProfile: {
          companyId: user.businessProfile?.companyId || "",
          companyName: user.businessProfile?.companyName || "",
          phoneNumber: user.businessProfile?.phoneNumber || "",
          email: user.businessProfile?.email || "",
          gstNumber: user.businessProfile?.gstNumber || "",
          panNumber: user.businessProfile?.panNumber || "",
          billingAddress: user.businessProfile?.billingAddress || "",
          shippingAddress: user.businessProfile?.shippingAddress || "",
          sameAsBillingAddress:
            user.businessProfile?.sameAsBillingAddress || false,
          interestedProducts:
            user.businessProfile?.interestedProducts || [],
        },
      };

      if (user.businessProfile?.gstCertificate?.data) {
        formattedUser.businessProfile.gstCertificate = {
          contentType: user.businessProfile.gstCertificate.contentType,
          originalName: user.businessProfile.gstCertificate.originalName,
          file: `data:${
            user.businessProfile.gstCertificate.contentType
          };base64,${user.businessProfile.gstCertificate.data.toString(
            "base64"
          )}`,
        };
      }

      if (user.businessProfile?.panCertificate?.data) {
        formattedUser.businessProfile.panCertificate = {
          contentType: user.businessProfile.panCertificate.contentType,
          originalName: user.businessProfile.panCertificate.originalName,
          file: `data:${
            user.businessProfile.panCertificate.contentType
          };base64,${user.businessProfile.panCertificate.data.toString(
            "base64"
          )}`,
        };
      }

      return formattedUser;
    });

    const buyers = formattedUsers.filter(
      (user) => user.role === "buyer"
    );

    const sellers = formattedUsers.filter(
      (user) => user.role === "seller"
    );

    return res.status(200).json({
      success: true,
      buyers,
      sellers,
    });
  } catch (error) {
    console.log("Get All Users For Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};