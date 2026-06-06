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

export const confirmSellerOrder = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { orderId } = req.params;

    const { transportMode } = req.body;

    /* =========================
       VALIDATE TRANSPORT MODE
    ========================= */

    if (!["self_transport", "marketplace_transport"].includes(transportMode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transport mode",
      });
    }

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

          transportMode,

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
       SELF TRANSPORT VALIDATION
    ========================= */

    if (order.transportMode === "self_transport") {
      if (!vehicleNumber) {
        return res.status(400).json({
          success: false,
          message: "Vehicle number is required",
        });
      }

      if (!driverName) {
        return res.status(400).json({
          success: false,
          message: "Driver name is required",
        });
      }

      if (!driverMobile) {
        return res.status(400).json({
          success: false,
          message: "Driver mobile is required",
        });
      }
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
         TRANSPORT LOGIC
      ========================= */

      transportMode: order.transportMode,

      transportStatus:
        order.transportMode === "marketplace_transport"
          ? "open_for_quotes"
          : "not_required",

      assignmentMethod:
        order.transportMode === "marketplace_transport"
          ? "quote_selection"
          : "self_transport",

      shipmentStatus:
        order.transportMode === "marketplace_transport" ? "packed" : "shipped",

      /* =========================
         SELF TRANSPORT DETAILS
      ========================= */

      vehicleNumber:
        order.transportMode === "self_transport" ? vehicleNumber : "",

      driverName: order.transportMode === "self_transport" ? driverName : "",

      driverMobile:
        order.transportMode === "self_transport" ? driverMobile : "",

      /* =========================
         TIMELINE
      ========================= */

      packedAt: new Date(),

      shippedAt: order.transportMode === "self_transport" ? new Date() : null,

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

    if (allItemsFullyShipped && order.transportMode === "self_transport") {
      updatedOrderStatus = "shipped";
      updatedShippedAt = new Date();
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

export const getOpenTransportShipments = async (req, res) => {
  try {
    const orders = await Order.find({
      isDeleted: false,

      shipments: {
        $elemMatch: {
          transportMode: "marketplace_transport",

          transportStatus: "open_for_quotes",
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

    const openShipments = [];

    orders.forEach((order) => {
      order.shipments.forEach((shipment) => {
        if (
          shipment.transportMode === "marketplace_transport" &&
          shipment.transportStatus === "open_for_quotes"
        ) {
          openShipments.push({
            orderId: order._id,

            orderInvoiceId: order.orderId,

            buyer: order.buyer,

            seller: order.seller,

            shipment,
          });
        }
      });
    });

    return res.status(200).json({
      success: true,
      shipments: openShipments,
    });
  } catch (error) {
    console.log("Get Open Transport Shipments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transport shipments",
    });
  }
};

export const submitTransportQuote = async (req, res) => {
  try {
    const transporterId = req.user._id;

    const { orderId, shipmentId } = req.params;

    const { quotedPrice, note, estimatedDeliveryDays } = req.body;

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

    const shipment = order.shipments.id(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    if (shipment.transportMode !== "marketplace_transport") {
      return res.status(400).json({
        success: false,
        message: "This shipment is not marketplace transport",
      });
    }

    if (shipment.transportStatus !== "open_for_quotes") {
      return res.status(400).json({
        success: false,
        message: "Quotes are closed for this shipment",
      });
    }

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

    const quote = await ShipmentTransportQuote.create({
      orderId,

      shipmentId,

      transporter: transporterId,

      quotedPrice,

      note,

      estimatedDeliveryDays,
    });

    shipment.transportStatus = "quotes_received";

    await order.save();

    return res.status(201).json({
      success: true,
      message: "Quote submitted successfully",

      quote,
    });
  } catch (error) {
    console.log("Submit Transport Quote Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit quote",
    });
  }
};

export const getTransporterQuotes = async (req, res) => {
  try {
    const transporterId = req.user._id;

    const quotes = await ShipmentTransportQuote.find({
      transporter: transporterId,
    })
      .populate("orderId", "orderId shipments")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      quotes,
    });
  } catch (error) {
    console.log("Get Transporter Quotes Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transporter quotes",
    });
  }
};

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
       VALIDATE TRANSPORT
    ========================= */

    if (shipment.transportMode !== "marketplace_transport") {
      return res.status(400).json({
        success: false,
        message:
          "Only marketplace transport shipments can be marked as shipped",
      });
    }

    /* =========================
       VALIDATE ASSIGNMENT
    ========================= */

    if (shipment.transportStatus !== "transporter_assigned") {
      return res.status(400).json({
        success: false,
        message: "Transporter not assigned yet",
      });
    }

    /* =========================
       VALIDATE STATUS
    ========================= */

    if (shipment.shipmentStatus === "shipped") {
      return res.status(400).json({
        success: false,
        message: "Shipment already marked as shipped",
      });
    }

    /* =========================
       UPDATE SHIPMENT
    ========================= */

    shipment.shipmentStatus = "shipped";

    shipment.shippedAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Shipment marked as shipped successfully",
      order,
    });
  } catch (error) {
    console.log("Mark Shipment Shipped Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark shipment shipped",
    });
  }
};

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
        "seller",
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
      );

    /* =========================
       FILTER SHIPMENTS
    ========================= */

    const assignedShipments = [];

    orders.forEach((order) => {
      order.shipments.forEach((shipment) => {
        if (
          shipment?.assignedTransporter?._id?.toString() ===
            transporterId.toString() &&
          shipment.shipmentStatus !== "delivered"
        ) {
          assignedShipments.push({
            orderId: order._id,

            orderInvoiceId: order.orderId,

            seller: order.seller,

            shipment,
          });
        }
      });
    });

    return res.status(200).json({
      success: true,

      assignedShipments,
    });
  } catch (error) {
    console.log("Get Transporter Assigned Shipments Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch assigned shipments",
    });
  }
};

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
        "seller",
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
      );

    /* =========================
         FILTER DELIVERED
      ========================= */

    const completedDeliveries = [];

    orders.forEach((order) => {
      order.shipments.forEach((shipment) => {
        if (
          shipment?.assignedTransporter?._id?.toString() ===
            transporterId.toString() &&
          shipment.shipmentStatus === "delivered"
        ) {
          completedDeliveries.push({
            orderId: order._id,

            orderInvoiceId: order.orderId,

            seller: order.seller,

            shipment,
          });
        }
      });
    });

    return res.status(200).json({
      success: true,

      completedDeliveries,
    });
  } catch (error) {
    console.log("Get Transporter Completed Deliveries Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch completed deliveries",
    });
  }
};

