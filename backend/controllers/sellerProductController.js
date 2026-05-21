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
    const { page = 1, limit = 3 } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const totalProducts = await Product.countDocuments({ status: "pending" });

    const products = await Product.find({ status: "pending" })
      .populate("seller", "fullName email")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

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
      totalPages: Math.ceil(totalProducts / limitNumber),
      totalProducts
    });
  } catch (error) {
    console.log("Get Admin Pending Products Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch pending products" });
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

export const getAllApprovedProductsForAdmin = async (req, res) => {
  try {
    // 1. Extract query values from request and enforce defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const query = { status: "approved" };

    // 2. Count the full volume of records matching this filter condition in total
    const totalProducts = await Product.countDocuments(query);

    // 3. Extract purely the relevant slice window context from Database storage
    const products = await Product.find(query)
      .populate("seller", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // 4. Format images to base64 structural delivery data
    const formattedProducts = products.map((product) => ({
      ...product._doc,
      images: product.images.map((img) => ({
        contentType: img.contentType,
        image: `data:${img.contentType};base64,${img.data.toString("base64")}`,
      })),
    }));

    // 5. Send results to the frontend along with page metrics
    return res.status(200).json({
      success: true,
      products: formattedProducts,
      totalPages: Math.ceil(totalProducts / limit) || 1,
      currentPage: page,
    });
  } catch (error) {
    console.log("Get Approved Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch approved products",
    });
  }
};

// 3. REJECTED (With Server-Side Pagination & Math Blueprints)
export const getAllRejectedProductsForAdmin = async (req, res) => {
  try {
    // 1. Parse pagination queries from frontend parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const query = { status: "rejected" };

    // 2. Query MongoDB for total count matching the 'rejected' flag
    const totalProducts = await Product.countDocuments(query);

    // 3. Request database stream to fetch only the restricted item slice
    const products = await Product.find(query)
      .populate("seller", "fullName email")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    // 4. Transform raw buffer images into inline base64 components
    const formattedProducts = products.map((product) => ({
      ...product._doc,
      images: product.images.map((img) => ({
        contentType: img.contentType,
        image: `data:${img.contentType};base64,${img.data.toString("base64")}`,
      })),
    }));

    // 5. Send optimized payload back down with structural page indexes
    return res.status(200).json({
      success: true,
      products: formattedProducts,
      totalPages: Math.ceil(totalProducts / limit) || 1,
      currentPage: page,
    });
  } catch (error) {
    console.log("Get Admin Rejected Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch rejected products",
    });
  }
};

// NEW UNIFIED METHOD: Replaces the 3 individual status endpoints
export const getAllProductsForAdmin = async (req, res) => {
  try {
    // 1. Extract page and limit
    const { page = 1, limit = 3 } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    // 2. Count total (for the pagination UI)
    const totalProducts = await Product.countDocuments({
      status: { $in: ["approved", "pending", "rejected"] }
    });

    // 3. Find only the slice
    const products = await Product.find({
      status: { $in: ["approved", "pending", "rejected"] }
    })
      .populate("seller", "fullName email")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // 4. Format images (only for the 3 items we fetched)
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
      totalPages: Math.ceil(totalProducts / limitNumber), // Send this to FE
      totalProducts
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error" });
  }
};

