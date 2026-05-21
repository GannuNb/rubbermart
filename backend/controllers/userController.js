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

export const getAllUsersForAdmin = async (req, res) => {
  try {
    // 1. Determine which role segment the frontend is actively viewing
    let targetRole = "buyer"; 
    if (req.query.role === "sellers") targetRole = "seller";
    if (req.query.role === "admins") targetRole = "admin";

    // 2. Parse pagination variables from query string (defaults to page 1, limit 4)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    // 3. EFFICIENT COUNTING: Get the live database counts for all roles in parallel.
    // This is super fast because countDocuments() doesn't fetch actual user data profiles.
    const [totalAdmins, totalBuyers, totalSellers] = await Promise.all([
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "buyer" }),
      User.countDocuments({ role: "seller" })
    ]);

    // 4. TRUE BACKEND PAGINATION: Fetch ONLY 4 documents from the database for the active tab
    const users = await User.find({ role: targetRole })
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // 5. Format certificates ONLY for the 4 documents retrieved
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
          sameAsBillingAddress: user.businessProfile?.sameAsBillingAddress || false,
          interestedProducts: user.businessProfile?.interestedProducts || [],
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

      return formattedUser;
    });

    // Determine target total context based on current view segment
    let activeTotalCount = totalBuyers;
    if (targetRole === "seller") activeTotalCount = totalSellers;
    if (targetRole === "admin") activeTotalCount = totalAdmins;

    // 6. Return the paginated chunk alongside global database counts
    return res.status(200).json({
      success: true,
      users: formattedUsers,
      totalCount: activeTotalCount, 
      totalPages: Math.ceil(activeTotalCount / limit) || 1,
      currentPage: page,
      globalCounts: {
        admins: totalAdmins,
        buyers: totalBuyers,
        sellers: totalSellers
      }
    });
  } catch (error) {
    console.log("Get All Users For Admin Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// backend/controllers/userController.js

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Get User Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const addUserAddress = async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      flatHouse,
      areaStreet,
      landmark,
      city,
      state,
      pincode,
    } = req.body;

    if (
      !fullName ||
      !mobileNumber ||
      !flatHouse ||
      !areaStreet ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required address fields",
      });
    }

    const fullAddress = `${flatHouse}, ${areaStreet}${
      landmark ? `, ${landmark}` : ""
    }, ${city}, ${state} - ${pincode}`;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyExists = user.addresses.some(
      (address) =>
        address.fullAddress?.trim().toLowerCase() ===
        fullAddress.trim().toLowerCase()
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Address already exists",
      });
    }

    const newAddress = {
      fullName,
      mobileNumber,
      flatHouse,
      areaStreet,
      landmark,
      city,
      state,
      pincode,
      fullAddress,
    };

    user.addresses.push(newAddress);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log("Add Address Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add address",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      location,
      phoneNumber,
      billingAddress,
      shippingAddress,
      interestedProducts,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =========================
    // BASIC USER INFO
    // =========================

    if (fullName !== undefined) {
      user.fullName = fullName;
    }

    if (location !== undefined) {
      user.location = location;
    }

    // =========================
    // BUSINESS PROFILE INFO
    // =========================

    if (phoneNumber !== undefined) {
      user.businessProfile.phoneNumber = phoneNumber;
    }

    if (billingAddress !== undefined) {
      user.businessProfile.billingAddress = billingAddress;
    }

    if (shippingAddress !== undefined) {
      user.businessProfile.shippingAddress = shippingAddress;
    }

    // buyer only
    if (
      user.role === "buyer" &&
      interestedProducts !== undefined
    ) {
      user.businessProfile.interestedProducts =
        interestedProducts;
    }

    // =========================
    // IMPORTANT:
    // NOT ALLOWING UPDATE
    // =========================
    // companyName
    // gstNumber
    // panNumber
    // gstCertificate
    // panCertificate

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};