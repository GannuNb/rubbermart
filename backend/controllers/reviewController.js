import Order from "../models/orderModel.js";
import Product from "../models/Product.js";

export const submitOrderReview = async (req, res) => {
  try {
    const buyerId = req.user._id;

    const { orderId } = req.params;

    const { rating, comment } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required",
      });
    }

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
       ONLY AFTER DELIVERY
    ========================= */

    if (
      order.orderStatus !== "delivered" &&
      order.orderStatus !== "completed"
    ) {
      return res.status(400).json({
        success: false,
        message: "You can review only after delivery",
      });
    }

    /* =========================
       REVIEW IMAGE
    ========================= */

    let reviewImage = null;

    if (req.file) {
      reviewImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    /* =========================
       APPLY REVIEW TO ALL PRODUCTS
    ========================= */

    for (const item of order.orderItems) {
      if (!item.product) continue;

      const product = await Product.findById(item.product);

      if (!product) continue;

      /* =========================
         CHECK EXISTING REVIEW
      ========================= */

      const existingReviewIndex = product.reviews.findIndex(
        (review) =>
          review.user.toString() === buyerId.toString() &&
          review.order.toString() === order._id.toString(),
      );

      /* =========================
         UPDATE REVIEW
      ========================= */

      if (existingReviewIndex !== -1) {
        product.reviews[existingReviewIndex].rating = Number(rating);

        product.reviews[existingReviewIndex].comment = comment;

        if (reviewImage) {
          product.reviews[existingReviewIndex].image = reviewImage;
        }
      } else {
        /* =========================
         CREATE REVIEW
      ========================= */
        product.reviews.push({
          user: buyerId,
          order: order._id,
          rating: Number(rating),
          comment,
          image: reviewImage,
        });
      }
      /* =========================
        UPDATE RATING SUMMARY
        ========================= */

      const totalReviews = product.reviews.length;

      const totalRating = product.reviews.reduce(
        (sum, review) => sum + Number(review.rating || 0),
        0,
      );

      product.totalReviews = totalReviews;

      product.averageRating =
        totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : 0;
      await product.save();
    }

    /* =========================
       UPDATE ORDER REVIEW STATUS
    ========================= */

    order.isReviewed = true;

    order.reviewedAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: order.isReviewed
        ? "Review updated successfully"
        : "Review submitted successfully",
    });
  } catch (error) {
    console.log("Submit Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
      error: error.message,
    });
  }
};
