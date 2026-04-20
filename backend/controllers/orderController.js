// backend/controllers/orderController.js

import Order from "../models/orderModel.js";
import Product from "../models/Product.js";
import generateOrderId from "../utils/generateOrderId.js";
import generateInvoicePdf from "../utils/pdf/generateInvoicePdf.js";
import sendOrderInvoiceEmail from "../utils/sendOrderInvoiceEmail.js";

export const createOrder = async (req, res) => {
  try {
    const buyerId = req.user._id;

    const {
      seller,
      shippingAddress,
      orderItems,
      taxableAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      gstAmount,
      totalAmount,
      buyerGstNumber,
      gstType,
    } = req.body;

    if (!seller) {
      return res.status(400).json({
        success: false,
        message: "Seller is required",
      });
    }

    if (!shippingAddress || !shippingAddress.fullAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product is required",
      });
    }

    const validatedOrderItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product).populate("seller");

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found for ID ${item.product}`,
        });
      }

      if (Number(item.requiredQuantity) > Number(product.quantity)) {
        return res.status(400).json({
          success: false,
          message: `${product.application} quantity exceeds available stock`,
        });
      }

      const subtotal =
        Number(item.requiredQuantity) * Number(product.pricePerMT);

      const itemGstAmount = subtotal * 0.18;

      validatedOrderItems.push({
        product: product._id,
        seller: product.seller._id,
        category: product.category,
        application: product.application,
        productName: product.productName || product.application,

        subProducts: product.subProducts || [],

        productImage: product.images?.[0]
          ? {
              data: product.images[0].data,
              contentType: product.images[0].contentType,
              originalName: product.images[0].originalName || "product-image",
            }
          : undefined,

        requiredQuantity: Number(item.requiredQuantity),
        pricePerMT: Number(product.pricePerMT),
        loadingLocation: product.loadingLocation,
        hsnCode: product.hsnCode,

        subtotal,
        gstAmount: itemGstAmount,
      });
    }

    const finalTaxableAmount = Number(taxableAmount || 0);
    const finalCgstAmount = Number(cgstAmount || 0);
    const finalSgstAmount = Number(sgstAmount || 0);
    const finalIgstAmount = Number(igstAmount || 0);
    const finalGstAmount = Number(gstAmount || 0);
    const finalTotalAmount = Number(totalAmount || 0);

    const orderId = await generateOrderId();

    const order = await Order.create({
      orderId,
      buyer: buyerId,
      seller,
      shippingAddress,
      orderItems: validatedOrderItems,

      taxableAmount: finalTaxableAmount,

      gstType: gstType === "cgst_sgst" ? "cgst_sgst" : "igst",

      buyerGstNumber: buyerGstNumber || "",

      cgstAmount: finalCgstAmount,
      sgstAmount: finalSgstAmount,
      igstAmount: finalIgstAmount,
      gstAmount: finalGstAmount,

      totalAmount: finalTotalAmount,

      buyerPendingAmount: finalTotalAmount,
      sellerPendingAmount: finalTotalAmount,

      orderStatus: "pending",
    });

    const populatedOrder = await Order.findById(order._id).populate(
      "buyer",
      `
        fullName
        email
        businessProfile.companyName
        businessProfile.phoneNumber
        businessProfile.email
        businessProfile.gstNumber
        businessProfile.billingAddress
        businessProfile.shippingAddress
      `
    );

    const invoicePdfBuffer = await generateInvoicePdf(populatedOrder);

    await sendOrderInvoiceEmail({
      buyerEmail: populatedOrder.buyer.email,
      buyerName: populatedOrder.buyer.fullName,
      orderId: populatedOrder.orderId,
      invoicePdfBuffer,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.log("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};


export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders = await Order.find({
      seller: sellerId,
      isDeleted: false,
    })
      .populate("buyer", "fullName email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.log("Get Seller Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch seller orders",
      error: error.message,
    });
  }
};

export const getSellerSingleOrder = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      seller: sellerId,
      isDeleted: false,
    })
      .populate(
        "buyer",
        `
          fullName
          email
          businessProfile.companyName
          businessProfile.phoneNumber
          businessProfile.email
          businessProfile.gstNumber
          businessProfile.billingAddress
          businessProfile.shippingAddress
        `
      )
      .populate(
        "seller",
        `
          fullName
          email
          businessProfile.companyName
          businessProfile.phoneNumber
          businessProfile.email
        `
      )
      .populate("orderItems.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log("Get Seller Single Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
      error: error.message,
    });
  }
};


export const confirmSellerOrder = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      seller: sellerId,
      isDeleted: false,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be confirmed",
      });
    }

    order.orderStatus = "seller_confirmed";
    order.sellerConfirmedAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order confirmed successfully",
      order,
    });
  } catch (error) {
    console.log("Confirm Seller Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to confirm order",
      error: error.message,
    });
  }
};

export const rejectSellerOrder = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { orderId } = req.params;
    const { cancellationReason } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      seller: sellerId,
      isDeleted: false,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be rejected",
      });
    }

    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();
    order.cancellationReason =
      cancellationReason || "Rejected by seller";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order rejected successfully",
      order,
    });
  } catch (error) {
    console.log("Reject Seller Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject order",
      error: error.message,
    });
  }
};