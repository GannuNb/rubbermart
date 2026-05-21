import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import styles from "../../styles/Buyer/BuyerOrderDetails.module.css";

import { submitOrderReviewThunk } from "../../redux/slices/buyerOrderThunk";
import { getBuyerOrdersThunk } from "../../redux/slices/getBuyerOrdersThunk";

function ReviewModal({ order, onClose, onReviewSubmitted }) {
  const dispatch = useDispatch();

  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const existingReview = order?.reviewData || null;

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 5);

      setComment(existingReview.comment || "");

      if (existingReview.image?.data) {
        setPreview(
          `data:${
            existingReview.image.contentType
          };base64,${existingReview.image.data}`,
        );
      }
    }
  }, [existingReview]);

  /* =========================
     IMAGE CHANGE
  ========================= */

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  /* =========================
     SUBMIT REVIEW
  ========================= */

  const handleSubmit = async () => {
    try {
      if (!comment.trim()) {
        alert("Please enter review");

        return;
      }

      setLoading(true);

      const formData = new FormData();

      formData.append("rating", rating);

      formData.append("comment", comment);

      if (image) {
        formData.append("image", image);
      }

      await dispatch(
        submitOrderReviewThunk({
          orderId: order._id,
          formData,
        }),
      ).unwrap();

      alert("Review submitted successfully");

      /* REFRESH BUYER ORDERS */

      await dispatch(getBuyerOrdersThunk());

      /* OPTIONAL ORDER DETAILS REFRESH */

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      onClose();
    } catch (error) {
      console.log(error);

      alert(error || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.reviewModalOverlay}>
      <div className={styles.reviewModal}>
        {/* HEADER */}

        <div className={styles.reviewHeader}>
          <h2>{order.isReviewed ? "Edit Review" : "Write a Review"}</h2>

          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* STARS */}

        <div className={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`${styles.star} ${
                star <= rating ? styles.activeStar : ""
              }`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        {/* COMMENT */}

        <textarea
          className={styles.reviewTextarea}
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* IMAGE */}

        <div className={styles.reviewUploadSection}>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <img src={preview} alt="preview" className={styles.reviewPreview} />
          )}
        </div>

        {/* ACTION */}

        <button
          className={styles.submitReviewBtn}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : order.isReviewed
              ? "Update Review"
              : "Submit Review"}
        </button>
      </div>
    </div>
  );
}

export default ReviewModal;
