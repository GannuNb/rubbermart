// backend/controllers/orderController.js
import mongoose from "mongoose";
import User from "../models/User.js";
import Order from "../models/orderModel.js";
import Product from "../models/Product.js";
import generateOrderId from "../utils/generateOrderId.js";
import generateInvoicePdf from "../utils/pdf/generateInvoicePdf.js";
import sendOrderInvoiceEmail from "../utils/sendOrderInvoiceEmail.js";
import generateShipmentInvoiceId from "../utils/generateShipmentInvoiceId.js";
import generateShippingInvoicePdf from "../utils/pdf/shipping/generateShippingInvoicePdf.js";
import generateBuyReportPdf from "../utils/pdf/buyReport/generateBuyReportPdf.js";
import ShipmentTransportQuote from "../models/ShipmentTransportQuote.js";

//buyer---> MAIN BUYER buyerordercreation
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
    /*
=========================================
REDUCE PRODUCT STOCK
=========================================
*/

    for (const item of validatedOrderItems) {
      const product = await Product.findById(item.product);

      if (!product) continue;

      /*
  -----------------------------------------
  REDUCE AVAILABLE QUANTITY
  -----------------------------------------
  */

      product.quantity = Math.max(
        0,
        Number(product.quantity) - Number(item.requiredQuantity),
      );

      /*
  -----------------------------------------
  AUTO UPDATE STOCK STATUS
  -----------------------------------------
  */

      if (product.quantity <= 0) {
        product.stockStatus = "soldout";
      } else {
        product.stockStatus = "available";
      }

      await product.save();
    }

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
      `,
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

//SELLER ALL CONTROLLERS

//seller-->ordersforsellers
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { page = 1 } = req.query; // Get page from query
    const LIMIT = 5; // Matches your itemsPerPage in frontend
    const pageNumber = parseInt(page, 10) || 1;
    const skip = (pageNumber - 1) * LIMIT;

    // Get total count for pagination math
    const totalCount = await Order.countDocuments({
      seller: sellerId,
      isDeleted: false,
    });

    const orders = await Order.find({
      seller: sellerId,
      isDeleted: false,
    })
      .populate("buyer", "fullName email")
      .populate("orderItems.product")
      .populate(
        "shipments.assignedTransporter",
        `
    fullName
    email
    businessProfile
  `,
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(LIMIT);

    return res.status(200).json({
      success: true,
      orders,
      totalPages: Math.ceil(totalCount / LIMIT),
      currentPage: pageNumber,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch orders" });
  }
};

//seller--->getsingleorder
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
        `,
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
        `,
      )
      .populate(
        "orderItems.product",
        `
    productName
    loadingLocation
    category
    application
  `,
      )
      .populate(
        "shipments.assignedTransporter",
        `
    fullName
    email
    businessProfile
  `,
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

//seller--->confirmorder
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

    /* =========================
        UPDATE ORDER
      ========================= */

    await Order.updateOne(
      {
        _id: orderId,
        seller: sellerId,
        isDeleted: false,
      },
      {
        $set: {
          orderStatus: "seller_confirmed",

          sellerConfirmedAt: new Date(),
        },
      },
    );

    const updatedOrder = await Order.findById(orderId)
      .populate(
        "buyer",
        `
        fullName
        email
        addresses
        businessProfile
        `,
      )
      .populate(
        "seller",
        `
        fullName
        email
        addresses
        businessProfile
        `,
      )
      .populate(
        "orderItems.product",
        `
        productName
        category
        application
        loadingLocation
        `,
      );

    return res.status(200).json({
      success: true,
      message: "Order confirmed successfully",
      order: updatedOrder,
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

//seller ---> rejectorder
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

    /* =========================
       UPDATE ONLY REQUIRED FIELDS
       (NO FULL order.save())
    ========================= */

    await Order.updateOne(
      {
        _id: orderId,
        seller: sellerId,
        isDeleted: false,
      },
      {
        $set: {
          orderStatus: "cancelled",
          cancelledAt: new Date(),
          cancellationReason: cancellationReason || "Rejected by seller",
        },
      },
    );

    const updatedOrder = await Order.findById(orderId)
      .populate(
        "buyer",
        `
        fullName
        email
        addresses
        businessProfile
        `,
      )
      .populate(
        "seller",
        `
        fullName
        email
        addresses
        businessProfile
        `,
      )
      .populate(
        "orderItems.product",
        `
        productName
        category
        application
        loadingLocation
        `,
      );

    return res.status(200).json({
      success: true,
      message: "Order rejected successfully",
      order: updatedOrder,
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

//seller ---> addingshipment/packed
export const addShipmentToOrder = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { orderId } = req.params;

    const {
      selectedItem,
      shippedQuantity,
      shipmentFrom,
      shipmentTo,
      selectedSubProducts,
    } = req.body;

    const normalizedSelectedItem = selectedItem?.trim()?.toLowerCase();

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

    /* =========================
       EXISTING SHIPPED QUANTITY
    ========================= */

    const existingShippedQuantity = order.shipments
      .filter(
        (shipment) =>
          shipment.selectedItem?.trim()?.toLowerCase() ===
          normalizedSelectedItem,
      )
      .reduce(
        (total, shipment) => total + Number(shipment.shippedQuantity || 0),
        0,
      );

    /* =========================
       FIND ORDER ITEM
    ========================= */

    const selectedOrderItem = order.orderItems.find(
      (item) =>
        item.productName?.trim()?.toLowerCase() === normalizedSelectedItem,
    );

    if (!selectedOrderItem) {
      return res.status(400).json({
        success: false,
        message: "Selected item not found in order",
      });
    }

    const totalAllowedQuantity = Number(selectedOrderItem.requiredQuantity);

    const newTotalQuantity = existingShippedQuantity + Number(shippedQuantity);

    if (newTotalQuantity > totalAllowedQuantity) {
      return res.status(400).json({
        success: false,
        message: `Maximum allowed quantity for ${selectedItem} is ${totalAllowedQuantity}. Already shipped ${existingShippedQuantity}.`,
      });
    }

    /* =========================
       GENERATE SHIPMENT ID
    ========================= */

    const shipmentInvoiceId = await generateShipmentInvoiceId();

    /* =========================
       FILE BUFFER
    ========================= */

    /* =========================
   FILES
========================= */

    const packedItemPhoto = req.files?.packedItemPhoto?.[0]
      ? {
          data: req.files.packedItemPhoto[0].buffer,

          contentType: req.files.packedItemPhoto[0].mimetype,

          originalName: req.files.packedItemPhoto[0].originalname,
        }
      : null;

    const weightTicket = req.files?.weightTicket?.[0]
      ? {
          data: req.files.weightTicket[0].buffer,

          contentType: req.files.weightTicket[0].mimetype,

          originalName: req.files.weightTicket[0].originalname,
        }
      : null;

    /* =========================
       NEW SHIPMENT OBJECT
    ========================= */

    const newShipment = {
      shipmentInvoiceId,

      orderItemId: selectedOrderItem._id,

      selectedItem,

      shippedQuantity: Number(shippedQuantity),

      shipmentFrom,
      shipmentTo,

      selectedSubProducts: selectedSubProducts
        ? JSON.parse(selectedSubProducts)
        : [],

      packedItemPhoto,

      weightTicket,

      /* =========================
        TRANSPORT WORKFLOW
      ========================= */

      transportStatus: "open_for_quotes",

      assignmentMethod: "quote_selection",

      shipmentStatus: "packed",

      /* =========================
         TIMELINE
      ========================= */

      packedAt: new Date(),

      shippedAt: null,

      deliveredAt: null,
    };

    /* =========================
       TEMP CALCULATION
    ========================= */

    const tempShipments = [...order.shipments, newShipment];

    const allItemsFullyShipped = order.orderItems.every((item) => {
      const totalShippedForItem = tempShipments
        .filter(
          (shipment) =>
            shipment.selectedItem?.trim()?.toLowerCase() ===
            item.productName?.trim()?.toLowerCase(),
        )
        .reduce(
          (total, shipment) => total + Number(shipment.shippedQuantity || 0),
          0,
        );

      return totalShippedForItem >= Number(item.requiredQuantity);
    });

    let updatedOrderStatus = "partially_shipped";

    let updatedShippedAt = null;

    if (allItemsFullyShipped) {
      updatedOrderStatus = "partially_shipped";
    }

    /* =========================
       UPDATE ORDER
    ========================= */

    await Order.updateOne(
      {
        _id: orderId,
        seller: sellerId,
        isDeleted: false,
      },
      {
        $push: {
          shipments: newShipment,
        },

        $set: {
          orderStatus: updatedOrderStatus,

          shippedAt: updatedShippedAt,
        },
      },
    );

    /* =========================
       FETCH UPDATED ORDER
    ========================= */

    const updatedOrder = await Order.findById(orderId);

    return res.status(200).json({
      success: true,
      message: "Shipment details uploaded successfully.",

      shipments: updatedOrder.shipments || [],

      orderStatus: updatedOrder.orderStatus,
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

// seller ---> mark shipment shipped
export const markShipmentShippedBySeller = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const { orderId, shipmentId } = req.params;

    /* =========================
       FIND ORDER
    ========================= */

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

    /* =========================
       FIND SHIPMENT
    ========================= */

    const shipment = order.shipments.id(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    /* =========================
       VALIDATE ASSIGNED
    ========================= */

    if (shipment.transportStatus !== "transporter_assigned") {
      return res.status(400).json({
        success: false,
        message: "Shipment must have assigned transporter before shipping",
      });
    }

    /* =========================
       INVALID STATUS
    ========================= */

    if (
      shipment.shipmentStatus === "shipped" ||
      shipment.shipmentStatus === "in_transit" ||
      shipment.shipmentStatus === "delivered" ||
      shipment.shipmentStatus === "completed"
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipment already shipped or completed",
      });
    }

    /* =========================
       UPDATE SHIPMENT
    ========================= */

    shipment.shipmentStatus = "shipped";

    shipment.shippedAt = new Date();

    /* =========================
       UPDATE ORDER STATUS
    ========================= */

    const hasShippedShipments = order.shipments.some(
      (item) =>
        item.shipmentStatus === "shipped" ||
        item.shipmentStatus === "in_transit" ||
        item.shipmentStatus === "delivered",
    );

    if (
      hasShippedShipments &&
      order.orderStatus !== "delivered" &&
      order.orderStatus !== "completed"
    ) {
      order.orderStatus = "partially_shipped";
    }

    const allShipmentsShipped = order.shipments.every(
      (item) =>
        item.shipmentStatus === "shipped" ||
        item.shipmentStatus === "in_transit" ||
        item.shipmentStatus === "delivered",
    );

    if (allShipmentsShipped) {
      order.orderStatus = "shipped";

      order.shippedAt = new Date();
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Shipment marked as shipped successfully",
      order,
      shipment,
    });
  } catch (error) {
    console.log("Mark Shipment Shipped Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark shipment shipped",
    });
  }
};

// seller ---> mark delivered
export const markShipmentDeliveredBySeller = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const { orderId, shipmentId } = req.params;

    /* =========================
       FIND ORDER
    ========================= */

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

    /* =========================
       FIND SHIPMENT
    ========================= */

    const shipment = order.shipments.id(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    /* =========================
       INVALID STATUS
    ========================= */

    if (
      shipment.shipmentStatus === "completed" ||
      shipment.shipmentStatus === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot update completed/cancelled shipment",
      });
    }

    /* =========================
       VALIDATE SHIPPED FIRST
    ========================= */

    if (
      shipment.shipmentStatus !== "shipped" &&
      shipment.shipmentStatus !== "in_transit"
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipment must be shipped before delivery",
      });
    }

    /* =========================
       ALREADY DELIVERED
    ========================= */

    if (shipment.shipmentStatus === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Shipment already delivered",
      });
    }

    /* =========================
       UPDATE SHIPMENT
    ========================= */

    shipment.shipmentStatus = "delivered";

    shipment.deliveredAt = new Date();

    /* =========================
       CHECK ALL DELIVERED
    ========================= */

    const allShipmentsDelivered = order.shipments.every(
      (item) => item.shipmentStatus === "delivered",
    );

    if (allShipmentsDelivered) {
      order.orderStatus = "delivered";

      order.deliveredAt = new Date();
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Shipment marked as delivered",
      order,
      shipment,
    });
  } catch (error) {
    console.log("Seller Mark Delivered Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark shipment delivered",
    });
  }
};


//TRANSPORTER ALL CONTROLLERS

//transporter ---> getallpackeditems
export const getOpenTransportShipments = async (req, res) => {
  try {
    /* =========================
       FIND ORDERS
    ========================= */

    const orders = await Order.find({
      isDeleted: false,

      shipments: {
        $elemMatch: {
          transportStatus: {
            $in: [
              "open_for_quotes",
              "quotes_received",
              "admin_assignment_pending",
              "admin_assignment_rejected",
            ],
          },
        },
      },
    })
      .populate(
        "buyer",
        `
        fullName
        businessProfile
        `,
      )
      .populate(
        "seller",
        `
        fullName
        businessProfile
        `,
      );

    /* =========================
       FORMAT SHIPMENTS
    ========================= */

    const openShipments = [];

    orders.forEach((order) => {
      order.shipments.forEach((shipment) => {
        if (
          [
            "open_for_quotes",
            "quotes_received",
            "admin_assignment_pending",
            "admin_assignment_rejected",
          ].includes(shipment.transportStatus)
        ) {
          openShipments.push({
            orderId: order._id,

            orderInvoiceId: order.orderId,

            buyer: {
              fullName: order?.buyer?.fullName || "",

              companyName: order?.buyer?.businessProfile?.companyName || "",
            },

            seller: {
              fullName: order?.seller?.fullName || "",

              companyName: order?.seller?.businessProfile?.companyName || "",
            },

            shipment,
          });
        }
      });
    });

    /* =========================
       RESPONSE
    ========================= */

    return res.status(200).json({
      success: true,

      shipments: openShipments,
    });
  } catch (error) {
    console.log("Get Open Transport Shipments Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch transport shipments",

      error: error.message,
    });
  }
};

//transporter --->submitquote
export const submitTransportQuote = async (req, res) => {
  try {
    const transporterId = req.user._id;

    const { orderId, shipmentId } = req.params;

    const { quotedPrice, note, estimatedDeliveryDays } = req.body;

    /* =========================
       VALIDATE INPUTS
    ========================= */

    if (!quotedPrice || Number(quotedPrice) <= 0) {
      return res.status(400).json({
        success: false,

        message: "Valid quoted price is required",
      });
    }

    /* =========================
       FIND ORDER
    ========================= */

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

    /* =========================
       FIND SHIPMENT
    ========================= */

    const shipment = order.shipments.id(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,

        message: "Shipment not found",
      });
    }

    /* =========================
       VALIDATE STATUS
    ========================= */

    if (
      ![
        "open_for_quotes",
        "quotes_received",
        "admin_assignment_pending",
        "admin_assignment_rejected",
      ].includes(shipment.transportStatus)
    ) {
      return res.status(400).json({
        success: false,

        message: "Quotes are closed for this shipment",
      });
    }

    /* =========================
       PREVENT DUPLICATE QUOTE
    ========================= */

    const existingQuote = await ShipmentTransportQuote.findOne({
      shipmentId,

      transporter: transporterId,
    });

    if (existingQuote) {
      return res.status(400).json({
        success: false,

        message: "You already submitted quote for this shipment",
      });
    }

    /* =========================
       CREATE QUOTE
    ========================= */

    const quote = await ShipmentTransportQuote.create({
      orderId,

      shipmentId,

      transporter: transporterId,

      quotedPrice: Number(quotedPrice),

      note: note || "",

      estimatedDeliveryDays: Number(estimatedDeliveryDays) || 1,
    });

    /* =========================
       UPDATE SHIPMENT STATUS
    ========================= */

    if (shipment.transportStatus === "open_for_quotes") {
      shipment.transportStatus = "quotes_received";
    }

    /* =========================
       UPDATE ORDER STATUS
    ========================= */

    if (["seller_confirmed", "partially_shipped"].includes(order.orderStatus)) {
      order.orderStatus = "transport_processing";
    }

    /* =========================
       SAVE ORDER
    ========================= */

    await order.save();

    /* =========================
       FETCH CREATED QUOTE
    ========================= */

    const createdQuote = await ShipmentTransportQuote.findById(
      quote._id,
    ).populate(
      "transporter",
      `
        fullName
        businessProfile
        `,
    );

    /* =========================
       RESPONSE
    ========================= */

    return res.status(201).json({
      success: true,

      message: "Quote submitted successfully",

      quote: createdQuote,
    });
  } catch (error) {
    console.log("Submit Transport Quote Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to submit quote",

      error: error.message,
    });
  }
};

//transporters --> myquotes
export const getTransporterQuotes = async (req, res) => {
  try {
    const transporterId = req.user._id;

    /* =========================
       FIND QUOTES
    ========================= */

    const quotes = await ShipmentTransportQuote.find({
      transporter: transporterId,
    })
      .populate(
        "orderId",
        `
          orderId
          buyer
          seller
          shipments
          `,
      )
      .sort({
        createdAt: -1,
      });

    /* =========================
       FORMAT RESPONSE
    ========================= */

    const formattedQuotes = [];

    quotes.forEach((quote) => {
      const order = quote.orderId;

      if (!order) return;

      const shipment = order.shipments?.find(
        (item) => item._id.toString() === quote.shipmentId.toString(),
      );

      if (!shipment) return;

      formattedQuotes.push({
        _id: quote._id,

        orderId: order._id,

        orderInvoiceId: order.orderId,

        shipmentId: shipment._id,

        shipment,

        quotedPrice: quote.quotedPrice,

        note: quote.note,

        estimatedDeliveryDays: quote.estimatedDeliveryDays,

        quoteStatus: quote.quoteStatus,

        submittedAt: quote.submittedAt,

        selectedAt: quote.selectedAt,

        rejectedAt: quote.rejectedAt,
      });
    });

    /* =========================
       RESPONSE
    ========================= */

    return res.status(200).json({
      success: true,

      quotes: formattedQuotes,
    });
  } catch (error) {
    console.log("Get Transporter Quotes Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch transporter quotes",

      error: error.message,
    });
  }
};

//transporters ---> asignedshipments
export const getTransporterAssignedShipments = async (req, res) => {
  try {
    const transporterId = req.user._id;

    /* =========================
       FIND ORDERS
    ========================= */

    const orders = await Order.find({
      "shipments.assignedTransporter": transporterId,

      isDeleted: false,
    })
      .populate(
        "buyer seller",
        `
        fullName
        email
        businessProfile
        `,
      )
      .populate(
        "shipments.assignedTransporter",
        `
        fullName
        email
        businessProfile
        `,
      )
      .populate("shipments.selectedQuoteId");

    /* =========================
       FILTER ASSIGNED SHIPMENTS
    ========================= */

    const assignedShipments = [];

    orders.forEach((order) => {
      order.shipments.forEach((shipment) => {
        if (
          shipment?.assignedTransporter?._id?.toString() ===
            transporterId.toString() &&
          shipment?.transportStatus === "transporter_assigned" &&
          !["delivered", "completed", "cancelled"].includes(
            shipment.shipmentStatus,
          )
        ) {
          assignedShipments.push({
            orderId: order._id,

            orderInvoiceId: order.orderId,

            /* =========================
               BUYER
            ========================= */

            buyer: {
              fullName: order?.buyer?.fullName || "",

              companyName: order?.buyer?.businessProfile?.companyName || "",
            },

            /* =========================
               SELLER
            ========================= */

            seller: {
              fullName: order?.seller?.fullName || "",

              companyName: order?.seller?.businessProfile?.companyName || "",
            },

            /* =========================
               SHIPMENT
            ========================= */

            shipment: {
              _id: shipment._id,

              shipmentInvoiceId: shipment.shipmentInvoiceId,

              selectedItem: shipment.selectedItem,

              shippedQuantity: shipment.shippedQuantity,

              shipmentFrom: shipment.shipmentFrom,

              shipmentTo: shipment.shipmentTo,

              shipmentStatus: shipment.shipmentStatus,

              transportStatus: shipment.transportStatus,

              transportHSNCode: shipment.transportHSNCode,

              assignedAt: shipment.assignedAt,

              packedAt: shipment.packedAt,

              createdAt: shipment.createdAt,

              selectedSubProducts: shipment.selectedSubProducts || [],

              assignedTransporter: shipment.assignedTransporter || null,

              transportPrice: shipment.transportPrice || 0,

              transportFinalAmount: shipment.transportFinalAmount || 0,

              adminAssignedPrice: shipment.adminAssignedPrice || 0,

              assignmentMethod: shipment.assignmentMethod || "",

              /* =========================
                 FILES
              ========================= */

              packedItemPhoto: shipment.packedItemPhoto
                ? {
                    data: shipment.packedItemPhoto.data,

                    contentType: shipment.packedItemPhoto.contentType,

                    originalName: shipment.packedItemPhoto.originalName,
                  }
                : null,

              weightTicket: shipment.weightTicket
                ? {
                    data: shipment.weightTicket.data,

                    contentType: shipment.weightTicket.contentType,

                    originalName: shipment.weightTicket.originalName,
                  }
                : null,

              /* =========================
                 FINAL PRICE
              ========================= */

              finalTransportPrice:
                shipment?.adminAssignedPrice ||
                shipment?.transportPrice ||
                shipment?.selectedQuoteId?.quotedPrice ||
                0,
            },

            /* =========================
               QUOTE DETAILS
            ========================= */

            transportQuote: {
              quotedPrice:
                shipment?.adminAssignedPrice ||
                shipment?.transportPrice ||
                shipment?.selectedQuoteId?.quotedPrice ||
                0,

              estimatedDeliveryDays:
                shipment?.selectedQuoteId?.estimatedDeliveryDays || null,

              note:
                shipment?.adminAssignmentNote ||
                shipment?.selectedQuoteId?.note ||
                "",

              quoteStatus: shipment?.selectedQuoteId?.quoteStatus || "",
            },
          });
        }
      });
    });

    /* =========================
       SORT LATEST FIRST
    ========================= */

    assignedShipments.sort(
      (a, b) => new Date(b.shipment.createdAt) - new Date(a.shipment.createdAt),
    );

    /* =========================
       RESPONSE
    ========================= */

    return res.status(200).json({
      success: true,

      assignedShipments,
    });
  } catch (error) {
    console.log("Get Transporter Assigned Shipments Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch assigned shipments",

      error: error.message,
    });
  }
};

//transporters ---> completed/history
export const getTransporterCompletedDeliveries = async (req, res) => {
  try {
    const transporterId = req.user._id;

    /* =========================
       FIND ORDERS
    ========================= */

    const orders = await Order.find({
      "shipments.assignedTransporter": transporterId,

      isDeleted: false,
    })
      .populate(
        "buyer seller",
        `
        fullName
        email
        businessProfile
        `,
      )
      .populate(
        "shipments.assignedTransporter",
        `
        fullName
        email
        businessProfile
        `,
      )
      .populate("shipments.selectedQuoteId");

    /* =========================
       COMPLETED DELIVERIES
    ========================= */

    const completedDeliveries = [];

    orders.forEach((order) => {
      order.shipments.forEach((shipment) => {
        /* =========================
           VALID DELIVERED SHIPMENTS
        ========================= */

        if (
          shipment?.assignedTransporter?._id?.toString() ===
            transporterId.toString() &&
          ["delivered", "completed"].includes(shipment.shipmentStatus)
        ) {
          /* =========================
             VERIFIED PAYMENTS
          ========================= */

          const payments =
            shipment?.adminTransportPaymentReceipts?.filter(
              (payment) => payment.status === "verified",
            ) || [];

          /* =========================
             TOTAL RECEIVED
          ========================= */

          const totalReceived = payments.reduce(
            (sum, payment) => sum + Number(payment.amount || 0),
            0,
          );

          /* =========================
             FINAL TRANSPORT PRICE
          ========================= */

          const transportAmount =
            shipment?.transportFinalAmount ||
            Number(
              shipment?.adminAssignedPrice ||
                shipment?.transportPrice ||
                shipment?.selectedQuoteId?.quotedPrice ||
                0,
            ) + Number(shipment?.transportGSTAmount || 0);

          /* =========================
             REMAINING AMOUNT
          ========================= */

          const remainingAmount =
            Number(transportAmount) - Number(totalReceived);

          /* =========================
             PUSH DATA
          ========================= */

          completedDeliveries.push({
            orderId: order._id,

            orderInvoiceId: order.orderId,

            buyer: {
              fullName: order?.buyer?.fullName || "",

              companyName: order?.buyer?.businessProfile?.companyName || "",
            },

            seller: {
              fullName: order?.seller?.fullName || "",

              companyName: order?.seller?.businessProfile?.companyName || "",
            },

            shipment: {
              ...shipment._doc,

              /* =========================
                 FINAL PRICE
              ========================= */

              finalTransportPrice: transportAmount,
            },

            /* =========================
               QUOTE DETAILS
            ========================= */

            transportQuote: {
              quotedPrice: transportAmount,

              estimatedDeliveryDays:
                shipment?.selectedQuoteId?.estimatedDeliveryDays || null,

              note:
                shipment?.adminAssignmentNote ||
                shipment?.selectedQuoteId?.note ||
                "",

              quoteStatus: shipment?.selectedQuoteId?.quoteStatus || "",
            },

            /* =========================
               PAYMENT DETAILS
            ========================= */

            payments,

            transportAmount,

            totalReceived,

            remainingAmount,
          });
        }
      });
    });

    /* =========================
       SORT LATEST FIRST
    ========================= */

    completedDeliveries.sort(
      (a, b) =>
        new Date(b.shipment?.deliveredAt || b.shipment?.createdAt) -
        new Date(a.shipment?.deliveredAt || a.shipment?.createdAt),
    );

    /* =========================
       RESPONSE
    ========================= */

    return res.status(200).json({
      success: true,

      completedDeliveries,
    });
  } catch (error) {
    console.log("Get Transporter Completed Deliveries Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch completed deliveries",

      error: error.message,
    });
  }
};

//transporter --> pendingassignments
export const getTransporterPendingAssignments = async (req, res) => {
  try {
    const transporterId = req.user._id;

    /* =========================
       FIND ORDERS
    ========================= */

    const orders = await Order.find({
      isDeleted: false,

      shipments: {
        $elemMatch: {
          assignedTransporter: transporterId,

          transportStatus: "admin_assignment_pending",
        },
      },
    })
      .populate(
        "buyer seller",
        `
        fullName
        email
        businessProfile
        `,
      )
      .populate("shipments.selectedQuoteId")
      .populate(
        "shipments.assignedTransporter",
        `
        fullName
        email
        businessProfile
        `,
      );

    /* =========================
       FILTER SHIPMENTS
    ========================= */

    const pendingAssignments = [];

    orders.forEach((order) => {
      order.shipments.forEach((shipment) => {
        if (
          shipment?.assignedTransporter?._id?.toString() ===
            transporterId.toString() &&
          shipment?.transportStatus === "admin_assignment_pending"
        ) {
          pendingAssignments.push({
            orderId: order._id,

            orderInvoiceId: order.orderId,

            buyer: {
              fullName: order?.buyer?.fullName || "",

              companyName: order?.buyer?.businessProfile?.companyName || "",
            },

            seller: {
              fullName: order?.seller?.fullName || "",

              companyName: order?.seller?.businessProfile?.companyName || "",
            },

            shipment: {
              ...shipment.toObject(),

              /* =========================
                   FINAL TRANSPORT PRICE
                ========================= */

              finalTransportPrice:
                shipment?.transportFinalAmount ||
                shipment?.adminAssignedPrice ||
                shipment?.transportPrice ||
                shipment?.selectedQuoteId?.quotedPrice ||
                0,
            },

            /* =========================
                 QUOTE DETAILS
              ========================= */

            transportQuote: {
              quotedPrice:
                shipment?.transportFinalAmount ||
                shipment?.adminAssignedPrice ||
                shipment?.transportPrice ||
                shipment?.selectedQuoteId?.quotedPrice ||
                0,

              estimatedDeliveryDays:
                shipment?.selectedQuoteId?.estimatedDeliveryDays || null,

              note:
                shipment?.adminAssignmentNote ||
                shipment?.selectedQuoteId?.note ||
                "",

              quoteStatus: shipment?.selectedQuoteId?.quoteStatus || "",
            },
          });
        }
      });
    });

    /* =========================
       SORT LATEST FIRST
    ========================= */

    pendingAssignments.sort(
      (a, b) => new Date(b.shipment.createdAt) - new Date(a.shipment.createdAt),
    );

    /* =========================
       RESPONSE
    ========================= */

    return res.status(200).json({
      success: true,

      assignments: pendingAssignments,
    });
  } catch (error) {
    console.log("Get Pending Assignments Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch assignments",

      error: error.message,
    });
  }
};

//transporter ---> fromadminrequest-accept
export const transporterAcceptAssignment = async (req, res) => {
  try {
    const transporterId = req.user._id;

    const { orderId, shipmentId } = req.params;

    /* =========================
       FIND ORDER
    ========================= */

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

    /* =========================
       FIND SHIPMENT
    ========================= */

    const shipment = order.shipments.id(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,

        message: "Shipment not found",
      });
    }

    /* =========================
       VALIDATE TRANSPORTER
    ========================= */

    if (
      shipment?.assignedTransporter?.toString() !== transporterId.toString()
    ) {
      return res.status(403).json({
        success: false,

        message: "Unauthorized transporter",
      });
    }

    /* =========================
       VALIDATE STATUS
    ========================= */

    if (shipment.transportStatus !== "admin_assignment_pending") {
      return res.status(400).json({
        success: false,

        message: "Assignment already processed",
      });
    }

    /* =========================
       GET TRANSPORTER
    ========================= */

    const transporter = await User.findById(transporterId);

    if (!transporter) {
      return res.status(404).json({
        success: false,

        message: "Transporter not found",
      });
    }

    /* =========================
       GST CALCULATION
    ========================= */

    const transporterGST = transporter?.businessProfile?.gstNumber || "";

    const transporterStateCode = transporterGST.substring(0, 2);

    const companyStateCode = "27";

    const gstType =
      transporterStateCode === companyStateCode ? "cgst_sgst" : "igst";

    /* =========================
       PRICE
    ========================= */

    const transportPrice =
      Number(shipment.adminAssignedPrice) ||
      Number(shipment.transportPrice) ||
      Number(shipment?.selectedQuoteId?.quotedPrice) ||
      0;

    const transportGSTAmount = Number((transportPrice * 0.05).toFixed(2));

    const transportFinalAmount = Number(
      (transportPrice + transportGSTAmount).toFixed(2),
    );

    /* =========================
       UPDATE SHIPMENT
    ========================= */

    shipment.transportStatus = "transporter_assigned";

    shipment.shipmentStatus = "assigned";

    shipment.transportPrice = transportPrice;

    shipment.transportGSTType = gstType;

    shipment.transportGSTAmount = transportGSTAmount;

    shipment.transportFinalAmount = transportFinalAmount;

    shipment.assignedAt = new Date();
    shipment.pickedUpAt = null;

    /* =========================
       CREATE QUOTE FOR
       DIRECT ASSIGNMENT
    ========================= */

    if (
      shipment.assignmentMethod === "admin_direct_assignment" &&
      shipment.adminAssignedPrice
    ) {
      const existingQuote = await ShipmentTransportQuote.findOne({
        shipmentId: shipment._id,

        transporter: transporterId,
      });

      if (!existingQuote) {
        const createdQuote = await ShipmentTransportQuote.create({
          orderId: order._id,

          shipmentId: shipment._id,

          transporter: transporterId,

          quotedPrice: shipment.adminAssignedPrice,

          note: shipment.adminAssignmentNote || "Direct admin assignment",

          estimatedDeliveryDays: 1,

          quoteStatus: "selected",

          selectedAt: new Date(),
        });

        shipment.selectedQuoteId = createdQuote._id;
      }
    }

    /* =========================
       SELECT ACCEPTED QUOTE
    ========================= */

    await ShipmentTransportQuote.updateOne(
      {
        shipmentId: shipment._id,

        transporter: transporterId,
      },
      {
        $set: {
          quoteStatus: "selected",

          selectedAt: new Date(),
        },
      },
    );

    /* =========================
       REJECT OTHER QUOTES
    ========================= */

    await ShipmentTransportQuote.updateMany(
      {
        shipmentId: shipment._id,

        transporter: {
          $ne: transporterId,
        },
      },
      {
        $set: {
          quoteStatus: "rejected",

          rejectedAt: new Date(),
        },
      },
    );

    /* =========================
       SAVE ORDER
    ========================= */
    await order.save();

    /* =========================
       UPDATED ORDER
    ========================= */

    const updatedOrder = await Order.findById(orderId)
      .populate(
        "shipments.assignedTransporter",
        `
          fullName
          email
          businessProfile
          `,
      )
      .populate("shipments.selectedQuoteId");

    /* =========================
       RESPONSE
    ========================= */

    return res.status(200).json({
      success: true,

      message: "Assignment accepted successfully",

      order: updatedOrder,
    });
  } catch (error) {
    console.log("Transporter Accept Assignment Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to accept assignment",

      error: error.message,
    });
  }
};

//transporter ---> rejectadminrequest
export const transporterRejectAssignment = async (req, res) => {
  try {
    const transporterId = req.user._id;

    const { orderId, shipmentId } = req.params;

    /* =========================
       FIND ORDER
    ========================= */

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

    /* =========================
       FIND SHIPMENT
    ========================= */

    const shipment = order.shipments.id(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,

        message: "Shipment not found",
      });
    }

    /* =========================
       VALIDATE TRANSPORTER
    ========================= */

    if (
      shipment?.assignedTransporter?.toString() !== transporterId.toString()
    ) {
      return res.status(403).json({
        success: false,

        message: "Unauthorized transporter",
      });
    }

    /* =========================
       VALIDATE STATUS
    ========================= */

    if (shipment.transportStatus !== "admin_assignment_pending") {
      return res.status(400).json({
        success: false,

        message: "Assignment already processed",
      });
    }

    /* =========================
       REJECT CURRENT QUOTE
    ========================= */

    await ShipmentTransportQuote.updateOne(
      {
        shipmentId: shipment._id,

        transporter: transporterId,
      },
      {
        $set: {
          quoteStatus: "rejected",

          rejectedAt: new Date(),
        },
      },
    );

    /* =========================
       RESET SHIPMENT
    ========================= */

    shipment.transportStatus = "open_for_quotes";

    shipment.shipmentStatus = "packed";

    shipment.assignedTransporter = null;

    shipment.selectedQuoteId = null;

    shipment.assignedAt = null;

    shipment.adminAssignedAt = null;

    shipment.transportPrice = 0;

    shipment.transportGSTAmount = 0;

    shipment.transportGSTType = "igst";

    shipment.transportFinalAmount = 0;

    shipment.adminAssignedPrice = 0;

    shipment.transportPaymentStatus = "unpaid";

    shipment.adminAssignmentNote = "";

    shipment.pickedUpAt = null;

    /* =========================
       SAVE ORDER
    ========================= */

    await order.save();

    /* =========================
       UPDATED ORDER
    ========================= */

    const updatedOrder = await Order.findById(orderId)
      .populate(
        "shipments.assignedTransporter",
        `
          fullName
          email
          businessProfile
          `,
      )
      .populate("shipments.selectedQuoteId");

    /* =========================
       RESPONSE
    ========================= */

    return res.status(200).json({
      success: true,

      message: "Assignment rejected successfully",

      order: updatedOrder,
    });
  } catch (error) {
    console.log("Transporter Reject Assignment Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to reject assignment",

      error: error.message,
    });
  }
};

//transporter ---> updating shipedstatus
export const markShipmentShippedByTransporter = async (req, res) => {
  try {
    const transporterId = req.user._id;

    const { orderId, shipmentId } = req.params;

    /* =========================
       FIND ORDER
    ========================= */

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

    /* =========================
       FIND SHIPMENT
    ========================= */

    const shipment = order.shipments.id(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,

        message: "Shipment not found",
      });
    }

    /* =========================
       VALIDATE TRANSPORTER
    ========================= */

    if (
      shipment?.assignedTransporter?.toString() !== transporterId.toString()
    ) {
      return res.status(403).json({
        success: false,

        message: "Unauthorized transporter",
      });
    }

    /* =========================
       VALIDATE TRANSPORT STATUS
    ========================= */

    if (shipment.transportStatus !== "transporter_assigned") {
      return res.status(400).json({
        success: false,

        message: "Transporter not assigned",
      });
    }

    /* =========================
       VALIDATE SHIPMENT STATUS
    ========================= */

    if (shipment.shipmentStatus === "shipped") {
      return res.status(400).json({
        success: false,

        message: "Shipment already shipped",
      });
    }

    if (shipment.shipmentStatus === "delivered") {
      return res.status(400).json({
        success: false,

        message: "Shipment already delivered",
      });
    }

    /* =========================
       UPDATE STATUS
    ========================= */

    shipment.shipmentStatus = "shipped";

    shipment.inTransitAt = new Date();

    shipment.pickedUpAt = new Date();

    /* =========================
       UPDATE ORDER STATUS
    ========================= */

    const allShipmentsShipped = order.shipments.every(
      (item) =>
        item.shipmentStatus === "shipped" ||
        item.shipmentStatus === "delivered" ||
        item.shipmentStatus === "completed",
    );

    if (allShipmentsShipped) {
      order.orderStatus = "shipped";

      order.shippedAt = new Date();
    }

    /* =========================
       SAVE ORDER
    ========================= */

    await order.save();

    /* =========================
       UPDATED ORDER
    ========================= */

    const updatedOrder = await Order.findById(orderId)
      .populate(
        "buyer seller",
        `
          fullName
          email
          businessProfile
          `,
      )
      .populate(
        "shipments.assignedTransporter",
        `
          fullName
          email
          businessProfile
          `,
      )
      .populate("shipments.selectedQuoteId");

    /* =========================
       RESPONSE
    ========================= */

    return res.status(200).json({
      success: true,

      message: "Shipment marked as shipped",

      order: updatedOrder,
    });
  } catch (error) {
    console.log("Mark Shipment Shipped By Transporter Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to update shipment",

      error: error.message,
    });
  }
};

//transporter ---> getting payments
export const getTransporterPaymentHistory = async (req, res) => {
  try {
    const transporterId = req.user._id;

    /* =========================
       FIND ORDERS
    ========================= */

    const orders = await Order.find({
      "shipments.assignedTransporter": transporterId,
    })
      .populate(
        "buyer",
        `
          fullName
          businessProfile.companyName
        `,
      )
      .populate(
        "seller",
        `
          fullName
          businessProfile.companyName
        `,
      );

    /* =========================
       FILTER SHIPMENTS
    ========================= */

    const transporterShipments = [];

    orders.forEach((order) => {
      order.shipments.forEach((shipment) => {
        if (
          shipment?.assignedTransporter?.toString() === transporterId.toString()
        ) {
          /* =========================
             VERIFIED ADMIN PAYMENTS
          ========================= */

          const verifiedPayments =
            shipment.adminTransportPaymentReceipts.filter(
              (r) => r.status === "verified",
            );

          const totalReceived = verifiedPayments.reduce(
            (sum, r) => sum + Number(r.amount || 0),
            0,
          );

          transporterShipments.push({
            orderId: order._id,

            orderNumber: order.orderId,

            buyer:
              order?.buyer?.businessProfile?.companyName ||
              order?.buyer?.fullName,

            seller:
              order?.seller?.businessProfile?.companyName ||
              order?.seller?.fullName,

            shipmentId: shipment._id,

            shipmentInvoiceId: shipment.shipmentInvoiceId,

            selectedItem: shipment.selectedItem,

            transportAmount: shipment.transportFinalAmount || 0,

            totalReceived,

            remainingAmount:
              Number(shipment.transportFinalAmount || 0) - totalReceived,

            payments: verifiedPayments,

            shipmentStatus: shipment.shipmentStatus,

            pickedUpAt: shipment.pickedUpAt,

            deliveredAt: shipment.deliveredAt,
          });
        }
      });
    });

    return res.status(200).json({
      success: true,

      shipments: transporterShipments,
    });
  } catch (error) {
    console.log("Get Transporter Payment History Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch transporter payments",

      error: error.message,
    });
  }
};

//ADMIN ALL CONTROLLERS

//admin -> transportersquotes
export const getShipmentQuotes = async (req, res) => {
  try {
    const { shipmentId } = req.params;

    /* =========================
         VALIDATE SHIPMENT ID
      ========================= */

    if (!mongoose.Types.ObjectId.isValid(shipmentId)) {
      return res.status(400).json({
        success: false,

        message: "Invalid shipment id",
      });
    }

    /* =========================
         FETCH QUOTES
      ========================= */

    const quotes = await ShipmentTransportQuote.find({
      shipmentId: new mongoose.Types.ObjectId(shipmentId),
    })
      .populate(
        "transporter",
        `
            fullName
            email
            businessProfile
            `,
      )
      .sort({
        quotedPrice: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,

      quotes,
    });
  } catch (error) {
    console.log("Get Shipment Quotes Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch shipment quotes",
    });
  }
};

//admin ---> assigntoshipment
export const assignTransporterToShipment = async (req, res) => {
  try {
    const { orderId, shipmentId, quoteId } = req.params;

    /* =========================
       FIND ORDER
    ========================= */

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    /* =========================
       FIND SHIPMENT
    ========================= */

    const shipment = order.shipments.id(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    /* =========================
       VALIDATE STATUS
    ========================= */

    if (
      ![
        "quotes_received",
        "open_for_quotes",
        "admin_assignment_rejected",
      ].includes(shipment.transportStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipment already assigned",
      });
    }

    /* =========================
       FIND SELECTED QUOTE
    ========================= */

    const selectedQuote =
      await ShipmentTransportQuote.findById(quoteId).populate("transporter");

    if (!selectedQuote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    /* =========================
       GST CALCULATION
    ========================= */

    const gstType = order.gstType || "igst";

    const transportPrice = Number(selectedQuote?.quotedPrice || 0);

    const transportGSTPercent = 5;

    const transportGSTAmount = Number(
      (transportPrice * (transportGSTPercent / 100)).toFixed(2),
    );

    const transportFinalAmount = Number(
      (transportPrice + transportGSTAmount).toFixed(2),
    );

    /* =========================
       UPDATE SHIPMENT
    ========================= */

    shipment.assignedTransporter = selectedQuote.transporter._id;

    shipment.selectedQuoteId = selectedQuote._id;

    shipment.transportStatus = "transporter_assigned";

    shipment.shipmentStatus = "assigned";

    shipment.assignmentMethod = "quote_selection";

    shipment.assignedAt = new Date();

    shipment.adminAssignedAt = new Date();

    /* =========================
       TRANSPORT AMOUNT
    ========================= */

    shipment.transportPrice = transportPrice;

    shipment.transportGSTPercent = transportGSTPercent;

    shipment.transportGSTType = gstType;

    shipment.transportGSTAmount = transportGSTAmount;

    shipment.transportFinalAmount = transportFinalAmount;

    /* =========================
       ADMIN FINAL APPROVAL PRICE
    ========================= */

    shipment.adminAssignedPrice = transportPrice;

    /* =========================
       PAYMENT STATUS
    ========================= */

    shipment.transportPaymentStatus = "unpaid";

    /* =========================
       REJECT OTHER QUOTES
    ========================= */

    await ShipmentTransportQuote.updateMany(
      {
        shipmentId: new mongoose.Types.ObjectId(shipmentId),

        _id: {
          $ne: quoteId,
        },
      },
      {
        $set: {
          quoteStatus: "rejected",

          rejectedAt: new Date(),
        },
      },
    );

    /* =========================
       SELECT CURRENT QUOTE
    ========================= */

    await ShipmentTransportQuote.findByIdAndUpdate(quoteId, {
      $set: {
        quoteStatus: "selected",

        selectedAt: new Date(),
      },
    });

    /* =========================
       UPDATE ORDER STATUS
    ========================= */

    if (["seller_confirmed", "partially_shipped"].includes(order.orderStatus)) {
      order.orderStatus = "transport_processing";
    }

    /* =========================
       SAVE ORDER
    ========================= */

    await order.save();

    /* =========================
       UPDATED ORDER
    ========================= */

    const updatedOrder = await Order.findById(orderId)
      .populate(
        "buyer seller",
        `
          fullName
          email
          businessProfile
          `,
      )
      .populate(
        "shipments.assignedTransporter",
        `
          fullName
          email
          businessProfile
          `,
      )
      .populate("shipments.selectedQuoteId");

    /* =========================
       RESPONSE
    ========================= */

    return res.status(200).json({
      success: true,

      message: "Transporter assigned successfully",

      order: updatedOrder,
    });
  } catch (error) {
    console.log("Assign Transporter Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to assign transporter",

      error: error.message,
    });
  }
};

//admin ---> admindirectassign/manual
export const adminDirectAssignTransporter = async (req, res) => {
  try {
    const { orderId, shipmentId } = req.params;

    const { transporterId, adminPrice, adminNote } = req.body;

    /* =========================
       FIND ORDER
    ========================= */

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found",
      });
    }

    /* =========================
       FIND SHIPMENT
    ========================= */

    const shipment = order.shipments.id(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,

        message: "Shipment not found",
      });
    }

    /* =========================
       FIND TRANSPORTER
    ========================= */

    const transporter = await User.findById(transporterId);

    if (!transporter || transporter.role !== "transporter") {
      return res.status(404).json({
        success: false,

        message: "Transporter not found",
      });
    }

    /* =========================
       GST CALCULATION
    ========================= */

    const gstType = order.gstType || "igst";

    const transportPrice = Number(adminPrice || 0);

    const transportGSTPercent = 5;

    const transportGSTAmount = Number(
      (transportPrice * (transportGSTPercent / 100)).toFixed(2),
    );

    const transportFinalAmount = Number(
      (transportPrice + transportGSTAmount).toFixed(2),
    );

    /* =========================
       ASSIGN TRANSPORTER
    ========================= */

    shipment.assignedTransporter = transporter._id;

    shipment.transportStatus = "admin_assignment_pending";

    shipment.assignmentMethod = "admin_direct_assignment";

    shipment.assignedAt = new Date();

    shipment.adminAssignedAt = new Date();

    shipment.adminAssignedPrice = transportPrice;

    shipment.adminAssignmentNote = adminNote;

    /* =========================
       TRANSPORT AMOUNTS
    ========================= */

    shipment.transportPrice = transportPrice;

    shipment.transportGSTPercent = transportGSTPercent;

    shipment.transportGSTType = gstType;

    shipment.transportGSTAmount = transportGSTAmount;

    shipment.transportFinalAmount = transportFinalAmount;

    shipment.transportPaymentStatus = "unpaid";

    /* =========================
       SAVE
    ========================= */

    await order.save();

    /* =========================
       UPDATED ORDER
    ========================= */

    const updatedOrder = await Order.findById(orderId).populate(
      "shipments.assignedTransporter",
      `
          fullName
          email
          businessProfile
          `,
    );

    return res.status(200).json({
      success: true,

      message: "Transporter assigned successfully",

      order: updatedOrder,
    });
  } catch (error) {
    console.log("Admin Direct Assignment Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to assign transporter",

      error: error.message,
    });
  }
};

//admin ---> dropdownselection
export const getAllTransporters = async (req, res) => {
  try {
    /* =========================
       FETCH TRANSPORTERS
    ========================= */

    const transporters = await User.find({
      role: "transporter",
    })
      .select(
        `
          fullName
          email
          mobile
          businessProfile
        `,
      )
      .sort({
        createdAt: -1,
      })
      .lean();

    console.log("Transporters:", transporters);

    /* =========================
       RESPONSE
    ========================= */

    return res.status(200).json({
      success: true,

      totalTransporters: transporters.length,

      transporters,
    });
  } catch (error) {
    console.log("Get Transporters Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch transporters",

      error: error.message,
    });
  }
};

//admin ---> updating shiped status
export const markShipmentShippedByAdmin = async (req, res) => {
  try {
    const { orderId, shipmentId } = req.params;

    const order = await Order.findById(orderId).populate(
      "shipments.assignedTransporter",
      `
        fullName
        email
        businessProfile
      `,
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const shipment = order.shipments.id(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    /* =========================
       VALIDATE STATUS
    ========================= */

    if (
      ["shipped", "in_transit", "delivered", "completed"].includes(
        shipment.shipmentStatus,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipment already shipped or completed",
      });
    }

    /* =========================
       UPDATE STATUS
    ========================= */

    shipment.shipmentStatus = "shipped";

    shipment.pickedUpAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,

      message: "Shipment marked as shipped",

      order,
    });
  } catch (error) {
    console.log("Admin Mark Shipment Shipped Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to update shipment",
    });
  }
};

// admin --> allordersfrombuyer
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
        `,
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
          order.orderId.toLowerCase().includes(search.toLowerCase()) ||
          buyerName.toLowerCase().includes(search.toLowerCase()) ||
          buyerEmail.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    const totalOrders = orders.length;

    const paginatedOrders = orders.slice(
      (pageNumber - 1) * limitNumber,
      pageNumber * limitNumber,
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

    const partialShipmentCount = await Order.countDocuments({
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
      totalPages: Math.ceil(totalOrders / limitNumber),

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
    console.log("Get Admin All Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin orders",
      error: error.message,
    });
  }
};

