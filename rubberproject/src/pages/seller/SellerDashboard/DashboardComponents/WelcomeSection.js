import React from "react";

import {
  FaPlusCircle,
  FaBoxOpen,
  FaClock,
  FaShoppingBag,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import styles from "./WelcomeSection.module.css";

function WelcomeSection() {
  return (
    <section className={styles.wrapper}>
      {/* =========================
          HERO SECTION
      ========================= */}

      <div className={styles.heroSection}>
        {/* LEFT CONTENT */}

        <div className={styles.heroContent}>
          <h1>
            Welcome back, Seller! 👋
          </h1>

          <p>
            Manage your products and
            orders efficiently.
          </p>
        </div>

        {/* =========================
            ACTION CARDS
        ========================= */}

        <div className={styles.cardsGrid}>
          {/* CARD */}

          <div className={styles.card}>
            <div
              className={`${styles.iconBox} ${styles.purple}`}
            >
              <FaPlusCircle />
            </div>

            <div className={styles.cardContent}>
              <h3>Add Products</h3>

              <p>
                Create and list new
                products
              </p>

              <Link
                to="/seller-add-products"
                className={styles.btnPurple}
              >
                Add Product
              </Link>
            </div>
          </div>

          {/* CARD */}

          <div className={styles.card}>
            <div
              className={`${styles.iconBox} ${styles.blue}`}
            >
              <FaBoxOpen />
            </div>

            <div className={styles.cardContent}>
              <h3>Manage Products</h3>

              <p>
                Edit or update your
                products
              </p>

              <Link
                to="/seller-products"
                className={styles.btnBlue}
              >
                Manage Products
              </Link>
            </div>
          </div>

          {/* CARD */}

          <div className={styles.card}>
            <div
              className={`${styles.iconBox} ${styles.orange}`}
            >
              <FaClock />
            </div>

            <div className={styles.cardContent}>
              <h3>Pending Products</h3>

              <p>
                Products awaiting admin
                approval
              </p>

              <Link
                to="/seller-pending-products"
                className={styles.btnOrange}
              >
                View Pending
              </Link>
            </div>
          </div>

          {/* CARD */}

          <div className={styles.card}>
            <div
              className={`${styles.iconBox} ${styles.green}`}
            >
              <FaShoppingBag />
            </div>

            <div className={styles.cardContent}>
              <h3>Orders</h3>

              <p>
                Track and manage buyer
                orders
              </p>

              <Link
                to="/seller/orders"
                className={styles.btnGreen}
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WelcomeSection;