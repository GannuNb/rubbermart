import React, { useEffect, useRef } from "react";

import {
  FaArrowLeft,
  FaArrowRight,
  FaBoxes,
  FaBullseye,
  FaGlobe,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaShoppingBag,
  FaStar,
  FaTags,
  FaUsers,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { fetchRecommendedProducts } from "../../../redux/slices/buyerProductThunk";

import styles from "./RecommendedProductsSection.module.css";

const RecommendedProductsSection = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const scrollRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  const {
    recommendedProducts,
    recommendedProductsLoading,
    recommendedProductsError,
  } = useSelector((state) => state.buyerProducts);

  /* =====================================
      FETCH PRODUCTS
  ===================================== */

  useEffect(() => {
    if (user) {
      dispatch(fetchRecommendedProducts());
    }
  }, [dispatch, user]);

  /* =====================================
      SLIDER
  ===================================== */

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -340,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 340,
        behavior: "smooth",
      });
    }
  };

  /* =====================================
      FEATURES
  ===================================== */

  const features = [
    {
      icon: <FaBullseye />,
      title: "Curated for You",
      desc: "Based on your interests",
    },

    {
      icon: <FaShieldAlt />,
      title: "Quality Assured",
      desc: "Approved & verified products",
    },

    {
      icon: <FaTags />,
      title: "Best Value",
      desc: "Competitive market pricing",
    },

    {
      icon: <FaUsers />,
      title: "Reliable Sellers",
      desc: "Trusted & verified sellers",
    },
  ];

  return (
    <section className={styles.recommendedSection}>
      <div className="container-fluid px-md-5">
        {/* =====================================
            TOP AREA
        ===================================== */}

        <div className={styles.topArea}>
          <div className={styles.personalizedBadge}>
            <FaStar />

            <span>Personalized for you</span>
          </div>

          <h2 className={styles.sectionTitle}>
            Recommended <span>Products</span>
          </h2>

          <p className={styles.sectionSubtitle}>
            Handpicked products that match your
            business interests and requirements
          </p>
        </div>

        {/* =====================================
            FEATURES
        ===================================== */}

        <div className={styles.featureGrid}>
          {features.map((item, index) => (
            <div
              key={index}
              className={styles.featureCard}
            >
              <div className={styles.featureIcon}>
                {item.icon}
              </div>

              <div className={styles.featureText}>
                <h4>{item.title}</h4>

                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* =====================================
            PRODUCTS WRAPPER
        ===================================== */}

        <div className={styles.productsWrapper}>
          {/* TOPBAR */}

          <div className={styles.productsTopbar}>
            <h3>
              <FaStar />

              Top Picks for You
            </h3>

            <div className={styles.rightActions}>
              {/* SLIDER BUTTONS */}

              {recommendedProducts.length > 3 && (
                <div className={styles.sliderBtns}>
                  <button
                    className={styles.arrowBtn}
                    onClick={scrollLeft}
                  >
                    <FaArrowLeft />
                  </button>

                  <button
                    className={styles.arrowBtn}
                    onClick={scrollRight}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              )}

              {/* VIEW ALL */}

              <button
                className={styles.viewAllBtn}
                onClick={() =>
                  navigate("/our-products")
                }
              >
                View all products

                <FaArrowRight />
              </button>
            </div>
          </div>

          {/* LOADING */}

          {recommendedProductsLoading && (
            <p>Loading recommendations...</p>
          )}

          {/* ERROR */}

          {recommendedProductsError && (
            <p>{recommendedProductsError}</p>
          )}

          {/* EMPTY */}

          {!recommendedProductsLoading &&
            recommendedProducts.length === 0 && (
              <p>No recommended products found</p>
            )}

          {/* PRODUCTS */}

          <div
            className={styles.productsScroll}
            ref={scrollRef}
          >
            <div className={styles.productGrid}>
              {recommendedProducts.map((product) => (
                <div
                  key={product._id}
                  className={styles.productCard}
                >
                  {/* IMAGE */}

                  <div className={styles.imageWrapper}>
                    <img
                      src={
                        product.images?.[0]?.image ||
                        "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt={product.application}
                    />

                    <span
                      className={
                        styles.stockBadge
                      }
                    >
                      ● Available
                    </span>
                  </div>

                  {/* BODY */}

                  <div className={styles.cardBody}>
                    {/* CATEGORY */}

                    <span
                      className={
                        styles.categoryTag
                      }
                    >
                      {product.category}
                    </span>

                    {/* TITLE */}

                    <h3
                      className={
                        styles.productTitle
                      }
                    >
                      {product.application}
                    </h3>

                    {/* PRICE */}

                    <div className={styles.price}>
                      ₹
                      {Number(
                        product.pricePerMT
                      ).toLocaleString()}

                      <span> / MT</span>
                    </div>

                    {/* LOCATION */}

                    <div
                      className={
                        styles.locationRow
                      }
                    >
                      <FaMapMarkerAlt />

                      <span>
                        {
                          product.loadingLocation
                        }
                        ,{" "}
                        {
                          product.countryOfOrigin
                        }
                      </span>
                    </div>

                    {/* META */}

                    <div
                      className={styles.metaGrid}
                    >
                      <div
                        className={
                          styles.metaBox
                        }
                      >
                        <h5>
                          <FaBoxes />
                        </h5>

                        <p>
                          {product.quantity} MT
                        </p>
                      </div>

                      <div
                        className={
                          styles.metaBox
                        }
                      >
                        <h5>
                          <FaGlobe />
                        </h5>

                        <p>
                          {
                            product.countryOfOrigin
                          }
                        </p>
                      </div>

                      <div
                        className={
                          styles.metaBox
                        }
                      >
                        <h5>
                          <FaShieldAlt />
                        </h5>

                        <p>Approved</p>
                      </div>
                    </div>

                    {/* BUTTON */}

                    <button
                      className={styles.viewBtn}
                      onClick={() =>
                        navigate(
                          `/product/${product._id}`
                        )
                      }
                    >
                      View Product

                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =====================================
              BOTTOM CTA
          ===================================== */}

          <div className={styles.bottomCTA}>
            <div className={styles.bottomLeft}>
              <div className={styles.bottomIcon}>
                <FaShoppingBag />
              </div>

              <div className={styles.bottomText}>
                <h4>
                  Can't find what you're looking
                  for?
                </h4>

                <p>
                  Explore all products from
                  verified sellers
                </p>
              </div>
            </div>

            <button
              className={styles.exploreBtn}
              onClick={() =>
                navigate("/our-products")
              }
            >
              Explore All Products

              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendedProductsSection;