import Product from "../models/Product.js";

import Order from "../models/orderModel.js";

export const getSellerDashboardStats = async (req, res) => {
  try {
    const sellerId = req.user._id;

    /* =========================
          PRODUCTS
      ========================= */

    const totalProducts = await Product.countDocuments({
      seller: sellerId,
    });

    const approvedProducts = await Product.countDocuments({
      seller: sellerId,

      status: "approved",
    });

    const pendingProducts = await Product.countDocuments({
      seller: sellerId,

      status: "pending",
    });

    /* =========================
          ORDERS
      ========================= */

    const totalOrders = await Order.countDocuments({
      seller: sellerId,
    });

    /* =========================
          RESPONSE
      ========================= */

    return res.status(200).json({
      success: true,

      stats: {
        totalProducts,
        approvedProducts,
        pendingProducts,
        totalOrders,
      },
    });
  } catch (error) {
    console.log("Seller Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch dashboard stats",
    });
  }
};

export const getSellerOrdersOverview = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const filter = req.query.filter || "7days";

    /* =========================
         DATE RANGE
      ========================= */

    let days = 7;

    if (filter === "30days") {
      days = 30;
    }

    const startDate = new Date();

    startDate.setDate(startDate.getDate() - days);

    /* =========================
         FETCH ORDERS
      ========================= */

    const orders = await Order.find({
      seller: sellerId,

      createdAt: {
        $gte: startDate,
      },
    });

    /* =========================
         GRAPH DATA
      ========================= */

    const graphData = [];

    for (let i = days - 1; i >= 0; i--) {
      const currentDate = new Date();

      currentDate.setDate(currentDate.getDate() - i);

      const dateLabel = currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const dayOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);

        return orderDate.toDateString() === currentDate.toDateString();
      });

      const completedOrders = dayOrders.filter(
        (order) =>
          order.orderStatus === "completed" ||
          order.orderStatus === "delivered",
      );

      graphData.push({
        date: dateLabel,

        totalOrders: dayOrders.length,

        completedOrders: completedOrders.length,
      });
    }

    /* =========================
         SUMMARY
      ========================= */

    const totalOrders = orders.length;

    const completedOrders = orders.filter(
      (order) =>
        order.orderStatus === "completed" || order.orderStatus === "delivered",
    ).length;

    const pendingOrders = orders.filter(
      (order) => order.orderStatus === "pending",
    ).length;

    const partialShipmentOrders = orders.filter(
      (order) => order.orderStatus === "partially_shipped",
    ).length;

    return res.status(200).json({
      success: true,

      graphData,

      summary: {
        totalOrders,

        completedOrders,

        pendingOrders,

        partialShipmentOrders,
      },
    });
  } catch (error) {
    console.log("Orders Overview Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch orders overview",
    });
  }
};

export const getRecentSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders = await Order.find({
      seller: sellerId,
    })
      .populate("buyer", "fullName email profileImage")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,

      orders,
    });
  } catch (error) {
    console.log("Recent Seller Orders Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch recent orders",
    });
  }
};

/* =========================
   MY PENDING PRODUCTS
========================= */

export const getSellerPendingProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const products = await Product.find({
      seller: sellerId,

      status: "pending",
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedProducts = products.map((product) => ({
      ...product._doc,

      images: product.images.map((img) => ({
        contentType: img.contentType,

        image: `data:${img.contentType};base64,${img.data.toString("base64")}`,
      })),
    }));

    return res.status(200).json({
      success: true,

      products: formattedProducts,
    });
  } catch (error) {
    console.log("Pending Products Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch pending products",
    });
  }
};

/* =========================
   TOP SELLING PRODUCTS
========================= */

export const getTopSellingProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders = await Order.find({
      seller: sellerId,
    });

    const productsMap = {};

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const productId = item.product?.toString();

        if (!productsMap[productId]) {
          productsMap[productId] = {
            productName: item.productName || item.application,

            totalQuantity: 0,

            totalRevenue: 0,
          };
        }

        /* =========================
               TOTAL SOLD QUANTITY
            ========================= */

        productsMap[productId].totalQuantity += item.requiredQuantity || 0;

        /* =========================
               TOTAL REVENUE
            ========================= */

        productsMap[productId].totalRevenue += item.subtotal || 0;
      });
    });

    /* =========================
         SORT TOP PRODUCTS
      ========================= */

    const topProducts = Object.values(productsMap)

      .sort((a, b) => b.totalQuantity - a.totalQuantity)

      .slice(0, 5);

    return res.status(200).json({
      success: true,

      products: topProducts,
    });
  } catch (error) {
    console.log("Top Selling Products Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch top selling products",
    });
  }
};
