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