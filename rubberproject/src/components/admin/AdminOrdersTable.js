// rubberproject/src/components/admin/AdminOrdersTable.js

import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FaFileInvoice,
  FaUser,
  FaBoxes,
  FaRupeeSign,
  FaCheckCircle,
  FaCalendarAlt,
  FaEye,
  FaDownload, // Added for download button icon
} from "react-icons/fa";

import styles from "../../styles/Admin/AdminOrdersTable.module.css";

const AdminOrdersTable = ({ orders }) => {
  const navigate = useNavigate();

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return styles.pending;
      case "partially_shipped":
        return styles.partial;
      case "cancelled":
        return styles.cancelled;
      case "delivered":
      case "completed":
      case "shipped":
        return styles.delivered;
      case "seller_confirmed":
      case "partial_payment_uploaded":
      case "partial_payment_verified":
      case "payment_completed":
      default:
        return styles.inProgress;
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return {
        date: "-",
        time: "-",
      };
    }

    const newDate = new Date(date);

    return {
      date: newDate.toLocaleDateString("en-IN"),
      time: newDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getImageSrc = (image) => {
    if (!image || !image.data) {
      return null;
    }

    try {
      const byteArray = image.data.data;

      if (!byteArray || !Array.isArray(byteArray)) {
        return null;
      }

      const base64String = btoa(
        new Uint8Array(byteArray).reduce((data, byte) => {
          return data + String.fromCharCode(byte);
        }, ""),
      );

      return `data:${image.contentType};base64,${base64String}`;
    } catch (error) {
      console.log("Image Conversion Error:", error);
      return null;
    }
  };

  const downloadOrderHistory = async (orderId, orderNumber) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
  `${process.env.REACT_APP_API_URL}/api/orders/admin/${orderId}/order-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.log("Backend Error:", errorText);

        alert(errorText);

        return;
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `Order_History_${orderNumber}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      alert("Failed to download Order History PDF.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <div className={styles.headerCell}>
                <FaFileInvoice />
                <span>Order ID</span>
              </div>
            </th>

            <th>
              <div className={styles.headerCell}>
                <FaUser />
                <span>Buyer</span>
              </div>
            </th>

            <th>
              <div className={styles.headerCell}>
                <FaBoxes />
                <span>Items</span>
              </div>
            </th>

            <th>
              <div className={styles.headerCell}>
                <FaRupeeSign />
                <span>Total Amount</span>
              </div>
            </th>

            <th>
              <div className={styles.headerCell}>
                <FaCheckCircle />
                <span>Status</span>
              </div>
            </th>

            <th>
              <div className={styles.headerCell}>
                <FaCalendarAlt />
                <span>Order Date</span>
              </div>
            </th>

            <th>
              <div className={styles.headerCell}>
                <FaEye />
                <span>Action</span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {orders && orders.length > 0 ? (
            orders.map((order) => {
              const firstImage = order?.orderItems?.[0]?.productImage;
              const imageSrc = getImageSrc(firstImage);
              const formattedDate = formatDate(order.createdAt);

              return (
                <tr
                  key={order._id}
                  className={styles.tableRow}
                  onClick={() => navigate(`/admin/order-details/${order._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {/* ORDER */}
                  <td data-label="Order">
                    <div className={styles.orderCell}>
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt="product"
                          className={styles.productImage}
                        />
                      ) : (
                        <div className={styles.placeholderImage} />
                      )}
                      <span className={styles.orderId}>
                        {order?.orderId || "-"}
                      </span>
                    </div>
                  </td>

                  {/* BUYER */}
                  <td data-label="Buyer" className={styles.buyerName}>
                    {order?.buyer?.fullName || "-"}
                  </td>

                  {/* ITEMS */}
                  <td data-label="Items">
                    {order?.orderItems?.length || 0} Items
                  </td>

                  {/* AMOUNT */}
                  <td data-label="Amount" className={styles.amount}>
                    ₹ {order?.totalAmount || 0}
                  </td>

                  {/* STATUS */}
                  <td data-label="Status">
                    <span
                      className={`${styles.statusBadge} ${getStatusClass(order?.orderStatus)}`}
                    >
                      {order?.orderStatus?.replaceAll("_", " ") || "-"}
                    </span>
                  </td>

                  {/* DATE */}
                  <td data-label="Date">
                    <div>
                      <p>{formattedDate.date}</p>
                      <p>{formattedDate.time}</p>
                    </div>
                  </td>

                  {/* ACTION */}
                  <td data-label="Action" onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className={styles.viewBtn}
                        onClick={() =>
                          navigate(`/admin/order-details/${order._id}`)
                        }
                      >
                        View
                      </button>

                      {/* PDF DOWNLOAD BUTTON */}
                      <button
                        className={styles.viewBtn}
                        style={{
                          backgroundColor: "#28a745",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                        onClick={() =>
                          downloadOrderHistory(order._id, order.orderId)
                        }
                      >
                        <FaDownload size={11} />
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className={styles.emptyRow}>
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersTable;
