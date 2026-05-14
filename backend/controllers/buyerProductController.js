// backend/controllers/buyerProductController.js

import Product from "../models/Product.js";

export const getApprovedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      status: "approved",
    })
      .populate(
        "seller",
        "fullName email businessProfile addresses profileImage"
      )
      .sort({ createdAt: -1 });

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
    console.log("Get Approved Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch approved products",
    });
  }
};

export const getSingleApprovedProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({
      _id: productId,
      status: "approved",
    }).populate(
      "seller",
      "fullName email businessProfile addresses profileImage"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const formattedProduct = {
      ...product._doc,
      images: product.images.map((img) => ({
        contentType: img.contentType,
        image: `data:${img.contentType};base64,${img.data.toString("base64")}`,
      })),
    };

    return res.status(200).json({
      success: true,
      product: formattedProduct,
    });
  } catch (error) {
    console.log("Get Single Approved Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product details",
    });
  }
};



// backend/controllers/buyerProductController.js

export const getBuyerProducts = async (req, res) => {
  try {
    const { sellerId } = req.query;

    let filter = {
      status: "approved",
    };

    if (sellerId) {
      filter.seller = sellerId;
    }

    const products = await Product.find(filter)
      .populate(
        "seller",
        "fullName email businessProfile addresses profileImage"
      )
      .sort({ createdAt: -1 });

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
    console.log("Get Buyer Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const interestedProducts =
      req.user?.businessProfile?.interestedProducts || [];

    /* =====================================
        FILTER
    ===================================== */

    let filter = {
      status: "approved",

      stockStatus: "available",
    };

    // IF USER HAS INTERESTS
    // SHOW MATCHING PRODUCTS

    if (interestedProducts.length > 0) {
      filter.application = {
        $in: interestedProducts,
      };
    }

    /* =====================================
        FETCH PRODUCTS
    ===================================== */

    const products = await Product.find(filter)
      .populate(
        "seller",
        "fullName email businessProfile addresses profileImage"
      )
      .sort({ createdAt: -1 })
      .limit(10);

    /* =====================================
        FORMAT IMAGES
    ===================================== */

    const formattedProducts = products.map((product) => ({
      ...product._doc,

      images: product.images.map((img) => ({
        contentType: img.contentType,

        image: `data:${img.contentType};base64,${img.data.toString(
          "base64"
        )}`,
      })),
    }));

    /* =====================================
        RESPONSE
    ===================================== */

    return res.status(200).json({
      success: true,

      products: formattedProducts,
    });
  } catch (error) {
    console.log(
      "Get Recommended Products Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch recommended products",
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      status: "approved",

      stockStatus: "available",
    })
      .populate(
        "seller",
        "fullName email businessProfile addresses profileImage"
      )
      .sort({ createdAt: -1 })
      .limit(10);

    const formattedProducts = products.map((product) => ({
      ...product._doc,

      images: product.images.map((img) => ({
        contentType: img.contentType,

        image: `data:${img.contentType};base64,${img.data.toString(
          "base64"
        )}`,
      })),
    }));

    return res.status(200).json({
      success: true,

      products: formattedProducts,
    });
  } catch (error) {
    console.log(
      "Get Featured Products Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch featured products",
    });
  }
};