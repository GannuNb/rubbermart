// src/components/admin/AdminOrdersTable.js

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
        new Uint8Array(byteArray).reduce(
          (data, byte) => {
            return (
              data + String.fromCharCode(byte)
            );
          },
          ""
        )
      );

      return `data:${image.contentType};base64,${base64String}`;
    } catch (error) {
      console.log(
        "Image Conversion Error:",
        error
      );
      return null;
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
              const firstImage =
                order?.orderItems?.[0]
                  ?.productImage;

              const imageSrc =
                getImageSrc(firstImage);

              const formattedDate =
                formatDate(order.createdAt);

              return (
                <tr key={order._id}>
                  {/* ORDER ID + IMAGE */}
                  <td>
                    <div
                      className={styles.orderCell}
                    >
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt="product"
                          className={
                            styles.productImage
                          }
                        />
                      ) : (
                        <div
                          className={
                            styles.placeholderImage
                          }
                        />
                      )}

                      <span
                        className={styles.orderId}
                      >
                        {order?.orderId || "-"}
                      </span>
                    </div>
                  </td>

                  {/* BUYER */}
                  <td
                    className={styles.buyerName}
                  >
                    {order?.buyer?.fullName ||
                      "-"}
                  </td>

                  {/* ITEMS */}
                  <td>
                    {order?.orderItems?.length ||
                      0}{" "}
                    Items
                  </td>

                  {/* TOTAL */}
                  <td className={styles.amount}>
                    ₹ {order?.totalAmount || 0}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`${
                        styles.statusBadge
                      } ${getStatusClass(
                        order?.orderStatus
                      )}`}
                    >
                      {order?.orderStatus
                        ?.replaceAll("_", " ") ||
                        "-"}
                    </span>
                  </td>

                  {/* DATE */}
                  <td>
                    <div>
                      <p>
                        {formattedDate.date}
                      </p>
                      <p>
                        {formattedDate.time}
                      </p>
                    </div>
                  </td>

                  {/* ACTION */}
                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() =>
                        navigate(
                          `/admin/order-details/${order._id}`
                        )
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="7"
                className={styles.emptyRow}
              >
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