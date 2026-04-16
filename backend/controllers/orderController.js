// backend/controllers/orderController.js

import Order from "../models/orderModel.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import generateOrderId from "../utils/generateOrderId.js";

export const createOrder = async (req, res) => {
  try {
    const {
      sellerId,
      selectedAddress,
      requiredQuantity,
      productId,
    } = req.body;

    if (
      !sellerId ||
      !selectedAddress ||
      !requiredQuantity ||
      !productId
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const product = await Product.findById(productId).populate(
      "seller",
      "businessProfile fullName"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (Number(requiredQuantity) > Number(product.quantity)) {
      return res.status(400).json({
        success: false,
        message: "Required quantity exceeds available stock",
      });
    }

    const buyer = await User.findById(req.user._id);

    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: "Buyer not found",
      });
    }

    const shippingAddress = buyer.addresses.find(
      (address) => address.fullAddress === selectedAddress
    );

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Selected address not found",
      });
    }

    const taxableAmount =
      Number(requiredQuantity) * Number(product.pricePerMT);

    const gstAmount = taxableAmount * 0.18;

    const totalAmount = taxableAmount + gstAmount;

    const orderId = await generateOrderId();

    const firstProductImage = product.images?.[0];

    const newOrder = await Order.create({
      orderId,
      buyer: req.user._id,
      seller: sellerId,

      shippingAddress: {
        fullName: shippingAddress.fullName,
        mobileNumber: shippingAddress.mobileNumber,
        flatHouse: shippingAddress.flatHouse,
        areaStreet: shippingAddress.areaStreet,
        landmark: shippingAddress.landmark,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        fullAddress: shippingAddress.fullAddress,
      },

      orderItems: [
        {
          product: product._id,
          seller: product.seller._id,
          category: product.category,
          application: product.application,

          productImage: firstProductImage
            ? {
                data: firstProductImage.data,
                contentType: firstProductImage.contentType,
                originalName: "product-image",
              }
            : null,

          requiredQuantity: Number(requiredQuantity),
          pricePerMT: Number(product.pricePerMT),
          loadingLocation: product.loadingLocation,
          hsnCode: product.hsnCode,
          subtotal: taxableAmount,
        },
      ],

      taxableAmount,
      gstAmount,
      totalAmount,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};