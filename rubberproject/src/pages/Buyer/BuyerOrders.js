import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Buyer/BuyerOrders.module.css";

import OrderCard from "../../components/orders/OrderCard";
import OrderFilters from "../../components/orders/OrderFilters";
import OrderHeader from "../../components/orders/OrderHeader";

import { getDisplayStatus } from "../../utils/orderStatusHelpers";

function BuyerOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchBuyerOrders();
  }, []);

  const fetchBuyerOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/orders/buyer-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        alert(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.log("Fetch Buyer Orders Error:", error);
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FILTER LOGIC
  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;

    return orders.filter((order) => {
      const displayStatus = getDisplayStatus(order);

      if (activeFilter === "in_progress") {
        return (
          displayStatus !== "Delivered" &&
          displayStatus !== "Cancelled"
        );
      }

      if (activeFilter === "partial_shipments") {
        return displayStatus === "Partial Shipment";
      }

      if (activeFilter === "shipped") {
        return displayStatus === "Shipped";
      }

      if (activeFilter === "delivered") {
        return displayStatus === "Delivered";
      }

      if (activeFilter === "cancelled") {
        return displayStatus === "Cancelled";
      }

      return true;
    });
  }, [orders, activeFilter]);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loadingText}>Loading orders...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* ✅ HEADER */}
      <OrderHeader />

      {/* CONTENT */}
      <div className={styles.contentCard}>
        {/* ✅ FILTERS */}
        <OrderFilters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {/* LIST */}
        {filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No Orders Found</h2>
            <p>No orders available for this filter.</p>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyerOrders;