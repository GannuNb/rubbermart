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
          <h1>Welcome back, Seller! 👋</h1>
          <p>Manage your products and orders efficiently.</p>
        </div>

        {/* =========================
            ACTION CARDS GRID
        ========================= */}
        <div className={styles.cardsGrid}>
          {/* CARD 1: Add Products */}
          <Link to="/seller-add-products" className={styles.card}>
            <div className={`${styles.iconBox} ${styles.purple}`}>
              <FaPlusCircle />
            </div>

            <div className={styles.cardContent}>
              <h3>Add Products</h3>
              <p>Create and list new products</p>
              <span className={styles.btnPurple}>Add Product</span>
            </div>
          </Link>

          {/* CARD 2: Manage Products */}
          <Link to="/seller-approved-products" className={styles.card}>
            <div className={`${styles.iconBox} ${styles.blue}`}>
              <FaBoxOpen />
            </div>

            <div className={styles.cardContent}>
              <h3>Manage Products</h3>
              <p>Edit or update your products</p>
              <span className={styles.btnBlue}>Manage Products</span>
            </div>
          </Link>

          {/* CARD 3: Pending Products */}
          <Link to="/seller-pending-products" className={styles.card}>
            <div className={`${styles.iconBox} ${styles.orange}`}>
              <FaClock />
            </div>

            <div className={styles.cardContent}>
              <h3>Pending Products</h3>
              <p>Products awaiting admin approval</p>
              <span className={styles.btnOrange}>View Pending</span>
            </div>
          </Link>

          {/* CARD 4: Orders */}
          <Link to="/seller/orders" className={styles.card}>
            <div className={`${styles.iconBox} ${styles.green}`}>
              <FaShoppingBag />
            </div>

            <div className={styles.cardContent}>
              <h3>Orders</h3>
              <p>Track and manage buyer orders</p>
              <span className={styles.btnGreen}>View Orders</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default WelcomeSection;