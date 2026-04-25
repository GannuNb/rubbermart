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

    // ✅ allow after seller confirmation (and beyond)
    if (!["seller_confirmed", "partially_shipped", "shipped"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Payment allowed only after seller confirmation",
      });
    }

    const paymentFile = req.file
      ? {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          originalName: req.file.originalname,
        }
      : null;

    const paidAmount = Number(amount);

    if (!paidAmount || paidAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    // ✅ calculate remaining ONLY from VERIFIED payments
    const verifiedPaid = (order.buyerPaymentReceipts || [])
      .filter((r) => r.status === "verified")
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const remaining = order.totalAmount - verifiedPaid;

    if (paidAmount > remaining) {
      return res.status(400).json({
        success: false,
        message: "Amount exceeds remaining amount",
      });
    }

    // ✅ CREATE RECEIPT (PENDING)
    const newReceipt = {
      file: paymentFile,
      amount: paidAmount,
      paymentMode,
      transactionId,
      note,
      uploadedBy: buyerId,
      paymentFor: paymentFor || "buyer_to_admin",
      status: "pending",
    };

    order.buyerPaymentReceipts.push(newReceipt);

    order.paymentUploadedAt = new Date();

    // ❌ DO NOT UPDATE totals here

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment uploaded successfully (pending admin approval)",
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




export const getAdminAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      fromDate = "",
      toDate = "",
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    let query = {
      isDeleted: false,
    };

    /*
      Search by:
      - Order ID
      - Buyer Name
      - Buyer Email
    */

    if (search) {
      query.$or = [
        {
          orderId: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    /*
      Status Filter
    */

    if (status && status !== "all") {
      query.orderStatus = status;
    }

    /*
      Date Filter (FULL DAY FIX)
    */

    if (fromDate && toDate) {
      const startDate = new Date(fromDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    let orders = await Order.find(query)
      .populate("buyer", "fullName email")
      .populate("seller", "fullName email")
      .populate(
        "orderItems.product",
        `
          productName
          category
          application
        `
      )
      .sort({ createdAt: -1 });

    /*
      Manual search support for buyer name/email
    */

    if (search) {
      orders = orders.filter((order) => {
        const buyerName = order?.buyer?.fullName || "";
        const buyerEmail = order?.buyer?.email || "";

        return (
          order.orderId
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          buyerName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          buyerEmail
            .toLowerCase()
            .includes(search.toLowerCase())
        );
      });
    }

    const totalOrders = orders.length;

    const paginatedOrders = orders.slice(
      (pageNumber - 1) * limitNumber,
      pageNumber * limitNumber
    );

    /*
      Dashboard Counts
    */

    const allCount = await Order.countDocuments({
      isDeleted: false,
    });

    /*
      Pending =
      seller still not approved yet
    */

    const pendingCount = await Order.countDocuments({
      isDeleted: false,
      orderStatus: "pending",
    });

    const deliveredCount = await Order.countDocuments({
      isDeleted: false,
      orderStatus: {
        $in: ["delivered", "completed"],
      },
    });

    const partialShipmentCount =
      await Order.countDocuments({
        isDeleted: false,
        orderStatus: "partially_shipped",
      });

    const cancelledCount = await Order.countDocuments({
      isDeleted: false,
      orderStatus: "cancelled",
    });

    return res.status(200).json({
      success: true,
      totalOrders,
      currentPage: pageNumber,
      totalPages: Math.ceil(
        totalOrders / limitNumber
      ),

      counts: {
        all: allCount,
        pending: pendingCount,
        delivered: deliveredCount,
        partialShipments: partialShipmentCount,
        cancelled: cancelledCount,
      },

      orders: paginatedOrders,
    });
  } catch (error) {
    console.log(
      "Get Admin All Orders Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch admin orders",
      error: error.message,
    });
  }
};





export const getAdminSingleOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      isDeleted: false,
    })
      .populate(
        "buyer",
        `
        fullName
        email
        addresses
        businessProfile
        `
      )
      .populate(
        "seller",
        `
        fullName
        email
        addresses
        businessProfile
        `
      )
      .populate(
        "orderItems.product",
        `
        productName
        category
        application
        `
      )
      .populate(
        "buyerPaymentReceipts.uploadedBy",
        "fullName"
      )
      .populate(
        "buyerPaymentReceipts.verifiedBy",
        "fullName"
      )
      .populate(
        "sellerPaymentReceipts.uploadedBy",
        "fullName"
      )
      .populate(
        "sellerPaymentReceipts.verifiedBy",
        "fullName"
      )
      .populate(
        "shipments.approvedBy",
        "fullName"
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
    console.log(
      "Get Admin Single Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch order details",
      error: error.message,
    });
  }
};



