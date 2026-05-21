// src/pages/ProductDetails.js

import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useParams } from "react-router-dom";
import ProductDetailsInfo from "../../components/products/ProductDetailsInfo";
import styles from "../../styles/Buyer/ProductDetails.module.css";

import { useSelector } from "react-redux";

import CommunitySection from "../Homepage/HomeComponents/CommunitySection";

import RecommendedProductsSection from "../Homepage/HomeComponents/RecommendedProductsSection";

function ProductDetails() {
  const { productId } = useParams();

  const [singleProduct, setSingleProduct] = useState(null);
  const [singleProductLoading, setSingleProductLoading] = useState(true);
  const [singleProductError, setSingleProductError] = useState("");

  const { user, token } = useSelector((state) => state.auth);

  const isLoggedIn = user && token;

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        setSingleProductLoading(true);

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/buyer-products/approved/${productId}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch product");
        }

        setSingleProduct(data.product);
      } catch (error) {
        setSingleProductError(error.message);
      } finally {
        setSingleProductLoading(false);
      }
    };

    fetchSingleProduct();
  }, [productId]);

  if (singleProductLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <FaSpinner className={styles.loaderIcon} />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (singleProductError) {
    return (
      <div className={styles.errorWrapper}>
        <p>{singleProductError}</p>
      </div>
    );
  }

  if (!singleProduct) return null;

  return (
    <div className={styles.pageWrapper}>
      <ProductDetailsInfo singleProduct={singleProduct} />

      {/* AFTER REVIEWS */}

      <div className="mt-5">
        {isLoggedIn ? <RecommendedProductsSection /> : <CommunitySection />}
      </div>
    </div>
  );
}

export default ProductDetails;
