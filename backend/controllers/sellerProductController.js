import SellerAddedProduct from "../models/SellerAddedProduct.js";

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

    // Check if same seller already added same product with same loading location
    const existingProduct = await SellerAddedProduct.findOne({
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

    const images = req.files?.map((file) => ({
      data: file.buffer,
      contentType: file.mimetype,
    })) || [];

    const product = await SellerAddedProduct.create({
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
    });

    res.status(201).json({
      success: true,
      message: "Product submitted for approval",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
    });
  }
};


export const getSellerPendingProducts = async (req, res) => {
  try {
    const products = await SellerAddedProduct.find({
      seller: req.user._id,
      status: "pending",
    }).sort({ createdAt: -1 });

    const formattedProducts = products.map((product) => ({
      ...product._doc,
      images: product.images.map((img) => ({
        contentType: img.contentType,
        image: `data:${img.contentType};base64,${img.data.toString("base64")}`,
      })),
    }));

    res.status(200).json({
      success: true,
      products: formattedProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending products",
    });
  }
};