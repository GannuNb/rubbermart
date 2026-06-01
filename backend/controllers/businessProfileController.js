// backend/controllers/businessProfileController.js

import User from "../models/User.js";
import CompanyIdCounter from "../models/CompanyIdCounter.js";

export const createBusinessProfile = async (req, res) => {
  try {
    const {
      companyName,
      phoneNumber,
      email,
      gstNumber,
      panNumber,
      billingAddress,
      shippingAddress,
      sameAsBillingAddress,
      interestedProducts,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isTransporter = user?.role === "transporter";

    if (
      !companyName ||
      !phoneNumber ||
      !email ||
      !panNumber ||
      !billingAddress ||
      (!isTransporter && !gstNumber)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    let counterName;

    if (user.role === "seller") {
      counterName = "sellerCompanyCounter";
    } else if (user.role === "transporter") {
      counterName = "transporterCompanyCounter";
    } else {
      counterName = "buyerCompanyCounter";
    }

    const counter = await CompanyIdCounter.findOneAndUpdate(
      {
        name: counterName,
      },
      {
        $inc: {
          sequenceValue: 1,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    const companyPrefix = companyName
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase()
      .slice(0, 3);

    let rolePrefix;

    if (user.role === "seller") {
      rolePrefix = "S";
    } else if (user.role === "transporter") {
      rolePrefix = "T";
    } else {
      rolePrefix = "B";
    }

    const companyId = `RSM${companyPrefix}_${rolePrefix}${String(
      counter.sequenceValue,
    ).padStart(2, "0")}`;

    let parsedInterestedProducts = [];

    if (user.role === "buyer" && interestedProducts) {
      parsedInterestedProducts = JSON.parse(interestedProducts);
    }

    user.businessProfileCompleted = true;

    user.businessProfile = {
      companyId,
      companyName,
      phoneNumber,
      email,
      gstNumber: gstNumber || "",
      panNumber,
      billingAddress,
      shippingAddress,
      sameAsBillingAddress:
        sameAsBillingAddress === "true" || sameAsBillingAddress === true,

      interestedProducts: user.role === "buyer" ? parsedInterestedProducts : [],

      gstCertificate: req.files?.gstCertificate?.[0]
        ? {
            data: req.files.gstCertificate[0].buffer,
            contentType: req.files.gstCertificate[0].mimetype,
            originalName: req.files.gstCertificate[0].originalname,
          }
        : undefined,

      panCertificate: req.files?.panCertificate?.[0]
        ? {
            data: req.files.panCertificate[0].buffer,
            contentType: req.files.panCertificate[0].mimetype,
            originalName: req.files.panCertificate[0].originalname,
          }
        : undefined,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Business profile created successfully",
      businessProfile: user.businessProfile,
      role: user.role,
    });
  } catch (error) {
    console.log("Create Business Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating business profile",
    });
  }
};
