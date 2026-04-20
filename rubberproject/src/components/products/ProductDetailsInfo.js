// src/components/ProductDetailsInfo.js

import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaBoxes,
  FaTag,
  FaIndustry,
  FaGlobe,
  FaBarcode,
  FaBuilding,
} from "react-icons/fa";
import ProductOrderPanel from "./ProductOrderPanel";
import styles from "../../styles/Buyer/ProductDetailsInfo.module.css";

function ProductDetailsInfo({ singleProduct }) {
  const [selectedImage, setSelectedImage] = useState(
    singleProduct.images?.[0]?.image || ""
  );

  const productImages =
    singleProduct.images?.length > 0
      ? singleProduct.images
      : [
          {
            image: "https://via.placeholder.com/600x600?text=No+Image",
          },
        ];

  return (
    <div className={styles.pageLayout}>
      <div className={styles.productContentCard}>
        <div className={styles.leftSection}>
          <div className={styles.imageGallery}>
            <div className={styles.thumbnailColumn}>
              {productImages.map((img, index) => (
                <img
                  key={index}
                  src={img.image}
                  alt={`Product ${index + 1}`}
                  className={`${styles.thumbnail} ${
                    selectedImage === img.image ? styles.activeThumbnail : ""
                  }`}
                  onClick={() => setSelectedImage(img.image)}
                />
              ))}
            </div>

            <div className={styles.mainImageContainer}>
              <img
                src={selectedImage || productImages[0].image}
                alt={singleProduct.application}
                className={styles.mainImage}
              />
            </div>
          </div>
        </div>

        <div className={styles.middleSection}>
          <div className={styles.headingSection}>
            <span className={styles.categoryBadge}>
              {singleProduct.category || "Category"}
            </span>

            <h1>{singleProduct.application || "Product Name"}</h1>

            <div
              className={`${styles.stockBadge} ${
                singleProduct.stockStatus === "available"
                  ? styles.available
                  : styles.soldout
              }`}
            >
              {singleProduct.stockStatus || "Unavailable"}
            </div>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <FaBoxes />
              <div>
                <span>Available Quantity</span>
                <h4>{singleProduct.quantity || 0} MT</h4>
              </div>
            </div>

            <div className={styles.infoCard}>
              <FaTag />
              <div>
                <span>Price Per MT</span>
                <h4>
                  ₹
                  {Number(singleProduct.pricePerMT || 0).toLocaleString()}
                </h4>
              </div>
            </div>

            <div className={styles.infoCard}>
              <FaMapMarkerAlt />
              <div>
                <span>Loading Location</span>
                <h4>{singleProduct.loadingLocation || "Not Available"}</h4>
              </div>
            </div>

            <div className={styles.infoCard}>
              <FaBarcode />
              <div>
                <span>HSN Code</span>
                <h4>{singleProduct.hsnCode || "Not Available"}</h4>
              </div>
            </div>

            <div className={styles.infoCard}>
              <FaGlobe />
              <div>
                <span>Country Of Origin</span>
                <h4>{singleProduct.countryOfOrigin || "Not Available"}</h4>
              </div>
            </div>

            <div className={styles.infoCard}>
              <FaIndustry />
              <div>
                <span>Category</span>
                <h4>{singleProduct.category || "Not Available"}</h4>
              </div>
            </div>
          </div>

          <div className={styles.descriptionBox}>
            <h3>Product Description</h3>
            <p>
              {singleProduct.description ||
                "No description available for this product."}
            </p>
          </div>
        </div>
      </div>

<div className={styles.rightSection}>
  <ProductOrderPanel singleProduct={singleProduct} />
</div>
    </div>
  );
}

export default ProductDetailsInfo;