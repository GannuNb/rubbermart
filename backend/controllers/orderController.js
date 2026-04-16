// backend/controllers/orderController.js

import Order from "../models/orderModel.js";
import Product from "../models/Product.js";
import generateOrderId from "../utils/generateOrderId.js";
import generateInvoicePdf from "../utils/generateInvoicePdf.js";
import sendOrderInvoiceEmail from "../utils/sendOrderInvoiceEmail.js";

export const createOrder = async (req, res) => {
  try {
    const buyerId = req.user._id;

    const {
      seller,
      shippingAddress,
      orderItems,
      taxableAmount,
      gstAmount,
      totalAmount,
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

      validatedOrderItems.push({
        product: product._id,
        seller: product.seller._id,
        category: product.category,
        application: product.application,

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
        subtotal:
          Number(item.requiredQuantity) * Number(product.pricePerMT),
      });
    }

    const orderId = await generateOrderId();

    const order = await Order.create({
      orderId,
      buyer: buyerId,
      seller,
      shippingAddress,
      orderItems: validatedOrderItems,
      taxableAmount,
      gstAmount,
      totalAmount,
      orderStatus: "pending",
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("buyer", "fullName email")
      .populate(
        "seller",
        "fullName email businessProfile.companyName businessProfile.companyId"
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
    });
  }
};