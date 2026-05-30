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

              {/* Change this part in your JSX */}
              {reviews.length > 0 && (
                <button
                  className={styles.viewAllBtn}
                  // Clicking "View all" explicitly sets index to 0 (the first review)
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
            <button className={styles.closeBtn} onClick={closePreview}><FaTimes /></button>

            {/* CAROUSEL NAVIGATION */}
            {reviews.length > 1 && (
              <>
                <button className={styles.arrowLeft} onClick={prevReview}><FaChevronLeft /></button>
                <button className={styles.arrowRight} onClick={nextReview}><FaChevronRight /></button>
              </>
            )}

            <div className={styles.modalBody}>
              {/* 1. IMAGE */}
              {selectedReview.image && (
                <div className={styles.modalCenter}>
                  <img src={selectedReview.image} alt="review" className={styles.mainPreviewImage} />
                </div>
              )}

              {/* 2. COMMENT */}
              <p className={styles.reviewComment}>{selectedReview.comment}</p>

              {/* 3. STARS */}
              <div className={styles.modalStars}>
                {"★".repeat(selectedReview.rating)}{"☆".repeat(5 - selectedReview.rating)}
              </div>

              {/* 4. USER INFO */}
              <div className={styles.profileRow}>
                <div className={styles.userCircle}>
                  {selectedReview.user?.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h4 className={styles.userName}>{selectedReview.user?.fullName || "User"}</h4>

                  <div className={styles.metaInfo}>
                    <span className={styles.verified}>
                      <FaCheckCircle /> Verified Purchase
                    </span>

                    {/* Date display */}
                    <span className={styles.postedOn}>
                      Posted on {new Date(selectedReview.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductReviewsSection;
