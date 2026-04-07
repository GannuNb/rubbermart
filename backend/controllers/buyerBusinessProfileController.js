
import Buyer from "../models/Buyer.js";
import BuyerCompanyIdCounter from "../models/BuyerCompanyIdCounter.js";

export const createBuyerBusinessProfile = async (req, res) => {
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

    const buyer = await Buyer.findById(req.buyer._id);

    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: "Buyer not found",
      });
    }

    const counter = await BuyerCompanyIdCounter.findOneAndUpdate(
      {
        name: "buyerCompanyCounter",
      },
      {
        $inc: {
          sequenceValue: 1,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    const companyPrefix = companyName
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase()
      .slice(0, 3);

    const companyId = `RSM${companyPrefix}_B${String(
      counter.sequenceValue
    ).padStart(2, "0")}`;

    let parsedInterestedProducts = [];

    if (interestedProducts) {
      parsedInterestedProducts = JSON.parse(interestedProducts);
    }

    buyer.businessProfileCompleted = true;

    buyer.businessProfile = {
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
      interestedProducts: parsedInterestedProducts,

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

    await buyer.save();

    return res.status(200).json({
      success: true,
      message: "Business profile created successfully",
      businessProfile: buyer.businessProfile,
    });
  } catch (error) {
    console.log("Create Buyer Business Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating business profile",
    });
  }
};

