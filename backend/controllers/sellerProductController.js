// backend/controllers/sellerProductController.js

import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const {
      category,
      application,
      quantity,
      loadingLocation,
      countryOfOrigin,
      pricePerMT,
      hsnCode,
      description,
    } = req.body;

    const existingProduct = await Product.findOne({
      seller: req.user._id,
      category,
      application,
      loadingLocation,
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message:
          "This product already exists for the selected loading location. Please manage or update it from Your Products page.",
      });
    }

    const images =
      req.files?.map((file) => ({
        data: file.buffer,
        contentType: file.mimetype,
      })) || [];

    const product = await Product.create({
      seller: req.user._id,
      category,
      application,
      quantity,
      loadingLocation,
      countryOfOrigin,
      pricePerMT,
      hsnCode,
      images,
      description,
      status: "pending",
      stockStatus: "available",
    });

    return res.status(201).json({
      success: true,
      message: "Product submitted for approval",
      product,
    });
  } catch (error) {
    console.log("Add Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add product",
    });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
    }).sort({ createdAt: -1 });

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
    console.log("Get Seller Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch seller products",
    });
  }
};

export const getAllPendingProductsForAdmin = async (req, res) => {
  try {
    const products = await Product.find({
      status: "pending",
    })
      .populate("seller", "fullName email")
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
    console.log("Get Admin Pending Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending products",
    });
  }
};

export const approveProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        status: "approved",
      },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product approved successfully",
      product,
    });
  } catch (error) {
    console.log("Approve Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve product",
    });
  }
};

export const rejectProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        status: "rejected",
      },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product rejected successfully",
      product,
    });
  } catch (error) {
    console.log("Reject Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject product",
    });
  }
};

export const updateSellerProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const {
      quantity,
      pricePerMT,
      description,
      loadingLocation,
      stockStatus,
    } = req.body;

    const product = await Product.findOne({
      _id: productId,
      seller: req.user._id,
      status: "approved",
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Approved product not found",
      });
    }

    if (quantity !== undefined) {
      product.quantity = quantity;
    }

    if (pricePerMT !== undefined) {
      product.pricePerMT = pricePerMT;
    }

    if (description !== undefined) {
      product.description = description;
    }

    if (loadingLocation !== undefined) {
      product.loadingLocation = loadingLocation;
    }

    if (stockStatus !== undefined) {
      product.stockStatus = stockStatus;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

// backend/controllers/sellerProductController.js

export const getAllApprovedProductsForAdmin = async (req, res) => {
  try {
    const products = await Product.find({
      status: "approved",
    })
      .populate("seller", "fullName email")
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