//admin -> transports

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
      });

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

export const assignTransporterToShipment = async (req, res) => {
  try {
    const {
      orderId,

      shipmentId,

      quoteId,
    } = req.params;

    const order = await Order.findById(orderId);

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

    const selectedQuote =
      await ShipmentTransportQuote.findById(quoteId).populate("transporter");

    if (!selectedQuote) {
      return res.status(404).json({
        success: false,

        message: "Quote not found",
      });
    }

    /* =========================
         UPDATE SHIPMENT
      ========================= */

    shipment.assignedTransporter = selectedQuote.transporter._id;

    shipment.selectedQuoteId = selectedQuote._id;

    shipment.transportStatus = "transporter_assigned";

    shipment.shipmentStatus = "assigned";

    shipment.assignmentMethod = "quote_selection";

    shipment.assignedAt = new Date();

    /* =========================
         UPDATE QUOTES
      ========================= */

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
        quoteStatus: "rejected",

        rejectedAt: new Date(),
      },
    );

    /* =========================
        SELECT CURRENT QUOTE
       ========================= */

    await ShipmentTransportQuote.findByIdAndUpdate(quoteId, {
      quoteStatus: "selected",

      selectedAt: new Date(),
    });

    await order.save();

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
    console.log("Assign Transporter Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to assign transporter",
    });
  }
};

