// src/components/products/ProductReviewsSection.js

import React, { useState } from "react";

import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

import styles from "../../styles/Buyer/ProductReviewsSection.module.css";

function ProductReviewsSection({ singleProduct }) {
  const reviews = singleProduct?.reviews || [];

  /* =========================
     IMAGE REVIEWS
  ========================= */

  const imageReviews = reviews.filter((review) => review.image);

  /* =========================
     MODAL
  ========================= */

  const [selectedIndex, setSelectedIndex] = useState(null);

  /* =========================
     OPEN REVIEW
  ========================= */

  const openPreview = (index) => {
    setSelectedIndex(index);
  };

  /* =========================
     CLOSE REVIEW
  ========================= */

  const closePreview = () => {
    setSelectedIndex(null);
  };

  /* =========================
     NEXT REVIEW
  ========================= */

  const nextReview = () => {
    if (reviews.length <= 1) return;

    setSelectedIndex((prev) => {
      if (prev === null) return 0;

      return prev === reviews.length - 1 ? 0 : prev + 1;
    });
  };

  /* =========================
     PREVIOUS REVIEW
  ========================= */

  const prevReview = () => {
    if (reviews.length <= 1) return;

    setSelectedIndex((prev) => {
      if (prev === null) return 0;

      return prev === 0 ? reviews.length - 1 : prev - 1;
    });
  };

  /* =========================
     CURRENT REVIEW
  ========================= */

  const selectedReview = selectedIndex !== null ? reviews[selectedIndex] : null;

  /* =========================
     EMPTY
  ========================= */

  if (reviews.length === 0 && !singleProduct.averageRating) {
    return null;
  }

  return (
    <>
      <div className={styles.reviewSection}>
        {/* =========================
            TOP
        ========================= */}

        <div className={styles.topSection}>
          {/* LEFT */}

          <div className={styles.ratingCard}>
            {/* TOP */}

            <div className={styles.ratingTop}>
              <div className={styles.bigRating}>
                {singleProduct.averageRating || 0}
              </div>

              <div className={styles.ratingRight}>
                <div className={styles.bigStars}>
                  {"★".repeat(Math.round(singleProduct.averageRating || 0))}
                </div>

                <p>Based on {singleProduct.totalReviews || 0} reviews</p>
              </div>
            </div>

            {/* BREAKDOWN */}

            <div className={styles.ratingBreakdown}>
              {[5, 4, 3, 2, 1].map((star) => {
                const total = singleProduct.totalReviews || 1;

                const count = reviews.filter((r) => r.rating === star).length;

                const percentage = Math.round((count / total) * 100);

                return (
                  <div key={star} className={styles.ratingRow}>
                    <span className={styles.starLabel}>{star} ★</span>

                    <div className={styles.ratingBar}>
                      <div
                        className={styles.ratingFill}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <span className={styles.ratingPercent}>{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}

          <div className={styles.reviewGallery}>
            <div className={styles.galleryTop}>
              <h3>Customer Reviews ({reviews.length})</h3>

              {reviews.length > 0 && (
                <button
                  className={styles.viewAllBtn}
                  onClick={() => openPreview(0)}
                >
                  View all reviews
                </button>
              )}
            </div>

            {/* IMAGES */}

            {imageReviews.length > 0 ? (
              <div className={styles.reviewImageGrid}>
                {imageReviews.slice(0, 5).map((review, index) => {
                  const remaining = imageReviews.length - 5;

                  return (
                    <div
                      key={index}
                      className={styles.reviewImageCard}
                      onClick={() =>
                        openPreview(
                          reviews.findIndex((r) => r._id === review._id),
                        )
                      }
                    >
                      <img
                        src={review.image}
                        alt="review"
                        className={styles.reviewGridImage}
                      />

                      {index === 4 && remaining > 0 && (
                        <div className={styles.moreOverlay}>+{remaining}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.noReviewImages}>
                <p>Reviews available without photos</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================
          MODAL
      ========================= */}

      {selectedReview && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {/* CLOSE */}

            <button className={styles.closeBtn} onClick={closePreview}>
              <FaTimes />
            </button>

            {/* HEADER */}

            <div className={styles.modalHeader}>
              <h2>Customer Reviews ({reviews.length})</h2>
            </div>

            {/* BODY */}

            <div className={styles.modalBody}>
              {/* LEFT */}

              {reviews.length > 1 && (
                <button className={styles.arrowBtn} onClick={prevReview}>
                  <FaChevronLeft />
                </button>
              )}

              {/* CENTER */}

              <div className={styles.modalCenter}>
                {/* IMAGE */}

                {selectedReview.image && (
                  <img
                    src={selectedReview.image}
                    alt="review"
                    className={styles.mainPreviewImage}
                  />
                )}

                {/* REVIEW DETAILS */}

                <div className={styles.reviewDetails}>
                  {/* PROFILE */}

                  <div className={styles.profileRow}>
                    {selectedReview.user?.profileImage ? (
                      <img
                        src={selectedReview.user.profileImage}
                        alt="user"
                        className={styles.profileImage}
                      />
                    ) : (
                      <div className={styles.userCircle}>
                        {selectedReview.user?.fullName
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>
                    )}

                    <div>
                      <h4>{selectedReview.user?.fullName || "User"}</h4>

                      <div className={styles.reviewMeta}>
                        <span className={styles.verified}>
                          <FaCheckCircle />
                          Verified Purchase
                        </span>

                        <span>
                          {new Date(
                            selectedReview.createdAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* STARS */}

                  <div className={styles.modalStars}>
                    {"★".repeat(selectedReview.rating)}
                    {"☆".repeat(5 - selectedReview.rating)}
                  </div>

                  {/* COMMENT */}

                  <p className={styles.reviewComment}>
                    {selectedReview.comment}
                  </p>
                </div>
              </div>

              {/* RIGHT */}

              {reviews.length > 1 && (
                <button className={styles.arrowBtn} onClick={nextReview}>
                  <FaChevronRight />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductReviewsSection;
