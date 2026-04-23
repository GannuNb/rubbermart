// src/pages/BuyerOrderDetails.js

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/Buyer/BuyerOrderDetails.module.css";

import OrderItemsSection from "../../components/orders/OrderItemsSection";
import OrderSummaryHeader from "../../components/orders/OrderSummaryHeader";
import DeliveryAddressCard from "../../components/orders/DeliveryAddressCard";
import PaymentUploadCard from "../../components/orders/PaymentUploadCard";
import PaymentSummaryCard from "../../components/orders/PaymentSummaryCard";

function BuyerOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/orders/buyer-orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
      } else {
        alert(data.message || "Failed to fetch order");
      }
    } catch (error) {
      console.log("Fetch Order Details Error:", error);
      alert("Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loadingText}>
          Loading order details...
        </div>
      </div>
    );
  }

  // EMPTY
  if (!order) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.emptyState}>
          Order not found
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* 🔷 TOP HEADER */}
      <div className={styles.topHeaderCard}>
        <div className={styles.pageTitleSection}>
          <div className={styles.orderIconBox}>
            <img src="/logo192.png" alt="orders" />
          </div>
          <h1>My Orders</h1>
        </div>

        <div className={styles.profileIcon}>
          <img
            src="https://i.pravatar.cc/100?img=32"
            alt="profile"
          />
        </div>
      </div>

      {/* 🔷 MAIN CARD */}
      <div className={styles.contentCard}>
        {/* BACK */}
        <div
          className={styles.backBtn}
          onClick={() => navigate(-1)}
        >
          ← Back to Orders
        </div>

        {/* 🔷 GRID */}
        <div className={styles.detailsGrid}>
          {/* ✅ LEFT SIDE */}
          <div className={styles.leftSection}>
            
            {/* ✅ MOVE HEADER HERE (IMPORTANT FIX) */}
            <OrderSummaryHeader order={order} />

            {/* ITEMS */}
            <OrderItemsSection order={order} />
          </div>

          {/* ✅ RIGHT SIDE */}
          <div className={styles.rightSection}>
            <DeliveryAddressCard order={order} />

            <PaymentUploadCard
              order={order}
              onPaymentUploaded={fetchOrderDetails}
            />

            <PaymentSummaryCard order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyerOrderDetails;