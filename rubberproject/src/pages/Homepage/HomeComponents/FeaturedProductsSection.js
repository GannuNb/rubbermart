import React, { useEffect, useRef } from "react";

import {
  ChevronLeft,
  ChevronRight,
  MoveRight,
  ShieldCheck,
  Leaf,
  Truck,
  BadgeDollarSign,
  Sparkles,
  MapPin,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { fetchFeaturedProducts } from "../../../redux/slices/buyerProductThunk";

import styles from "./FeaturedProductsSection.module.css";

import bgImage from "../../../assests/fp7.png";

import tyreImg from "../../../assests/categoryimages/Tyre.jpeg";

function FeaturedProductsSection() {
  const scrollRef = useRef(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { featuredProducts, featuredProductsLoading } = useSelector(
    (state) => state.buyerProducts,
  );

  /* =====================================
      FETCH PRODUCTS
  ===================================== */

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  /* =====================================
      SLIDER
  ===================================== */

  const scroll = (direction) => {
    const { current } = scrollRef;

    if (current) {
      const scrollAmount = 340;

      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,

        behavior: "smooth",
      });
    }
  };

  return (
    <section className={styles.sectionWrapper}>
      {/* BACKGROUND */}

      <div
        className={styles.bgOverlay}
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />

      <div className="container-fluid px-xl-5 px-lg-4 px-3">
        {/* =====================================
            HEADER
        ===================================== */}

        <div className={styles.topHeader}>
          <div>
            <div className={styles.topTag}>
              <Sparkles size={13} />
              NEWEST ARRIVALS
            </div>

            <h2 className={styles.sectionTitle}>
              Featured <span>Products</span>
            </h2>

            <p className={styles.sectionDesc}>
              Explore the latest approved rubber products from verified
              suppliers.
            </p>
          </div>
        </div>

        {/* =====================================
            VIEW ALL BUTTON
        ===================================== */}

        <div className={styles.viewAllWrapper}>
          <button
            className={styles.viewAllBtn}
            onClick={() => navigate("/our-products")}
          >
            View all products
            <MoveRight size={16} />
          </button>
        </div>

        {/* =====================================
            PRODUCTS
        ===================================== */}

        <div className={styles.sliderWrapper}>
          {/* LEFT BUTTON */}

          {featuredProducts.length > 3 && (
            <button
              className={`${styles.navBtn} ${styles.prevBtn}`}
              onClick={() => scroll("left")}
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* RIGHT BUTTON */}

          {featuredProducts.length > 3 && (
            <button
              className={`${styles.navBtn} ${styles.nextBtn}`}
              onClick={() => scroll("right")}
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* LOADING */}

          {featuredProductsLoading && <p>Loading products...</p>}

          {/* PRODUCTS */}

          <div className={styles.productsSlider} ref={scrollRef}>
            {featuredProducts.map((item, index) => (
              <div className={styles.productCard} key={index}>
                {/* IMAGE */}

                <div className={styles.imageWrapper}>
                  <img
                    src={item.images?.[0]?.image || tyreImg}
                    alt={item.application}
                    className={styles.productImage}
                  />

                  {/* BADGE */}

                  <div className={`${styles.badgeIcon} ${styles.purpleBadge}`}>
                    <ShieldCheck size={15} />
                  </div>
                </div>

                {/* BODY */}

                <div className={styles.cardBody}>
                  {/* TITLE */}

                  <h3 className={styles.productTitle}>{item.application}</h3>

                  {/* QUANTITY */}

                  <p className={styles.qtyText}>{item.quantity} MT</p>

                  {/* LOCATION */}

                  <div className={styles.locationRow}>
                    <MapPin size={13} />

                    <span>{item.loadingLocation}</span>
                  </div>

                  {/* PRICE */}

                  <h4 className={styles.purplePrice}>
                    ₹ {item.pricePerMT} / MT
                  </h4>

                  {/* BUTTON */}

                  <button
                    className={styles.detailsBtn}
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    View Details
                    <MoveRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================
            BOTTOM INFO
        ===================================== */}

        <div className={styles.bottomInfoWrapper}>
          {/* ITEM */}

          <div className={styles.infoItem}>
            <div className={styles.infoIconPurple}>
              <ShieldCheck size={22} />
            </div>

            <div>
              <h5>Verified Suppliers</h5>

              <p>All suppliers are verified for your safety</p>
            </div>
          </div>

          {/* ITEM */}

          <div className={styles.infoItem}>
            <div className={styles.infoIconGreen}>
              <Leaf size={22} />
            </div>

            <div>
              <h5 className={styles.greenText}>Best Quality</h5>

              <p>Premium quality rubber products</p>
            </div>
          </div>

          {/* ITEM */}

          <div className={styles.infoItem}>
            <div className={styles.infoIconPurple}>
              <Truck size={22} />
            </div>

            <div>
              <h5>Global Shipping</h5>

              <p>Fast & reliable delivery worldwide</p>
            </div>
          </div>

          {/* ITEM */}

          <div className={styles.infoItem}>
            <div className={styles.infoIconGreen}>
              <BadgeDollarSign size={22} />
            </div>

            <div>
              <h5 className={styles.greenText}>Secure Payments</h5>

              <p>100% secure transactions and payments</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProductsSection;