//admin --->singleorder
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
        `,
      )
      .populate(
        "seller",
        `
        fullName
        email
        addresses
        businessProfile
        `,
      )
      .populate(
        "orderItems.product",
        `
        productName
        category
        application
        `,
      )
      .populate("buyerPaymentReceipts.uploadedBy", "fullName")
      .populate("buyerPaymentReceipts.verifiedBy", "fullName")
      .populate("sellerPaymentReceipts.uploadedBy", "fullName")
      .populate("sellerPaymentReceipts.verifiedBy", "fullName")
      .populate(
        "shipments.assignedTransporter",
        `
    fullName
    email
    businessProfile.companyName
    businessProfile.phoneNumber
  `,
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
    console.log("Get Admin Single Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
      error: error.message,
    });
  }
};

//admin ---> approvepayment
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

    const payment = order.buyerPaymentReceipts.id(paymentId);

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
       UPDATE PAYMENT ONLY
       (NO FULL SAVE)
    ========================= */

    await Order.updateOne(
      {
        _id: orderId,
        "buyerPaymentReceipts._id": paymentId,
      },
      {
        $set: {
          "buyerPaymentReceipts.$.status": "verified",
          "buyerPaymentReceipts.$.verifiedBy": req.user._id,
          "buyerPaymentReceipts.$.verifiedAt": new Date(),
        },
      },
    );

    /* =========================
       FETCH UPDATED ORDER
    ========================= */

    const refreshedOrder = await Order.findById(orderId);

    const verifiedTotal = refreshedOrder.buyerPaymentReceipts
      .filter((item) => item.status === "verified")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const buyerPendingAmount = Math.max(
      Number(refreshedOrder.totalAmount || 0) - verifiedTotal,
      0,
    );

    let buyerPaymentStatus = "pending";

    if (buyerPendingAmount <= 0) {
      buyerPaymentStatus = "completed";
    } else if (verifiedTotal > 0) {
      buyerPaymentStatus = "partial";
    }

    /* =========================
       UPDATE ONLY PAYMENT SUMMARY
    ========================= */

    await Order.updateOne(
      { _id: orderId },
      {
        $set: {
          buyerPaidAmount: verifiedTotal,
          buyerPendingAmount: buyerPendingAmount,
          buyerPaymentStatus: buyerPaymentStatus,
        },
      },
    );

    /* =========================
       RETURN FINAL POPULATED ORDER
    ========================= */

    const updatedOrder = await Order.findById(orderId)
      .populate("buyer", "fullName email addresses businessProfile")
      .populate("seller", "fullName email addresses businessProfile")
      .populate("orderItems.product", "productName category application")
      .populate("buyerPaymentReceipts.uploadedBy", "fullName")
      .populate("buyerPaymentReceipts.verifiedBy", "fullName")
      .populate("sellerPaymentReceipts.uploadedBy", "fullName")
      .populate("sellerPaymentReceipts.verifiedBy", "fullName");

    return res.status(200).json({
      success: true,
      message: "Buyer payment approved successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.log("Approve Buyer Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve buyer payment",
      error: error.message,
    });
  }
};

//admin ---> paymenttoseller
export const uploadAdminToSellerPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const { amount, paymentMode, transactionId, note } = req.body;

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

    let uploadedFile = {};

    if (req.file) {
      uploadedFile = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        originalName: req.file.originalname,
      };
    }

    /* =========================
       CALCULATE PAYMENT
    ========================= */

    const newPaidAmount = Number(order.sellerPaidAmount || 0) + Number(amount);

    const newPendingAmount = Math.max(
      Number(order.totalAmount || 0) - newPaidAmount,
      0,
    );

    const isFinalPayment = newPendingAmount <= 0;

    let sellerPaymentStatus = "pending";

    if (newPendingAmount <= 0) {
      sellerPaymentStatus = "completed";
    } else if (newPaidAmount > 0) {
      sellerPaymentStatus = "partial";
    }

    /* =========================
       UPDATE ONLY PAYMENT FIELDS
       (NO FULL ORDER SAVE)
    ========================= */

    await Order.updateOne(
      { _id: orderId },
      {
        $push: {
          sellerPaymentReceipts: {
            file: uploadedFile,
            amount: Number(amount),
            paymentMode,
            transactionId,
            note,

            uploadedBy: req.user._id,
            paymentFor: "admin_to_seller",

            status: "verified",

            totalPaidTillNow: newPaidAmount,
            remainingAmount: newPendingAmount,

            isPartialPayment: !isFinalPayment,
            isFinalPayment: isFinalPayment,

            verifiedBy: req.user._id,
            verifiedAt: new Date(),
          },
        },

        $set: {
          sellerPaidAmount: newPaidAmount,
          sellerPendingAmount: newPendingAmount,
          sellerPaymentStatus: sellerPaymentStatus,
        },
      },
    );

    /* =========================
       RETURN POPULATED ORDER
    ========================= */

    const updatedOrder = await Order.findById(orderId)
      .populate(
        "buyer",
        `
        fullName
        email
        addresses
        businessProfile
        `,
      )
      .populate(
        "seller",
        `
        fullName
        email
        addresses
        businessProfile
        `,
      )
      .populate("buyerPaymentReceipts.uploadedBy", "fullName")
      .populate("buyerPaymentReceipts.verifiedBy", "fullName")
      .populate("sellerPaymentReceipts.uploadedBy", "fullName")
      .populate("sellerPaymentReceipts.verifiedBy", "fullName");

    return res.status(200).json({
      success: true,
      message: "Payment sent to seller successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.log("Upload Admin To Seller Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload seller payment",
      error: error.message,
    });
  }
};

//admin ---> markdelivered
export const markShipmentDeliveredByAdmin = async (req, res) => {
  try {
    const { orderId, shipmentId } = req.params;

    /* =========================
         FIND ORDER
      ========================= */

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

    /* =========================
         FIND SHIPMENT
      ========================= */

    const shipment = order.shipments.id(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    /* =========================
         ALREADY DELIVERED
      ========================= */

    if (shipment.shipmentStatus === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Shipment already delivered",
      });
    }

    /* =========================
         MARK SINGLE SHIPMENT
      ========================= */

    shipment.shipmentStatus = "delivered";

    shipment.deliveredAt = new Date();

    /* =========================
         CHECK FULL DELIVERY
      ========================= */

    const allItemsDelivered = order.orderItems.every((orderItem) => {
      const deliveredQty = order.shipments
        .filter(
          (shipmentItem) =>
            shipmentItem.selectedItem?.trim()?.toLowerCase() ===
              orderItem.productName?.trim()?.toLowerCase() &&
            shipmentItem.shipmentStatus === "delivered",
        )
        .reduce(
          (total, shipmentItem) =>
            total + Number(shipmentItem.shippedQuantity || 0),
          0,
        );

      return deliveredQty >= Number(orderItem.requiredQuantity);
    });

    /* =========================
         UPDATE MAIN ORDER STATUS
      ========================= */

    if (allItemsDelivered) {
      order.orderStatus = "delivered";

      order.deliveredAt = new Date();
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Shipment marked as delivered",
      order,
      shipment,
    });
  } catch (error) {
    console.log("Mark Delivered Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark shipment delivered",
      error: error.message,
    });
  }
};

//admin --> adminverifybuyertransportfee
export const verifyBuyerTransportPayment = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { orderId, shipmentId, receiptId } = req.params;
    const { action } = req.body;

    /* =========================
         VALIDATE ACTION
      ========================= */

    if (!["verified", "rejected"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }

    /* =========================
         FIND ORDER
      ========================= */

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    /* =========================
         FIND SHIPMENT
      ========================= */

    const shipment = order.shipments.id(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    /* =========================
         FIND RECEIPT
      ========================= */

    const receipt = shipment.transportPaymentReceipts.id(receiptId);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Payment receipt not found",
      });
    }

    /* =========================
         PREVENT RE-VERIFY
      ========================= */
    if (receipt.status === "verified" && action === "verified") {
      return res.status(400).json({
        success: false,
        message: "Payment already verified",
      });
    }

    /* =========================
         UPDATE STATUS
      ========================= */

    receipt.status = action;
    receipt.verifiedBy = adminId;
    receipt.verifiedAt = new Date();

    /* =========================
         VERIFIED TOTAL
      ========================= */

    const verifiedAmount = shipment.transportPaymentReceipts
      .filter((r) => r.status === "verified")
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    /* =========================
         PAYMENT STATUS
      ========================= */

    if (verifiedAmount <= 0) {
      shipment.transportPaymentStatus = "unpaid";
    } else if (verifiedAmount < shipment.transportFinalAmount) {
      shipment.transportPaymentStatus = "partial_paid";
    } else {
      shipment.transportPaymentStatus = "paid";
    }

    /* =========================
         SAVE
      ========================= */

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        action === "verified"
          ? "Payment verified successfully"
          : "Payment rejected successfully",
      order,
    });
  } catch (error) {
    console.log("Verify Buyer Transport Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};

//Admin --->admin to transporterpayment
export const uploadAdminTransportPayment = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { orderId, shipmentId } = req.params;
    const { amount, paymentMode, transactionId, note } = req.body;

    /* =========================
       FIND ORDER
    ========================= */
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "order not found",
      });
    }

    /* =========================
       FIND SHIPMENT
    ========================= */
    const shipment = order.shipments.id(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "shipment not found",
      });
    }
    /* =========================
       VALIDATE TRANSPORTER
    ========================= */

    if (!shipment?.assignedTransporter) {
      return res.status(400).json({
        success: false,
        message: "Transporter not assigned",
      });
    }

    /* =========================
       VALIDATE AMOUNT
    ========================= */

    const paidAmount = Number(amount);

    if (!paidAmount || paidAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    /* =========================
       VERIFIED ADMIN PAYMENTS
    ========================= */

    const adminPaidAmount = (shipment?.adminTransportPaymentReceipts || [])
      .filter((r) => r.status === "verified")
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);
    /* =========================
       TOTAL TRANSPORT AMOUNT
    ========================= */
    const totalTransportAmount = Number(shipment?.transportFinalAmount || 0);

    /* =========================
       REMAINING AMOUNT
    ========================= */
    const remainingAmount = totalTransportAmount - adminPaidAmount;

    /* =========================
       PREVENT OVERPAY
    ========================= */

    if (paidAmount > remainingAmount) {
      return res.status(400).json({
        success: false,
        message: "Amount exceeds transport total amount",
      });
    }
    /* =========================
       FILE
    ========================= */
    const paymentFile = req.file
      ? {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          originalName: req.file.originalname,
        }
      : null;
    /* =========================
       CREATE RECEIPT
    ========================= */

    const newReceipt = {
      file: paymentFile,
      amount: paidAmount,
      paymentMode,
      transactionId,
      note,
      uploadedBy: adminId,
      paymentFor: "admin_to_transporter",
      status: "verified",
      verifiedBy: adminId,
      verifiedAt: new Date(),
      totalPaidTillNow: adminPaidAmount,
      remainingAmount: remainingAmount - paidAmount,
      isPartialPayment: paidAmount < remainingAmount,
      isFinalPayment: paidAmount === remainingAmount,
    };
    /* =========================
       PUSH RECEIPT
    ========================= */
    shipment.adminTransportPaymentReceipts.push(newReceipt);

    /* =========================
       SAVE
    ========================= */

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Transporter payment uploaded successfully",
      order,
    });
  } catch (error) {
    console.log("Upload Admin Transport Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload transporter payment",
      error: error.message,
    });
  }
};

//BUYER ALL CONTROLLERS

//buyer ---> buyerorders
export const getBuyerOrders = async (req, res) => {
  try {
    const buyerId = req.user._id;

    /* =========================
       PAGINATION + FILTERS
    ========================= */

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 3;

    const skip = (page - 1) * limit;

    const filter = req.query.filter || "all";

    /* =========================
       BASE QUERY
    ========================= */

    const query = {
      buyer: buyerId,
      isDeleted: false,
    };

    /* =========================
       GET ALL ORDERS
    ========================= */

    let orders = await Order.find(query)
      .populate(
        "seller",
        `
          fullName
          email
          businessProfile.companyName
          businessProfile.phoneNumber
          businessProfile.companyId
        `,
      )
      .populate(
        "orderItems.product",
        `
          productName
          category
          application
          loadingLocation
        `,
      )
      .sort({ createdAt: -1 });

    /* =========================
       CUSTOM FILTER LOGIC
    ========================= */

    if (filter !== "all") {
      orders = orders.filter((order) => {
        const shipments = order.shipments || [];

        const totalShippedQuantity = shipments.reduce(
          (total, shipment) => total + Number(shipment.shippedQuantity || 0),
          0,
        );

        const totalRequiredQuantity = order.orderItems.reduce(
          (total, item) => total + Number(item.requiredQuantity || 0),
          0,
        );

        /* =========================
           CANCELLED
        ========================= */

        if (filter === "cancelled") {
          return order.orderStatus === "cancelled";
        }

        /* =========================
           DELIVERED
        ========================= */

        if (filter === "delivered") {
          return (
            order.orderStatus === "delivered" ||
            order.orderStatus === "completed"
          );
        }

        /* =========================
           IN PROGRESS
           waiting seller confirmation
        ========================= */

        if (filter === "in_progress") {
          return order.orderStatus === "pending";
        }

        /* =========================
           PARTIAL SHIPMENTS
        ========================= */

        if (filter === "partial_shipments") {
          return (
            shipments.length > 0 &&
            totalShippedQuantity > 0 &&
            totalShippedQuantity < totalRequiredQuantity
          );
        }

        /* =========================
           SHIPPED
           fully shipped but not delivered
        ========================= */

        if (filter === "shipped") {
          return (
            shipments.length > 0 &&
            totalShippedQuantity >= totalRequiredQuantity &&
            order.orderStatus !== "delivered" &&
            order.orderStatus !== "completed"
          );
        }

        return true;
      });
    }

    /* =========================
       TOTAL COUNTS
    ========================= */

    const totalOrders = orders.length;

    const totalPages = Math.ceil(totalOrders / limit);

    /* =========================
       PAGINATION
    ========================= */

    orders = orders.slice(skip, skip + limit);

    /* =========================
       ATTACH REVIEW DATA
    ========================= */

    for (const order of orders) {
      for (const item of order.orderItems) {
        if (!item.product) continue;

        const product = await Product.findById(item.product);

        if (!product) continue;

        const existingReview = product.reviews.find(
          (review) =>
            review.user.toString() === buyerId.toString() &&
            review.order.toString() === order._id.toString(),
        );

        if (existingReview) {
          order._doc.reviewData = {
            rating: existingReview.rating,

            comment: existingReview.comment,

            image: existingReview.image?.data
              ? {
                  data: existingReview.image.data.toString("base64"),

                  contentType: existingReview.image?.contentType || "",
                }
              : null,
          };

          break;
        }
      }
    }

    /* =========================
       RESPONSE
    ========================= */

    return res.status(200).json({
      success: true,

      orders,

      pagination: {
        currentPage: page,

        totalPages,

        totalOrders,

        limit,
      },
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

//buyer ---> cancelorder
export const cancelBuyerOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const { cancellationReason } = req.body;

    /* =========================
       FIND ORDER
    ========================= */

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    /* =========================
       VERIFY BUYER
    ========================= */

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /* =========================
       ALLOWED STATUS ONLY
    ========================= */

    const allowedStatuses = ["pending", "seller_confirmed"];

    if (!allowedStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled now",
      });
    }

    /* =========================
       UPDATE ORDER
    ========================= */

    order.orderStatus = "cancelled";

    order.cancelledAt = new Date();

    order.cancellationReason = cancellationReason || "";

    await order.save();

    /* =========================
       RESPONSE
    ========================= */

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",

      order,
    });
  } catch (error) {
    console.log("Cancel Buyer Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};

//buyer ---> singleorder
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
        `,
      )
      .populate(
        "orderItems.product",
        `
          productName
          category
          application
          loadingLocation
        `,
      )
      .populate("shipments.assignedTransporter", "fullName businessProfile");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    /* =========================
   ATTACH REVIEW DATA
========================= */

    for (const item of order.orderItems) {
      if (!item.product) continue;

      const product = await Product.findById(item.product);

      if (!product) continue;

      const existingReview = product.reviews.find(
        (review) =>
          review.user.toString() === buyerId.toString() &&
          review.order.toString() === order._id.toString(),
      );

      if (existingReview) {
        order._doc.reviewData = {
          rating: existingReview.rating,

          comment: existingReview.comment,

          image: existingReview.image?.data
            ? {
                data: existingReview.image.data.toString("base64"),

                contentType: existingReview.image?.contentType || "",
              }
            : null,
        };

        break;
      }
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

//buyer ---> uploadpaymenttoadmin
export const uploadBuyerPayment = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { orderId } = req.params;

    const { amount, paymentMode, transactionId, note, paymentFor } = req.body;

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
    if (
      ![
        "seller_confirmed",
        "partially_shipped",
        "shipped",
        "delivered",
        "completed",
      ].includes(order.orderStatus)
    ) {
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

//buyer --> shipinginvoice
export const downloadShippingInvoice = async (req, res) => {
  try {
    const { orderId, shipmentId } = req.params;

    /* =========================
       FETCH ORDER
    ========================= */

    const order = await Order.findById(orderId)
      .populate(
        "buyer seller",
        `
        fullName
        email
        businessProfile.companyName
        businessProfile.phoneNumber
        businessProfile.email
        businessProfile.gstNumber
        businessProfile.billingAddress
        businessProfile.shippingAddress
      `,
      )
      .populate(
        "shipments.assignedTransporter",
        `
    fullName
    businessProfile.companyName
    businessProfile.phoneNumber
    businessProfile.gstNumber
  `,
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    /* =========================
       FIND SHIPMENT
    ========================= */

    const shipment = order.shipments?.find(
      (s) => s._id.toString() === shipmentId,
    );

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    /* =========================
       GENERATE PDF
    ========================= */

    const pdfBuffer = await generateShippingInvoicePdf(order, shipment);

    /* =========================
       SEND FILE
    ========================= */

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Shipping-Invoice-${shipment.shipmentInvoiceId}.pdf`,
    );

    return res.send(pdfBuffer);
  } catch (error) {
    console.log("Shipping Invoice Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to download shipping invoice",
      error: error.message,
    });
  }
};

//buyer --> downloadbuyreport
export const downloadBuyReport = async (req, res) => {
  try {
    const { orderId } = req.params;

    /* =========================
       FETCH COMPLETE ORDER
    ========================= */

    const order = await Order.findById(orderId)
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
        `,
      )
      .populate(
        "seller",
        `
          fullName
          email
          businessProfile.companyName
          businessProfile.phoneNumber
          businessProfile.email
          businessProfile.gstNumber
          businessProfile.billingAddress
          businessProfile.shippingAddress
        `,
      );

    /* =========================
       ORDER NOT FOUND
    ========================= */

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    /* =========================
       GENERATE BUY REPORT PDF
    ========================= */

    const pdfBuffer = await generateBuyReportPdf(order);

    /* =========================
       RESPONSE HEADERS
    ========================= */

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Buy-Report-${order.orderId}.pdf`,
    );

    return res.send(pdfBuffer);
  } catch (error) {
    console.log("Download Buy Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to download buy report",
      error: error.message,
    });
  }
};

//buyer ---> proformainvoice
export const downloadProformaInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    /* =========================
       FETCH COMPLETE ORDER DATA
    ========================= */

    const populatedOrder = await Order.findById(orderId)
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
        `,
      )
      .populate(
        "seller",
        `
          fullName
          email
          businessProfile.companyName
          businessProfile.phoneNumber
          businessProfile.email
          businessProfile.gstNumber
          businessProfile.billingAddress
          businessProfile.shippingAddress
        `,
      );

    if (!populatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    /* =========================
       SAFETY CHECK FOR SHIPPING
    ========================= */

    if (
      !populatedOrder.shippingAddress ||
      !populatedOrder.shippingAddress.fullAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipping address not found for this order",
      });
    }

    /* =========================
       GENERATE PDF
    ========================= */

    const invoicePdfBuffer = await generateInvoicePdf(populatedOrder);

    /* =========================
       FORCE DOWNLOAD
    ========================= */

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Proforma-Invoice-${populatedOrder.orderId}.pdf`,
    );

    return res.send(invoicePdfBuffer);
  } catch (error) {
    console.log("Download Proforma Invoice Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to download proforma invoice",
      error: error.message,
    });
  }
};

//buyer ---> buyer to admin upload transport payment
export const uploadTransportPaymentReceipt = async (req, res) => {
  try {
    const buyerId = req.user._id;

    const { orderId, shipmentId } = req.params;

    const { amount, paymentMode, transactionId, note } = req.body;

    /* =========================
       FIND ORDER
    ========================= */

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

    /* =========================
       FIND SHIPMENT
    ========================= */

    const shipment = order.shipments.id(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,

        message: "Shipment not found",
      });
    }

    /* =========================
       VALIDATE TRANSPORT
    ========================= */

    if (!shipment.transportFinalAmount || shipment.transportFinalAmount <= 0) {
      return res.status(400).json({
        success: false,

        message: "Transport amount not available",
      });
    }

    /* =========================
       VALIDATE PAYMENT
    ========================= */

    const paidAmount = Number(amount);

    if (!paidAmount || paidAmount <= 0) {
      return res.status(400).json({
        success: false,

        message: "Invalid payment amount",
      });
    }

    /* =========================
       VERIFIED PAYMENTS ONLY
    ========================= */

    const verifiedPaidAmount = (shipment.transportPaymentReceipts || [])
      .filter((receipt) => receipt.status === "verified")
      .reduce((sum, receipt) => sum + Number(receipt.amount || 0), 0);

    const remainingAmount = shipment.transportFinalAmount - verifiedPaidAmount;

    /* =========================
       PREVENT OVERPAY
    ========================= */

    if (paidAmount > remainingAmount) {
      return res.status(400).json({
        success: false,

        message: "Amount exceeds remaining transport amount",
      });
    }

    /* =========================
       FILE
    ========================= */

    const paymentFile = req.file
      ? {
          data: req.file.buffer,

          contentType: req.file.mimetype,

          originalName: req.file.originalname,
        }
      : null;

    /* =========================
       CREATE RECEIPT
    ========================= */

    const newReceipt = {
      file: paymentFile,

      amount: paidAmount,

      paymentMode,

      transactionId,

      note,

      uploadedBy: buyerId,

      paymentFor: "buyer_to_admin",

      status: "pending",

      totalPaidTillNow: verifiedPaidAmount,

      remainingAmount: remainingAmount - paidAmount,

      isPartialPayment: paidAmount < remainingAmount,

      isFinalPayment: paidAmount === remainingAmount,
    };

    /* =========================
       PUSH RECEIPT
    ========================= */

    shipment.transportPaymentReceipts.push(newReceipt);

    /* =========================
       PAYMENT STATUS
    ========================= */

    shipment.transportPaymentStatus = "payment_submitted";

    /* =========================
       SAVE
    ========================= */

    await order.save();

    /* =========================
       RETURN UPDATED ORDER
    ========================= */

    const updatedOrder = await Order.findById(orderId)
      .populate(
        "shipments.assignedTransporter",
        `
          fullName
          businessProfile.companyName
          businessProfile.phoneNumber
          businessProfile.gstNumber
          `,
      )
      .populate(
        "shipments.transportPaymentReceipts.uploadedBy",
        "fullName email",
      );

    return res.status(200).json({
      success: true,

      message: "Transport payment uploaded successfully",

      order: updatedOrder,
    });
  } catch (error) {
    console.log("Upload Transport Payment Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to upload transport payment",

      error: error.message,
    });
  }
};