export const adminDirectAssignTransporter = async (req, res) => {
  try {
    const {
      orderId,

      shipmentId,
    } = req.params;

    const { transporterId } = req.body;

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
         VALIDATE TRANSPORT MODE
      ========================= */

    if (shipment.transportMode !== "marketplace_transport") {
      return res.status(400).json({
        success: false,

        message: "Not marketplace shipment",
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
         ASSIGN REQUEST
      ========================= */

    shipment.assignedTransporter = transporter._id;

    shipment.transportStatus = "admin_assignment_pending";

    shipment.assignmentMethod = "admin_direct_assignment";

    shipment.assignedAt = new Date();

    await order.save();

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

      message: "Transporter assignment request sent",

      order: updatedOrder,
    });
  } catch (error) {
    console.log("Admin Direct Assignment Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to assign transporter",
    });
  }
};

export const getAllTransporters = async (req, res) => {
  try {
    const transporters = await User.find({
      role: "transporter",
    }).select(`
          fullName
          email
          businessProfile
        `);

    // console.log("Transporters:", transporters);

    return res.status(200).json({
      success: true,

      transporters,
    });
  } catch (error) {
    console.log("Get Transporters Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch transporters",
    });
  }
};

export const getTransporterPendingAssignments = async (req, res) => {
  try {
    const transporterId = req.user._id;

    const orders = await Order.find({
      "shipments.assignedTransporter": transporterId,

      "shipments.transportStatus": "admin_assignment_pending",
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
         FILTER SHIPMENTS
      ========================= */

    const pendingAssignments = [];

    orders.forEach((order) => {
      order.shipments.forEach((shipment) => {
        if (
          shipment?.assignedTransporter?.toString() ===
            transporterId.toString() &&
          shipment?.transportStatus === "admin_assignment_pending"
        ) {
          pendingAssignments.push({
            orderId: order._id,

            orderInvoiceId: order.orderId,

            shipment,
          });
        }
      });
    });

    return res.status(200).json({
      success: true,

      assignments: pendingAssignments,
    });
  } catch (error) {
    console.log("Get Pending Assignments Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch assignments",
    });
  }
};

export const transporterAcceptAssignment = async (req, res) => {
  try {
    const transporterId = req.user._id;

    const {
      orderId,

      shipmentId,
    } = req.params;

    const order = await Order.findById(orderId);

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
         ACCEPT ASSIGNMENT
      ========================= */

    shipment.transportStatus = "transporter_assigned";

    shipment.shipmentStatus = "assigned";

    await order.save();

    return res.status(200).json({
      success: true,

      message: "Assignment accepted successfully",

      order,
    });
  } catch (error) {
    console.log("Transporter Accept Assignment Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to accept assignment",
    });
  }
};

export const transporterRejectAssignment = async (req, res) => {
  try {
    const transporterId = req.user._id;

    const {
      orderId,

      shipmentId,
    } = req.params;

    const order = await Order.findById(orderId);

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
         REJECT ASSIGNMENT
      ========================= */

    shipment.transportStatus = "admin_assignment_rejected";

    shipment.assignedTransporter = null;

    shipment.assignedAt = null;

    shipment.shipmentStatus = "pending";

    await order.save();

    return res.status(200).json({
      success: true,

      message: "Assignment rejected successfully",

      order,
    });
  } catch (error) {
    console.log("Transporter Reject Assignment Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to reject assignment",
    });
  }
};

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
      );

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

export const downloadShippingInvoice = async (req, res) => {
  try {
    const { orderId, shipmentId } = req.params;

    /* =========================
       FETCH ORDER
    ========================= */

    const order = await Order.findById(orderId).populate(
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

// admin

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
      .populate("sellerPaymentReceipts.verifiedBy", "fullName");

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
    console.log("Seller Mark Delivered Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark shipment delivered",
      error: error.message,
    });
  }
};

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
