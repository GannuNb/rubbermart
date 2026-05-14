import Order from "../models/orderModel.js";
import Product from "../models/Product.js";
import User from "../models/User.js";



/*
|--------------------------------------------------------------------------
| 1. DASHBOARD OVERVIEW
|--------------------------------------------------------------------------
*/

export const getDashboardOverview = async (req, res) => {
  try {
    const [
      totalProducts,
      approvedProducts,
      pendingProducts,
      totalOrders,
      totalUsers,
    ] = await Promise.all([
      Product.countDocuments(),

      Product.countDocuments({
        status: "approved",
      }),

      Product.countDocuments({
        status: "pending",
      }),

      Order.countDocuments({
        isDeleted: false,
      }),

      User.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,

      overview: {
        totalProducts,
        approvedProducts,
        pendingProducts,
        totalOrders,
        totalUsers,
      },
    });
  } catch (error) {
    console.log("Dashboard Overview Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard overview",
    });
  }
};



/*
|--------------------------------------------------------------------------
| 2. ORDERS OVERVIEW
|--------------------------------------------------------------------------
*/

export const getOrdersOverview = async (req, res) => {
  try {
    const { range = "7days" } = req.query;

    const days = range === "30days" ? 30 : 7;

    const startDate = new Date();

    startDate.setHours(0, 0, 0, 0);

    startDate.setDate(
      startDate.getDate() - (days - 1)
    );



    /*
    --------------------------------------------------------
    FETCH ORDERS
    --------------------------------------------------------
    */

    const orders = await Order.find({
      createdAt: {
        $gte: startDate,
      },

      isDeleted: false,
    });



    /*
    --------------------------------------------------------
    CREATE DATE MAP
    --------------------------------------------------------
    */

    const graphMap = {};



    /*
    --------------------------------------------------------
    ADD ALL DATES FIRST
    --------------------------------------------------------
    */

    for (let i = 0; i < days; i++) {

      const currentDate = new Date(startDate);

      currentDate.setDate(
        startDate.getDate() + i
      );

      const formattedDate =
        currentDate.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
          }
        );

      graphMap[formattedDate] = 0;
    }



    /*
    --------------------------------------------------------
    COUNT ORDERS PER DATE
    --------------------------------------------------------
    */

    orders.forEach((order) => {

      const formattedDate =
        new Date(
          order.createdAt
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
          }
        );

      if (
        graphMap[formattedDate] !== undefined
      ) {
        graphMap[formattedDate] += 1;
      }

    });



    /*
    --------------------------------------------------------
    FINAL GRAPH DATA
    --------------------------------------------------------
    */

    const graphData = Object.entries(
      graphMap
    ).map(([date, orders]) => ({
      date,
      orders,
    }));



    /*
    --------------------------------------------------------
    COUNTS
    --------------------------------------------------------
    */

    const totalOrders = orders.length;

    const completedOrders =
      orders.filter(
        (order) =>
          order.orderStatus ===
            "completed" ||
          order.orderStatus ===
            "delivered"
      ).length;

    const partialShipments =
      orders.filter(
        (order) =>
          order.orderStatus ===
          "partially_shipped"
      ).length;

    const pendingOrders =
      orders.filter(
        (order) =>
          order.orderStatus ===
          "pending"
      ).length;



    return res.status(200).json({
      success: true,

      overview: {
        totalOrders,
        completedOrders,
        partialShipments,
        pendingOrders,
      },

      graphData,
    });

  } catch (error) {

    console.log(
      "Orders Overview Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch orders overview",
    });

  }
};



/*
|--------------------------------------------------------------------------
| 3. RECENT ORDERS
|--------------------------------------------------------------------------
*/

export const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      isDeleted: false,
    })
      .populate("buyer", "fullName")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Recent Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent orders",
    });
  }
};



/*
|--------------------------------------------------------------------------
| 4. PENDING PRODUCTS
|--------------------------------------------------------------------------
*/

export const getPendingProducts = async (req, res) => {
  try {

    const products = await Product.find({
      status: "pending",
    })
      .populate("seller", "fullName")
      .sort({ createdAt: -1 })
      .limit(5);



    /*
    -------------------------------------------------------
    FORMAT IMAGES
    -------------------------------------------------------
    */

    const formattedProducts =
      products.map((product) => ({

        ...product._doc,

        images: product.images.map(
          (img) => ({

            contentType:
              img.contentType,

            image: `data:${img.contentType};base64,${img.data.toString(
              "base64"
            )}`,

          })
        ),

      }));



    return res.status(200).json({
      success: true,

      products: formattedProducts,
    });

  } catch (error) {

    console.log(
      "Pending Products Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch pending products",
    });

  }
};