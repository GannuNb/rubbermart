import React from "react";
import {
  FaPlusCircle,
  FaBoxOpen,
  FaClock,
  FaShoppingBag,
} from "react-icons/fa";
import styles from "./WelcomeSection.module.css";
import { useSelector } from "react-redux";

function WelcomeSection() {
  const { token, user } = useSelector((state) => state.auth || {});

  const handleProtectedNavigation = (path) => {
  // NOT LOGGED IN
  if (!token) {
    window.location.href = "/login";
    return;
  }

  // BUSINESS PROFILE NOT COMPLETED
  if (!user?.businessProfileCompleted) {
    window.location.href = "/business-profile";
    return;
  }

  // ALLOWED
  window.location.href = path;
};

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
          <div
            className={styles.card}
            onClick={() => handleProtectedNavigation("/seller-add-products")}
          >            <div className={`${styles.iconBox} ${styles.purple}`}>
              <FaPlusCircle />
            </div>

            <div className={styles.cardContent}>
              <h3>Add Products</h3>
              <p>Create and list new products</p>
              <span className={styles.btnPurple}>Add Product</span>
            </div>
          </div>

          {/* CARD 2: Manage Products */}
          <div
            className={styles.card}
            onClick={() => handleProtectedNavigation("/seller-approved-products")}
          >            <div className={`${styles.iconBox} ${styles.blue}`}>
              <FaBoxOpen />
            </div>

            <div className={styles.cardContent}>
              <h3>Manage Products</h3>
              <p>Edit or update your products</p>
              <span className={styles.btnBlue}>Manage Products</span>
            </div>
          </div>

          {/* CARD 3: Pending Products */}
          <div
            className={styles.card}
            onClick={() => handleProtectedNavigation("/seller-pending-products")}
          >            <div className={`${styles.iconBox} ${styles.orange}`}>
              <FaClock />
            </div>

            <div className={styles.cardContent}>
              <h3>Pending Products</h3>
              <p>Products awaiting admin approval</p>
              <span className={styles.btnOrange}>View Pending</span>
            </div>
          </div
          >
          {/* CARD 4: Orders */}
          <div
            className={styles.card}
            onClick={() => handleProtectedNavigation("/seller/orders")}
          >            <div className={`${styles.iconBox} ${styles.green}`}>
              <FaShoppingBag />
            </div>

            <div className={styles.cardContent}>
              <h3>Orders</h3>
              <p>Track and manage buyer orders</p>
              <span className={styles.btnGreen}>View Orders</span>
            </div>
          </div>        </div>
      </div>
    </section>
  );
}

export default WelcomeSection;