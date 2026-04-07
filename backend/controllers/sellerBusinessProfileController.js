import Seller from "../models/seller.js";
import SellerCompanyIdCounter from "../models/SellerCompanyIdCounter.js";

export const createSellerBusinessProfile = async (req, res) => {
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
    } = req.body;

    if (
      !companyName ||
      !phoneNumber ||
      !email ||
      !gstNumber ||
      !panNumber ||
      !billingAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const seller = await Seller.findById(req.seller._id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // ✅ Generate Company ID
    const counter = await SellerCompanyIdCounter.findOneAndUpdate(
      { name: "sellerCompanyCounter" },
      { $inc: { sequenceValue: 1 } },
      { new: true, upsert: true }
    );

    const companyPrefix = companyName
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase()
      .slice(0, 3);

    const companyId = `RSM${companyPrefix}_S${String(
      counter.sequenceValue
    ).padStart(2, "0")}`;

    seller.businessProfileCompleted = true;

    seller.businessProfile = {
      companyId,
      companyName,
      phoneNumber,
      email,
      gstNumber,
      panNumber,
      billingAddress,
      shippingAddress,
      sameAsBillingAddress:
        sameAsBillingAddress === "true" || sameAsBillingAddress === true,

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

    await seller.save();

    return res.status(200).json({
      success: true,
      message: "Seller business profile created successfully",
      businessProfile: seller.businessProfile,
    });
  } catch (error) {
    console.log("Seller Business Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating seller business profile",
    });
  }
};