export const approveBuyerPayment = async (req, res) => {
  try {
    const { orderId, paymentId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      isDeleted: false,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const payment =
      order.buyerPaymentReceipts.id(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment receipt not found",
      });
    }

    if (payment.status === "verified") {
      return res.status(400).json({
        success: false,
        message: "Payment already verified",
      });
    }

    /* =========================
       VERIFY PAYMENT ONLY
    ========================= */

    payment.status = "verified";
    payment.verifiedBy = req.user._id;
    payment.verifiedAt = new Date();

    await order.save();

    /* =========================
       RECALCULATE VERIFIED TOTAL
    ========================= */

    const refreshedOrder =
      await Order.findById(order._id);

    const verifiedTotal =
      refreshedOrder.buyerPaymentReceipts
        .filter(
          (item) => item.status === "verified"
        )
        .reduce(
          (sum, item) =>
            sum + (item.amount || 0),
          0
        );

    refreshedOrder.buyerPaidAmount =
      verifiedTotal;

    refreshedOrder.buyerPendingAmount =
      Math.max(
        (refreshedOrder.totalAmount || 0) -
          verifiedTotal,
        0
      );

    /* =========================
       UPDATE ONLY
       buyerPaymentStatus
       (NOT orderStatus)
    ========================= */

    if (
      refreshedOrder.buyerPendingAmount <= 0
    ) {
      refreshedOrder.buyerPaymentStatus =
        "completed";
    } else if (verifiedTotal > 0) {
      refreshedOrder.buyerPaymentStatus =
        "partial";
    } else {
      refreshedOrder.buyerPaymentStatus =
        "pending";
    }

    await refreshedOrder.save();

    /* =========================
       RETURN POPULATED ORDER
    ========================= */

    const updatedOrder =
      await Order.findById(
        refreshedOrder._id
      )
        .populate(
          "buyer",
          `
          fullName
          email
          addresses
          businessProfile
          `
        )
        .populate(
          "seller",
          `
          fullName
          email
          addresses
          businessProfile
          `
        )
        .populate(
          "orderItems.product",
          `
          productName
          category
          application
          `
        )
        .populate(
          "buyerPaymentReceipts.uploadedBy",
          "fullName"
        )
        .populate(
          "buyerPaymentReceipts.verifiedBy",
          "fullName"
        )
        .populate(
          "sellerPaymentReceipts.uploadedBy",
          "fullName"
        )
        .populate(
          "sellerPaymentReceipts.verifiedBy",
          "fullName"
        )
        .populate(
          "shipments.approvedBy",
          "fullName"
        );

    return res.status(200).json({
      success: true,
      message:
        "Buyer payment approved successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.log(
      "Approve Buyer Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to approve buyer payment",
      error: error.message,
    });
  }
};



export const uploadAdminToSellerPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const {
      amount,
      paymentMode,
      transactionId,
      note,
    } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      isDeleted: false,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    /* =========================
       FILE BUFFER
    ========================= */

    let uploadedFile = {};

    if (req.file) {
      uploadedFile = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        originalName:
          req.file.originalname,
      };
    }

    /* =========================
       CURRENT CALCULATION
    ========================= */

    const newPaidAmount =
      (order.sellerPaidAmount || 0) +
      Number(amount);

    const newPendingAmount =
      Math.max(
        (order.totalAmount || 0) -
          newPaidAmount,
        0
      );

    const isFinalPayment =
      newPendingAmount <= 0;

    /* =========================
       PUSH RECEIPT
    ========================= */

    order.sellerPaymentReceipts.push({
      file: uploadedFile,
      amount: Number(amount),
      paymentMode,
      transactionId,
      note,

      uploadedBy: req.user._id,

      paymentFor: "admin_to_seller",

      status: "verified",

      totalPaidTillNow:
        newPaidAmount,

      remainingAmount:
        newPendingAmount,

      isPartialPayment:
        !isFinalPayment,

      isFinalPayment:
        isFinalPayment,

      verifiedBy: req.user._id,
      verifiedAt: new Date(),
    });

    /* =========================
       UPDATE ORDER PAYMENT ONLY
    ========================= */

    order.sellerPaidAmount =
      newPaidAmount;

    order.sellerPendingAmount =
      newPendingAmount;

    if (newPendingAmount <= 0) {
      order.sellerPaymentStatus =
        "completed";
    } else if (newPaidAmount > 0) {
      order.sellerPaymentStatus =
        "partial";
    } else {
      order.sellerPaymentStatus =
        "pending";
    }

    await order.save();

    /* =========================
       RETURN POPULATED ORDER
    ========================= */

    const updatedOrder =
      await Order.findById(order._id)
        .populate(
          "buyer",
          `
          fullName
          email
          addresses
          businessProfile
          `
        )
        .populate(
          "seller",
          `
          fullName
          email
          addresses
          businessProfile
          `
        )
        .populate(
          "buyerPaymentReceipts.uploadedBy",
          "fullName"
        )
        .populate(
          "buyerPaymentReceipts.verifiedBy",
          "fullName"
        )
        .populate(
          "sellerPaymentReceipts.uploadedBy",
          "fullName"
        )
        .populate(
          "sellerPaymentReceipts.verifiedBy",
          "fullName"
        );

    return res.status(200).json({
      success: true,
      message:
        "Payment sent to seller successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.log(
      "Upload Admin To Seller Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to upload seller payment",
      error: error.message,
    });
  }
};