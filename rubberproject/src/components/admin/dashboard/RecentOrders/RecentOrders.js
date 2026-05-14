import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import styles from "./RecentOrders.module.css";

function RecentOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin-dashboard/recent-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.log("Recent Orders Error:", error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
      case "delivered":
        return styles.completed;

      case "partially_shipped":
        return styles.partial;

      case "pending":
        return styles.pending;

      case "cancelled":
        return styles.cancelled;

      default:
        return styles.defaultStatus;
    }
  };

  return (
    <div className={styles.recentOrders}>
      {/* TOP */}

      <div className={styles.recentOrdersTop}>
        <div>
          <h2>Recent Orders</h2>

          <p>Latest platform orders</p>
        </div>

        <button
          className={styles.viewAllButton}
          onClick={() => navigate("/admin/orders")}
        >
          View All
        </button>
      </div>

      {/* TABLE */}

      <div className={styles.tableWrapper}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>

              <th>Buyer</th>

              <th>Amount</th>

              <th>Status</th>

              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderId}</td>

                <td>{order?.buyer?.fullName || "Buyer"}</td>

                <td>₹{order.totalAmount}</td>

                <td>
                  <span
                    className={`
                      ${styles.statusBadge}
                      ${getStatusClass(order.orderStatus)}
                    `}
                  >
                    {order.orderStatus?.replace("_", " ")}
                  </span>
                </td>

                <td>{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrders;
