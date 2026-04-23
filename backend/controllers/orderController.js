// backend/controllers/orderController.js

import Order from "../models/orderModel.js";
import Product from "../models/Product.js";
import generateOrderId from "../utils/generateOrderId.js";
import generateInvoicePdf from "../utils/pdf/generateInvoicePdf.js";
import sendOrderInvoiceEmail from "../utils/sendOrderInvoiceEmail.js";
import generateShipmentInvoiceId from "../utils/generateShipmentInvoiceId.js";

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
          addresses
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
          addresses
          businessProfile.companyName
          businessProfile.phoneNumber
          businessProfile.email
          businessProfile.gstNumber
          businessProfile.billingAddress
          businessProfile.shippingAddress
        `
      )
      .populate(
        "orderItems.product",
        `
          productName
          loadingLocation
          category
          application
        `
      );

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


export const addShipmentToOrder = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { orderId } = req.params;

    const {
      selectedItem,
      shippedQuantity,
      vehicleNumber,
      driverName,
      driverMobile,
      shipmentFrom,
      shipmentTo,
      selectedSubProducts,
    } = req.body;

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

    const existingShippedQuantity = order.shipments
      .filter((shipment) => shipment.selectedItem === selectedItem)
      .reduce(
        (total, shipment) =>
          total + Number(shipment.shippedQuantity || 0),
        0
      );

    const selectedOrderItem = order.orderItems.find(
      (item) => item.productName === selectedItem
    );

    if (!selectedOrderItem) {
      return res.status(400).json({
        success: false,
        message: "Selected item not found in order",
      });
    }

    const totalAllowedQuantity = Number(
      selectedOrderItem.requiredQuantity
    );

    const newTotalQuantity =
      existingShippedQuantity + Number(shippedQuantity);

    if (newTotalQuantity > totalAllowedQuantity) {
      return res.status(400).json({
        success: false,
        message: `Maximum allowed quantity for ${selectedItem} is ${totalAllowedQuantity}. Already shipped ${existingShippedQuantity}.`,
      });
    }

    const shipmentInvoiceId = await generateShipmentInvoiceId();

    const shipmentFile = req.file
      ? {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          originalName: req.file.originalname,
        }
      : null;

    const newShipment = {
      shipmentInvoiceId,
      selectedItem,
      shippedQuantity: Number(shippedQuantity),
      vehicleNumber,
      driverName,
      driverMobile,
      shipmentFrom,
      shipmentTo,

      selectedSubProducts: selectedSubProducts
        ? JSON.parse(selectedSubProducts)
        : [],

      shipmentFile,

      shipmentStatus: "shipped",
      approvedByAdmin: false,
      approvedBy: null,
      approvedAt: null,
      shippedAt: new Date(),
      deliveredAt: null,
    };

    order.shipments.push(newShipment);

    const allItemsFullyShipped = order.orderItems.every((item) => {
      const totalShippedForItem = order.shipments
        .filter(
          (shipment) => shipment.selectedItem === item.productName
        )
        .reduce(
          (total, shipment) =>
            total + Number(shipment.shippedQuantity || 0),
          0
        );

      return totalShippedForItem >= Number(item.requiredQuantity);
    });

    const hasAnyShipment = order.shipments.length > 0;

    if (allItemsFullyShipped) {
      order.orderStatus = "shipped";
      order.shippedAt = new Date();
    } else if (hasAnyShipment) {
      order.orderStatus = "partially_shipped";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Shipment details uploaded successfully. Waiting for admin approval.",
      shipments: order.shipments,
      orderStatus: order.orderStatus,
    });
  } catch (error) {
    console.log("Add Shipment To Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add shipment details",
      error: error.message,
    });
  }
};




export const getBuyerOrders = async (req, res) => {
  try {
    const buyerId = req.user._id;

    const orders = await Order.find({
      buyer: buyerId,
      isDeleted: false,
    })
      .populate(
        "seller",
        `
          fullName
          email
          businessProfile.companyName
          businessProfile.phoneNumber
          businessProfile.companyId
        `
      )
      .populate(
        "orderItems.product",
        `
          productName
          category
          application
          loadingLocation
        `
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.log("Get Buyer Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch buyer orders",
      error: error.message,
    });
  }
};


export const getBuyerSingleOrder = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      buyer: buyerId,
      isDeleted: false,
    })
      .populate(
        "seller",
        `
          fullName
          email
          businessProfile.companyName
          businessProfile.phoneNumber
          businessProfile.companyId
        `
      )
      .populate(
        "orderItems.product",
        `
          productName
          category
          application
          loadingLocation
        `
      );

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
    console.log("Get Buyer Single Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};



export const uploadBuyerPayment = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { orderId } = req.params;

    const {
      amount,
      paymentMode,
      transactionId,
      note,
      paymentFor,
    } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      buyer: buyerId,
      isDeleted: false,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ✅ FIXED LOGIC (IMPORTANT)
    const blockedStatuses = ["pending", "cancelled"];

    if (blockedStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Payment not allowed at this stage",
      });
    }

    // ✅ FILE
    const paymentFile = req.file
      ? {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          originalName: req.file.originalname,
        }
      : null;

    // ✅ VALIDATION
    const paidAmount = Number(amount);

    if (!paidAmount || paidAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    if (paidAmount > order.buyerPendingAmount) {
      return res.status(400).json({
        success: false,
        message: "Amount exceeds pending amount",
      });
    }

    // ✅ CALCULATIONS
    const newTotalPaid = order.buyerPaidAmount + paidAmount;
    const remainingAmount = order.totalAmount - newTotalPaid;
    const isFinalPayment = remainingAmount <= 0;

    // ✅ CREATE RECEIPT
    const newReceipt = {
      file: paymentFile,
      amount: paidAmount,
      paymentMode,
      transactionId,
      note,
      uploadedBy: buyerId,
      paymentFor: paymentFor || "buyer_to_admin",
      totalPaidTillNow: newTotalPaid,
      remainingAmount: Math.max(remainingAmount, 0),
      isPartialPayment: !isFinalPayment,
      isFinalPayment: isFinalPayment,
    };

    order.buyerPaymentReceipts.push(newReceipt);

    // ✅ UPDATE AMOUNTS
    order.buyerPaidAmount = newTotalPaid;
    order.buyerPendingAmount = Math.max(remainingAmount, 0);

    // ✅ UPDATE STATUS (DON’T BREAK SHIPMENT FLOW)
    if (isFinalPayment) {
      order.buyerPaymentStatus = "completed";

      // only update if not already shipped
      if (
        !["partially_shipped", "shipped", "delivered"].includes(
          order.orderStatus
        )
      ) {
        order.orderStatus = "payment_completed";
      }
    } else {
      order.buyerPaymentStatus = "partial";

      if (
        !["partially_shipped", "shipped", "delivered"].includes(
          order.orderStatus
        )
      ) {
        order.orderStatus = "partial_payment_uploaded";
      }
    }

    order.paymentUploadedAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment uploaded successfully",
      order,
    });
  } catch (error) {
    console.log("Upload Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload payment",
      error: error.message,
    });
  }
};