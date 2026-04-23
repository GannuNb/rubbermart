import React from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaShoppingBag, FaPlusCircle, FaClock } from "react-icons/fa";
import styles from "../../styles/Seller/SellerDashboard.module.css";

function SellerDashboard() {
  return (
    <div className={styles.container}>

      {/* ===== Top Section ===== */}
      <section className={styles.topSection}>
        <div className={styles.topContent}>
          <h1>Seller Dashboard</h1>
          <p>Manage your products and orders efficiently</p>
        </div>
      </section>

      {/* ===== Cards ===== */}
      <section className={styles.cards}>

        <div className={styles.card}>
          <FaPlusCircle className={styles.icon} />
          <h2>Add Products</h2>
          <p>Create and list new products</p>
          <Link to="/seller-add-products" className={styles.btn}>
            Add Product
          </Link>
        </div>

        <div className={styles.card}>
          <FaBoxOpen className={styles.icon} />
          <h2>Manage Products</h2>
          <p>Edit or update your listings</p>
          <Link to="/seller-products" className={styles.btn}>
            Manage Products
          </Link>
        </div>

        {/* ✅ New Pending Products Card */}
        <div className={styles.card}>
          <FaClock className={styles.icon} />
          <h2>Pending Products</h2>
          <p>Products awaiting admin approval</p>
          <Link to="/seller-pending-products" className={styles.btn}>
            View Pending
          </Link>
        </div>

        <div className={styles.card}>
          <FaShoppingBag className={styles.icon} />
          <h2>Orders</h2>
          <p>Track and manage buyer orders</p>
          <Link to="/seller/orders" className={styles.btn}>
            View Orders
          </Link>
        </div>

      </section>

      {/* ===== Info Section ===== */}
      <section className={styles.infoSection}>
        <h2>Seller Insights</h2>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3>📦 Product Quality</h3>
            <p>Use clear images and detailed descriptions to increase trust.</p>
          </div>

          <div className={styles.infoCard}>
            <h3>⚡ Fast Response</h3>
            <p>Quick responses improve buyer satisfaction and repeat orders.</p>
          </div>

          <div className={styles.infoCard}>
            <h3>📈 Growth Tips</h3>
            <p>Update pricing and availability regularly to stay competitive.</p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default SellerDashboard;